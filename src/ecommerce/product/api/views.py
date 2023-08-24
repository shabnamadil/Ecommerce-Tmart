from product.models import *
from .serializers import *
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import filters


class ProductCategoryListAPIView(ListAPIView):
    serializer_class = ProductCategorySerializer
    queryset = Category.objects.all()



class ProductListAPIView(ListAPIView):
    serializer_class = ProductSerializer
    queryset =  Product.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    ordering_fields = ['price']



def Products(request):
    product_list = Product.objects.all()
    serializer = ProductSerializer(product_list, many=True)
    return JsonResponse(data=serializer.data, safe=False)

from django.db.models import Q

class ProductVersionListAPIView(ListAPIView):
    serializer_class = ProductVersionSerializer
    queryset = ProductVersion.objects.filter(in_stock=True)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product__title', 'product__small_description', 'product__price', 'product__large_description', 'product__category__category_name']
    ordering_fields = ['product__price']



    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        size = self.request.query_params.get('size')
        color = self.request.query_params.get('color')
        ProductId = self.request.query_params.get('ProductId')
        cat = self.request.query_params.get('cat')
        subcat = self.request.query_params.get('subcat')


        if color and ProductId:
            queryset = queryset.filter(Q(property_value__id=color) & Q(product__id=ProductId) &Q(property_value__product_value__property_name='color'))

        elif color:
            queryset = queryset.filter(property_value__id=color)

        elif ProductId:
            queryset = queryset.filter(product__id=ProductId)

        elif size:
            queryset = queryset.filter(property_value__id=size)

        elif category:
            queryset = queryset.filter(product__category__main_category__main_category__id=category)

        elif cat:
            queryset = queryset.filter(product__category__main_category__id=cat)

        elif subcat:
            queryset = queryset.filter(product__category__id=subcat)

        return queryset





def ProductVersions(request):
    product_version_list = ProductVersion.objects.all()
    serializer = ProductVersionSerializer(product_version_list, context={'request' : request}, many=True)
    return JsonResponse(data=serializer.data, safe=False)




class ProductImageListAPIView(ListAPIView):
    serializer_class = ProductImageSerializer
    queryset = ProductImage.objects.all()


def ProductImages(request):
    product_images_list = ProductImage.objects.all()
    serializer = ProductImageSerializer(product_images_list, context={'request' : request}, many=True)
    return JsonResponse(data=serializer.data, safe=False)


class ReviewListAPIView(ListCreateAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReviewPostSerializer
        return super().get_serializer_class()
    

class ReviewDeleteAPIView(RetrieveDestroyAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

@api_view(http_method_names=['GET', 'POST'])
def Reviews(request):
    if request.method == 'POST':
        serializer = ReviewPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(data=serializer.data, status=201, safe=False)
        return JsonResponse(data=serializer.errors, status=400, safe=False)
    reviews_list = Review.objects.all()
    serializer = ReviewSerializer(reviews_list, many=True)
    return JsonResponse(data=serializer.data, safe=False)


class PropertyListAPIView(ListAPIView):
    serializer_class = ProductPropertySerializer
    queryset = ProductProperty.objects.all()


def ProductPropertyList(request):
    product_property_list = ProductProperty.objects.all()
    serializer = ProductPropertySerializer(product_property_list, many=True)
    return JsonResponse(data=serializer.data, safe=False)


class ProductPropertyValueListAPIView(ListAPIView):
    serializer_class = PropertyValueSerializer
    queryset = PropertyValue.objects.all()
    filter_backends =[filters.SearchFilter]
    

    def get_queryset(self):
        queryset = super().get_queryset()
        color = self.request.query_params.get('color')

        if color:
            queryset = PropertyValue.objects.filter(id=color)

        return queryset






def ProductPropertyValueList(request):
    product_property_value_list = PropertyValue.objects.all()
    serializer = PropertyValueSerializer(product_property_value_list, many=True)
    return JsonResponse(data=serializer.data, safe=False)