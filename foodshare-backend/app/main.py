from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine

from app.models.user import User
from app.models.food import Food

from app.routers.auth_router import router as auth_router
from app.routers.food_router import router as food_router
from app.routers.admin_router import router as admin_router
from app.routers.notification_router import router as notification_router


app = FastAPI(
    title="FoodShare API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
User.metadata.create_all(bind=engine)
Food.metadata.create_all(bind=engine)

# Routers
app.include_router(auth_router)
app.include_router(food_router)
app.include_router(admin_router)
app.include_router(notification_router)


@app.get("/")
def home():
    return {
        "message": "FoodShare API Running Successfully"
    }