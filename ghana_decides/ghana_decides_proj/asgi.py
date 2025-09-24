import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.conf import settings
from django.core.asgi import get_asgi_application

from ghana_decides_proj import routing
from ghana_decides_proj.auth import TokenAuthMiddlewareStack

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ghana_decides_proj.settings")

django_asgi_app = get_asgi_application()

websocket_application = TokenAuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))

if getattr(settings, "TESTING", False):
    application = ProtocolTypeRouter(
        {
            "http": django_asgi_app,
            "websocket": websocket_application,
        }
    )
else:
    application = ProtocolTypeRouter(
        {
            "http": django_asgi_app,
            "websocket": AllowedHostsOriginValidator(websocket_application),
        }
    )
