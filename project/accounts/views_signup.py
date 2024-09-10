from rest_framework.permissions import AllowAny
from .serializers import RegistreSerializer
from django.contrib.auth.models import User
from rest_framework import generics
from .models import UserProfile


class RegisterView(generics.CreateAPIView):
    queryset            = UserProfile.objects.all()
    permission_classes  = (AllowAny, )
    serializer_class = RegistreSerializer
