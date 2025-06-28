from fastapi import APIRouter, Depends, HTTPException, status
from app.models import LinksCreate, LinksResponse, MessageResponse
from app.auth import get_current_active_user
from app.database import get_database
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/links", tags=["Links"])

@router.post("/", response_model=dict)
async def create_or_update_links(
    links_data: LinksCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create or update user links"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Prepare links document
    links_doc = {
        "user_id": user_id,
        "website": links_data.website,
        "email": links_data.email,
        "phone": links_data.phone,
        "whatsapp": links_data.whatsapp,
        "instagram": links_data.instagram,
        "twitter": links_data.twitter,
        "linkedin": links_data.linkedin,
        "facebook": links_data.facebook,
        "youtube": links_data.youtube,
        "tiktok": links_data.tiktok,
        "github": links_data.github,
        "discord": links_data.discord,
        "updated_at": datetime.utcnow()
    }
    
    # Check if links already exist for this user
    existing_links = await db.links.find_one({"user_id": user_id})
    
    if existing_links:
        # Update existing links
        await db.links.update_one(
            {"user_id": user_id},
            {"$set": links_doc}
        )
        message = "Links updated successfully"
    else:
        # Create new links
        links_doc["created_at"] = datetime.utcnow()
        result = await db.links.insert_one(links_doc)
        message = "Links created successfully"
    
    return {
        "message": message,
        "success": True
    }

@router.get("/", response_model=LinksResponse)
async def get_user_links(current_user: dict = Depends(get_current_active_user)):
    """Get current user's links"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    links = await db.links.find_one({"user_id": user_id})
    if not links:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Links not found"
        )
    
    return LinksResponse(**links)

@router.get("/{user_id}", response_model=LinksResponse)
async def get_links_by_user_id(user_id: str):
    """Get links by user ID (public endpoint)"""
    db = get_database()
    
    # Validate ObjectId
    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    links = await db.links.find_one({"user_id": user_id})
    if not links:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Links not found"
        )
    
    return LinksResponse(**links)

@router.delete("/", response_model=MessageResponse)
async def delete_user_links(current_user: dict = Depends(get_current_active_user)):
    """Delete current user's links"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    result = await db.links.delete_one({"user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Links not found"
        )
    
    return MessageResponse(message="Links deleted successfully")