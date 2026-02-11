# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Django REST API backend for a job application tracking system. Part of a fullstack monorepo (this is the Backend directory).

- **Framework**: Django 6.0.1 with Django REST Framework 3.16.1
- **Authentication**: JWT via djangorestframework-simplejwt
- **Database**: SQLite (dev), PostgreSQL-ready (prod via dj-database-url)
- **Deployment**: Render (gunicorn)

## Common Commands

```bash
# Run development server
python manage.py runserver

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Run tests
python manage.py test

# Create superuser
python manage.py createsuperuser

# Install dependencies
pip install -r requirements.txt
```

## Architecture

### Directory Structure
```
Backend/
├── config/          # Django project settings and root URL config
├── applications/    # Main app: models, views, serializers, URLs
├── manage.py
├── requirements.txt
└── Procfile         # Render deployment
```

### Models (applications/models.py)
- **Application**: Job application tracking (company_name, role_title, status, applied_date, notes). Status choices: APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED
- **UserProfile**: Extended user info with email verification status
- **EmailVerificationToken**: UUID tokens for email verification flow

### API Endpoints
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/signup/` | POST | No | User registration |
| `/api/token/` | POST | No | Obtain JWT tokens |
| `/api/token/refresh/` | POST | No | Refresh JWT |
| `/api/applications/` | GET, POST | Yes | List/create applications |
| `/api/applications/<id>/` | GET, PUT, DELETE | Yes | Application CRUD |

### Key Patterns
- User-scoped querysets: Views filter `Application.objects.filter(user=self.request.user)` to ensure users only access their own data
- JWT authentication configured globally in `REST_FRAMEWORK` settings
- CORS configured for frontend at `localhost:5173` (Vite dev server)
