from database import SessionLocal, engine
import models
from auth import get_password_hash

# 1. Create all Tables (Fresh Start)
models.Base.metadata.drop_all(bind=engine) # Delete old structure
models.Base.metadata.create_all(bind=engine) # Create new structure

db = SessionLocal()

print("--- SEEDING DATA ---")

# --- 2. ADD SERVICES ---
services = [
    {"name": "AC Repair", "image_url": "https://cdn-icons-png.flaticon.com/512/11549/11549747.png"}, 
    {"name": "Appliance Repair", "image_url": "https://cdn-icons-png.flaticon.com/512/307/307907.png"},
    {"name": "Carpenter", "image_url": "https://cdn-icons-png.flaticon.com/512/2061/2061956.png"},
    {"name": "Cleaning Services", "image_url": "https://cdn-icons-png.flaticon.com/512/995/995053.png"},
    {"name": "Electrician", "image_url": "https://cdn-icons-png.flaticon.com/512/2933/2933116.png"},
    {"name": "Gardening", "image_url": "https://cdn-icons-png.flaticon.com/512/1518/1518965.png"},
    {"name": "Home Security", "image_url": "https://cdn-icons-png.flaticon.com/512/2645/2645897.png"},
    {"name": "Interior Design", "image_url": "https://cdn-icons-png.flaticon.com/512/2558/2558062.png"},
    {"name": "Masonry", "image_url": "https://cdn-icons-png.flaticon.com/512/3100/3100652.png"},
    {"name": "Painter", "image_url": "https://cdn-icons-png.flaticon.com/512/2972/2972106.png"},
    {"name": "Pest Control", "image_url": "https://cdn-icons-png.flaticon.com/512/2316/2316885.png"},
    {"name": "Plumber", "image_url": "https://cdn-icons-png.flaticon.com/512/307/307882.png"},
]

for s in services:
    db_service = models.Service(name=s["name"], image_url=s["image_url"])
    db.add(db_service)
print("✅ Services Added")

# --- 3. CREATE ADMIN USER ---
admin_email = "admin@hussboss.com"
if not db.query(models.User).filter(models.User.email == admin_email).first():
    admin = models.User(
        full_name="admin",
        email=admin_email,
        hashed_password=get_password_hash("adminhoni"),
        phone="9800000000",
        address="Headquarters",
        is_admin=True
    )
    db.add(admin)
    print(f"✅ Admin Created: {admin_email} / admin123")

db.commit()
db.close()
print("--------------------")
print("🎉 DATABASE RESET SUCCESSFUL")