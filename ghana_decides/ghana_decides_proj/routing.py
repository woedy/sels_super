from django.urls import re_path

from elections.api.consumers.live_map_consumers import LiveMapConsumer
from elections.api.consumers.presenter_dashboard_consumers import PresenterDashboardConsumers

websocket_urlpatterns = [
    re_path(r"ws/presenter-dashboard/", PresenterDashboardConsumers.as_asgi()),
    re_path(r"ws/live-map-consumer/", LiveMapConsumer.as_asgi()),
]
