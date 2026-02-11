from rest_framework import generics, viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import UserSerializer, ApplicationSerializer
from applications.models import Application

# Auth Views
class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    # Determine if we need customization later
    pass

# Application ViewSet
class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['status']
    ordering_fields = ['date_applied', 'updated_at']
    search_fields = ['company_name', 'role_title']

    def get_queryset(self):
        return Application.objects.filter(user=self.request.user)
