from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.user import User
from app.models.food import Food

from app.utils.security import get_current_user

router = APIRouter(
    prefix="/admin",
    tags=["Admin Dashboard"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Admin Access Only"
        )

    total_users = db.query(User).count()

    total_donations = db.query(Food).count()

    available_food = (
        db.query(Food)
        .filter(Food.status == "AVAILABLE")
        .count()
    )

    claimed_food = (
        db.query(Food)
        .filter(Food.status == "CLAIMED")
        .count()
    )

    picked_up_food = (
        db.query(Food)
        .filter(Food.status == "PICKED_UP")
        .count()
    )

    delivered_food = (
        db.query(Food)
        .filter(Food.status == "DELIVERED")
        .count()
    )

    ngo_count = (
        db.query(User)
        .filter(User.role == "NGO")
        .count()
    )

    volunteer_count = (
        db.query(User)
        .filter(User.role == "VOLUNTEER")
        .count()
    )

    return {
        "total_users": total_users,
        "total_donations": total_donations,
        "available_food": available_food,
        "claimed_food": claimed_food,
        "picked_up_food": picked_up_food,
        "delivered_food": delivered_food,
        "total_ngos": ngo_count,
        "total_volunteers": volunteer_count
    }

@router.get("/recent-donations")
def recent_donations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Admin Access Only"
        )

    foods = (
        db.query(Food)
        .order_by(Food.created_at.desc())
        .limit(10)
        .all()
    )

    return foods