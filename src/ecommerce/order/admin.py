from django.contrib import admin

from .models import *


admin.site.register(Wishlist)
admin.site.register(Billing)
admin.site.register(Order)
admin.site.register(OrderItem)