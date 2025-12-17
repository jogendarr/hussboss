from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles 
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import shutil
import os
import uuid 

import models, database, schemas
from auth import get_password_hash
import auth 

# Initialize DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Mount static folder
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- PUBLIC ROUTES ---

@app.get("/locations")
def get_locations():
    return ["Kathmandu", "Lalitpur", "Bhaktapur", "Tansen", "Butwal", "Hetauda", "Chitwan", "Rampur", "Dhangadi", "Karnali"]

@app.get("/services")
def get_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()

@app.get("/search")
def search_providers(
    service_name: Optional[str] = None, 
    location: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.Provider).join(models.Service)
    
    if location and location != "All Nepal":
        query = query.filter(models.Provider.location == location)
        
    if service_name:
        query = query.filter(models.Service.name.ilike(f"%{service_name}%"))
        
    providers = query.all()
    
    # Add full URL to the image path
    for p in providers:
        if p.profile_image:
            p.profile_image = f"https://hussboss.onrender.com/{p.profile_image}"
            
    return providers

# --- REGISTRATION (PROVIDERS) ---

@app.post("/register")
async def register_provider(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phone: str = Form(...),
    location: str = Form(...),
    service_id: int = Form(...),
    description: str = Form(...),
    profile_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    if db.query(models.Provider).filter(models.Provider.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    image_path = None
    if profile_image:
        filename = f"{uuid.uuid4()}{os.path.splitext(profile_image.filename)[1]}"
        save_location = f"static/uploads/{filename}"
        with open(save_location, "wb") as buffer:
            shutil.copyfileobj(profile_image.file, buffer)
        image_path = save_location 

    new_provider = models.Provider(
        name=name,
        email=email,
        hashed_password=get_password_hash(password),
        phone=phone,
        location=location,
        service_id=service_id,
        description=description,
        profile_image=image_path 
    )
    
    db.add(new_provider)
    db.commit()
    return {"message": "Account created successfully!"}


# --- BOOKING & USER HISTORY ROUTES ---

# Define request body for Booking
class BookingRequest(BaseModel):
    user_id: int
    user_name: str
    phone: str
    address: str
    service_type: str
    location: str

@app.post("/book_service")
def book_service(request: BookingRequest, db: Session = Depends(get_db)):
    new_request = models.ServiceRequest(
        user_id=request.user_id,
        user_name=request.user_name,
        phone=request.phone,
        address=request.address,
        service_type=request.service_type,
        location=request.location,
        status="Pending"
    )
    db.add(new_request)
    db.commit()
    return {"message": "Request submitted! We will contact you shortly."}

@app.get("/my_requests/{user_id}")
def get_user_requests(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.ServiceRequest).filter(models.ServiceRequest.user_id == user_id).order_by(models.ServiceRequest.created_at.desc()).all()


# --- ADMIN ROUTES ---

@app.get("/admin/requests")
def get_all_requests(db: Session = Depends(get_db)):
    return db.query(models.ServiceRequest).order_by(models.ServiceRequest.created_at.desc()).all()

@app.put("/admin/requests/{request_id}")
def update_request_status(request_id: int, status: str, db: Session = Depends(get_db)):
    req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    req.status = status
    db.commit()
    return {"message": "Status updated successfully"}


# --- USER AUTHENTICATION ROUTES ---

# Add Schema for Signup manually to handle phone/address optionally
class UserCreateExtended(BaseModel):
    full_name: str
    email: str
    password: str
    phone: Optional[str] = None
    address: Optional[str] = None

@app.post("/auth/signup")
def signup_user(user: UserCreateExtended, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        phone=user.phone,     # Save phone
        address=user.address, # Save address
        is_admin=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Return user info immediately for auto-login
    return {
        "id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "phone": new_user.phone,
        "address": new_user.address,
        "is_admin": new_user.is_admin
    }

@app.post("/auth/login")
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Return expanded info for profile page
    return {
        "id": db_user.id,
        "full_name": db_user.full_name,
        "email": db_user.email,
        "phone": db_user.phone,    # Send to frontend
        "address": db_user.address,# Send to frontend
        "is_admin": db_user.is_admin
    }

# --- ADMIN SETUP ---
@app.get("/setup_admin")
def create_default_admin(db: Session = Depends(get_db)):
    if not db.query(models.User).filter(models.User.email == "admin@hussboss.com").first():
        admin = models.User(
            full_name="Super Admin",
            email="admin@hussboss.com",
            hashed_password=get_password_hash("adminhoni"), 
            is_admin=True
        )
        db.add(admin)
        db.commit()
        return {"message": "Admin created: admin@hussboss.com"}
    return {"message": "Admin already exists"}