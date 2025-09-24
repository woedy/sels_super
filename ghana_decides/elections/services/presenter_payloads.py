"""Helpers to build and broadcast presenter dashboard payloads."""
from __future__ import annotations

from dataclasses import dataclass
import re
from typing import Iterable

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.cache import cache
from django.utils import timezone

from elections.models import (
    Election,
    ElectionPresidentialCandidate,
    PresidentialCandidateConstituencyVote,
    PresidentialCandidateRegionalVote,
)
from regions.models import Constituency, PollingStation, Region

HISTORY_LIMIT = 5
_SAFE_COMPONENT = re.compile(r"[^0-9A-Za-z_.-]")


@dataclass(frozen=True)
class Scope:
    election: Election
    level: str
    name: str
    identifier: str | None = None

    @property
    def cache_key(self) -> str:
        election_component = _normalise_component(self.election.election_id or "")
        suffix = _normalise_component(self.identifier) if self.identifier else "national"
        return f"results:presenter:{election_component}:{self.level}:{suffix}"

    @property
    def history_key(self) -> str:
        return f"{self.cache_key}:history"

    @property
    def group_name(self) -> str:
        election_component = _normalise_component(self.election.election_id or "")
        suffix = _normalise_component(self.identifier) if self.identifier else "national"
        return f"presenter.{election_component}.{self.level}.{suffix}"


def presenter_group_name(election_id: str, scope: str, scope_id: str | None) -> str:
    election_component = _normalise_component(election_id)
    suffix = _normalise_component(scope_id) if scope_id else "national"
    return f"presenter.{election_component}.{scope}.{suffix}"


def _normalise_component(value: str | None) -> str:
    if not value:
        return ""
    return _SAFE_COMPONENT.sub("-", value)


def build_presenter_payload(election_id: str, scope: str = "national", scope_id: str | None = None) -> dict:
    """Return a payload ready for presenter clients, persisting history for deltas."""

    election = _get_election(election_id)
    scope_obj = _resolve_scope(election, scope, scope_id)
    results = list(_fetch_scope_results(scope_obj))

    totals = {
        "turnout": sum(entry["total_votes"] for entry in results),
        **_reporting_stats(scope_obj),
    }

    leader_entry = results[0] if results else None
    runner_up_entry = results[1] if len(results) > 1 else None

    leader_summary = _candidate_summary(leader_entry) if leader_entry else _empty_candidate_summary()
    runner_up_summary = _candidate_summary(runner_up_entry) if runner_up_entry else None

    previous_history: list[dict] = cache.get(scope_obj.history_key, [])
    previous_entry = previous_history[0] if previous_history else None

    previous_share = 0.0
    previous_turnout = 0
    if previous_entry:
        prev_leader = previous_entry.get("leader", {})
        if prev_leader.get("candidate_id") == leader_summary.get("candidate_id"):
            previous_share = float(prev_leader.get("vote_share", 0.0))
        previous_turnout = int(previous_entry.get("totals", {}).get("turnout", 0))

    current_share = leader_summary.get("vote_share", 0.0)
    vote_share_delta = round(current_share - previous_share, 1)
    turnout_change = totals["turnout"] - previous_turnout

    timestamp = timezone.now().isoformat()

    history_entry = {
        "timestamp": timestamp,
        "leader": leader_summary,
        "vote_share_delta": vote_share_delta,
        "turnout_change": turnout_change,
        "totals": totals,
    }
    history = [history_entry] + previous_history[: HISTORY_LIMIT - 1]

    payload = {
        "scope": {
            "level": scope_obj.level,
            "id": scope_obj.identifier,
            "name": scope_obj.name,
        },
        "leader": leader_summary,
        "runner_up": runner_up_summary,
        "vote_share_delta": vote_share_delta,
        "turnout_change": turnout_change,
        "timestamp": timestamp,
        "totals": totals,
        "history": history,
    }

    cache.set(scope_obj.history_key, history, timeout=None)
    cache.set(scope_obj.cache_key, payload, timeout=None)
    return payload


def broadcast_presenter_updates(election_id: str, scopes: Iterable[tuple[str, str | None]]):
    """Build payloads for the provided scopes and fan them out via Channels."""

    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    for scope, scope_id in scopes:
        try:
            payload = build_presenter_payload(election_id, scope=scope, scope_id=scope_id)
        except ValueError:
            continue
        group = presenter_group_name(election_id, scope, scope_id)
        async_to_sync(channel_layer.group_send)(
            group,
            {"type": "presenter.update", "payload": payload},
        )


def _get_election(election_id: str) -> Election:
    election = Election.objects.filter(election_id=election_id).first()
    if not election:
        raise ValueError(f"Unknown election_id '{election_id}'")
    return election


def _resolve_scope(election: Election, scope: str, scope_id: str | None) -> Scope:
    scope = (scope or "").lower()
    if scope == "national":
        return Scope(election=election, level="national", name=f"{election.year} National")

    if scope == "region":
        if not scope_id:
            raise ValueError("region scope requires scope_id")
        region = Region.objects.filter(region_id=scope_id).first()
        if not region:
            raise ValueError(f"Unknown region '{scope_id}'")
        return Scope(
            election=election,
            level="region",
            identifier=region.region_id,
            name=region.region_name,
        )

    if scope == "constituency":
        if not scope_id:
            raise ValueError("constituency scope requires scope_id")
        constituency = Constituency.objects.filter(constituency_id=scope_id).first()
        if not constituency:
            raise ValueError(f"Unknown constituency '{scope_id}'")
        return Scope(
            election=election,
            level="constituency",
            identifier=constituency.constituency_id,
            name=constituency.constituency_name,
        )

    raise ValueError(f"Unsupported scope '{scope}'")


def _fetch_scope_results(scope: Scope):
    if scope.level == "national":
        queryset = (
            ElectionPresidentialCandidate.objects.select_related("candidate__party")
            .filter(election=scope.election)
            .order_by("-total_votes", "candidate__last_name")
        )
        for candidate in queryset:
            yield {
                "candidate": candidate,
                "total_votes": int(candidate.total_votes or 0),
                "vote_share": float(candidate.total_votes_percent or 0.0),
            }
        return

    if scope.level == "region":
        queryset = (
            PresidentialCandidateRegionalVote.objects.select_related("prez_candidate__candidate__party")
            .filter(election=scope.election, region__region_id=scope.identifier)
            .order_by("-total_votes", "prez_candidate__candidate__last_name")
        )
        for entry in queryset:
            yield {
                "candidate": entry.prez_candidate,
                "total_votes": int(entry.total_votes or 0),
                "vote_share": float(entry.total_votes_percent or 0.0),
            }
        return

    if scope.level == "constituency":
        queryset = (
            PresidentialCandidateConstituencyVote.objects.select_related("prez_candidate__candidate__party")
            .filter(election=scope.election, constituency__constituency_id=scope.identifier)
            .order_by("-total_votes", "prez_candidate__candidate__last_name")
        )
        for entry in queryset:
            yield {
                "candidate": entry.prez_candidate,
                "total_votes": int(entry.total_votes or 0),
                "vote_share": float(entry.total_votes_percent or 0.0),
            }
        return

    return []


def _candidate_summary(entry: dict | None) -> dict:
    if entry is None:
        return _empty_candidate_summary()

    candidate: ElectionPresidentialCandidate = entry.get("candidate")
    party = getattr(candidate.candidate, "party", None)
    vote_share = float(entry.get("vote_share", 0.0))
    return {
        "candidate_id": candidate.election_prez_id,
        "name": " ".join(filter(None, [candidate.candidate.first_name, candidate.candidate.last_name])).strip(),
        "party": party.party_initial if party else "",
        "party_name": party.party_full_name if party else "",
        "total_votes": int(entry.get("total_votes", 0)),
        "vote_share": round(vote_share, 1),
    }


def _empty_candidate_summary() -> dict:
    return {
        "candidate_id": None,
        "name": "",
        "party": "",
        "party_name": "",
        "total_votes": 0,
        "vote_share": 0.0,
    }


def _reporting_stats(scope: Scope) -> dict:
    if scope.level == "national":
        stations = PollingStation.objects.all()
    elif scope.level == "region":
        stations = PollingStation.objects.filter(electoral_area__constituency__region__region_id=scope.identifier)
    else:
        stations = PollingStation.objects.filter(electoral_area__constituency__constituency_id=scope.identifier)

    total = stations.count()
    reporting = stations.filter(presidential_submitted=True).count()
    percent = (reporting / total * 100) if total else 0.0
    return {
        "reporting": reporting,
        "total_stations": total,
        "reporting_percent": round(percent, 1),
    }
