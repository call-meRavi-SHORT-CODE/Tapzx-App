from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from app.models import UserCreate, UserLogin, Token, UserResponse, MessageResponse
from app.auth import (
    authenticate_user, 
    create_access_token, 
    get_password_hash, 
    get_current_active_user,
    security
)
from app.database import get_database
from app.config import settings
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=dict)
async def signup(user: UserCreate):
    """Create a new user account"""
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if phone number already exists
    existing_phone = await db.users.find_one({"phone_number": user.phone_number})
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user document
    user_doc = {
        "full_name": user.full_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "is_profile_complete": False
    }
    
    # Insert user into database
    result = await db.users.insert_one(user_doc)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "message": "User created successfully",
        "user_id": str(result.inserted_id),
        "access_token": access_token,
        "token_type": "bearer",
        "success": True
    }

@router.post("/signin", response_model=dict)
async def signin(user_credentials: UserLogin):
    """Sign in user"""
    user = await authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {
        "message": "Login successful",
        "user_id": str(user["_id"]),
        "access_token": access_token,
        "token_type": "bearer",
        "is_profile_complete": user.get("is_profile_complete", False),
        "success": True
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_active_user)):
    """Get current user information"""
    return UserResponse(
        _id=str(current_user["_id"]),
        full_name=current_user["full_name"],
        email=current_user["email"],
        phone_number=current_user["phone_number"],
        created_at=current_user["created_at"],
        is_profile_complete=current_user.get("is_profile_complete", False)
    )

@router.post("/verify-token", response_model=dict)
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify if token is valid"""
    try:
        current_user = await get_current_active_user(current_user=credentials)
        return {
            "valid": True,
            "user_id": str(current_user["_id"]),
            "email": current_user["email"],
            "is_profile_complete": current_user.get("is_profile_complete", False)
        }
    except HTTPException:
        return {"valid": False}