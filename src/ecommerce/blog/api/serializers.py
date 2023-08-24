from rest_framework import serializers
from blog.models import *
class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = (
            'id',
            'category_name',
            'slug',
            'blog'
        )

class BlogSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer()
    class Meta:
        model = Blog
        fields = (
            'id',
            'title',
            'blog',
            'image',
            'slug',
            'published_day',
            'published_month',
            'blog_user',
            'category',
            'status',
            'get_absolute_url',
            )


class CommentSerializer(serializers.ModelSerializer):
    blog = BlogSerializer()
    class Meta:
        model = Comment
        fields = (
            'id',
            'comment_user',
            'message',
            'blog',
            'active',
            'comment_time'
        )


class CommentPostSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Comment
        fields = (
            'user',
            'message',
            'blog',
            'active'
        )
        
    def validate(self, attrs):
        request = self.context['request']
        attrs['user'] = request.user
        attrs['active'] = True
        return super().validate(attrs)
