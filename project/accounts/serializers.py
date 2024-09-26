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
    nickname    = serializers.CharField(required=True)
    password    = serializers.CharField(write_only=True, required=True)


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
        
        # Return the authenticated user
        return {
            'user': user
        }
    

# Serializer for update profile
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['nickname', 'email', 'profile_picture']
    
    def update(self, instance, validated_data):
        instance.nickname = validated_data.get('nickname', instance.nickname)
        instance.email = validated_data.get('email', instance.email)
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        
        # Update the User's username to match the new nickname, if it changed
        user = instance.user
        
        if 'nickname' in validated_data and validated_data['nickname']:
            user.username = validated_data['nickname']
        
        # Update the User's email to match the new email, if it changed
        if 'email' in validated_data and validated_data['email']:
            user.email = validated_data['email']
        
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