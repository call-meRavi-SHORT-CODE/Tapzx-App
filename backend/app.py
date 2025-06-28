from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import re
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'tapzx_db')

try:
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# Collections
users_collection = db.users
links_collection = db.links
profiles_collection = db.profiles

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
        return doc
    return None

# Validation functions
def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    # Remove spaces and special characters
    phone_clean = re.sub(r'[^\d+]', '', phone)
    # Check if it's a valid phone number (10-15 digits, optionally starting with +)
    pattern = r'^\+?[1-9]\d{9,14}$'
    return re.match(pattern, phone_clean) is not None

def validate_username(username):
    # Username should be 3-30 characters, alphanumeric, underscore, hyphen
    pattern = r'^[a-zA-Z0-9_-]{3,30}$'
    return re.match(pattern, username) is not None

# Routes

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Tapzx Backend API",
        "version": "1.0.0",
        "status": "running"
    })

# Authentication Routes

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'phone_number', 'password', 'confirm_password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        
        full_name = data['full_name'].strip()
        email = data['email'].strip().lower()
        phone_number = data['phone_number'].strip()
        password = data['password']
        confirm_password = data['confirm_password']
        
        # Validate data
        if len(full_name) < 2:
            return jsonify({"error": "Full name must be at least 2 characters"}), 400
        
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        if not validate_phone(phone_number):
            return jsonify({"error": "Invalid phone number format"}), 400
        
        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400
        
        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400
        
        # Check if user already exists
        if users_collection.find_one({"email": email}):
            return jsonify({"error": "Email already registered"}), 400
        
        if users_collection.find_one({"phone_number": phone_number}):
            return jsonify({"error": "Phone number already registered"}), 400
        
        # Hash password
        hashed_password = generate_password_hash(password)
        
        # Create user document
        user_doc = {
            "full_name": full_name,
            "email": email,
            "phone_number": phone_number,
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "is_profile_complete": False
        }
        
        # Insert user
        result = users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        return jsonify({
            "message": "User created successfully",
            "user_id": user_id,
            "success": True
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Find user
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Check password
        if not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Return user info
        return jsonify({
            "message": "Login successful",
            "user_id": str(user['_id']),
            "user": {
                "id": str(user['_id']),
                "full_name": user['full_name'],
                "email": user['email'],
                "phone_number": user['phone_number'],
                "is_profile_complete": user.get('is_profile_complete', False)
            },
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/check-user/<user_id>', methods=['GET'])
def check_user(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid user ID"}), 400
        
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "user": {
                "id": str(user['_id']),
                "full_name": user['full_name'],
                "email": user['email'],
                "phone_number": user['phone_number'],
                "is_profile_complete": user.get('is_profile_complete', False)
            },
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Links Routes

@app.route('/api/links/save', methods=['POST'])
def save_links():
    try:
        data = request.get_json()
        
        if not data.get('user_id'):
            return jsonify({"error": "User ID is required"}), 400
        
        user_id = data['user_id']
        
        if not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid user ID"}), 400
        
        # Check if user exists
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Prepare links document
        links_doc = {
            "user_id": user_id,
            "website": data.get('website'),
            "email": data.get('email'),
            "phone": data.get('phone'),
            "whatsapp": data.get('whatsapp'),
            "instagram": data.get('instagram'),
            "twitter": data.get('twitter'),
            "linkedin": data.get('linkedin'),
            "facebook": data.get('facebook'),
            "youtube": data.get('youtube'),
            "tiktok": data.get('tiktok'),
            "github": data.get('github'),
            "discord": data.get('discord'),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Check if links already exist for this user
        existing_links = links_collection.find_one({"user_id": user_id})
        
        if existing_links:
            # Update existing links
            links_doc["updated_at"] = datetime.utcnow()
            links_collection.update_one(
                {"user_id": user_id},
                {"$set": links_doc}
            )
            message = "Links updated successfully"
        else:
            # Create new links
            links_collection.insert_one(links_doc)
            message = "Links saved successfully"
        
        return jsonify({
            "message": message,
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/links/get/<user_id>', methods=['GET'])
def get_links(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid user ID"}), 400
        
        links = links_collection.find_one({"user_id": user_id})
        if not links:
            return jsonify({"error": "Links not found"}), 404
        
        return jsonify({
            "links": serialize_doc(links),
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Profile Routes

@app.route('/api/profile/save', methods=['POST'])
def save_profile():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'username', 'organization_name', 'bio', 'location']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        
        user_id = data['user_id']
        username = data['username'].strip().lower()
        organization_name = data['organization_name'].strip()
        bio = data['bio'].strip()
        location = data['location'].strip()
        profile_image = data.get('profile_image')
        
        if not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid user ID"}), 400
        
        # Check if user exists
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Validate username
        if not validate_username(username):
            return jsonify({"error": "Username must be 3-30 characters and contain only letters, numbers, underscore, and hyphen"}), 400
        
        # Check if username is already taken by another user
        existing_profile = profiles_collection.find_one({
            "username": username,
            "user_id": {"$ne": user_id}
        })
        if existing_profile:
            return jsonify({"error": "Username already taken"}), 400
        
        # Validate bio word count
        bio_words = len(bio.split())
        if bio_words > 150:
            return jsonify({"error": "Bio cannot exceed 150 words"}), 400
        
        # Validate other fields
        if len(organization_name) < 2:
            return jsonify({"error": "Organization name must be at least 2 characters"}), 400
        
        if len(location) < 2:
            return jsonify({"error": "Location must be at least 2 characters"}), 400
        
        # Generate profile URL
        profile_url = f"tapzx.app/{username}"
        
        # Prepare profile document
        profile_doc = {
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
        
        # Check if profile already exists for this user
        existing_user_profile = profiles_collection.find_one({"user_id": user_id})
        
        if existing_user_profile:
            # Update existing profile
            profile_doc["updated_at"] = datetime.utcnow()
            profiles_collection.update_one(
                {"user_id": user_id},
                {"$set": profile_doc}
            )
            message = "Profile updated successfully"
        else:
            # Create new profile
            profiles_collection.insert_one(profile_doc)
            message = "Profile created successfully"
        
        # Update user's profile completion status
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_profile_complete": True}}
        )
        
        return jsonify({
            "message": message,
            "profile_url": profile_url,
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profile/get/<user_id>', methods=['GET'])
def get_profile(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid user ID"}), 400
        
        profile = profiles_collection.find_one({"user_id": user_id})
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        return jsonify({
            "profile": serialize_doc(profile),
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profile/check-username/<username>', methods=['GET'])
def check_username(username):
    try:
        username = username.strip().lower()
        
        if not validate_username(username):
            return jsonify({
                "available": False,
                "message": "Username must be 3-30 characters and contain only letters, numbers, underscore, and hyphen"
            }), 400
        
        existing_profile = profiles_collection.find_one({"username": username})
        
        return jsonify({
            "username": username,
            "available": existing_profile is None,
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profile/by-username/<username>', methods=['GET'])
def get_profile_by_username(username):
    try:
        username = username.strip().lower()
        
        profile = profiles_collection.find_one({"username": username})
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        # Get user info
        user = users_collection.find_one({"_id": ObjectId(profile['user_id'])})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get links
        links = links_collection.find_one({"user_id": profile['user_id']})
        
        return jsonify({
            "profile": serialize_doc(profile),
            "user": {
                "full_name": user['full_name'],
                "email": user['email']
            },
            "links": serialize_doc(links) if links else None,
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Complete User Data Route

@app.route('/api/user/complete/<user_id>', methods=['GET'])
def get_complete_user_data(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid user ID"}), 400
        
        # Get user
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get links
        links = links_collection.find_one({"user_id": user_id})
        
        # Get profile
        profile = profiles_collection.find_one({"user_id": user_id})
        
        return jsonify({
            "user": {
                "id": str(user['_id']),
                "full_name": user['full_name'],
                "email": user['email'],
                "phone_number": user['phone_number'],
                "is_profile_complete": user.get('is_profile_complete', False),
                "created_at": user['created_at'].isoformat()
            },
            "links": serialize_doc(links) if links else None,
            "profile": serialize_doc(profile) if profile else None,
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health Check
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        db.command('ping')
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)