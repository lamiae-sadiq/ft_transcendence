from rest_framework import serializers
from .models import UserProfile
import base64


# Serializer for update profile
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['nickname', 'email', 'bio']
    
    def update(self, instance, validated_data):
        instance.nickname           = validated_data.get('nickname', instance.nickname)
        instance.email              = validated_data.get('email', instance.email)
        instance.bio                = validated_data.get('bio', instance.bio)
        instance.save()
        
        # Update the User's username to match the new nickname, if it changed
        user = instance.user
        if 'nickname' in validated_data and validated_data['nickname']:
            user.username = validated_data['nickname']
        # Update the User's email to match the new email, if it changed
        if 'email' in validated_data and validated_data['email']:
            user.email = validated_data['email']
        if 'bio' in validated_data and validated_data['bio']:
            user.bio = validated_data['bio']
        user.save()  # Save the User model to apply the username and email changes
        return instance
    

# Serializer to change password
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance
    

class UpdateProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_picture']
    

    def update(self, instance, validated_data):
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance
