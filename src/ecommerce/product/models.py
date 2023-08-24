from django.db import models
from django.urls import reverse
from accounts.models import User
from django.db.models import Avg


class Category (models.Model):
    category_name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    main_category = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='cat_name')
    png = models.FileField(null=True, blank=True)
    
    def main_cat(self):
        main = None
        if self.main_category == None :
            main = self.category_name
            return main

    def __str__(self):
        return self.category_name
    

class ProductProperty(models.Model):
    property_name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=200)

    def __str__(self):
        return self.property_name
    

class PropertyValue(models.Model):
    value_name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=200)
    product_value = models.ForeignKey(ProductProperty, on_delete=models.CASCADE, related_name='value')

    def __str__(self):
        return self.value_name


class Product(models.Model):
    title = models.CharField(max_length=255)
    small_description = models.CharField(max_length=200, blank=True)
    large_description = models.TextField(blank=True)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True, related_name='product_category')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def average_rating(self) -> float:
        return Review.objects.filter(product=self).aggregate(Avg("rating"))["rating__avg"] or 0

    def __str__(self):
        return self.title
    

class ProductVersion(models.Model):
    slug = models.SlugField(max_length=200, unique=True)
    in_stock = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    total = models.IntegerField(default=0)
    main_image = models.ImageField(null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True,  null=True, related_name='product_version')
    property_value = models.ManyToManyField(PropertyValue, blank=True, related_name='product_version')
    
    class Meta:
        ordering = ['-created']
    
    @property
    def current_stock(self):
        return self.total > 0
        

    
    def get_absolute_url(self):
        return reverse('shop_detail', args=[self.slug])
    
    def __str__(self):
        return self.slug
    
class ProductImage(models.Model):
    image = models.ImageField(upload_to='product/images/')
    product_version = models.ForeignKey(ProductVersion, on_delete=models.CASCADE, blank=True, null=True, related_name='images')


class Review(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    email = models.EmailField(max_length=250, null=True, blank=True)
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    rating = models.FloatField(default=0)
    active = models.BooleanField(default=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='review')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='review')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Review by {self.user} on {self.product}'
    
    def review_user(self):
        return self.user.get_username()
    
    def review_time(self):
        return self.created_at.strftime('%d %b %Y at %H:%M  %p')