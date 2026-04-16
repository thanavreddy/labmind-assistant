"""Authentication utilities and middleware (Supabase ES256 + JWKS)."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
import requests
from app.config import get_settings

# Load settings
settings = get_settings()

# Bearer auth scheme
security = HTTPBearer()

# Supabase JWKS endpoint (correct)
JWKS_URL = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Validate Supabase JWT using JWKS (ES256).
    """
    try:
        token = credentials.credentials

        # Fetch JWKS (public endpoint — no headers needed)
        response = requests.get(JWKS_URL)
        jwks = response.json()

        # Extract key ID from token
        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")

        if not kid:
            raise Exception("Missing 'kid' in token header")

        # Find matching key
        key = next((k for k in jwks["keys"] if k["kid"] == kid), None)

        if not key:
            raise Exception("Matching JWKS key not found")

        # Decode token
        payload = jwt.decode(
            token,
            key,
            algorithms=["ES256"],
            options={"verify_aud": False}
        )

        if "sub" not in payload:
            raise Exception("Invalid token payload")

        return payload

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )


class TokenData:
    """Optional helper class."""

    def __init__(self, user_id: str, email: str, role: str):
        self.user_id = user_id
        self.email = email
        self.role = role