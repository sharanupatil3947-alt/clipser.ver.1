from pydantic import BaseModel
from typing import Optional

class UserRegister(BaseModel):
    email: str
    password: str
    name: Optional[str] = ""

class UserLogin(BaseModel):
    email: str
    password: str


class GoogleAuthRequest(BaseModel):
    credential: str # Google ID token or OAuth code
    name: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = ""
    avatar_url: Optional[str] = ""
    is_pro: Optional[bool] = True
    plan_tier: Optional[str] = "pro_unlimited"
    source_minutes_remaining: Optional[int] = 999999

    class Config:
        from_attributes = True
