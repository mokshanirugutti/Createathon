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
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only the submissions made by the authenticated user"""
        queryset = Submission.objects.filter(user=self.request.user).order_by("-submitted_at")

        # Get the status filter from the request query parameters
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset