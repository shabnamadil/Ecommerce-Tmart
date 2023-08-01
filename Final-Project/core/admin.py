from django.contrib import admin

from .models import *

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at']
    list_filter = ['subject', 'created_at']
    search_fields = ['subject', 'message']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']


admin.site.register(Newsletter)
admin.site.register(Team)
