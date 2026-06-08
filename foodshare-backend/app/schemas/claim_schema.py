from pydantic import BaseModel

class ClaimFood(BaseModel):
    ngo_email: str

class AssignVolunteer(BaseModel):
    volunteer_email: str