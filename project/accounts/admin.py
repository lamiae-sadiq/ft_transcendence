from django.contrib import admin
from .models import UserProfile

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'id', 'nickname', 'profile_picture', 'show_friends')
        
    def show_friends(self, obj):
        return ", ".join([friend.username for friend in obj.friends.all()])
    
    show_friends.short_description = 'Friends'
