from django.db import models
from django.contrib.auth.models import User
from .views import profilePics
import random
import os

# Create your models here.

class UserProfile(models.Model):
    user                    = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_profile')
    id                      = models.AutoField(primary_key=True)
    nickname                = models.CharField(max_length=30, unique=True, blank=True, null=True)
    profile_picture         = models.ImageField(upload_to="images/", default=random.choice(profilePics), blank=True, null=True)
    mimeType                = models.CharField(max_length=50, default="image/jpg")
    email                   = models.EmailField(max_length=255, blank=True, null=True)
    bio                     = models.CharField(max_length=100, blank=True)
    friends                 = models.ManyToManyField(User, blank=True, related_name='user_friends')
    wins                    = models.IntegerField(default=0)
    losses                  = models.IntegerField(default=0)
    level                   = models.IntegerField(default=0)

    def __str__(self):
        return self.nickname