# apps/orders/modles.py
from django.db import models
from django.conf import settings
import uuid
# Create your models here.

def generate_order_number():
    return str(uuid.uuid4())

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),      # 尚未付款
        ('paid', 'Paid'),            # 已付款
        ('cancelled', 'Cancelled'),  # 取消訂單
        ('refunded', 'Refunded'),    # 退款
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=36, unique=True, default=generate_order_number)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_amount(self):
        """動態計算總金額"""
        ticket = self.tickets.first()
        return ticket.price if ticket else 0
    
    @property
    def ticket(self):
        """取得唯一的票券"""
        return self.tickets.first()

    @classmethod
    def create_order(cls, user, ticket):
        order = cls.objects.create(
            user=user,
            status='pending',
        )
        ticket.order = order
        ticket.status = 'reserved'
        ticket.save()
        return order

    def __str__(self):
        return f"Order {self.order_number} ({self.user})"
