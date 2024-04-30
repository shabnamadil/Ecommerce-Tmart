from django.urls import path
from .views import *

urlpatterns = [
    path('', HomeListView.as_view(), name = 'home'),
    path('shop/', ShopListView.as_view(), name = 'shop'),
    # path('shop/<slug:category_slug>/', shop, name = 'shop_category'),
    path('shop/detail/<slug:slug>/', ShopDetailView.as_view(), name = 'shop_detail'),
]