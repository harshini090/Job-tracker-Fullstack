# Copilot Instructions for Job Tracker Fullstack

## Project Overview
Job Tracker is a **monorepo with independent Backend (Django) and Frontend (React/Vite) deployments**. The architecture enforces **user data isolation** — each authenticated user sees only their own job applications. This is a production-pattern project, not a simple CRUD scaffold.

---

## Architecture & Critical Patterns

### Data Ownership & User Scoping
**Every query must filter by `user=self.request.user`** to prevent cross-user data leakage.

- **Backend** ([Backend/applications/views.py](Backend/applications/views.py)): `Application.objects.filter(user=self.request.user)` is mandatory in all list/detail views
- **Frontend** ([frontend/src/api.js](frontend/src/api.js)): JWT token stored in `localStorage` with key `"jobtracker_token"`; sent as `Authorization: Bearer <token>` header
- **Auth flow**: Signup → JWT tokens → Token stored client-side → All subsequent requests authenticated

### API Contract (Django REST Framework)
- Base URL: `/api/`
- Authentication: JWT via `djangorestframework-simplejwt` (configured globally in settings)
- CORS: Configured for `localhost:5173` (frontend Vite dev server)
- Status codes: Use 400 for validation errors, 401 for auth failures, 404 for not found

### Core Models & Status Lifecycle
```
Application(user, company_name, role_title, status, applied_date, notes, created_at)
  status ∈ ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"]

UserProfile(user, is_email_verified)
EmailVerificationToken(user, token:UUID, expires_at, used:bool)
```

**Email verification** uses time-limited UUID tokens; tokens become invalid after use or expiry.

---

## Development Workflows

### Backend (Django)
```bash
# Development server (runs on 8000)
python manage.py runserver

# Create migrations after model changes
python manage.py makemigrations
python manage.py migrate

# Run all tests
python manage.py test

# Create admin user
python manage.py createsuperuser
```

**Key directories:**
- [Backend/config](Backend/config) — Django settings, CORS, JWT config
- [Backend/applications](Backend/applications) — Models, views, serializers, API endpoints

### Frontend (React/Vite)
```bash
# Development server (runs on 5173 with vite)
npm run dev

# Build for production
npm run build

# Lint code
npm lint
```

**Key files:**
- [frontend/src/api.js](frontend/src/api.js) — All backend HTTP calls (login, signup, CRUD operations)
- [frontend/src/App.jsx](frontend/src/App.jsx) — Main component; manages auth state, app CRUD, filtering
- [frontend/src/components](frontend/src/components) — AuthCard, ApplicationCard reusable components

### Vite Proxy for Development
Frontend uses Vite's proxy configuration to forward API calls to `http://localhost:8000`. If modifying this, check [frontend/vite.config.js](frontend/vite.config.js).

---

## Project-Specific Conventions

### Form State Management (Frontend)
React component maintains a single form object:
```javascript
const [form, setForm] = useState({
  company_name: "",
  role_title: "",
  status: "APPLIED",
  applied_date: "",
  notes: "",
});
```
On update, spread the current form data and override changed fields. Reset form on successful submit.

### Error Handling Patterns
- **Backend**: Return JSON `{"detail": "message"}` or `{"field": ["error"]}` for validation
- **Frontend**: Wrap API calls in try/catch; display errors via `setError()` state and top-level alert component

### Session Expiry (Frontend)
If API returns 401, clear token immediately and redirect user to login. Token refresh is **not yet implemented** (planned feature).

### Testing (Backend)
Tests should use Django's `TestCase` class (automatically manages database rollback). Mock email sending. Test user-scoping by creating multiple users and verifying isolation.

---

## Cross-Component Communication

### Frontend ↔ Backend Flow
1. User fills form → validates client-side
2. Frontend calls API function from [frontend/src/api.js](frontend/src/api.js)
3. API function attaches JWT token, sends JSON
4. Backend validates, checks `user=self.request.user`, returns 200 or error
5. Frontend updates component state or displays error

### Database Deployment
- **Local**: SQLite (committed as [Backend/db.sqlite3](Backend/db.sqlite3) for demos)
- **Production**: PostgreSQL via `dj-database-url` (configured in [Backend/config/settings.py](Backend/config/settings.py))
- **Deployment**: Render via [Backend/Procfile](Backend/Procfile) with gunicorn

---

## Integration Points & Dependencies

### Backend Dependencies (Key)
- **Django 6.0.1**: Core framework
- **djangorestframework 3.16.1**: REST API, serializers
- **djangorestframework-simplejwt 5.5.1**: JWT tokens
- **django-cors-headers 4.9.0**: CORS support
- **psycopg2-binary**: PostgreSQL adapter (prod)

### Frontend Dependencies (Key)
- **React 19.2.0**: UI library
- **Vite 7.2.4**: Build tool and dev server
- No external state management (plain React hooks); minimal dependencies by design

---

## Common Mistakes to Avoid

1. **Forgetting user filtering** in views → data leakage
2. **Hardcoding API base URL** instead of using relative paths → breaks proxy
3. **Not resetting form state** after successful create/update → stale form data
4. **Sending requests without auth token** even after login → 401 errors
5. **Not calling `perform_create()`** in viewsets → user field not set
6. **Mixing localStorage token checks** with API calls → mismatch if token expires mid-session

---

## When in Doubt

- **Authentication issues**: Check [frontend/src/api.js](frontend/src/api.js) token flow and [Backend/config/settings.py](Backend/config/settings.py) JWT config
- **API response format**: Check [Backend/applications/serializers.py](Backend/applications/serializers.py) for expected fields
- **User-scoped queries**: Always inspect [Backend/applications/views.py](Backend/applications/views.py) `get_queryset()` method
- **Frontend state**: Trace through [frontend/src/App.jsx](frontend/src/App.jsx) main component for auth/app state flow
