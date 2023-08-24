from django.urls import path
from .views import *
urlpatterns = [
    path('checkout/', CheckoutView, name='checkout'),
    path('cart/', cart, name="cart"),
	path('update_item/', updateItem, name="update_item"),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('updatewishlist/', updateWishList, name='updatewishlist')
]