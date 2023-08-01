from django.urls import path
from .views import *

urlpatterns = [
    path('products/', ProductListAPIView.as_view(), name='products'),
    path('categories/', ProductCategoryListAPIView.as_view(), name='categories'),
    path('product_versions/', ProductVersionListAPIView.as_view(), name='product_versions'),
    path('product_images/', ProductImageListAPIView.as_view(), name='product_images'),
    path('reviews/', ReviewListAPIView.as_view(), name='reviews'),
    path('reviews/<int:pk>', ReviewDeleteAPIView.as_view(), name='review_delete'),
    path('product_properties/', PropertyListAPIView.as_view(), name='product_properties'),
    path('property_values/', ProductPropertyValueListAPIView.as_view(), name='property_values')
]
    # path('products/', Products, name='products'),
    # path('product_versions/', ProductVersions, name='product_versions'),
    # path('product_images/', ProductImages, name='product_images'),
    # path('reviews/', Reviews, name='reviews'),
#     path('product_properties/', ProductPropertyList, name='product_properties'),
#     path('property_values/', ProductPropertyValueList, name='property_values')
# ]