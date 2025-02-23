from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .models import Category, Challenge, Submission,UserProgress
from .serializers import CategorySerializer, ChallengeSerializer, SubmissionSerializer

import requests
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils.timezone import now


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    
    
    


FASTAPI_EXECUTION_URL = "http://localhost:8001/execute"  # Change to actual FastAPI URL

class SubmissionViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            challenge = serializer.validated_data['challenge']
            code = serializer.validated_data['code']
            user = request.user
            
            # Fetch test cases from the Challenge model
            test_cases = challenge.test_cases  # Stored as JSON
            
            # Send request to FastAPI Execution Service
            execution_payload = {
                "code": code,
                "test_cases": test_cases
            }
            
            try:
                response = requests.post(FASTAPI_EXECUTION_URL, json=execution_payload)
                response_data = response.json()
            except requests.RequestException as e:
                return Response({"error": "Execution service not reachable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            # Save Submission in DB
            submission = Submission.objects.create(
                user=user,
                challenge=challenge,
                code=code,
                status=response_data.get("status", "failed"),
                result=response_data
            )

            # If all test cases passed, update user progress
            if response_data.get("status") == "passed":
                UserProgress.objects.update_or_create(
                    user=user,
                    challenge=challenge,
                    defaults={"status": "completed", "completed_at": now()}
                )

            return Response({"message": "Submission processed", "result": response_data}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
