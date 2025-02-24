from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Category, Challenge, Submission



class UserCreationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField(min_length=8)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value


class VerifyRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.IntegerField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Invalid email")
        return value

    def validate_otp(self, value):
        if value <= 0:
            raise serializers.ValidationError("Invalid OTP")
        return value


class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Invalid email")
        return value


class VerifyPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Invalid email")
        return value


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    challenge_id = serializers.IntegerField(write_only=True) 

    class Meta:
        model = Submission
        fields = '__all__'
        read_only_fields = ['user', 'challenge', 'result', 'status', 'submitted_at']

    def validate_challenge_id(self, value):
        try:
            return Challenge.objects.get(id=value)  # Return Challenge object instead of just ID
        except Challenge.DoesNotExist:
            raise serializers.ValidationError("Invalid Challenge ID")

    def create(self, validated_data):
        challenge = Challenge.objects.get(id=validated_data.pop("challenge_id"))
        submission = Submission.objects.create(challenge=challenge, **validated_data)
        return submission
