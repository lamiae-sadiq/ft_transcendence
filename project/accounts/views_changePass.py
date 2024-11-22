from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializersUpdate import ChangePasswordSerializer
from .models import UserProfile

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = UserProfile
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, queryset=None):
        # Get the logged-in user
        return self.request.user

    def update(self, request, *args, **kwargs):
        # Get the user object
        user = self.get_object()

        # Pass data to the serializer, including the context for accessing the request
        serializer = self.get_serializer(data=request.data, context={'request': request})

        # Validate the data
        if serializer.is_valid():
            # If valid, change the password and return success message
            serializer.update(user, serializer.validated_data)
            return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)

        # If invalid, return the errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
