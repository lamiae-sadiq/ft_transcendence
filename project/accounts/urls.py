from django.urls import path
from .views import home
from .views_auth import oauth_callback
from .views_signup import RegisterView
from .views_signin import LoginView
from .views_changePass import ChangePasswordView
# from .views_login import loginPage


urlpatterns = [
    path('', home),
    path('oauthcallback/', oauth_callback),
    path('signup/',RegisterView.as_view(),),
    path('signin/',LoginView.as_view(),),
    path('changePassword/<int:pk>', ChangePasswordView.as_view(),)
]
