from rest_framework.permissions import IsAuthenticated
from .serializers import ChangePasswordSerializer
from django.contrib.auth.models import User
from rest_framework import generics


class ChangePasswordView(generics.UpdateAPIView):

    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer