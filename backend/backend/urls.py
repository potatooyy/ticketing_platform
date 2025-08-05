# apps/users/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from apps.users.views import *
from apps.concerts.views import *
from apps.orders.views import *
from apps.payments.views import CreatePaymentView

schema_view = get_schema_view(
   openapi.Info(
      title="你的 API 標題",
      default_version='v1',
      description="API 文件說明",
      terms_of_service="https://你的網站/terms/",
      contact=openapi.Contact(email="contact@example.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter(trailing_slash=False)
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
    path('api/payments/', include('apps.payments.urls')),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)