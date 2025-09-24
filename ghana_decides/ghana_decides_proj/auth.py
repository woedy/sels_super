"""Authentication helpers for Channels websockets."""
from __future__ import annotations

from urllib.parse import parse_qs

from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token


class TokenAuthMiddleware:
    """Populate ``scope['user']`` from a DRF token in the query string or headers."""

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        token_key = self._get_token_from_scope(scope)
        scope["user"] = await self._get_user(token_key)
        return await self.inner(scope, receive, send)

    def _get_token_from_scope(self, scope) -> str | None:
        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        if params.get("token"):
            token = params["token"][0]
            if token:
                return token

        for header_name, header_value in scope.get("headers", []):
            if header_name == b"authorization":
                parts = header_value.decode().split()
                if len(parts) == 2 and parts[0].lower() == "token":
                    return parts[1]
        return None

    @staticmethod
    @database_sync_to_async
    def _get_user(token_key: str | None):
        if not token_key:
            return AnonymousUser()
        try:
            token = Token.objects.select_related("user").get(key=token_key)
        except Token.DoesNotExist:
            return AnonymousUser()
        return token.user


def TokenAuthMiddlewareStack(inner):
    """Wrap ``AuthMiddlewareStack`` with token support."""

    return TokenAuthMiddleware(AuthMiddlewareStack(inner))
