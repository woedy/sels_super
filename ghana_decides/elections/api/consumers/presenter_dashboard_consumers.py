"""Channels consumer powering the presenter dashboard realtime feed."""
from __future__ import annotations

import asyncio
from typing import Optional

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.utils import timezone

from elections.services.presenter_payloads import (
    build_presenter_payload,
    presenter_group_name,
)
from monitoring.metrics import record_ws_connect, record_ws_disconnect


class PresenterDashboardConsumers(AsyncJsonWebsocketConsumer):
    """Authenticated websocket delivering presenter updates with heartbeats."""

    heartbeat_interval = 30

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.group_name: Optional[str] = None
        self.election_id: Optional[str] = None
        self.scope: str = "national"
        self.scope_id: Optional[str] = None
        self._heartbeat_task: Optional[asyncio.Task] = None

    async def connect(self):
        user = self.scope.get("user")
        if not getattr(user, "is_authenticated", False):
            await self.close(code=4401)
            return

        user_type = getattr(user, "user_type", "") or ""
        if user_type.lower() != "presenter" and not getattr(user, "is_staff", False):
            await self.close(code=4403)
            return

        await self.accept()
        record_ws_connect('presenter_dashboard')

    async def disconnect(self, code):
        if self.group_name:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
            self._heartbeat_task = None
        record_ws_disconnect('presenter_dashboard', code)

    async def receive_json(self, content, **kwargs):
        action = content.get("action")
        if action == "subscribe":
            await self._handle_subscribe(content)
        elif action == "ping":
            await self.send_json({"type": "heartbeat", "timestamp": timezone.now().isoformat()})
        elif action == "unsubscribe":
            await self._handle_unsubscribe()
        else:
            await self.send_json({"type": "error", "message": "Unknown action."})

    async def presenter_update(self, event):
        await self.send_json({"type": "update", "payload": event["payload"]})

    async def _handle_subscribe(self, content: dict):
        election_id = content.get("election_id")
        scope = (content.get("scope") or "national").lower()
        scope_id = content.get("scope_id")

        if not election_id:
            await self.send_json({"type": "error", "message": "election_id is required."})
            return

        try:
            payload = await database_sync_to_async(build_presenter_payload)(
                election_id,
                scope=scope,
                scope_id=scope_id,
            )
        except ValueError as exc:
            await self.send_json({"type": "error", "message": str(exc)})
            return

        await self._subscribe_to_group(election_id, scope, scope_id)
        await self.send_json({"type": "snapshot", "payload": payload})
        await self._start_heartbeat()

    async def _handle_unsubscribe(self):
        if self.group_name:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            self.group_name = None

    async def _subscribe_to_group(self, election_id: str, scope: str, scope_id: Optional[str]):
        group_name = presenter_group_name(election_id, scope, scope_id)
        if self.group_name and self.group_name != group_name:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

        await self.channel_layer.group_add(group_name, self.channel_name)
        self.group_name = group_name
        self.election_id = election_id
        self.scope = scope
        self.scope_id = scope_id

    async def _start_heartbeat(self):
        if self._heartbeat_task:
            self._heartbeat_task.cancel()

        self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())

    async def _heartbeat_loop(self):
        try:
            while True:
                await asyncio.sleep(self.heartbeat_interval)
                await self.send_json({"type": "heartbeat", "timestamp": timezone.now().isoformat()})
        except asyncio.CancelledError:  # pragma: no cover - lifecycle cleanup
            pass
