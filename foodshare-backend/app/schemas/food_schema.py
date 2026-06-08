from pydantic import BaseModel
from datetime import datetime

class FoodCreate(BaseModel):
    food_name: str
    quantity: int
    food_type: str
    pickup_address: str
    expiry_time: datetime