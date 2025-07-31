# apps/orders/serializers.py
from rest_framework import serializers
from .models import Order
from apps.concerts.models import Ticket

class OrderCreateSerializer(serializers.ModelSerializer):
    ticket_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True)

    class Meta:
        model = Order
        fields = ['status', 'ticket_ids']

    def create(self, validated_data):
        ticket_ids = validated_data.pop('ticket_ids')  # 取出票id清單
        user = self.context['request'].user
        # order = Order.objects.create(user=user, **validated_data)

        tickets = Ticket.objects.filter(id__in=ticket_ids, status='available')
        print(f"Found {tickets.count()} tickets with available status")
        if not tickets.exists():
            raise serializers.ValidationError("找不到狀態為 available 的票券，無法建立訂單。")

        # 都是 available 時候才創訂單
        order = Order.objects.create(user=user, **validated_data)

        for ticket in tickets:
            ticket.order = order
            ticket.status = 'reserved'
            ticket.save()

        return order

class UserOrderSerializer(serializers.ModelSerializer):
    """用戶版本：不顯示敏感資訊"""
    total_amount = serializers.ReadOnlyField()
    ticket_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'status', 'total_amount', 
                 'created_at', 'ticket_info']
    
    def get_ticket_info(self, obj):
        ticket = obj.ticket
        if not ticket:
            return None
        return {
            'id': ticket.id,
            'show_title': ticket.show.concert.title,
            'show_date': ticket.show.show_date,
            'show_time': ticket.show.show_time,
            'seat': str(ticket.seat),
            'section': ticket.seat.section,
            'venue': ticket.show.venue.name,
            'price': ticket.price,
            'ticket_status': ticket.status,
        }


class AdminOrderSerializer(serializers.ModelSerializer):
    """管理員版本：顯示完整資訊"""
    total_amount = serializers.ReadOnlyField()
    ticket_info = serializers.SerializerMethodField()
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'status', 'total_amount', 
                 'created_at', 'updated_at', 'user_info', 'ticket_info']
    
    def get_user_info(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
        }
    
    def get_ticket_info(self, obj):
        # 更詳細的票券資訊
        ticket = obj.ticket
        if not ticket:
            return None
        return {
            'id': ticket.id,
            'show_title': ticket.show.concert.title,
            'show_date': ticket.show.show_date,
            'show_time': ticket.show.show_time,
            'seat': str(ticket.seat),
            'section': ticket.seat.section,
            'venue': ticket.show.venue.name,
            'price': ticket.price,
            'ticket_status': ticket.status,
        }