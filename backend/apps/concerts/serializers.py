# apps/concerts/serializers.py
from rest_framework import serializers
from django.utils import timezone
from .models import Venue, VenueSeatMap, Concert, Show, Pricing, Ticket

class ConcertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concert
        fields = ['id', 'title', 'artist', 'description', 'image', 'created_at']

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'

class VenueSeatMapSerializer(serializers.ModelSerializer):
    venue = VenueSerializer(read_only=True)  # 可以改成 id 傳入依需求調整
    venue_id = serializers.PrimaryKeyRelatedField(
        queryset=Venue.objects.all(), source='venue', write_only=True
    )

    class Meta:
        model = VenueSeatMap
        fields = ['id', 'venue', 'venue_id', 'section', 'seat_number']

class ShowSerializer(serializers.ModelSerializer):
    concert = ConcertSerializer(read_only=True)
    concert_id = serializers.PrimaryKeyRelatedField(
        queryset=Concert.objects.all(), source='concert', write_only=True
    )
    venue = VenueSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(
        queryset=Venue.objects.all(), source='venue', write_only=True
    )

    class Meta:
        model = Show
        fields = ['id', 'concert', 'concert_id', 'venue', 'venue_id','show_date', 'show_time']

class SimpleConcertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concert
        fields = ['title']
class SimpleVenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['name']

class PricingSerializer(serializers.ModelSerializer):
    concert = SimpleConcertSerializer(read_only=True)
    venue = SimpleVenueSerializer(read_only=True)
    show_id = serializers.PrimaryKeyRelatedField(
        queryset=Show.objects.all(), source='show'
    )

    class Meta:
        model = Pricing
        fields = ['id', 'concert', 'show_id', 'venue','section', 'price']

class TicketSerializer(serializers.ModelSerializer):
    show = ShowSerializer(read_only=True)
    show_id = serializers.PrimaryKeyRelatedField(
        queryset=Show.objects.all(), source='show', write_only=True
    )

    seat = VenueSeatMapSerializer(read_only=True)
    seat_id = serializers.PrimaryKeyRelatedField(
        queryset=VenueSeatMap.objects.all(), source='seat', write_only=True
    )

    buyer = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            'id', 
            'show', 'show_id',
            'seat', 'seat_id',
            'price', 
            'status', 
            'buyer', 
            'reserved_until', 
            'order',
        ]
        read_only_fields = ['price']  # price 會自動從 Pricing 帶入，不需要手動填寫

    def get_buyer(self, obj):
        user = obj.buyer
        if user:
            return {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        return None

    def validate(self, data):
        """驗證座位是否屬於演出場地"""
        show = data.get('show')
        seat = data.get('seat')
        
        if show and seat:
            if seat.venue != show.venue:
                raise serializers.ValidationError(
                    "座位必須屬於演出場地"
                )
        
        return data

    #     # 檢查是否已被預訂或售出
    #     if Ticket.objects.filter(
    #         show=show,
    #         seatmap=seatmap,
    #         status__in=['reserved', 'sold']
    #     ).exists():
    #         raise serializers.ValidationError("該座位已被預訂或售出")

    #     return data

    #     def create(self, validated_data):
    #       pricing = validated_data['pricing']
    #       validated_data['price'] = pricing.price
    #       validated_data['status'] = 'reserved'
    #       validated_data['reserved_until'] = timezone.now() + timezone.timedelta(seconds=60)
    #       return super().create(validated_data)