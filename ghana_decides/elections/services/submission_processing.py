"""Helpers for processing polling station result submissions."""
from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP
from typing import Sequence

from django.core.cache import cache
from django.db import transaction
from django.db.models import Sum

from elections.models import (
    ElectionParliamentaryCandidate,
    ElectionPresidentialCandidate,
    ParliamentaryCandidateConstituencyVote,
    ParliamentaryCandidateElectoralAreaVote,
    ParliamentaryCandidatePollingStationVote,
    ParliamentaryCandidateRegionalVote,
    PollingStationResultSubmission,
    PresidentialCandidateConstituencyVote,
    PresidentialCandidateElectoralAreaVote,
    PresidentialCandidatePollingStationVote,
    PresidentialCandidateRegionalVote,
)
from elections.services.presenter_payloads import broadcast_presenter_updates
from elections.services.public_map_payloads import broadcast_map_updates
from monitoring.metrics import record_ingestion_failed, record_ingestion_processed


def process_submission(
    submission: PollingStationResultSubmission,
    presidential_results: Sequence[dict] | None = None,
    parliamentary_results: Sequence[dict] | None = None,
) -> None:
    """Persist normalized tallies and refresh derived aggregates.

    The serializer delivers `presidential_results` and `parliamentary_results`
    as dictionaries with a `candidate` model instance and a `votes` integer.
    """

    presidential_results = presidential_results or []
    parliamentary_results = parliamentary_results or []

    submission.mark_processing()

    try:
        with transaction.atomic():
            _process_presidential_results(submission, presidential_results)
            _process_parliamentary_results(submission, parliamentary_results)
            _update_polling_station_flags(submission, presidential_results, parliamentary_results)
            submission.mark_processed()
    except Exception as exc:  # pragma: no cover - safety net, error re-raised
        submission.mark_failed(str(exc))
        record_ingestion_failed()
        raise
    else:
        record_ingestion_processed(submission)
    finally:
        invalidate_cached_payloads(submission)


def _process_presidential_results(
    submission: PollingStationResultSubmission, results: Sequence[dict]
) -> None:
    if not results:
        return

    election = submission.election
    polling_station = submission.polling_station
    total_votes = sum(entry["votes"] for entry in results)
    updated_candidates: set[ElectionPresidentialCandidate] = set()

    for entry in results:
        candidate: ElectionPresidentialCandidate = entry["candidate"]
        votes = entry["votes"]
        PresidentialCandidatePollingStationVote.objects.update_or_create(
            election=election,
            prez_candidate=candidate,
            polling_station=polling_station,
            defaults={
                "total_votes": votes,
                "total_votes_percent": _calculate_percentage(votes, total_votes),
                "active": True,
            },
        )
        updated_candidates.add(candidate)

    for candidate in updated_candidates:
        _refresh_presidential_rollups(submission, candidate)


def _process_parliamentary_results(
    submission: PollingStationResultSubmission, results: Sequence[dict]
) -> None:
    if not results:
        return

    election = submission.election
    polling_station = submission.polling_station
    total_votes = sum(entry["votes"] for entry in results)
    updated_candidates: set[ElectionParliamentaryCandidate] = set()

    for entry in results:
        candidate: ElectionParliamentaryCandidate = entry["candidate"]
        votes = entry["votes"]
        ParliamentaryCandidatePollingStationVote.objects.update_or_create(
            election=election,
            parl_candidate=candidate,
            polling_station=polling_station,
            defaults={
                "total_votes": votes,
                "total_votes_percent": _calculate_percentage(votes, total_votes),
                "active": True,
            },
        )
        updated_candidates.add(candidate)

    for candidate in updated_candidates:
        _refresh_parliamentary_rollups(submission, candidate)


def _refresh_presidential_rollups(
    submission: PollingStationResultSubmission, candidate: ElectionPresidentialCandidate
) -> None:
    election = submission.election
    polling_station = submission.polling_station
    electoral_area = polling_station.electoral_area
    constituency = electoral_area.constituency
    region = constituency.region

    candidate_total = _sum_presidential_votes(election, prez_candidate=candidate)
    national_total = _sum_presidential_votes(election)
    candidate.total_votes = candidate_total
    candidate.total_votes_percent = _calculate_percentage(candidate_total, national_total)
    candidate.save(update_fields=["total_votes", "total_votes_percent", "updated_at"])

    _update_presidential_area_vote(election, candidate, electoral_area)
    _update_presidential_constituency_vote(election, candidate, constituency)
    _update_presidential_region_vote(election, candidate, region)


def _refresh_parliamentary_rollups(
    submission: PollingStationResultSubmission, candidate: ElectionParliamentaryCandidate
) -> None:
    election = submission.election
    polling_station = submission.polling_station
    electoral_area = polling_station.electoral_area
    constituency = electoral_area.constituency
    region = constituency.region

    candidate_total = _sum_parliamentary_votes(election, parl_candidate=candidate)
    national_total = _sum_parliamentary_votes(election)
    candidate.total_votes = candidate_total
    candidate.total_votes_percent = _calculate_percentage(candidate_total, national_total)
    candidate.save(update_fields=["total_votes", "total_votes_percent", "updated_at"])

    _update_parliamentary_area_vote(election, candidate, electoral_area)
    _update_parliamentary_constituency_vote(election, candidate, constituency)
    _update_parliamentary_region_vote(election, candidate, region)


def _update_polling_station_flags(
    submission: PollingStationResultSubmission,
    presidential_results: Sequence[dict],
    parliamentary_results: Sequence[dict],
) -> None:
    polling_station = submission.polling_station
    update_fields: list[str] = []

    if presidential_results and not polling_station.presidential_submitted:
        polling_station.presidential_submitted = True
        update_fields.append("presidential_submitted")

    if parliamentary_results and not polling_station.parliamentary_submitted:
        polling_station.parliamentary_submitted = True
        update_fields.append("parliamentary_submitted")

    if update_fields:
        polling_station.save(update_fields=update_fields)


def invalidate_cached_payloads(submission: PollingStationResultSubmission) -> None:
    polling_station = submission.polling_station
    electoral_area = polling_station.electoral_area
    constituency = electoral_area.constituency
    region = constituency.region
    election = submission.election

    cache_keys = [
        f"results:map:{election.election_id}:national",
        _scope_key("results:map", election.election_id, "region", getattr(region, "region_id", None)),
        _scope_key(
            "results:map",
            election.election_id,
            "constituency",
            getattr(constituency, "constituency_id", None),
        ),
        _scope_key(
            "results:map",
            election.election_id,
            "electoral_area",
            getattr(electoral_area, "electoral_area_id", None),
        ),
        f"results:presenter:{election.election_id}:national",
        _scope_key(
            "results:presenter",
            election.election_id,
            "region",
            getattr(region, "region_id", None),
        ),
        _scope_key(
            "results:presenter",
            election.election_id,
            "constituency",
            getattr(constituency, "constituency_id", None),
        ),
    ]

    cache.delete_many([key for key in cache_keys if key])

    scope_pairs = [("national", None)]
    region_id = getattr(region, "region_id", None)
    constituency_id = getattr(constituency, "constituency_id", None)
    if region_id:
        scope_pairs.append(("region", region_id))
    if constituency_id:
        scope_pairs.append(("constituency", constituency_id))

    broadcast_presenter_updates(election.election_id, scope_pairs)
    broadcast_map_updates(election.election_id, scope_pairs)


def _scope_key(prefix: str, election_id: str | None, scope: str, scope_id: str | None) -> str | None:
    if not election_id or not scope_id:
        return None
    return f"{prefix}:{election_id}:{scope}:{scope_id}"


def _sum_presidential_votes(election, prez_candidate: ElectionPresidentialCandidate | None = None) -> int:
    filters = {"election": election}
    if prez_candidate is not None:
        filters["prez_candidate"] = prez_candidate
    return (
        PresidentialCandidatePollingStationVote.objects.filter(**filters)
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )


def _sum_parliamentary_votes(election, parl_candidate: ElectionParliamentaryCandidate | None = None) -> int:
    filters = {"election": election}
    if parl_candidate is not None:
        filters["parl_candidate"] = parl_candidate
    return (
        ParliamentaryCandidatePollingStationVote.objects.filter(**filters)
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )


def _update_presidential_area_vote(election, candidate, electoral_area) -> None:
    candidate_total = (
        PresidentialCandidatePollingStationVote.objects.filter(
            election=election,
            prez_candidate=candidate,
            polling_station__electoral_area=electoral_area,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )
    area_total = (
        PresidentialCandidatePollingStationVote.objects.filter(
            election=election,
            polling_station__electoral_area=electoral_area,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )

    PresidentialCandidateElectoralAreaVote.objects.update_or_create(
        election=election,
        prez_candidate=candidate,
        electoral_area=electoral_area,
        defaults={
            "total_votes": candidate_total,
            "total_votes_percent": _calculate_percentage(candidate_total, area_total),
            "active": True,
        },
    )


def _update_presidential_constituency_vote(election, candidate, constituency) -> None:
    candidate_total = (
        PresidentialCandidatePollingStationVote.objects.filter(
            election=election,
            prez_candidate=candidate,
            polling_station__electoral_area__constituency=constituency,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )
    constituency_total = (
        PresidentialCandidatePollingStationVote.objects.filter(
            election=election,
            polling_station__electoral_area__constituency=constituency,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )

    PresidentialCandidateConstituencyVote.objects.update_or_create(
        election=election,
        prez_candidate=candidate,
        constituency=constituency,
        defaults={
            "total_votes": candidate_total,
            "total_votes_percent": _calculate_percentage(candidate_total, constituency_total),
            "active": True,
        },
    )


def _update_presidential_region_vote(election, candidate, region) -> None:
    candidate_total = (
        PresidentialCandidatePollingStationVote.objects.filter(
            election=election,
            prez_candidate=candidate,
            polling_station__electoral_area__constituency__region=region,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )
    region_total = (
        PresidentialCandidatePollingStationVote.objects.filter(
            election=election,
            polling_station__electoral_area__constituency__region=region,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )

    PresidentialCandidateRegionalVote.objects.update_or_create(
        election=election,
        prez_candidate=candidate,
        region=region,
        defaults={
            "total_votes": candidate_total,
            "total_votes_percent": _calculate_percentage(candidate_total, region_total),
            "active": True,
        },
    )


def _update_parliamentary_area_vote(election, candidate, electoral_area) -> None:
    candidate_total = (
        ParliamentaryCandidatePollingStationVote.objects.filter(
            election=election,
            parl_candidate=candidate,
            polling_station__electoral_area=electoral_area,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )
    area_total = (
        ParliamentaryCandidatePollingStationVote.objects.filter(
            election=election,
            polling_station__electoral_area=electoral_area,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )

    ParliamentaryCandidateElectoralAreaVote.objects.update_or_create(
        election=election,
        parl_candidate=candidate,
        electoral_area=electoral_area,
        defaults={
            "total_votes": candidate_total,
            "total_votes_percent": _calculate_percentage(candidate_total, area_total),
            "active": True,
        },
    )


def _update_parliamentary_constituency_vote(election, candidate, constituency) -> None:
    candidate_total = (
        ParliamentaryCandidatePollingStationVote.objects.filter(
            election=election,
            parl_candidate=candidate,
            polling_station__electoral_area__constituency=constituency,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )
    constituency_total = (
        ParliamentaryCandidatePollingStationVote.objects.filter(
            election=election,
            polling_station__electoral_area__constituency=constituency,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )

    ParliamentaryCandidateConstituencyVote.objects.update_or_create(
        election=election,
        parl_candidate=candidate,
        constituency=constituency,
        defaults={
            "total_votes": candidate_total,
            "total_votes_percent": _calculate_percentage(candidate_total, constituency_total),
            "active": True,
        },
    )


def _update_parliamentary_region_vote(election, candidate, region) -> None:
    candidate_total = (
        ParliamentaryCandidatePollingStationVote.objects.filter(
            election=election,
            parl_candidate=candidate,
            polling_station__electoral_area__constituency__region=region,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )
    region_total = (
        ParliamentaryCandidatePollingStationVote.objects.filter(
            election=election,
            polling_station__electoral_area__constituency__region=region,
        )
        .aggregate(total=Sum("total_votes"))
        .get("total")
        or 0
    )

    ParliamentaryCandidateRegionalVote.objects.update_or_create(
        election=election,
        parl_candidate=candidate,
        region=region,
        defaults={
            "total_votes": candidate_total,
            "total_votes_percent": _calculate_percentage(candidate_total, region_total),
            "active": True,
        },
    )


def _calculate_percentage(numerator: int, denominator: int) -> Decimal:
    if not denominator:
        return Decimal("0")
    value = (Decimal(numerator) / Decimal(denominator)) * Decimal("100")
    return value.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
