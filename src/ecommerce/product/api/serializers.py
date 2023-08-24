from rest_framework import serializers
from product.models import *

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            'id',
            'category_name',
            'slug',
            'main_category',
            'main_cat',
            'cat_name',
            'png'
        )

class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer()
    class Meta:
        model = Product
        fields = (
            'id',
            'title',
            'small_description',
            'large_description',
            'old_price',
            'price',
            'average_rating',
            'category'
        )

class ProductPropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductProperty
        fields = (
            '__all__'
        )


class PropertyValueSerializer(serializers.ModelSerializer):
    product_value = ProductPropertySerializer()
    class Meta:
        model = PropertyValue
        fields = (
            'id',
            'value_name',
            'slug',
            'product_value',
            'product_version'
        )


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = (
            'id',
            'image'
        )


class ProductVersionSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    property_value = PropertyValueSerializer(many=True)
    category = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True)
    class Meta:
        model = ProductVersion
        fields = (
            'id',
            'slug',
            'in_stock',
            'current_stock',
            'total',
            'main_image',
            'product',
            'property_value',
            'category',
            'get_absolute_url',
            'images'
        )

    def get_category(self, obj):
        return ProductCategorySerializer(obj.product.category).data








class ReviewSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = Review
        fields = (
            'id',
            'review_user',
            'review',
            'created_at',
            'rating',
            'active',
            'product',
            'review_time'
        )


class ReviewPostSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Review
        fields = (
            'id',
            'user',
            'review',
            'created_at',
            'rating',
            'active',
            'product',
            'review_time'

        )

    def validate(self, attrs):
        request = self.context['request']
        attrs['user'] = request.user
        attrs['active'] = True
        return super().validate(attrs)
    
