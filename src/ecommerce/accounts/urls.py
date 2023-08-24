from django.urls import path, re_path, include

from .views import *

urlpatterns = [
    path('login-register/', LoginView.as_view(), name='login_register'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutRequestView.as_view() , name='logout'),
    re_path(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,2033})/$',
        activate, name='activate'),
    path('social-auth/', include('social_django.urls', namespace="social")),

]