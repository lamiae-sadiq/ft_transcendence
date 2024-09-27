from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


# this is the view that is shown when "0.0.0.0:8000/"
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # The authenticated user can be accessed here
        user = request.user
        try:
            # Get the UserProfile related to this user
            user_profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=404)

        # Serialize the UserProfile data
        serializer = UserProfileSerializer(user_profile)

        # Return the serialized data
        return Response(serializer.data)