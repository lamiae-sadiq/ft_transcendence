from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import LoginSerializer
from rest_framework import status


class LoginView(APIView):
    def post(self, request):
        print(request.data)
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            print ("THE User is Valid!!!!!!")
            #authenticated successful
            user = serializer.validated_data['user']
            return Response({'message': 'Login successful',})
        print ("INVALID USER!!!!")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)