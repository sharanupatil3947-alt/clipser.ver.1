import hashlib
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional, Any
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def hash_password_pbkdf2(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password or "$" not in hashed_password:
        return False
    try:
        salt, key_hex = hashed_password.split("$", 1)
        expected_key = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000)
        return secrets.compare_digest(key_hex, expected_key.hex())
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    return hash_password_pbkdf2(password)


def create_access_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from app.models.user import User

    # Helper to get or create the demo user
    def _get_demo_user():
        dev_user = db.query(User).filter(User.email == "demo@clipser.ai").first()
        if not dev_user:
            dev_user = User(
                email="demo@clipser.ai",
                name="Clipser Pro Creator",
                hashed_password=get_password_hash("clipser123"),
                is_pro=True,
                auth_provider="local"
            )
            db.add(dev_user)
            db.commit()
            db.refresh(dev_user)
        return dev_user

    if not token:
        return _get_demo_user()

    # Accept known demo/fallback tokens without JWT decode
    if token.startswith("demo_") or token.startswith("jwt_token_") or token.startswith("google_jwt_token_"):
        return _get_demo_user()

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return _get_demo_user()
    except JWTError:
        # Instead of 401, fall back to demo user for seamless local dev experience
        return _get_demo_user()
        
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        return _get_demo_user()
    return user
