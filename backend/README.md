# FastAPI Backend - Community Cyber Safety Helpdesk
**B.Sc. IT Semester V Community Engagement Project**

## Quick Start Guide

### 1. Requirements
* Python 3.10+
* SQLite 3

### 2. Installation
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Google OAuth 2.0 Client ID and Secret obtained from Google Cloud Console.

### 4. Running the Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. API Documentation
Once running, open your browser to view interactive API documentation:
* Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
* ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 6. Endpoints
* `GET /auth/google/login`: Redirects to Google OAuth consent page.
* `GET /auth/google/callback`: Receives Google authorization code, exchanges token, and creates user in SQLite.
* `GET /auth/me`: Returns current user's profile.
* `POST /auth/logout`: Clears session cookie.
* `POST /api/questions`: Submits new cyber safety query.
* `GET /api/questions`: Lists all queries of current user.
* `GET /api/questions/{id}`: Detailed query view.
* `POST /api/questions/{id}/respond`: Helpdesk guidance response demonstration endpoint.
