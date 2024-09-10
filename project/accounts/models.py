from django.db import models
from django.contrib.auth.models import User
from .views import profilePics
import random

# Create your models here.

class UserProfile(models.Model):
    user                    = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname                = models.CharField(max_length=30, blank=True, null=True)
    profile_picture         = models.ImageField(upload_to="images/", default=random.choice(profilePics), blank=True, null=True)
    email                   = models.EmailField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.nickname