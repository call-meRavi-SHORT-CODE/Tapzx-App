from datetime import datetime
from bson import ObjectId

class UserModel:
    @staticmethod
    def create_user_doc(full_name, email, phone_number, hashed_password):
        return {
            "full_name": full_name,
            "email": email,
            "phone_number": phone_number,
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "is_profile_complete": False
        }

class LinksModel:
    @staticmethod
    def create_links_doc(user_id, links_data):
        return {
            "user_id": user_id,
            "website": links_data.get('website'),
            "email": links_data.get('email'),
            "phone": links_data.get('phone'),
            "whatsapp": links_data.get('whatsapp'),
            "instagram": links_data.get('instagram'),
            "twitter": links_data.get('twitter'),
            "linkedin": links_data.get('linkedin'),
            "facebook": links_data.get('facebook'),
            "youtube": links_data.get('youtube'),
            "tiktok": links_data.get('tiktok'),
            "github": links_data.get('github'),
            "discord": links_data.get('discord'),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

class ProfileModel:
    @staticmethod
    def create_profile_doc(user_id, username, organization_name, bio, location, profile_image=None):
        profile_url = f"tapzx.app/{username}"
        return {
            "user_id": user_id,
            "username": username,
            "organization_name": organization_name,
            "bio": bio,
            "location": location,
            "profile_image": profile_image,
            "profile_url": profile_url,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }