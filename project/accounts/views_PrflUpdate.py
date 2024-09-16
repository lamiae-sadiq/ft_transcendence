from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import UpdateProfileSerializer


class UserProfileUpdateView(APIView):
    permession_classes = [IsAuthenticated]


    def get_object(self):
        return self.request.user.userprofile

    def put(self, request):
        user_profile = self.get_object()
        serializer = UpdateProfileSerializer(user_profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)