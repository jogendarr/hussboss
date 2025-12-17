from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --- SERVICES ---
class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    is_admin: bool
    
    class Config:
        from_attributes = True
class ServiceBase(BaseModel):
    name: str
    image_url: str

class Service(ServiceBase):
    id: int

    class Config:
        from_attributes = True

# --- PROVIDERS ---
class ProviderBase(BaseModel):
    name: str
    phone: str
    location: str
    description: Optional[str] = None
    rating: Optional[str] = "New"
    service_id: int

# This is used when registering a new provider
class ProviderCreate(ProviderBase):
    email: str
    password: str

# This is used when reading provider data (sending to frontend)
class Provider(ProviderBase):
    id: int
    email: Optional[str] = None
    profile_image: Optional[str] = None 

    class Config:
        from_attributes = True

# --- SERVICE REQUESTS (Booking) ---

# IMPORTANT: This must be defined BEFORE the class below it
class ServiceRequestCreate(BaseModel):
    user_name: str
    phone: str
    address: str
    service_type: str
    location: str

class ServiceRequest(ServiceRequestCreate):
    id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True