# apps/concerts/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filter
from django.utils import timezone
from .models import Venue, VenueSeatMap, Concert, Show, Pricing, Ticket
from .serializers import (
    VenueSerializer,
    VenueSeatMapSerializer,
    ConcertSerializer,
    ShowSerializer,
    PricingSerializer,
    TicketSerializer
)
class ConcertFilter(filter.FilterSet):
    class Meta:
        model = Concert
        fields = ['id', 'title', 'artist',]
class ConcertViewSet(viewsets.ModelViewSet):
    queryset = Concert.objects.all()
    serializer_class = ConcertSerializer
    permission_classes = [AllowAny]
    ilter_backends = [DjangoFilterBackend]      
    filterset_class = ConcertFilter

class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    permission_classes = [AllowAny]

class VenueSeatMapViewSet(viewsets.ModelViewSet):
    queryset = VenueSeatMap.objects.all()
    serializer_class = VenueSeatMapSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer
    permission_classes = [AllowAny]

class PricingViewSet(viewsets.ModelViewSet):
    queryset = Pricing.objects.all()
    serializer_class = PricingSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TicketFilter(filter.FilterSet):
    # Ticket 自身欄位
    status = filter.CharFilter(lookup_expr='iexact')
    price_gte = filter.NumberFilter(field_name='price', lookup_expr='gte')
    price_lte = filter.NumberFilter(field_name='price', lookup_expr='lte')
    reserved_until_before = filter.IsoDateTimeFilter(field_name='reserved_until', lookup_expr='lte')
    reserved_until_after = filter.IsoDateTimeFilter(field_name='reserved_until', lookup_expr='gte')

    # seat 關聯過濾 (VenueSeatMap)
    section = filter.CharFilter(field_name='seat__section', lookup_expr='iexact')
    seat_number = filter.CharFilter(field_name='seat__seat_number', lookup_expr='iexact')
    venue_name = filter.CharFilter(field_name='seat__venue__name', lookup_expr='icontains')
    venue_address = filter.CharFilter(field_name='seat__venue__address', lookup_expr='icontains')

    # show 關聯過濾 (Show)
    show_date = filter.DateFilter(field_name='show__show_date')
    show_date_before = filter.DateFilter(field_name='show__show_date', lookup_expr='lte')
    show_date_after = filter.DateFilter(field_name='show__show_date', lookup_expr='gte')
    show_time = filter.TimeFilter(field_name='show__show_time')
    venue_name_show = filter.CharFilter(field_name='show__venue__name', lookup_expr='icontains')

    # concert (Show -> concert)
    concert_title = filter.CharFilter(field_name='show__concert__title', lookup_expr='icontains')
    concert_artist = filter.CharFilter(field_name='show__concert__artist', lookup_expr='icontains')

    # order (訂單) 及 user
    order_id = filter.NumberFilter(field_name='order__id')
    buyer_username = filter.CharFilter(field_name='order__user__username', lookup_expr='iexact')

    class Meta:
        model = Ticket
        fields = ['id', 'status', 'show', 'seat', 'price', 'order']
        # fields = []


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]      
    filterset_class = TicketFilter

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # def get_queryset(self):
    #     qs = super().get_queryset()
    #     status = self.request.query_params.get('status')
    #     if status:
    #         qs = qs.filter(status=status)
    #     return qs

    @action(detail=True, methods=['post'])
    def reserve(self, request, pk=None):
        ticket = self.get_object()
        if ticket.status != 'available':
            return Response({'error': '此票券無法被預訂'}, status=400)

        ticket.status = 'reserved'
        ticket.reserved_until = timezone.now() + timezone.timedelta(minutes=10)  # 10分鐘保留
        ticket.save()

        return Response({'message': '票券已被保留，請於10分鐘內付款'})

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        ticket = self.get_object()
        if ticket.status != 'reserved':
            return Response({'error': '此票券不在保留狀態，無法付款'}, status=400)