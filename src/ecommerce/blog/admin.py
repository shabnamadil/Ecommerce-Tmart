from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import *

@admin.register(Blog)
class BlogAdmin(TranslationAdmin):
    list_display = ['title', 'user','published_at', 'status']
    list_filter = ['user','status', 'published_at', 'created_at']
    search_fields = ['title', 'blog']
    # prepopulated_fields = {'slug':('title',)}
    raw_id_fields = ['user']
    date_hierarchy = 'published_at'
    ordering = ['status', '-published_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'email', 'blog', 'created_at', 'active']
    list_filter = ['user', 'created_at', 'active']
    search_fields = ['user__username','message', 'blog__title']
    date_hierarchy = 'created_at'
    ordering = ['created_at', 'active']

@admin.register(BlogCategory)
class BlogCategoryAdmin(TranslationAdmin):
    list_display = ['category_name', 'slug']
    list_filter = ['category_name']
    search_fields = ['category_name', 'blog__title']



