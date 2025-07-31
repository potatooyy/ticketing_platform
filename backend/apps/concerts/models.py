# apps/concerts/models.py

from django.db import models
from django.conf import settings

class Concert(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='concert_images/', blank=True, null=True)  # 需要 Pillow 套件支持
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.artist}"

class Venue(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class VenueSeatMap(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='seats')
    section = models.CharField(max_length=10)
    seat_number = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.venue.name} - {self.section}{self.seat_number}"

class Show(models.Model):
    concert = models.ForeignKey(Concert, on_delete=models.CASCADE, related_name='shows')
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='shows')
    show_date = models.DateField()
    show_time = models.TimeField()
    
    def __str__(self):
        return f"{self.concert.title} @ {self.show_date} {self.show_time}"

class Pricing(models.Model):
    show = models.ForeignKey(Show, on_delete=models.CASCADE, related_name='pricings')
    section = models.CharField(max_length=10)
    price = models.PositiveIntegerField()
    
    class Meta:
        unique_together = ['show', 'section']  # 防止同一場次的同一區域有重複定價
    
    def __str__(self):
        return f"{self.show.concert.title} @ {self.show.venue.name} - {self.section}: {self.price} NT"
    
    @property
    def concert(self):
        """透過 show 取得 concert"""
        return self.show.concert
    
    @property
    def venue(self):
        """透過 show 取得 venue"""
        return self.show.venue

class Ticket(models.Model):
    """
    票券模型 - 每張票是一個商品
    一張票 = 一場演出 + 一個座位 + 一個價格
    """
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]

    # 核心資訊
    show = models.ForeignKey(Show, on_delete=models.CASCADE, related_name='tickets')
    seat = models.ForeignKey(VenueSeatMap, on_delete=models.PROTECT, related_name='tickets')
    price = models.PositiveIntegerField(null=True, blank=True)  # 從 Pricing 自動帶入
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # 購買資訊
    reserved_until = models.DateTimeField(null=True, blank=True)
    order = models.ForeignKey(
        'orders.Order', 
        on_delete=models.SET_NULL, 
        null=True, blank=True, 
        related_name='tickets'
    )
    
    @property
    def buyer(self):
        return self.order.user if self.order else None
    
    class Meta:
        unique_together = ['show', 'seat']  # 一個座位在一場演出只能有一張票
    
    
    def save(self, *args, **kwargs):
        """自動從 Pricing 帶入價格"""
        if not self.price:
            try:
                pricing = Pricing.objects.get(
                    show=self.show,
                    section=self.seat.section
                )
                self.price = pricing.price
            except Pricing.DoesNotExist:
                raise ValueError(f"找不到 {self.show} 的 {self.seat.section} 區定價")
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.show.concert.title} - {self.seat} - {self.status}"