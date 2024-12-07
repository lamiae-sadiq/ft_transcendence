from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import redirect
from .models import UserProfile
import requests
from django.core.files.base import ContentFile
from project import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken





def tokenFunc(code):
    token_url = 'https://api.intra.42.fr/oauth/token'
    payload = {
        "grant_type": "authorization_code",
        "client_id": "u-s4t2ud-9e8cb1d6b2b0bb181505b29a9397b6d8e3079ab0fe7be47c059b43e8f4603fcf",
        "client_secret": "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",
        "redirect_uri": "http://0.0.0.0:8080/login",
        "code": code
    }
    #Sending a post request to the Token endPoint
    token_response = requests.post(token_url, data=payload)
    if token_response.status_code != 200:
        return HttpResponse("Failed to obtain access token------", status=401)
    token_json = token_response.json()
    return (token_json)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['GET'])
@csrf_exempt
@ensure_csrf_cookie
def oauth_callback(request):
    code = request.GET.get('code')
    token_json = tokenFunc(code)
    
    if not token_json:
        return Response({'error': 'Failed to obtain token'}, status=400)

    access_token = token_json.get('access_token')
    if not access_token:
        return Response({'error': 'Access token is missing'}, status=400)

    user_info_response = requests.get(
        'https://api.intra.42.fr/v2/me',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    if user_info_response.status_code != 200:
        return Response({'error': 'Failed to fetch user info'}, status=user_info_response.status_code)

    user_info = user_info_response.json()
    login = user_info.get('login')
    if not login:
        return Response({'error': 'Login is missing from 42 API response'}, status=400)

    picture = user_info.get('image', {}).get('versions', {}).get('small')

    user, created = User.objects.get_or_create(
        username=login,
        defaults={'first_name': login}
    )
    
    user_profile, created = UserProfile.objects.update_or_create(
        user=user,
        defaults={'nickname': login}
    )

    if picture:
        response = requests.get(picture)
        if response.status_code == 200:
            user_profile.profile_picture.save(
                f"{login}_profile.jpg",
                ContentFile(response.content)
            )
            user_profile.save()
    # login(request, user)
    tokens = get_tokens_for_user(user)

    return Response({
        'profile_picture': f"{settings.MEDIA_URL}{user_profile.profile_picture.name}",
        'nickname': login,
        'access': tokens['access'],  # Return the JWT access token
        'refresh': tokens['refresh'],  # Optional: Return the refresh token
    })
