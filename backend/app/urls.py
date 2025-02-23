from django.urls import path, include 
from .authViews import RegisterView
from .services import VerifyPasswordResetOTPView, VerifyRegistrationOTPView, RequestPasswordResetView
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ChallengeViewSet, SubmissionViewSet
from .submission_views import CodeExecutionViewSet 

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'challenges', ChallengeViewSet)
router.register(r'submissions', SubmissionViewSet, basename="submission")
router.register(r'execute-submission', CodeExecutionViewSet, basename="execute")  # Code Execution
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register-view'),
    path('verify-registration-otp/', VerifyRegistrationOTPView.as_view(), name='verify-otp'),
    path('request-password-reset/', RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('verify-password-reset/', VerifyPasswordResetOTPView.as_view(), name='verify-password-reset'),
    path('api/', include(router.urls)),
]
