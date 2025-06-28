from fastapi import APIRouter, Depends, HTTPException, status
from app.models import CompleteUserProfile, UserResponse, LinksResponse, ProfileResponse
from app.auth import get_current_active_user
from app.database import get_database
from bson import ObjectId

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/complete-profile", response_model=CompleteUserProfile)
async def get_complete_user_profile(current_user: dict = Depends(get_current_active_user)):
    """Get complete user profile with links and profile data"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Get user data
    user_response = UserResponse(
        _id=str(current_user["_id"]),
        full_name=current_user["full_name"],
        email=current_user["email"],
        phone_number=current_user["phone_number"],
        created_at=current_user["created_at"],
        is_profile_complete=current_user.get("is_profile_complete", False)
    )
    
    # Get links data
    links_data = await db.links.find_one({"user_id": user_id})
    links_response = LinksResponse(**links_data) if links_data else None
    
    # Get profile data
    profile_data = await db.profiles.find_one({"user_id": user_id})
    profile_response = ProfileResponse(**profile_data) if profile_data else None
    
    return CompleteUserProfile(
        user=user_response,
        links=links_response,
        profile=profile_response
    )

@router.get("/public/{user_id}", response_model=CompleteUserProfile)
async def get_public_user_profile(user_id: str):
    """Get public user profile by user ID"""
    db = get_database()
    
    # Validate ObjectId
    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    # Get user data
    user_data = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_response = UserResponse(
        _id=str(user_data["_id"]),
        full_name=user_data["full_name"],
        email=user_data["email"],
        phone_number=user_data["phone_number"],
        created_at=user_data["created_at"],
        is_profile_complete=user_data.get("is_profile_complete", False)
    )
    
    # Get links data
    links_data = await db.links.find_one({"user_id": user_id})
    links_response = LinksResponse(**links_data) if links_data else None
    
    # Get profile data
    profile_data = await db.profiles.find_one({"user_id": user_id})
    profile_response = ProfileResponse(**profile_data) if profile_data else None
    
    return CompleteUserProfile(
        user=user_response,
        links=links_response,
        profile=profile_response
    )

@router.get("/public/username/{username}", response_model=CompleteUserProfile)
async def get_public_user_profile_by_username(username: str):
    """Get public user profile by username"""
    db = get_database()
    
    # Get profile data first
    profile_data = await db.profiles.find_one({"username": username.lower()})
    if not profile_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    user_id = profile_data["user_id"]
    
    # Get user data
    user_data = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_response = UserResponse(
        _id=str(user_data["_id"]),
        full_name=user_data["full_name"],
        email=user_data["email"],
        phone_number=user_data["phone_number"],
        created_at=user_data["created_at"],
        is_profile_complete=user_data.get("is_profile_complete", False)
    )
    
    # Get links data
    links_data = await db.links.find_one({"user_id": user_id})
    links_response = LinksResponse(**links_data) if links_data else None
    
    profile_response = ProfileResponse(**profile_data)
    
    return CompleteUserProfile(
        user=user_response,
        links=links_response,
        profile=profile_response
    )

@router.delete("/account", response_model=dict)
async def delete_user_account(current_user: dict = Depends(get_current_active_user)):
    """Delete user account and all associated data"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Delete user's links
    await db.links.delete_one({"user_id": user_id})
    
    # Delete user's profile
    await db.profiles.delete_one({"user_id": user_id})
    
    # Delete user account
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "message": "Account deleted successfully",
        "success": True
    }