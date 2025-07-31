# apps/users/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from apps.users.views import *
from apps.concerts.views import *
from apps.orders.views import *

router = DefaultRouter()
router.register(r'users', UserViewSet, basename = 'user')
router.register(r'venues', VenueViewSet)
router.register(r'seats', VenueSeatMapViewSet)
router.register(r'concerts', ConcertViewSet)
router.register(r'shows', ShowViewSet)
router.register(r'pricings', PricingViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'user/orders', UserOrderViewSet, basename='user-orders')
router.register(r'admin/orders', AdminOrderViewSet, basename='admin-orders')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)