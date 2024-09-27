from django.urls import path
from .viewsUserInfo import ProtectedView
from .views_auth import oauth_callback
from .views_signup import RegisterView
from .views_signin import LoginView
from .views_PrflUpdate import UserProfileUpdateView
from .views_changePass import ChangePasswordView
# from .views_changePass import ChangePasswordView
# from .views_login import loginPage


urlpatterns = [
    path('userinfo/', ProtectedView.as_view(),),
    path('oauthcallback/', oauth_callback),
    path('signup/',RegisterView.as_view(),),
    path('signin/',LoginView.as_view(),),
    path('profile/update/',UserProfileUpdateView.as_view()),
    path('profile/changepassword/',ChangePasswordView.as_view()),
    # path('userinfo/',UserInfo),
    
    # this is the old one
    # path('changePassword/<int:pk>', ChangePasswordView.as_view(),)
]
