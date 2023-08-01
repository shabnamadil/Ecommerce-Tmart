from blog.models import *
from django.http import JsonResponse
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import filters





class BlogCategoryListAPIView(ListAPIView):
    serializer_class = BlogCategorySerializer
    queryset = BlogCategory.objects.all()


def BlogCategoryList(request):
    blog_category_list = BlogCategory.objects.all()
    serializer = BlogCategorySerializer(blog_category_list, many=True)
    return JsonResponse(data=serializer.data, safe=False)

from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse

class BlogListAPIView(ListCreateAPIView):
    serializer_class = BlogSerializer
    queryset = Blog.published.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'blog']
    ordering_fields = ['published_at']




    
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')

        if category:
            queryset = queryset.filter(category__id=category)

        return queryset


def BlogList(request):
    blog_list = Blog.published.all()
    serializer = BlogSerializer(blog_list, context={'request' : request},  many=True)
    return JsonResponse(data=serializer.data, safe=False)


class CommentListAPIView(ListCreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes = (IsAuthenticated, )
    
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentPostSerializer
        return super().get_serializer_class()


class CommentDeleteApIView(RetrieveDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()


@api_view(http_method_names=['GET', 'POST'])
def CommentList(request):
    if request.method == 'POST':
        serializer = CommentPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(data=serializer.data, safe=False, status = 201)
        return JsonResponse(data=serializer.errors, safe=False, status = 400)
    comment_list = Comment.objects.all()
    serializer = CommentSerializer(comment_list, many=True)
    return JsonResponse(data=serializer.data, safe=False)