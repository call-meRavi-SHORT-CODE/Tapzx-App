from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# User Models
class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone_number: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=8)
    confirm_password: str

    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

    @validator('phone_number')
    def validate_phone(cls, v):
        # Remove spaces and validate phone number format
        phone = v.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if not phone.isdigit() and not (phone.startswith('+') and phone[1:].isdigit()):
            raise ValueError('Invalid phone number format')
        return phone

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    full_name: str
    email: str
    phone_number: str
    created_at: datetime
    is_profile_complete: bool = False

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

# Links Models
class LinksCreate(BaseModel):
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    facebook: Optional[str] = None
    youtube: Optional[str] = None
    tiktok: Optional[str] = None
    github: Optional[str] = None
    discord: Optional[str] = None

class LinksResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    facebook: Optional[str] = None
    youtube: Optional[str] = None
    tiktok: Optional[str] = None
    github: Optional[str] = None
    discord: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

# Profile Models
class ProfileCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    organization_name: str = Field(..., min_length=2, max_length=100)
    bio: str = Field(..., min_length=10, max_length=150)
    location: str = Field(..., min_length=2, max_length=100)
    profile_image: Optional[str] = None

    @validator('username')
    def validate_username(cls, v):
        # Username should only contain alphanumeric characters, underscores, and hyphens
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v.lower()

    @validator('bio')
    def validate_bio_word_count(cls, v):
        words = v.split()
        if len(words) > 150:
            raise ValueError('Bio cannot exceed 150 words')
        return v

class ProfileResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    username: str
    organization_name: str
    bio: str
    location: str
    profile_image: Optional[str] = None
    profile_url: str
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Complete User Profile Response
class CompleteUserProfile(BaseModel):
    user: UserResponse
    links: Optional[LinksResponse] = None
    profile: Optional[ProfileResponse] = None

# Response Models
class MessageResponse(BaseModel):
    message: str
    success: bool = True

class ErrorResponse(BaseModel):
    detail: str
    success: bool = False