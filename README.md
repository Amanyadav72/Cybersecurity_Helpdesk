# Community Cyber Safety Helpdesk
**B.Sc. IT Semester V Community Engagement Project**

**Topic:** Community Helpdesk for Cyber Safety Queries  
**Database:** Neon PostgreSQL Database (Serverless)  
**Authentication:** Actual Google OAuth 2.0 (OpenID Connect)  
**Context:** Educational & Awareness Project (Not a hacking or security testing platform)

---

## 📌 Project Overview

The **Community Cyber Safety Helpdesk** is a clean, accessible, beginner-friendly web portal created to help local citizens, students, senior citizens, and small shopkeepers ask basic questions regarding digital fraud, suspicious messages, and account privacy.

### Key Objectives
* Provide a safe, non-judgmental space for community members to ask cyber-safety questions.
* Enable seamless sign-in using actual Google accounts (OAuth 2.0) with zero password management hassles.
* Store data securely in a **Neon PostgreSQL cloud database** with connection pooling.
* Deliver easy-to-understand, verified safety guidance provided by student volunteers.
* Educate community members with actionable safety tips on UPI, Phishing, Passwords, and Social Media.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Python 3, FastAPI, Pydantic, Uvicorn |
| **Cloud Database** | **Neon PostgreSQL** (`@neondatabase/serverless` / `pg` / `psycopg2-binary`) |
| **Authentication** | **Actual Google OAuth 2.0** (OpenID Connect `openid email profile`) |

---

## 🔑 Required API Keys & Secrets

To run the application with full cloud database and Google authentication, configure these environment variables:

| Variable | Description | Where to Get It |
|---|---|---|
| **`NEON_DATABASE_URL`** | Neon PostgreSQL connection string with SSL | [Neon Console](https://console.neon.tech) &rarr; Project &rarr; Connection Details |
| **`GOOGLE_CLIENT_ID`** | Google OAuth 2.0 Web Client ID | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| **`GOOGLE_CLIENT_SECRET`** | Google OAuth 2.0 Client Secret | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| **`SECRET_KEY`** | Secret key for signing JWT user sessions | Generate with `openssl rand -hex 32` or any long random string |
| **`FRONTEND_URL`** | URL of the frontend application | `http://localhost:3000` (or your production URL) |

### Sample `.env` file:
```env
# Neon PostgreSQL Connection String (from https://console.neon.tech)
NEON_DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Google OAuth 2.0 Credentials (from https://console.cloud.google.com)
GOOGLE_CLIENT_ID="1234567890-abcdefg123456.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-yourSecretKeyHere"

# JWT Session Secret
SECRET_KEY="super-secret-key-change-this-for-production"

# Application URLs
FRONTEND_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
```

---

## 📂 Project Structure

```text
community-cyber-safety-helpdesk/
├── backend/                        # FastAPI Python Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI application entry & CORS
│   │   ├── database.py            # Neon PostgreSQL connection & SQLAlchemy Session
│   │   ├── models.py              # User and Question SQLAlchemy models
│   │   ├── schemas.py             # Pydantic validation models
│   │   ├── auth.py                # Google OAuth token exchange & JWT verification
│   │   └── routes/
│   │       ├── auth.py            # /auth/google/login, /auth/google/callback, /auth/me
│   │       └── questions.py       # /api/questions (CRUD & Isolation)
│   ├── .env.example               # Backend environment variables template
│   ├── requirements.txt           # Python backend dependencies (including psycopg2-binary)
│   └── README.md                  # Backend-specific instructions
│
├── src/                            # React Frontend
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive navigation with Google profile
│   │   ├── Footer.tsx             # Helplines (1930) & project disclaimer
│   │   ├── GoogleSignInModal.tsx  # Direct Google OAuth button & secrets status
│   │   └── VolunteerResponseModal.tsx # Volunteer responder modal for viva evaluation
│   ├── pages/
│   │   ├── HomePage.tsx           # Hero, mission, core safety tips (OTPs, links, 2FA)
│   │   ├── DashboardPage.tsx      # Profile card, question counters, recent items
│   │   ├── AskQuestionPage.tsx    # Query form with 10 categories & Reference ID
│   │   ├── MyQuestionsPage.tsx    # User-isolated queries with verified answers
│   │   ├── SafetyTipsPage.tsx     # 8 educational cards for community members
│   │   └── AboutProjectPage.tsx   # Project context, target community, workflow
│   ├── services/
│   │   └── api.ts                 # Fetch client connecting frontend to backend
│   ├── types.ts                   # TypeScript interfaces & category constants
│   ├── App.tsx                    # Main layout & page routing
│   └── main.tsx                   # React root entry point
│
├── server.ts                       # Integrated Node/Express server with Neon pg pool
├── package.json                    # Frontend dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build tool configuration
└── README.md                       # Comprehensive project documentation
```

---

## 🚀 Step-by-Step Setup Guide

### 1. How to Set Up Neon PostgreSQL Database

1. Sign up for free at [https://neon.tech](https://neon.tech).
2. Click **Create Project** &rarr; Name it `cyber-safety-helpdesk`.
3. In the project dashboard under **Connection details**:
   * Select **PostgreSQL** or **Pooled connection**.
   * Copy the connection string. It looks like:
     ```text
     postgresql://neondb_owner:npg_xxxx@ep-cool-forest-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
4. Paste this URL into your `.env` file as `NEON_DATABASE_URL` (and `DATABASE_URL`).
5. Tables (`users` and `questions`) are automatically created when the server boots!

---

### 2. How to Create Actual Google OAuth 2.0 Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **`Cyber Safety Helpdesk`**.
3. In the sidebar, go to **APIs & Services** &rarr; **OAuth consent screen**:
   * Select **External** &rarr; Click **Create**.
   * App name: `Community Cyber Safety Helpdesk`
   * User support email: Select your email.
   * Developer contact information: Enter your email.
   * Scopes: Add `openid`, `email`, and `profile`.
   * Test users: Add your Gmail address (e.g., `amanyadavabhay@gmail.com`).
4. In the sidebar, go to **APIs & Services** &rarr; **Credentials**:
   * Click **+ Create Credentials** &rarr; **OAuth client ID**.
   * Application type: **Web application**.
   * Name: `Cyber Safety Web Client`.
   * **Authorized JavaScript origins**:
     * `http://localhost:3000`
     * (And your production domain URL if deployed)
   * **Authorized redirect URIs**:
     * `http://localhost:3000/auth/google/callback`
     * `http://localhost:8000/auth/google/callback`
   * Click **Create**.
5. Copy your **Client ID** and **Client Secret** into your `.env` file:
   * `GOOGLE_CLIENT_ID="..."`
   * `GOOGLE_CLIENT_SECRET="..."`

---

### 3. Running the Application

#### Option A: Running with Vite & Integrated Node/Express Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option B: Running the Python FastAPI Backend Separately
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Add your NEON_DATABASE_URL & Google credentials
uvicorn app.main:app --reload --port 8000
```
FastAPI interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔐 How Actual Google OAuth 2.0 Authentication Works

```text
[ Community Member ]
       │
       ▼ (Clicks "Sign in with Google")
[ React Frontend ] ──────────► [ Backend: GET /auth/google/login ]
                                      │
                                      ▼
                           [ Google OAuth Consent Screen ]
                             (accounts.google.com)
                                      │
                                      ▼ (User selects Google Account)
[ React Frontend ] ◄────────── [ Backend: GET /auth/google/callback ]
       │                        1. Exchanges code for Google access token
       │                        2. Fetches Google profile (id, name, email, avatar)
       │                        3. Saves or updates user in Neon PostgreSQL
       │                        4. Issues signed JWT session token
       ▼
[ Dashboard Page ]
 - Reads user profile via GET /auth/me
 - Displays authenticated Google profile name, email, picture
```

---

## 🗄️ Neon PostgreSQL Database Schema

```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  profile_picture VARCHAR(1024),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(64) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(128) NOT NULL,
  question TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Pending',
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Strict User Isolation
Each user can only access their own questions:
```sql
SELECT * FROM questions WHERE user_id = $1 ORDER BY created_at DESC;
```

---

## 📞 Official Emergency Helplines
* **National Cyber Crime Helpline:** Dial **1930** (Toll-Free)
* **National Cyber Crime Reporting Portal:** [https://cybercrime.gov.in](https://cybercrime.gov.in)
