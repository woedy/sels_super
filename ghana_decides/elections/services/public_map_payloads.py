"""Build and broadcast payloads for the public live map experience."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.cache import cache
from django.utils import timezone

from elections.models import (
    Election,
    ElectionPresidentialCandidate,
    PresidentialCandidateConstituencyVote,
    PresidentialCandidateElectoralAreaVote,
    PresidentialCandidateRegionalVote,
)
from regions.models import Constituency, ElectoralArea, PollingStation, Region

_SAFE_COMPONENT = """abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-"""


@dataclass(frozen=True)
class MapScope:
    """Details of the requested aggregation scope."""

    election: Election
    level: str
    identifier: str | None
    name: str

    @property
    def cache_key(self) -> str:
        election_id = self.election.election_id or ""
        if self.level == "national":
            return f"results:map:{election_id}:national"
        suffix = _normalise_component(self.identifier)
        return f"results:map:{election_id}:{self.level}:{suffix}"

    @property
    def group_name(self) -> str:
        election_id = _normalise_component(self.election.election_id or "")
        suffix = _normalise_component(self.identifier) if self.identifier else "national"
        return f"map.{election_id}.{self.level}.{suffix}"


def map_group_name(election_id: str, scope: str, scope_id: str | None) -> str:
    election_component = _normalise_component(election_id)
    suffix = _normalise_component(scope_id) if scope_id else "national"
    return f"map.{election_component}.{scope}.{suffix}"


def build_map_payload(
    election_id: str,
    *,
    scope: str = "national",
    scope_id: str | None = None,
) -> dict:
    """Return cached payload describing the requested scope."""
    election = _get_election(election_id)
    scope_obj = _resolve_scope(election, scope, scope_id)

    cached = cache.get(scope_obj.cache_key)
    if cached:
        return cached

    summary_candidates = list(_scope_candidates(scope_obj))
    reporting = _reporting_stats(scope_obj)
    timestamp = timezone.now().isoformat()

    feature_entries = list(_features_for_scope(scope_obj))
    feature_collection = {
        "type": "FeatureCollection",
        "features": [entry["feature"] for entry in feature_entries if entry.get("feature")],
    }

    payload = {
        "election": {
            "id": election.election_id,
            "year": election.year,
            "name": f"{election.year} Presidential" if election.year else "Election",
        },
        "scope": {
            "level": scope_obj.level,
            "id": scope_obj.identifier,
            "name": scope_obj.name,
        },
        "summary": {
            **reporting,
            "updated_at": timestamp,
        },
        "candidates": summary_candidates,
        "features": feature_entries,
        "feature_collection": feature_collection,
        "options": _scope_options(scope_obj),
    }

    cache.set(scope_obj.cache_key, payload, timeout=None)
    return payload


def broadcast_map_updates(
    election_id: str,
    scopes: Iterable[tuple[str, str | None]],
) -> None:
    """Push refreshed payloads for the provided scopes to websocket subscribers."""

    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    for scope, scope_id in scopes:
        try:
            payload = build_map_payload(election_id, scope=scope, scope_id=scope_id)
        except ValueError:
            continue

        async_to_sync(channel_layer.group_send)(
            map_group_name(election_id, scope, scope_id),
            {"type": "map.update", "payload": payload},
        )


def _normalise_component(value: str | None) -> str:
    if not value:
        return ""
    return "".join(ch if ch in _SAFE_COMPONENT else "-" for ch in value)


def _get_election(election_id: str) -> Election:
    election = Election.objects.filter(election_id=election_id).first()
    if not election:
        raise ValueError(f"Unknown election_id '{election_id}'")
    return election


def _resolve_scope(election: Election, scope: str, scope_id: str | None) -> MapScope:
    scope = (scope or "").lower() or "national"
    if scope == "national":
        return MapScope(
            election=election,
            level="national",
            identifier=None,
            name=f"{election.year} National" if election.year else "National",
        )

    if scope == "region":
        if not scope_id:
            raise ValueError("region scope requires scope_id")
        region = Region.objects.filter(region_id=scope_id).first()
        if not region:
            raise ValueError(f"Unknown region '{scope_id}'")
        return MapScope(
            election=election,
            level="region",
            identifier=region.region_id,
            name=region.region_name or "Region",
        )

    if scope == "constituency":
        if not scope_id:
            raise ValueError("constituency scope requires scope_id")
        constituency = Constituency.objects.filter(constituency_id=scope_id).first()
        if not constituency:
            raise ValueError(f"Unknown constituency '{scope_id}'")
        return MapScope(
            election=election,
            level="constituency",
            identifier=constituency.constituency_id,
            name=constituency.constituency_name or "Constituency",
        )

    raise ValueError(f"Unsupported scope '{scope}'")


def _scope_candidates(scope: MapScope):
    if scope.level == "national":
        queryset = (
            ElectionPresidentialCandidate.objects.select_related("candidate__party")
            .filter(election=scope.election)
            .order_by("-total_votes", "candidate__last_name")
        )
        for entry in queryset:
            yield _candidate_summary(entry, entry.total_votes or 0, entry.total_votes_percent or 0.0)
        return

    if scope.level == "region":
        queryset = (
            PresidentialCandidateRegionalVote.objects.select_related("prez_candidate__candidate__party")
            .filter(election=scope.election, region__region_id=scope.identifier)
            .order_by("-total_votes", "prez_candidate__candidate__last_name")
        )
    else:
        queryset = (
            PresidentialCandidateConstituencyVote.objects.select_related("prez_candidate__candidate__party")
            .filter(election=scope.election, constituency__constituency_id=scope.identifier)
            .order_by("-total_votes", "prez_candidate__candidate__last_name")
        )

    for entry in queryset:
        candidate = entry.prez_candidate
        yield _candidate_summary(candidate, entry.total_votes or 0, entry.total_votes_percent or 0.0)


def _candidate_summary(candidate: ElectionPresidentialCandidate, votes: int, vote_share: float) -> dict:
    party = getattr(candidate.candidate, "party", None)
    return {
        "candidate_id": candidate.election_prez_id,
        "name": " ".join(
            filter(None, [candidate.candidate.first_name, candidate.candidate.last_name])
        ).strip(),
        "party": party.party_initial if party else "",
        "party_name": party.party_full_name if party else "",
        "party_color": getattr(party, "party_color", "") if party else "",
        "total_votes": int(votes or 0),
        "vote_share": round(float(vote_share or 0.0), 1),
    }


def _features_for_scope(scope: MapScope):
    if scope.level == "national":
        regions = Region.objects.all().order_by("region_name")
        for region in regions:
            yield _region_feature(scope, region)
        return

    if scope.level == "region":
        constituencies = Constituency.objects.filter(region__region_id=scope.identifier).order_by(
            "constituency_name"
        )
        for constituency in constituencies:
            yield _constituency_feature(scope, constituency)
        return

    electoral_areas = ElectoralArea.objects.filter(
        constituency__constituency_id=scope.identifier
    ).order_by("electoral_area_name")
    for electoral_area in electoral_areas:
        yield _electoral_area_feature(scope, electoral_area)


def _region_feature(scope: MapScope, region: Region) -> dict:
    leading_vote = (
        PresidentialCandidateRegionalVote.objects.select_related("prez_candidate__candidate__party")
        .filter(election=scope.election, region=region)
        .order_by("-total_votes")
        .first()
    )
    leader = (
        _candidate_summary(leading_vote.prez_candidate, leading_vote.total_votes, leading_vote.total_votes_percent)
        if leading_vote
        else None
    )
    reporting = _station_reporting(region=region)

    feature = _feature_geometry(
        identifier=region.region_id,
        name=region.region_name,
        coordinates=list(region.region_coordinates.all()),
        extra_properties={
            "leader_color": (leader or {}).get("party_color") or "#1f2937",
        },
    )

    return {
        "id": region.region_id,
        "name": region.region_name,
        "leader": leader,
        "reporting": reporting,
        "feature": feature,
    }


def _constituency_feature(scope: MapScope, constituency: Constituency) -> dict:
    leading_vote = (
        PresidentialCandidateConstituencyVote.objects.select_related("prez_candidate__candidate__party")
        .filter(election=scope.election, constituency=constituency)
        .order_by("-total_votes")
        .first()
    )
    leader = (
        _candidate_summary(
            leading_vote.prez_candidate,
            leading_vote.total_votes,
            leading_vote.total_votes_percent,
        )
        if leading_vote
        else None
    )
    reporting = _station_reporting(constituency=constituency)

    feature = _feature_geometry(
        identifier=constituency.constituency_id,
        name=constituency.constituency_name,
        coordinates=list(constituency.constituency_coordinates.all()),
        extra_properties={
            "leader_color": (leader or {}).get("party_color") or "#1f2937",
        },
    )

    return {
        "id": constituency.constituency_id,
        "name": constituency.constituency_name,
        "leader": leader,
        "reporting": reporting,
        "feature": feature,
    }


def _electoral_area_feature(scope: MapScope, electoral_area: ElectoralArea) -> dict:
    leading_vote = (
        PresidentialCandidateElectoralAreaVote.objects.select_related(
            "prez_candidate__candidate__party"
        )
        .filter(election=scope.election, electoral_area=electoral_area)
        .order_by("-total_votes")
        .first()
    )
    leader = (
        _candidate_summary(
            leading_vote.prez_candidate,
            leading_vote.total_votes,
            leading_vote.total_votes_percent,
        )
        if leading_vote
        else None
    )
    reporting = _station_reporting(electoral_area=electoral_area)

    feature = _feature_geometry(
        identifier=electoral_area.electoral_area_id,
        name=electoral_area.electoral_area_name,
        coordinates=list(electoral_area.electoral_area_coordinates.all()),
        extra_properties={
            "leader_color": (leader or {}).get("party_color") or "#1f2937",
        },
    )

    return {
        "id": electoral_area.electoral_area_id,
        "name": electoral_area.electoral_area_name,
        "leader": leader,
        "reporting": reporting,
        "feature": feature,
    }


def _feature_geometry(
    identifier: str | None,
    name: str | None,
    coordinates: list,
    *,
    extra_properties: dict | None = None,
) -> dict | None:
    if not coordinates:
        return None

    points = [
        [float(entry.lng), float(entry.lat)]
        for entry in coordinates
        if entry.lat is not None and entry.lng is not None
    ]
    if not points:
        return None

    if points[0] != points[-1]:
        points.append(points[0])

    properties = {"name": name}
    if extra_properties:
        properties.update(extra_properties)

    return {
        "type": "Feature",
        "id": identifier,
        "properties": properties,
        "geometry": {
            "type": "Polygon",
            "coordinates": [points],
        },
    }


def _reporting_stats(scope: MapScope) -> dict:
    if scope.level == "national":
        stations = PollingStation.objects.all()
    elif scope.level == "region":
        stations = PollingStation.objects.filter(
            electoral_area__constituency__region__region_id=scope.identifier
        )
    else:
        stations = PollingStation.objects.filter(
            electoral_area__constituency__constituency_id=scope.identifier
        )

    total = stations.count()
    reporting = stations.filter(presidential_submitted=True).count()
    percent = (reporting / total * 100) if total else 0.0
    return {
        "reporting": reporting,
        "total_stations": total,
        "reporting_percent": round(percent, 1),
    }


def _station_reporting(
    *,
    region: Region | None = None,
    constituency: Constituency | None = None,
    electoral_area: ElectoralArea | None = None,
) -> dict:
    if region is not None:
        stations = PollingStation.objects.filter(
            electoral_area__constituency__region=region
        )
    elif constituency is not None:
        stations = PollingStation.objects.filter(
            electoral_area__constituency=constituency
        )
    else:
        stations = PollingStation.objects.filter(electoral_area=electoral_area)

    total = stations.count()
    reporting = stations.filter(presidential_submitted=True).count()
    percent = (reporting / total * 100) if total else 0.0
    return {
        "reporting": reporting,
        "total_stations": total,
        "reporting_percent": round(percent, 1),
    }


def _scope_options(scope: MapScope) -> dict:
    options: dict[str, list[dict]] = {}

    regions = Region.objects.all().order_by("region_name")
    options["regions"] = [
        {"id": region.region_id, "name": region.region_name}
        for region in regions
    ]

    if scope.level in {"region", "constituency"} and scope.identifier:
        constituencies = Constituency.objects.filter(region__region_id=scope.identifier).order_by(
            "constituency_name"
        )
        options["constituencies"] = [
            {"id": constituency.constituency_id, "name": constituency.constituency_name}
            for constituency in constituencies
        ]

    if scope.level == "constituency" and scope.identifier:
        electoral_areas = ElectoralArea.objects.filter(
            constituency__constituency_id=scope.identifier
        ).order_by("electoral_area_name")
        options["electoral_areas"] = [
            {"id": area.electoral_area_id, "name": area.electoral_area_name}
            for area in electoral_areas
        ]

    return options
