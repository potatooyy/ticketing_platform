from django.db import models

# Create your models here.

class Venue(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)

class VenueSeatMap(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='seats')
    section = models.CharField(max_length=10)
    seat_number = models.CharField(max_length=10)

class Concert(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=100)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='concerts')
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='concert_images/', blank=True, null=True) # 需要Pillow套件支持
    created_at = models.DateTimeField(auto_now_add=True)

class Show(models.Model):
    concert = models.ForeignKey(Concert, on_delete=models.CASCADE, related_name='shows')
    show_date = models.DateField()
    show_time = models.TimeField()

class Pricing(models.Model):
    concert = models.ForeignKey(Concert, on_delete=models.CASCADE, related_name='pricings')
    section = models.CharField(max_length=10)
    price = models.PositiveIntegerField()

class Ticket(models.Model):
    show = models.ForeignKey(Show, on_delete=models.CASCADE, related_name='tickets')
    pricing = models.ForeignKey(Pricing, on_delete=models.PROTECT)
    seatmap = models.ForeignKey(VenueSeatMap, on_delete=models.PROTECT)
    price = models.PositiveIntegerField()  # ❗實際售價
    status = models.CharField(max_length=20, default='available')  # available / sold / reserved
