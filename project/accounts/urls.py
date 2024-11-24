from django.urls import path
from .views_signin import LoginView
from .views_auth import oauth_callback
from .views_signup import RegisterView
from .viewsUserInfo import ProtectedView
from .views_changePass import ChangePasswordView
from .views_PrflUpdate import UserProfileUpdateView, ChangeProfilePictureAPIView
from .viewsWinLoss import UpdateWinLossView

urlpatterns = [
    path('userinfo/', ProtectedView.as_view(),),
    path('oauthcallback/', oauth_callback),
    path('signup/',RegisterView.as_view(),),
    path('signin/',LoginView.as_view(),),
    path('profile/update/',UserProfileUpdateView.as_view()),
    path('profile/update/changepassword/',ChangePasswordView.as_view()),
    path('profile/update/picture/',ChangeProfilePictureAPIView.as_view(),),
    path('profile/update/<str:result>/', UpdateWinLossView.as_view()), #this is the path for the win or loss
]
