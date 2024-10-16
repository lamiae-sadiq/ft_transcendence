from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import redirect
from .models import UserProfile
import requests
import json


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


# def 


@csrf_exempt
@ensure_csrf_cookie
def oauth_callback(request):
    code = request.GET.get('code')
    #Token Part
    token_json = tokenFunc(code)
    access_token = token_json.get('access_token')
    user_info_response = requests.get(
        'https://api.intra.42.fr/v2/me',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    #preparing what should be returned
    user_info = user_info_response.json()
    login = user_info.get('login')
    if not login:
        return JsonResponse({'error': 'Login is missing from 42 API response'}, status=400)
    picture = user_info.get('image', {}).get('versions', {}).get('small')
    user_information = {
        'profile_picture' : picture,
        'nickname' : login,
        'token' : access_token
    }
    #user creation
      # Create or get the user
    user, created = User.objects.get_or_create(
        username=login,
        defaults={
            'first_name': login,  # Adjust if you have other fields to set
        }
    )

    # Create or update UserProfile
    UserProfile.objects.update_or_create(
        user=user,
        defaults={
            'nickname': login,
            'profile_picture': picture
        }
    )
    json_user_information = json.dumps(user_information)
    return JsonResponse(user_information)
