from django.db import models
from django.conf import settings

class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'APPLIED', 'Applied'
        SCREENING = 'SCREENING', 'Screening'
        INTERVIEW = 'INTERVIEW', 'Interview'
        OFFER = 'OFFER', 'Offer'
        REJECTED = 'REJECTED', 'Rejected'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    company_name = models.CharField(max_length=255)
    role_title = models.CharField(max_length=255)
    job_link = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED)
    date_applied = models.DateField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.role_title} at {self.company_name}"
