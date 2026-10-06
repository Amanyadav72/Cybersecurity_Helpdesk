# Community Cyber Safety Helpdesk
**B.Sc. IT Semester V Community Engagement Project**

**Topic:** Community Helpdesk for Cyber Safety Queries  
**Context:** Educational & Awareness Project (Not a hacking or security testing platform)

---

## 📌 Project Overview

The **Community Cyber Safety Helpdesk** is a clean, accessible, beginner-friendly web portal created to help local citizens, students, senior citizens, and small shopkeepers ask basic questions regarding digital fraud, suspicious messages, and account privacy.

### Key Objectives
* Provide a safe, non-judgmental space for community members to ask cyber-safety questions.
* Enable seamless sign-in using Google accounts (OAuth 2.0) with zero password management hassles.
* Deliver easy-to-understand, verified safety guidance provided by student volunteers.
* Educate community members with actionable safety tips on UPI, Phishing, Passwords, and Social Media.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Python 3, FastAPI, Pydantic, Uvicorn |
| **Database** | SQLite with SQLAlchemy ORM |
| **Authentication** | Google OAuth 2.0 (OpenID Connect / JWT Session) |

---

## 📂 Project Structure

```text
community-cyber-safety-helpdesk/
├── backend/                        # FastAPI Python Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI application entry & CORS
│   │   ├── database.py            # SQLite engine & SQLAlchemy Session
│   │   ├── models.py              # User and Question SQLAlchemy models
│   │   ├── schemas.py             # Pydantic validation models
│   │   ├── auth.py                # Google OAuth & JWT token verification
│   │   └── routes/
│   │       ├── auth.py            # /auth/google/login, /auth/me, /auth/logout
│   │       └── questions.py       # /api/questions (CRUD & Isolation)
│   ├── .env.example               # Backend environment variables template
│   ├── requirements.txt           # Python backend dependencies
│   └── README.md                  # Backend-specific instructions
│
├── src/                            # React Frontend
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive navigation with Google profile
│   │   ├── Footer.tsx             # Helplines (1930) & project disclaimer
│   │   ├── GoogleSignInModal.tsx  # Google Sign-In & 1-click viva demo selector
│   │   └── VolunteerResponseModal.tsx # Demo responder mechanism for evaluation
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
├── server.ts                       # Integrated Node/Express server for dev preview
├── package.json                    # Frontend dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build tool configuration
└── README.md                       # Comprehensive project documentation
```

---

## 🚀 Step-by-Step Installation & Running Guide

### 1. Prerequisites
* **Node.js** (v18 or higher)
* **Python** (v3.10 or higher)
* **Google Cloud Console account** (Free)

---

### 2. How to Create Google OAuth 2.0 Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **`Cyber Safety Helpdesk`**.
3. In the sidebar, go to **APIs & Services** &rarr; **OAuth consent screen**:
   * Select **External** and click **Create**.
   * App name: `Community Cyber Safety Helpdesk`
   * User support email: Select your email.
   * Developer contact information: Enter your email.
   * Click **Save and Continue**.
   * Under **Scopes**, add `openid`, `email`, and `profile`.
   * Under **Test users**, add your Gmail address (e.g., `yourname@gmail.com`).
4. In the sidebar, go to **APIs & Services** &rarr; **Credentials**:
   * Click **+ Create Credentials** &rarr; **OAuth client ID**.
   * Application type: **Web application**.
   * Name: `Cyber Safety Web Client`.
   * **Authorized JavaScript origins**:
     * `http://localhost:3000`
     * `http://localhost:5173`
   * **Authorized redirect URIs**:
     * `http://localhost:8000/auth/google/callback`
     * `http://localhost:3000/auth/google/callback`
   * Click **Create**.
5. Copy your **Client ID** and **Client Secret**.

---

### 3. Backend Setup (FastAPI & SQLite)

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   # On macOS / Linux
   python3 -m venv venv
   source venv/bin/activate

   # On Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   * Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   * Open `.env` and fill in your Google credentials:
     ```env
     GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
     GOOGLE_CLIENT_SECRET="your-google-client-secret"
     SECRET_KEY="generate-a-random-32-byte-secret-key"
     FRONTEND_URL="http://localhost:3000"
     BACKEND_PORT=8000
     DATABASE_URL="sqlite:///./cyber_safety.db"
     ```

5. Run the FastAPI backend:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   * The backend will run at: `http://localhost:8000`
   * Interactive Swagger API documentation: `http://localhost:8000/docs`
   * SQLite database `cyber_safety.db` is created automatically on startup!

---

### 4. Frontend Setup (React & Vite)

1. Open a new terminal in the project root directory:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 🔐 How the Authentication Flow Works

```text
[ Community Member ]
       │
       ▼ (Clicks "Sign in with Google")
[ React Frontend ] ──────────► [ FastAPI Backend: GET /auth/google/login ]
                                      │
                                      ▼
                           [ Google OAuth Consent Screen ]
                                      │
                                      ▼ (User Approves)
[ React Frontend ] ◄────────── [ FastAPI: GET /auth/google/callback ]
       │                        - Exchanges auth code for Google Access Token
       │                        - Fetches user profile (name, email, picture)
       │                        - Finds or creates user in SQLite database
       │                        - Issues signed JWT session token
       ▼
[ Dashboard Page ]
 - Reads authenticated session via GET /auth/me
 - Displays user's Google name, email, profile picture
```

1. **User clicks "Sign in with Google"** on the home page or navbar.
2. The user is redirected to the Google authentication consent page.
3. Upon approval, Google redirects back to `/auth/google/callback` with an authorization code.
4. FastAPI exchanges the code with Google's token endpoint (`https://oauth2.googleapis.com/token`).
5. FastAPI fetches the user's Google identity (`https://www.googleapis.com/oauth2/v3/userinfo`).
6. FastAPI creates or retrieves the user record in SQLite.
7. A signed JWT token is issued and set in a secure cookie or passed to the React frontend.
8. React stores the session and redirects the user directly to the **Dashboard**.

---

## 🗄️ How the Database Works (SQLite + SQLAlchemy)

The database uses SQLite for simplicity, zero maintenance, and portability. It consists of two tables:

### 1. `users` Table
Stores registered community members authenticated via Google:
* `id` (INTEGER, Primary Key)
* `google_id` (VARCHAR(255), Unique, Indexed)
* `name` (VARCHAR(255))
* `email` (VARCHAR(255), Unique, Indexed)
* `profile_picture` (VARCHAR(1024), Nullable)
* `created_at` (DATETIME)

### 2. `questions` Table
Stores cyber-safety queries submitted by community members:
* `id` (VARCHAR(64), Primary Key) &rarr; Formatted Reference ID (e.g. `CSH-2026-1042`)
* `user_id` (INTEGER, Foreign Key referencing `users.id`)
* `category` (VARCHAR(128)) &rarr; One of 10 cyber safety categories
* `question` (TEXT) &rarr; Description of the suspicious incident
* `status` (VARCHAR(32)) &rarr; Either `'Pending'` or `'Answered'`
* `response` (TEXT, Nullable) &rarr; Verified guidance provided by helpdesk volunteers
* `created_at` (DATETIME) &rarr; Timestamp of query submission
* `updated_at` (DATETIME) &rarr; Timestamp of helpdesk guidance update

### Strict User Isolation
The backend strictly filters questions using:
```python
db.query(Question).filter(Question.user_id == current_user.id).all()
```
This guarantees community members can only view their own questions.

---

## 🌐 How Frontend Communicates with Backend

The React frontend utilizes standard REST API calls via `fetch` configured in `src/services/api.ts`:

* **`GET /auth/me`**: Fetches the authenticated user's profile info.
* **`GET /api/dashboard/stats`**: Retrieves user submission metrics (total, pending, answered) and recent questions.
* **`POST /api/questions`**: Submits a new question with category and text payload. Returns generated Reference ID.
* **`GET /api/questions`**: Returns all questions submitted by the active user.
* **`GET /api/questions/{id}`**: Returns single question details (verifying ownership).
* **`POST /api/questions/{id}/respond`**: Allows helpdesk volunteers/evaluators during the viva demo to post guidance and mark a query as Answered.

---

## 🎓 Viva / College Project Presentation Tips

1. **Highlight the Community Need**:
   Explain how the rapid rise of UPI payment fraud and phishing attacks targets non-technical citizens and elders.
2. **Demonstrate Question Isolation**:
   Show that when User A logs in, they only see User A's questions. Switching to User B displays User B's questions.
3. **Showcase the Volunteer Response Mechanism**:
   Click the **"Answer as Helpdesk Volunteer (Demo)"** button on any pending question during the demonstration to show examiners how advice is published and the status updates in real time from **Pending** to **Answered**.
4. **Emphasize Security Best Practices**:
   * No passwords stored in database (handled via Google OAuth 2.0).
   * Environment variables keep secrets out of Git.
   * Input validation handled by Pydantic.
   * User privacy protected.

---

## 📞 Official Emergency Helplines
* **National Cyber Crime Helpline:** Dial **1930** (Toll-Free)
* **National Cyber Crime Reporting Portal:** [https://cybercrime.gov.in](https://cybercrime.gov.in)
