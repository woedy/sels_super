"""Prometheus metrics helpers for SELS."""
from __future__ import annotations

from typing import Optional, TYPE_CHECKING

from prometheus_client import CONTENT_TYPE_LATEST, Counter, Gauge, generate_latest

if TYPE_CHECKING:  # pragma: no cover - type checking only
    from elections.models import PollingStationResultSubmission


_ingestion_processed_total = Counter(
    'sels_ingestion_processed_total',
    'Total number of polling station submissions processed successfully.',
)
_ingestion_failed_total = Counter(
    'sels_ingestion_failed_total',
    'Total number of polling station submissions that failed during processing.',
)
_ingestion_lag_seconds = Gauge(
    'sels_ingestion_processing_lag_seconds',
    'Time in seconds between submission receipt and successful processing.',
)

_ws_active_connections = Gauge(
    'sels_ws_active_connections',
    'Active websocket connections by channel.',
    labelnames=('channel',),
)
_ws_disconnect_total = Counter(
    'sels_ws_disconnect_total',
    'Websocket disconnect events grouped by channel and close code.',
    labelnames=('channel', 'code'),
)


def record_ingestion_processed(submission: 'PollingStationResultSubmission') -> None:
    """Track a successfully processed submission."""
    _ingestion_processed_total.inc()
    processed_at = submission.processed_at
    created_at = submission.created_at
    if processed_at and created_at:
        lag = (processed_at - created_at).total_seconds()
        if lag >= 0:
            _ingestion_lag_seconds.set(lag)


def record_ingestion_failed() -> None:
    """Track a failed submission attempt."""
    _ingestion_failed_total.inc()


def record_ws_connect(channel: str) -> None:
    """Increment active websocket connection count for a channel."""
    _ws_active_connections.labels(channel=channel).inc()


def record_ws_disconnect(channel: str, code: Optional[int]) -> None:
    """Decrement active websocket connections and track disconnect."""
    _ws_active_connections.labels(channel=channel).dec()
    _ws_disconnect_total.labels(channel=channel, code=str(code or 'unknown')).inc()


def prometheus_metrics() -> tuple[str, bytes]:
    """Return metrics payload tuple of content type and encoded body."""
    return CONTENT_TYPE_LATEST, generate_latest()
