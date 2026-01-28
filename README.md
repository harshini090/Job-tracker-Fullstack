
# Job Tracker – Full-Stack Application

A full-stack Job Application Tracker built to manage, track, and organize job applications with a production-style authentication system and clean architecture.

This project is designed with **real-world backend patterns**, not just CRUD — focusing on authentication, data ownership, and scalability.

---

## ✨ Features

### Authentication & Security

* User signup with **email + password**
* **Email verification flow** using token-based links
* Duplicate account prevention
* Planned JWT-based login (access + refresh tokens)
* User-specific data isolation (each user sees only their own applications)

### Job Application Management

* Create, view, update, and delete job applications
* Track company name, role, status, and applied date
* RESTful APIs with proper permissions

---

## 🏗️ Tech Stack

### Backend

* **Django**
* **Django REST Framework**
* Token-based email verification
* SQLite (local) → PostgreSQL (deployment-ready)

### Frontend

* **React (Vite)**
* Clean, minimal UI (Apple / Notion–inspired)
* Top-level alerts for auth & validation feedback

---

## 📂 Project Structure

```
Job-tracker-fullstack/
├── Backend/
│   ├── applications/        # Core app (models, views, serializers)
│   ├── config/              # Project settings & URLs
│   ├── manage.py
│   ├── requirements.txt
│   └── .gitignore
├── frontend/                # React frontend (Vite)
└── README.md
```

---

## 🔐 Email Verification Flow

1. User signs up with email & password
2. Account is created as **unverified**
3. A verification token with expiry is generated
4. User verifies email via tokenized link
5. Only verified users can sign in

This mirrors **real production authentication flows**.

---

## 🧪 API Highlights

* `POST /api/auth/signup/` – User registration
* `POST /api/auth/verify-email/` – Email verification
* `GET /api/applications/` – List user applications
* `POST /api/applications/` – Add new application

(All application routes are **user-scoped and protected**.)

---

## 🎯 Why This Project Matters

This project demonstrates:

* Backend-first thinking
* Secure authentication design
* Clean separation of concerns
* Scalable full-stack architecture

Built to reflect **how real products are engineered**, not just tutorials.

---

## 🛠️ Future Enhancements

* JWT login & refresh token flow
* Password reset via email
* Application analytics dashboard
* Deployment (AWS / Render / Fly.io)

---

## 👩‍💻 Author

**Harshini Chowdary Kilari**
Master’s Student | Full-Stack & Cloud Enthusiast
GitHub: [https://github.com/harshini090](https://github.com/harshini090)

