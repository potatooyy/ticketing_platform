from django.contrib import admin
from .models import Order
from apps.concerts.models import Ticket

admin.site.site_header = "ticketgo"
admin.site.site_title = "ticketgo"
admin.site.index_title = ""


class TicketInline(admin.TabularInline):
    model = Ticket
    extra = 0
    readonly_fields = ('show', 'seat', 'price', 'status', 'reserved_until', 'buyer')
    # buyer 是計算屬性，可以在此顯示

    def buyer(self, obj):
        return obj.buyer
    buyer.short_description = 'Buyer'

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'status', 'created_at', 'updated_at', 'total_amount')
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'user__username', 'user__email')
    readonly_fields = ('order_number', 'created_at', 'updated_at', 'total_amount')
    inlines = [TicketInline]

    def total_amount(self, obj):
        return obj.total_amount
    total_amount.short_description = 'Total Amount'
