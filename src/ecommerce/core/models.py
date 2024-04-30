from django.db import models
from django.utils import timezone

class Contact(models.Model):
    name = models.CharField(max_length=50, null=False, blank=False)
    email = models.EmailField(max_length=200)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name
    

class Newsletter(models.Model):
    email = models.EmailField(max_length=250, unique=True)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email


class Team(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=250, unique=True)
    profession = models.CharField(max_length=200)
    department = models.CharField(max_length=200)
    salary = models.IntegerField()
    information = models.TextField()
    facebook_account = models.URLField(default='https://www.facebook.com/', blank=True)
    instagram_account = models.URLField(default='https://www.facebook.com/', blank=True)
    twitter_account = models.URLField(default='https://www.facebook.com/', blank=True)
    google_account = models.URLField(default='https://www.facebook.com/', blank=True)
    image = models.ImageField()
    active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.full_name