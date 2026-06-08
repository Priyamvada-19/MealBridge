from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.food import Food

from app.schemas.food_schema import FoodCreate

from app.utils.security import get_current_user
from app.utils.priority import calculate_priority

router = APIRouter(
    prefix="/food",
    tags=["Food Donation"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE FOOD
@router.post("/create")
def create_food(
    food: FoodCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "DONOR":
        raise HTTPException(
            status_code=403,
            detail="Only DONOR can create food"
        )

    priority = calculate_priority(
        food.expiry_time
    )

    new_food = Food(
        food_name=food.food_name,
        quantity=food.quantity,
        food_type=food.food_type,
        pickup_address=food.pickup_address,
        expiry_time=food.expiry_time,
        donor_email=current_user["email"],
        status="AVAILABLE",
        priority_score=priority
    )

    db.add(new_food)
    db.commit()
    db.refresh(new_food)

    return {
        "message": "Food Created Successfully",
        "food_id": new_food.id
    }


# VIEW ALL FOOD
@router.get("/all")
def get_all_food(
    db: Session = Depends(get_db)
):

    foods = db.query(Food).all()

    return foods


# PRIORITY FOOD LIST
# IMPORTANT:
# This route MUST come before /{food_id}
@router.get("/priority-food")
def priority_food(
    db: Session = Depends(get_db)
):

    foods = (
        db.query(Food)
        .filter(Food.status == "AVAILABLE")
        .order_by(Food.priority_score.desc())
        .all()
    )

    return foods


# VIEW SINGLE FOOD
@router.get("/{food_id}")
def get_food(
    food_id: int,
    db: Session = Depends(get_db)
):

    food = (
        db.query(Food)
        .filter(Food.id == food_id)
        .first()
    )

    if not food:

        raise HTTPException(
            status_code=404,
            detail="Food Not Found"
        )

    return food


# UPDATE FOOD
@router.put("/update/{food_id}")
def update_food(
    food_id: int,
    food: FoodCreate,
    db: Session = Depends(get_db)
):

    db_food = (
        db.query(Food)
        .filter(Food.id == food_id)
        .first()
    )

    if not db_food:

        raise HTTPException(
            status_code=404,
            detail="Food Not Found"
        )

    db_food.food_name = food.food_name
    db_food.quantity = food.quantity
    db_food.food_type = food.food_type
    db_food.pickup_address = food.pickup_address
    db_food.expiry_time = food.expiry_time

    db_food.priority_score = calculate_priority(
        food.expiry_time
    )

    db.commit()

    return {
        "message": "Food Updated Successfully"
    }


# DELETE FOOD
@router.delete("/delete/{food_id}")
def delete_food(
    food_id: int,
    db: Session = Depends(get_db)
):

    food = (
        db.query(Food)
        .filter(Food.id == food_id)
        .first()
    )

    if not food:

        raise HTTPException(
            status_code=404,
            detail="Food Not Found"
        )

    db.delete(food)
    db.commit()

    return {
        "message": "Food Deleted Successfully"
    }


# NGO CLAIM FOOD
@router.post("/claim/{food_id}")
def claim_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "NGO":

        raise HTTPException(
            status_code=403,
            detail="Only NGO can claim food"
        )

    food = (
        db.query(Food)
        .filter(Food.id == food_id)
        .first()
    )

    if not food:

        raise HTTPException(
            status_code=404,
            detail="Food Not Found"
        )

    if food.status != "AVAILABLE":

        raise HTTPException(
            status_code=400,
            detail="Food Already Claimed"
        )

    food.status = "CLAIMED"
    food.claimed_by = current_user["email"]

    db.commit()

    return {
        "message": "Food Claimed Successfully"
    }


# VOLUNTEER PICKUP
# VOLUNTEER PICKUP
@router.put("/pickup/{food_id}")
def pickup_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "VOLUNTEER":

        raise HTTPException(
            status_code=403,
            detail="Only VOLUNTEER can pickup food"
        )

    food = (
        db.query(Food)
        .filter(Food.id == food_id)
        .first()
    )

    if not food:

        raise HTTPException(
            status_code=404,
            detail="Food Not Found"
        )

    if food.status != "CLAIMED":

        raise HTTPException(
            status_code=400,
            detail="Food must be CLAIMED before pickup"
        )

    food.status = "PICKED_UP"
    food.volunteer_email = current_user["email"]

    db.commit()

    return {
        "message": "Food Picked Up Successfully"
    }


# VOLUNTEER DELIVER FOOD
# VOLUNTEER DELIVER FOOD
@router.put("/deliver/{food_id}")
def deliver_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "VOLUNTEER":

        raise HTTPException(
            status_code=403,
            detail="Only VOLUNTEER can deliver food"
        )

    food = (
        db.query(Food)
        .filter(Food.id == food_id)
        .first()
    )

    if not food:

        raise HTTPException(
            status_code=404,
            detail="Food Not Found"
        )

    if food.status != "PICKED_UP":

        raise HTTPException(
            status_code=400,
            detail="Food must be PICKED_UP before delivery"
        )

    food.status = "DELIVERED"

    db.commit()

    return {
        "message": "Food Delivered Successfully"
    }

# DONOR ANALYTICS
@router.get("/stats/summary")
def food_summary(
    db: Session = Depends(get_db)
):

    foods = db.query(Food).all()

    total_donations = len(foods)

    available = len(
        [f for f in foods if f.status == "AVAILABLE"]
    )

    claimed = len(
        [f for f in foods if f.status == "CLAIMED"]
    )

    picked_up = len(
        [f for f in foods if f.status == "PICKED_UP"]
    )

    delivered = len(
        [f for f in foods if f.status == "DELIVERED"]
    )

    meals_saved = sum(
        int(f.quantity)
        for f in foods
        if f.status == "DELIVERED"
    )

    return {
        "total_donations": total_donations,
        "available": available,
        "claimed": claimed,
        "picked_up": picked_up,
        "delivered": delivered,
        "meals_saved": meals_saved
    }