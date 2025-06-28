from fastapi import APIRouter, Depends, HTTPException, status
from app.models import ProfileCreate, ProfileResponse, MessageResponse
from app.auth import get_current_active_user
from app.database import get_database
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.post("/", response_model=dict)
async def create_or_update_profile(
    profile_data: ProfileCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create or update user profile"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Check if username is already taken by another user
    existing_profile = await db.profiles.find_one({
        "username": profile_data.username,
        "user_id": {"$ne": user_id}
    })
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Generate profile URL
    profile_url = f"tapzx.app/{profile_data.username}"
    
    # Prepare profile document
    profile_doc = {
        "user_id": user_id,
        "username": profile_data.username,
        "organization_name": profile_data.organization_name,
        "bio": profile_data.bio,
        "location": profile_data.location,
        "profile_image": profile_data.profile_image,
        "profile_url": profile_url,
        "updated_at": datetime.utcnow()
    }
    
    # Check if profile already exists for this user
    existing_user_profile = await db.profiles.find_one({"user_id": user_id})
    
    if existing_user_profile:
        # Update existing profile
        await db.profiles.update_one(
            {"user_id": user_id},
            {"$set": profile_doc}
        )
        message = "Profile updated successfully"
    else:
        # Create new profile
        profile_doc["created_at"] = datetime.utcnow()
        await db.profiles.insert_one(profile_doc)
        message = "Profile created successfully"
    
    # Update user's profile completion status
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_profile_complete": True}}
    )
    
    return {
        "message": message,
        "profile_url": profile_url,
        "success": True
    }

@router.get("/", response_model=ProfileResponse)
async def get_user_profile(current_user: dict = Depends(get_current_active_user)):
    """Get current user's profile"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    profile = await db.profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return ProfileResponse(**profile)

@router.get("/username/{username}", response_model=ProfileResponse)
async def get_profile_by_username(username: str):
    """Get profile by username (public endpoint)"""
    db = get_database()
    
    profile = await db.profiles.find_one({"username": username.lower()})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return ProfileResponse(**profile)

@router.get("/{user_id}", response_model=ProfileResponse)
async def get_profile_by_user_id(user_id: str):
    """Get profile by user ID (public endpoint)"""
    db = get_database()
    
    # Validate ObjectId
    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    profile = await db.profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return ProfileResponse(**profile)

@router.delete("/", response_model=MessageResponse)
async def delete_user_profile(current_user: dict = Depends(get_current_active_user)):
    """Delete current user's profile"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    result = await db.profiles.delete_one({"user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Update user's profile completion status
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_profile_complete": False}}
    )
    
    return MessageResponse(message="Profile deleted successfully")

@router.get("/check-username/{username}", response_model=dict)
async def check_username_availability(username: str):
    """Check if username is available"""
    db = get_database()
    
    existing_profile = await db.profiles.find_one({"username": username.lower()})
    
    return {
        "username": username.lower(),
        "available": existing_profile is None,
        "success": True
    }