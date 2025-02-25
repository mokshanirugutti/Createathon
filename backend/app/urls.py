from django.urls import path, include 
from .authViews import RegisterView, ProfileView
from .services import VerifyPasswordResetOTPView, VerifyRegistrationOTPView, RequestPasswordResetView
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ChallengeViewSet, SubmissionViewSet
from .submission_views import CodeExecutionViewSet  

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'challenges', ChallengeViewSet)
submission_list = SubmissionViewSet.as_view({'get': 'list'})  # Only allow GET
submission_detail = SubmissionViewSet.as_view({'get': 'retrieve'})
router.register(r'execute-submission', CodeExecutionViewSet, basename="execute")  # Code Execution
urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register-view'),
    path('api/verify-registration-otp/', VerifyRegistrationOTPView.as_view(), name='verify-otp'),
    path('api/request-password-reset/', RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('api/verify-password-reset/', VerifyPasswordResetOTPView.as_view(), name='verify-password-reset'),
    path('api/profile/', ProfileView.as_view(), name='profile-view'),
    path('api/submissions/', submission_list, name='submission-list'),
    path('api/submissions/<int:pk>/', submission_detail, name='submission-detail'),
    path('api/', include(router.urls)),
]
