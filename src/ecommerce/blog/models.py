from django.db import models
from django.db.models.query import QuerySet
from django.utils import timezone
from django.urls import reverse
from taggit.managers import TaggableManager
from ckeditor_uploader.fields import RichTextUploadingField
from accounts.models import User


class BlogCategory(models.Model):
    category_name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)

    def blog(self):
        return self.blog

    def __str__(self):
        return self.category_name
    

class PublishedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status=Blog.Status.PUBLİSHED)
    

class Blog(models.Model):

    class Status(models.TextChoices):
        DRAFT = 'DF', 'Draft'
        PUBLİSHED = 'PB', 'Published'

    title = models.CharField(max_length=255)
    blog = RichTextUploadingField()
    image = models.ImageField(upload_to='blog/images/')
    slug = models.SlugField(max_length=255, unique_for_date='published_at')
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog')
    category =  models.ForeignKey(BlogCategory, on_delete=models.CASCADE, related_name='blog')
    status = models.CharField(max_length=2,
                              choices=Status.choices,
                              default=Status.DRAFT)
    objects = models.Manager()
    published = PublishedManager()
    tags = TaggableManager()
    

    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['-published_at'])
        ]


    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('blog_detail', args=[self.published_at.year,
                                                 self.published_at.month,
                                                 self.published_at.day,
                                                 self.slug])
    
    def blog_user(self):
        return self.user.get_username()
    
    def published_day(self):
        return self.published_at.strftime('%d')
    
    def published_month(self):
        return self.published_at.strftime('%b')



class Comment(models.Model):
    name = models.CharField(max_length=15, blank=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    email = models.EmailField(max_length=250)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at'])
        ]

    def __str__(self):
        return f'Comment by {self.user} on {self.blog}'
    
    def comment_user(self):
        return self.user.get_username()
    
    def comment_time(self):
        return self.created_at.strftime('%d' ' ' '%b' ' ' '%Y')