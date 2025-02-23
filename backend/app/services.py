import json
import random
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpRequest
from .serializers import VerifyRegistrationSerializer, RequestPasswordResetSerializer, VerifyPasswordResetSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password

class OTPService:
    def generate_otp(self):
        return random.randint(100000, 999999)

    def send_otp(self, user: User, purpose: str):
        otp = self.generate_otp()
        user.profile.otp = otp
        user.profile.otp_created_at = timezone.now()
        user.profile.otp_purpose = purpose
        user.profile.save()
        
        self._send_email(user.email, otp, purpose)

    def _send_email(self, email: str, otp: int, purpose: str):
        subject = 'Your OTP Code'
        message = f'Your OTP code for {purpose} is {otp}'
        send_mail(
            subject,
            message,
            f'dictionary_app <{settings.EMAIL_HOST_USER}>',
            [email],
            fail_silently=False,
        )
    
    def is_otp_valid(self, user: User, otp: int, purpose: str) -> bool:
        if user.profile.otp != otp or user.profile.otp_purpose != purpose:
            return False
        
        otp_age = timezone.now() - user.profile.otp_created_at
        if otp_age > timedelta(minutes=10):  # OTP is valid for 10 minutes
            return False

        return True


@method_decorator(csrf_exempt, name='dispatch')
class VerifyRegistrationOTPView(APIView):
    serializer_class = VerifyRegistrationSerializer

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.otp_service = OTPService()

    def post(self, request: HttpRequest, *args, **kwargs):
        data = json.loads(request.body)
        serializer = VerifyRegistrationSerializer(data=data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = int(serializer.validated_data['otp'])
            user = User.objects.get(email=email)
            if self.otp_service.is_otp_valid(user, otp, 'registration'):
                user.is_active = True
                user.profile.otp = None
                user.profile.otp_created_at = None
                user.profile.otp_purpose = None
                user.profile.save()
                user.save()
                return JsonResponse({'message': 'OTP verified successfully. You can now log in.'}, status=200)
            else:
                return JsonResponse({'error': 'Invalid or expired OTP'}, status=400)
        else:
            return JsonResponse(serializer.errors, status=400)



#  password reset
@method_decorator(csrf_exempt, name='dispatch')
class RequestPasswordResetView(APIView):
    serializer_class = RequestPasswordResetSerializer

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.otp_service = OTPService()

    def post(self, request: HttpRequest, *args, **kwargs):
        data = json.loads(request.body)
        serializer = RequestPasswordResetSerializer(data=data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            self.otp_service.send_otp(user, 'password reset')
            return JsonResponse({'message': 'OTP for password reset has been sent to your email.'}, status=200)
        else:
            return JsonResponse(serializer.errors, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class VerifyPasswordResetOTPView(APIView):
    serializer_class = VerifyPasswordResetSerializer

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.otp_service = OTPService()

    def post(self, request: HttpRequest, *args, **kwargs):
        data = json.loads(request.body)
        serializer = VerifyPasswordResetSerializer(data=data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = int(serializer.validated_data['otp'])
            new_password = serializer.validated_data['new_password']
            user = User.objects.get(email=email)

            if self.otp_service.is_otp_valid(user, otp, 'password reset'):
                user.password = make_password(new_password)
                user.profile.otp = None
                user.profile.otp_created_at = None
                user.profile.otp_purpose = None
                user.profile.save()
                user.save()
                return JsonResponse({'message': 'Password reset successfully. You can now log in with your new password.'}, status=200)
            else:
                return JsonResponse({'error': 'Invalid or expired OTP'}, status=400)
        else:
            return JsonResponse(serializer.errors, status=400)
