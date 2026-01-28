from django.urls import path
from .views import ApplicationListCreateView, ApplicationDetailView
from .views import SignupView

urlpatterns = [
    path("applications/", ApplicationListCreateView.as_view()),
    path("applications/<int:pk>/", ApplicationDetailView.as_view()),
]
urlpatterns += [
    path("signup/", SignupView.as_view(), name="signup"),
]