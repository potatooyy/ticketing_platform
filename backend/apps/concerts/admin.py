from django.contrib import admin
from .models import Venue, VenueSeatMap, Concert, Show, Pricing, Ticket

# Register your models here.
admin.site.register(Venue)
admin.site.register(VenueSeatMap)
admin.site.register(Concert)
admin.site.register(Show)
admin.site.register(Pricing)
admin.site.register(Ticket)