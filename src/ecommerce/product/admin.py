from django.contrib import admin


from .models import *

admin.site.register(ProductImage)
admin.site.register(Category)
admin.site.register(ProductProperty)
admin.site.register(PropertyValue)
admin.site.register(Review)
admin.site.register(Product)
admin.site.register(ProductVersion)


# class ProductImageInline(admin.TabularInline):
#     model = ProductImage
#     extra = 1


# @admin.register(Product)
# class ProductAdmin(admin.ModelAdmin):
#     inlines = [ ProductImageInline]