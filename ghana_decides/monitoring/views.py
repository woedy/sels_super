from django.http import HttpResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET

from .metrics import prometheus_metrics


@require_GET
@never_cache
def metrics_view(request):
    """Expose Prometheus metrics."""
    content_type, payload = prometheus_metrics()
    return HttpResponse(payload, content_type=content_type)
