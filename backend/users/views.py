from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import UserSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated

class SignupView(APIView):
    def post(self, request):
        # Crearea unui nou utilizator folosind serializer-ul
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Salvăm utilizatorul
            user = serializer.save()
            
            # Generăm token-urile JWT pentru user
            refresh = RefreshToken.for_user(user)
            
            # Returnăm token-urile și informațiile utilizatorului
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data  # Acesta este obiectul User validat

            # Generăm token-urile JWT pentru user
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetMeView(APIView):
    permission_classes = [IsAuthenticated]

    def initial(self, request, *args, **kwargs):
        # Log headers before permission checks
        print('Request Headers (before IsAuthenticated):', dict(request.headers))
        print('Authorization Header (before IsAuthenticated):', request.headers.get('Authorization'))
        # Call the parent initial method to continue with authentication and permission checks
        super().initial(request, *args, **kwargs)

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({
            'user_data': serializer.data
        }, status=status.HTTP_200_OK)