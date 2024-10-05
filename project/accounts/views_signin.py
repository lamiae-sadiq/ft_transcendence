from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import LoginSerializer    
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status



class LoginView(APIView):
    # parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            # Authenticate successful
            user = serializer.validated_data['user']
            # profile_picture_url = serializer.validated_data['profile_picture']

            refresh = RefreshToken.for_user(user)

            return Response({
                'message': 'Login successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })

        return Response({
            'message': 'incorrect login or password, please try again.'
        }, status=status.HTTP_400_BAD_REQUEST)