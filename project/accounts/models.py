from django.db import models
from django.contrib.auth.models import User
from .views import profilePics
import random

# Create your models here.

class UserProfile(models.Model):
    user                    = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_profile')
    id                      = models.AutoField(primary_key=True)
    nickname                = models.CharField(max_length=30, unique=True, blank=True, null=True)
    profile_picture         = models.ImageField(upload_to="images/", default=random.choice(profilePics), blank=True, null=True)
    email                   = models.EmailField(max_length=255, blank=True, null=True)
    # bio                     = models.CharField(max_length=100, blank=True)
    friends                 = models.ManyToManyField(User, blank=True, related_name='friends')

    def __str__(self):
        return self.nickname