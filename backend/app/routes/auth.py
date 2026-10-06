import urllib.parse
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.responses import RedirectResponse, JSONResponse
import httpx
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import UserResponse
from ..auth import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    FRONTEND_URL,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/google/login")
def google_login(request: Request):
    """
    Step 1 & 2: Redirect user to Google OAuth 2.0 consent page.
    """
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        # If client credentials aren't configured yet, redirect back to frontend with a helpful note
        error_msg = urllib.parse.quote("Google OAuth credentials are not configured in backend/.env yet.")
        return RedirectResponse(f"{FRONTEND_URL}/?auth_error={error_msg}")

    # Build the callback redirect URI based on backend host
    redirect_uri = f"{str(request.base_url).rstrip('/')}/auth/google/callback"

    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "response_type": "code",
        "scope": "openid email profile",
        "redirect_uri": redirect_uri,
        "access_type": "offline",
        "prompt": "select_account",
    }
    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=google_auth_url)


@router.get("/google/callback")
async def google_callback(code: str = None, error: str = None, request: Request = None, db: Session = Depends(get_db)):
    """
    Step 5-9: Handle Google's redirect with authorization code, exchange for tokens,
    fetch user profile, create or retrieve user in SQLite, and redirect to frontend dashboard.
    """
    if error or not code:
        err_msg = urllib.parse.quote(error or "Authentication was cancelled by the user.")
        return RedirectResponse(f"{FRONTEND_URL}/?auth_error={err_msg}")

    redirect_uri = f"{str(request.base_url).rstrip('/')}/auth/google/callback"

    # Exchange authorization code for access token
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
        )

        if token_resp.status_code != 200:
            return RedirectResponse(f"{FRONTEND_URL}/?auth_error=Failed+to+exchange+Google+authorization+code")

        tokens = token_resp.json()
        access_token = tokens.get("access_token")

        # Fetch user's profile info from Google
        profile_resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        if profile_resp.status_code != 200:
            return RedirectResponse(f"{FRONTEND_URL}/?auth_error=Failed+to+fetch+Google+profile")

        profile = profile_resp.json()

    google_id = profile.get("sub")
    email = profile.get("email")
    name = profile.get("name") or email.split("@")[0]
    picture = profile.get("picture")

    if not google_id or not email:
        return RedirectResponse(f"{FRONTEND_URL}/?auth_error=Google+profile+missing+email+or+ID")

    # Find or create user in SQLite database
    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        # Check if user with same email exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_id = google_id
            user.name = name
            user.profile_picture = picture
        else:
            user = User(
                google_id=google_id,
                name=name,
                email=email,
                profile_picture=picture,
            )
            db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update user name and avatar if changed
        user.name = name
        user.profile_picture = picture
        db.commit()

    # Create session JWT
    session_jwt = create_access_token(data={"sub": str(user.id), "email": user.email, "name": user.name})

    # Redirect to frontend with token in query param or set cookie
    response = RedirectResponse(f"{FRONTEND_URL}/dashboard?token={session_jwt}")
    response.set_cookie(
        key="session_token",
        value=session_jwt,
        httponly=True,
        samesite="lax",
        max_age=7 * 24 * 3600,
    )
    return response


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return user


@router.post("/logout")
def logout(response: Response):
    """Clear session cookie and invalidate login."""
    response.delete_cookie(key="session_token")
    return {"message": "Logged out successfully."}


@router.post("/demo-login", response_model=dict)
def demo_google_login(
    payload: dict,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Demo login endpoint for college viva / presentation demonstration.
    Allows testing the Google user profile flow easily even if Google API keys are offline.
    """
    email = payload.get("email", "student.demo@community-cyber.edu")
    name = payload.get("name", "Community Member")
    picture = payload.get("picture", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80")
    google_id = payload.get("google_id", f"demo-google-{abs(hash(email)) % 1000000}")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            google_id=google_id,
            name=name,
            email=email,
            profile_picture=picture,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.name = name
        user.profile_picture = picture
        db.commit()

    token = create_access_token(data={"sub": str(user.id), "email": user.email, "name": user.name})
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=7 * 24 * 3600,
    )

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "profile_picture": user.profile_picture,
            "created_at": user.created_at.isoformat(),
        }
    }
