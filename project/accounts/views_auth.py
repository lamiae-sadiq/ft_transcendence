from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from .models import UserProfile
import requests
import json


# def authorization42(request):
#     print("this is the AUTHORIZE FUNCTION")
#     print(request.GET.get('client_id'))
#     authorize_url = (
#         f"https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9e8cb1d6b2b0bb181505b29a9397b6d8e3079ab0fe7be47c059b43e8f4603fcf"
#         f"&redirect_uri=http://127.0.0.1:8000/oauthcallback/&response_type=code&scope=public"
#     )
#     return redirect(authorize_url)

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
    print("*************************")
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
    picture = user_info.get('image', {}).get('versions', {}).get('small')
    user_information = {
        'picture' : picture,
        'login' : login,
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
            'loginID': login,
            'profile_picture': picture
        }
    )

    json_user_information = json.dumps(user_information)
    return JsonResponse(user_information)
