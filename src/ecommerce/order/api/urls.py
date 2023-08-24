from django.urls import path
from .views import *

urlpatterns = [
    path('', OrderItemListAPIView.as_view(), name='Sopping_cart'),
    path('items/<int:pk>', OrderItemDeleteAPIView.as_view(), name='Sopping_cart_item_delete'),
    path('checkout/', CheckoutAPIView.as_view(), name='checkout'),
    path('wishlist/', WishlistAPIView.as_view(), name='wishlist'),
    path('wishlist/<int:pk>', WishListDeleteAPIView.as_view(), name='wishlist_delete')
]