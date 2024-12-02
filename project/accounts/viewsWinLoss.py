from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile


class UpdateWinLossView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request, result):
        try:
            user_id = request.data.get('user_id')
            if not user_id:
                return Response({"error": "User ID is required"}, status=400)
            # Fetch the user profile
            user_profile = UserProfile.objects.get(user__id=user_id)

            # Update stats based on the result
            if result == "win":
                user_profile.wins += 1
            elif result == "lose":
                user_profile.losses += 1
            else:
                return Response({"error": "Invalid result. Use 'win' or 'lose'."}, status=400)

            user_profile.save()

            return Response({
                "message": f"User {user_profile.nickname} updated successfully.",
                "wins": user_profile.wins,
                "losses": user_profile.losses
            }, status=200)

        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)