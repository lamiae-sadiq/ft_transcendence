from django.db          import models
from django.contrib.auth.models import User


# Create your models here.
class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='friend_requests_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='friend_requests_received', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user.username} -> {self.to_user.username}"











## this is an old model

# class Friendship(models.Model):
#     from_user = models.ForeignKey(UserProfile, related_name='sent_friend_requests', on_delete=models.CASCADE)
#     to_user = models.ForeignKey(UserProfile, related_name='received_friend_requests', on_delete=models.CASCADE)
#     is_accepted = models.BooleanField(default=False)  # To track if the friend request is accepted or pending
#     created_at = models.DateTimeField(auto_now_add=True)  # Automatically set the timestamp when the request is created

#     def __str__(self):
#         return f"Friend request from {self.from_user.nickname} to {self.to_user.nickname}"