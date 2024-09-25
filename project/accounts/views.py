from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from django.shortcuts import render



def home(request):
    return HttpResponse("welcome frome home")


# this is the view that is shown when "0.0.0.0:8000/"
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # The authenticated user can be accessed here
        user = request.user
        return Response({"message": f"Hello {user.username} with the id {user.id}, you are authenticated!"})


profilePics = [
    'images/poro0.jpg',
    'images/poro1.jpg',
    'images/poro2.jpg',
    'images/poro3.jpg',
    'images/poro4.jpg',
    'images/poro5.jpg',
    'images/poro6.jpg',
]

# def 
# '{"email":"edde@gmail.com","loginID":"rergerg",
# "password":"ergeergergergERGERGERGE5151515","passwordC":"ergeergergergERGERGERGE5151515"}'

##login added to the home page now should see if can login with existing user???