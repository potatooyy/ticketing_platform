from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from .models import Order
from .serializers import OrderCreateSerializer, UserOrderSerializer, AdminOrderSerializer
# Create your views here.

from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    permission_classes = [IsAuthenticated]
    # permission_classes = [AllowAny]


    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer  # 建立訂單用自訂 Serializer
        if self.request.user.is_staff:
            return AdminOrderSerializer   # 管理員看用
        return UserOrderSerializer
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        with transaction.atomic():
            # 取出該訂單所有票券
            tickets = instance.tickets.all()
            # 批次更新票券狀態為已釋放。例如 'available' 依照你系統定義的票券可售狀態調整
            tickets.update(status='available', order=None)
            # 刪除訂單
            self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)



class UserOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """用戶查看自己的訂單"""
    serializer_class = UserOrderSerializer
    permission_classes = [IsAuthenticated]
    # permission_classes = [AllowAny]
    
    def get_queryset(self):
        # 只能看自己的訂單
        return Order.objects.select_related('user').prefetch_related(
            'tickets__show__concert',
            'tickets__seat',
            'tickets__show__venue'
        ).filter(user=self.request.user).order_by('-created_at')


class AdminOrderViewSet(viewsets.ModelViewSet):  # ModelViewSet 支援 CRUD
    """管理員管理所有訂單"""
    serializer_class = AdminOrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    # permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Order.objects.select_related('user').prefetch_related(
            'tickets__show__concert',
            'tickets__seat',
            'tickets__show__venue'
        ).order_by('-created_at')
        
        # 支援篩選
        user_id = self.request.query_params.get('user_id')
        status = self.request.query_params.get('status')
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset