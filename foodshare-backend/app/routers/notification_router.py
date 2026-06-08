from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from datetime import datetime

from app.database import SessionLocal
from app.models.food import Food

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/expiry-alerts")
def expiry_alerts(
    db: Session = Depends(get_db)
):

    foods = db.query(Food).all()

    alerts = []

    for food in foods:

        hours_left = (
            food.expiry_time -
            datetime.utcnow()
        ).total_seconds() / 3600

        if hours_left <= 6:

            alerts.append({
                "food_id": food.id,
                "food_name": food.food_name,
                "hours_left": round(hours_left, 2)
            })

    return alerts

@router.get("/volunteer-alerts/{email}")
def volunteer_alerts(
    email: str,
    db: Session = Depends(get_db)
):

    foods = (
        db.query(Food)
        .filter(
            Food.volunteer_email == email
        )
        .all()
    )

    return foods

@router.get("/ngo-matches")
def ngo_matches(
    db: Session = Depends(get_db)
):

    foods = (
        db.query(Food)
        .filter(Food.status == "AVAILABLE")
        .order_by(
            Food.priority_score.desc()
        )
        .limit(20)
        .all()
    )

    return foods