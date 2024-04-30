from django.urls import path


from .views import *

urlpatterns = [
    path('', BlogListView.as_view(), name='blog_list'),
    # path('tag/<slug:tag_slug>/', blog_list, name='blog_list_tag'),
    # path('category/<slug:category_slug>/', blog_list, name='blog_list_category'),
    # path('search/', blog_list, name='blog_search'),
    path('<int:year>/<int:month>/<int:day>/<slug:slug>/', 
         BlogDetailVieW.as_view(), 
         name='blog_detail')

]