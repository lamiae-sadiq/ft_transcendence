from django.contrib     import admin
from django.contrib import admin
from .models import FriendRequest



class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'timestamp')


admin.site.register(FriendRequest, FriendRequestAdmin)