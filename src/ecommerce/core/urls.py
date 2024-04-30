from django.urls import path 

from .views import  *

urlpatterns = [
    path('about/', AboutView.as_view(), name='about'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('team/', TeamListView.as_view(), name='team' ),
    path('newsletter/', NewsletterView.as_view(), name='newsletter')

]