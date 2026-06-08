from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.utils.security import get_current_user

from app.database import SessionLocal
from app.models.user import User
from app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    RoleSelect
)

from pydantic import BaseModel

from google.oauth2 import id_token
from google.auth.transport import requests

from app.utils.hashing import (
    hash_password,
    verify_password
)

from app.utils.jwt_handler import (
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Replace with your actual Google Client ID
GOOGLE_CLIENT_ID = "509734946177-ftfhgkkln8hm17bg2lpvcvpnp3nbq2vf.apps.googleusercontent.com"

class GoogleLoginRequest(BaseModel):
    token: str


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Register User
@router.post("/register")
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        return {
            "message": "Email already exists"
        }

    new_user = User(
    name=user.name,
    email=user.email,
    password=hash_password(user.password),
    role="PENDING"
)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User Registered Successfully",
        "user_id": new_user.id
    }


# Login User
@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        return {
            "message": "Invalid Credentials"
        }

    if not verify_password(
        user.password,
        db_user.password
    ):
        return {
            "message": "Invalid Credentials"
        }

    access_token = create_access_token(
        {
            "email": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "role": db_user.role
        }
    }


# Google Login
@router.post("/google")
def google_login(
    request_data: GoogleLoginRequest,
    db: Session = Depends(get_db)
):

    try:

        id_info = id_token.verify_oauth2_token(
            request_data.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = id_info["email"]

        name = id_info.get(
            "name",
            email.split("@")[0]
        )

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:

            user = User(
                name=name,
                email=email,
                password=hash_password(
                    "google_oauth_user"
                ),
                role="PENDING"
            )

            db.add(user)
            db.commit()
            db.refresh(user)

        access_token = create_access_token(
            {
                "email": user.email,
                "role": user.role
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }

    except Exception as e:

        return {
            "message": "Google Login Failed",
            "error": str(e)
        }
@router.put("/select-role")
def select_role(
    role_data: RoleSelect,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    allowed_roles = [
        "DONOR",
        "NGO",
        "VOLUNTEER"
    ]

    if role_data.role not in allowed_roles:

        return {
            "message": "Invalid Role"
        }

    user = (
        db.query(User)
        .filter(
            User.email ==
            current_user["email"]
        )
        .first()
    )

    if not user:

        return {
            "message": "User Not Found"
        }

    user.role = role_data.role

    db.commit()

    return {
        "message": "Role Selected Successfully",
        "role": user.role
    }   