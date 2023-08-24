from django.urls import path
from .views import *

urlpatterns = [
    # path('categories/', BlogCategoryList, name='categories'),
    path('categories/', BlogCategoryListAPIView.as_view(), name='categories'),
    # path('blogs/', BlogList, name='blogs'),
    path('blogs/', BlogListAPIView.as_view(), name='blogs'),
    # path('comments/', CommentList, name='comments')
    path('comments/', CommentListAPIView.as_view(), name='comments'),
    path('comments/<int:pk>', CommentDeleteApIView.as_view(), name='comment_delete')
]