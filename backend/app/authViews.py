import json
from .services import OTPService
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from .serializers import UserCreationSerializer
from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from .serializers import ProfileSerializer


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    serializer_class = UserCreationSerializer

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.otp_service = OTPService()

    def post(self, request: HttpRequest, *args, **kwargs):
        
        data = json.loads(request.body)
        serializer = UserCreationSerializer(data=data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            email = serializer.validated_data['email']
            user = User.objects.create(
                username=username,
                password=make_password(password),
                email=email,
                is_active=False  # User is inactive until email verification
            )

            self.otp_service.send_otp(user, 'registration')
            return JsonResponse({'message': 'User registered successfully. An OTP has been sent to your email.'}, status=200)
        else:
            return JsonResponse(serializer.errors, status=400)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Requires authentication

    def get(self, request):
        user = request.user  # Get authenticated user
        profile, created = Profile.objects.get_or_create(user=user)  # Ensure profile exists
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=200)