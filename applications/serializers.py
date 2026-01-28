from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils.timezone import now, timedelta
from .models import UserProfile, EmailVerificationToken, Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"
        read_only_fields = ["user"]


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    # ✅ THIS handles "email already exists"
    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Account already exists. Please sign in."
            )
        return value

    def create(self, validated_data):
        # 1️⃣ Create user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        # 2️⃣ Create profile (email NOT verified)
        UserProfile.objects.create(user=user)

        # 3️⃣ Create verification token with expiry
        EmailVerificationToken.objects.create(
            user=user,
            expires_at=now() + timedelta(hours=24)
        )

        return user
