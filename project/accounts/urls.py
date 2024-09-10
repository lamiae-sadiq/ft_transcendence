from django.urls import path
from .views import home
from .views_auth import oauth_callback
from .views_signup import RegisterView
from .views_signin import LoginView
# from .views_login import loginPage


urlpatterns = [
    path('', home),
    path('signup/',RegisterView.as_view(),),
    path('signin/',LoginView.as_view(),),
    path('oauthcallback/', oauth_callback)
]
