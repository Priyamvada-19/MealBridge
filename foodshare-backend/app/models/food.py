from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database import Base


class Food(Base):

    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)

    food_name = Column(String(100), nullable=False)

    quantity = Column(String(50), nullable=False)

    food_type = Column(String(50), nullable=False)

    pickup_address = Column(String(255), nullable=False)

    expiry_time = Column(DateTime, nullable=False)

    donor_email = Column(String(100), nullable=False)

    status = Column(
        String(20),
        default="AVAILABLE"
    )

    claimed_by = Column(
        String(100),
        nullable=True
    )

    volunteer_email = Column(
        String(100),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    priority_score = Column(Integer, default=0)

notification_sent = Column(
    String(10),
    default="NO"
)