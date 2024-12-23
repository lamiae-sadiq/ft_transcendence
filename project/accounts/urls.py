from django.urls import path
from .views_signin import LoginView
from .views_auth import oauth_callback
from .views_signup import RegisterView
from .viewsUserInfo import ProtectedView
from .views_changePass import ChangePasswordView
from .views_PrflUpdate import UserProfileUpdateView, ChangeProfilePictureAPIView
from .viewsWinLoss import UpdateWinLossView
from .views import UserProfileDetailView, Enable2FAView, VerifyOTPView, Disable2FAView
# from .views import ProxyToChat

from . import viewsUserInfo

urlpatterns = [
    # path('proxy/block/<int:user_id>/', ProxyToChat.as_view(), name='proxy_to_chat'),
    path('userinfo/', ProtectedView.as_view(),),
    path('oauthcallback/', oauth_callback),
    path('signup/',RegisterView.as_view(),),
    path('signin/',LoginView.as_view(),),
    path('profile/update/',UserProfileUpdateView.as_view()),
    path('profile/update/changepassword/',ChangePasswordView.as_view()),
    path('profile/update/picture/',ChangeProfilePictureAPIView.as_view(),),
    path('profile/update/<str:result>/', UpdateWinLossView.as_view()), #this is the path for the win or loss
    ####
    path('user-profile/<str:nickname>/', UserProfileDetailView.as_view(), name='user-profile-detail'),
    # *************************************************************************new
    path('api/search-friends/', viewsUserInfo.search_friends, name='search_friends'),
    path('api/add-friend/', viewsUserInfo.add_friend, name='add_friend'),

    path('2fa/enable/', Enable2FAView.as_view(), name='enable_2fa'),
    path("2fa/verify/", VerifyOTPView.as_view(), name="verify_otp"),
    path("2fa/disable/", Disable2FAView.as_view(), name="disable_2fa"),

    # path('2fa/verify/', VerifyOTPView.as_view(), name='verify_otp'),
    # path('2fa/disable/', Disable2FAView.as_view(), name='disable_2fa'),
    
]
