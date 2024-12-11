from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile
from project import settings
from friendship.serializers import FriendRequestSerializer



# Friend Serializer
class FriendSerializer(serializers.ModelSerializer):
    id              = serializers.SerializerMethodField()
    nickname        = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile  # Keep it as UserProfile, but get the related profile
        fields = ['id', 'nickname', 'profile_picture']

    def get_id(self, obj):
        return obj.user_profile.id

    def get_nickname(self, obj):
        # Get the nickname from the UserProfile related to the User
        return obj.user_profile.nickname if hasattr(obj, 'user_profile') else None

    def get_profile_picture(self, obj):
        # Get the profile_picture from the UserProfile related to the User
        if hasattr(obj, 'user_profile') and obj.user_profile.profile_picture:
            return f"{settings.MEDIA_URL}{obj.user_profile.profile_picture.name}"
        return None


# User Profile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture     = serializers.SerializerMethodField()
    friends             = FriendSerializer(many=True)  # Use the updated FriendSerializer here

    class Meta:
        model = UserProfile
        fields = ['id', 'nickname', 'profile_picture', 'mimeType', 'email', 
                  'bio', 'friends', 'level', 'wins', 'losses']

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return f"{settings.MEDIA_URL}{obj.profile_picture.name}"
        return None


# Serializer for registration
class RegistreSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['nickname', 'profile_picture', 'email', 'password']
    

    nickname    = serializers.CharField(
                    validators=[UniqueValidator(queryset=UserProfile.objects.all())])
    email       = serializers.EmailField(
                    required=True,
                    validators=[UniqueValidator(queryset=UserProfile.objects.all())])
    password    = serializers.CharField(write_only=True)

    def create(self, validated_data):
         # Extract password since it's part of the User creation, not UserProfile
        password = validated_data.pop('password')
        user = User.objects.create_user(
            username=validated_data['nickname'],
            email=validated_data['email'],
            password=password,
        )
        user_profile = UserProfile.objects.create(user=user, **validated_data)
        
        return user_profile

    
class LoginSerializer(serializers.Serializer):
    nickname = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        # Extract the nickname and password from the input data
        nickname = data['nickname']
        password = data['password']

        # Authenticate the user using Django's authenticate function
        user = authenticate(username=nickname, password=password)

        # Check if user is authenticated and active
        if user is None:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("User account is inactive")
        
        # Return the authenticated user and their profile picture
        return {
            'user': user,
        }
