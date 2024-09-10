from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


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


# Serializer for login
class LoginSerializer(serializers.Serializer):
    loginID    = serializers.CharField(required=True)
    password    = serializers.CharField(write_only=True, required=True)


    def validate(self, data):
        # Extract the loginID and password from the input data
        print(data)
        loginID = data['loginID']
        password = data['password']

        # Authenticate the user using Django's authenticate function
        user = authenticate(username=loginID, password=password)

        # Check if user is authenticated and active
        if user is None:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("User account is inactive")
        
        # Return the authenticated user
        return {
            'user': user
        }