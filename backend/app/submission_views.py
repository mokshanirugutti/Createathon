from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.timezone import now
from .models import Submission, UserProgress
from .serializers import SubmissionSerializer
import requests
from dotenv import load_dotenv
import os
load_dotenv()

FASTAPI_EXECUTION_URL = os.environ.get('EXECUTION_SERVER')

class CodeExecutionViewSet(viewsets.ViewSet):  # Handles code execution
    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            challenge = serializer.validated_data['challenge_id']
            code = serializer.validated_data['code']
            user = request.user

            # Fetch test cases
            test_cases = challenge.test_cases  # Stored as JSON

            # Send request to FastAPI Execution Service
            execution_payload = {
                "code": code,
                "test_cases": test_cases
            }
            
            try:
                response = requests.post(FASTAPI_EXECUTION_URL, json=execution_payload)
                response_data = response.json()
            except requests.RequestException:
                return Response({"error": "Execution service not reachable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            # Save submission
            submission = Submission.objects.create(
                user=user,
                challenge=challenge,
                code=code,
                status=response_data.get("status", "failed"),
                result=response_data
            )

            passed = response_data.get("status") == "passed"

            user_progress, created = UserProgress.objects.update_or_create(
                user=user,
                challenge=challenge,
                defaults={
                    "status": "completed" if passed else "started",
                }
            )
            if created:
                user_progress.attempts = 1
            else:
                user_progress.attempts += 1

            if passed:
                user_progress.completed_at = now()

            return Response({
                "message": "Submission processed",
                "submission_status": response_data.get("status"),
                "results":response_data,
                "user_progress": {
                    "status": user_progress.status,
                    "attempts": user_progress.attempts,
                    "completed_at": user_progress.completed_at
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
