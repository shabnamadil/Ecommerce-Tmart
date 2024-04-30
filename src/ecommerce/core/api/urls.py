from django.urls import path
from .views import *

urlpatterns = [
    # path('contacts/', contacts, name='contacts')
    path('contacts/', ContactCreateAPIView.as_view(), name='contacts'),
    path('newsletter/', NewsletterAPIView.as_view(), name='newsletter')
]