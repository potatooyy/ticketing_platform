# apps/concerts/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
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

class ConcertViewSet(viewsets.ModelViewSet):
    queryset = Concert.objects.all()
    serializer_class = ConcertSerializer
    permission_classes = [AllowAny]

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

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs

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