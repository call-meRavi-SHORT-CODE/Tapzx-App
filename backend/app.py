from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import re
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# SQLite Configuration
DATABASE_PATH = os.getenv('DATABASE_PATH', 'tapzx.db')

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    return conn

def init_database():
    """Initialize database with tables"""
    conn = get_db_connection()
    
    # Create users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone_number TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_profile_complete BOOLEAN DEFAULT FALSE
        )
    ''')
    
    # Create links table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            website TEXT,
            email TEXT,
            phone TEXT,
            whatsapp TEXT,
            instagram TEXT,
            twitter TEXT,
            linkedin TEXT,
            facebook TEXT,
            youtube TEXT,
            tiktok TEXT,
            github TEXT,
            discord TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id)
        )
    ''')
    
    # Create profiles table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            username TEXT UNIQUE NOT NULL,
            organization_name TEXT NOT NULL,
            bio TEXT NOT NULL,
            location TEXT NOT NULL,
            profile_image TEXT,
            profile_url TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

# Initialize database on startup
init_database()

# Validation functions
def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    phone_clean = re.sub(r'[^\d+]', '', phone)
    pattern = r'^\+?[1-9]\d{9,14}$'
    return re.match(pattern, phone_clean) is not None

def validate_username(username):
    pattern = r'^[a-zA-Z0-9_-]{3,30}$'
    return re.match(pattern, username) is not None

def dict_from_row(row):
    """Convert sqlite3.Row to dictionary"""
    return dict(row) if row else None

# Routes

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Tapzx Backend API with SQLite",
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
        
        conn = get_db_connection()
        
        # Check if user already exists
        existing_email = conn.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()
        if existing_email:
            conn.close()
            return jsonify({"error": "Email already registered"}), 400
        
        existing_phone = conn.execute('SELECT id FROM users WHERE phone_number = ?', (phone_number,)).fetchone()
        if existing_phone:
            conn.close()
            return jsonify({"error": "Phone number already registered"}), 400
        
        # Hash password
        hashed_password = generate_password_hash(password)
        
        # Insert user
        cursor = conn.execute('''
            INSERT INTO users (full_name, email, phone_number, password)
            VALUES (?, ?, ?, ?)
        ''', (full_name, email, phone_number, hashed_password))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
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
        
        conn = get_db_connection()
        
        # Find user
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()
        
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Check password
        if not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Return user info
        return jsonify({
            "message": "Login successful",
            "user_id": user['id'],
            "user": {
                "id": user['id'],
                "full_name": user['full_name'],
                "email": user['email'],
                "phone_number": user['phone_number'],
                "is_profile_complete": bool(user['is_profile_complete'])
            },
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/check-user/<int:user_id>', methods=['GET'])
def check_user(user_id):
    try:
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        conn.close()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "user": {
                "id": user['id'],
                "full_name": user['full_name'],
                "email": user['email'],
                "phone_number": user['phone_number'],
                "is_profile_complete": bool(user['is_profile_complete'])
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
        
        conn = get_db_connection()
        
        # Check if user exists
        user = conn.execute('SELECT id FROM users WHERE id = ?', (user_id,)).fetchone()
        if not user:
            conn.close()
            return jsonify({"error": "User not found"}), 404
        
        # Check if links already exist for this user
        existing_links = conn.execute('SELECT id FROM links WHERE user_id = ?', (user_id,)).fetchone()
        
        if existing_links:
            # Update existing links
            conn.execute('''
                UPDATE links SET 
                website = ?, email = ?, phone = ?, whatsapp = ?, instagram = ?,
                twitter = ?, linkedin = ?, facebook = ?, youtube = ?, tiktok = ?,
                github = ?, discord = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            ''', (
                data.get('website'), data.get('email'), data.get('phone'),
                data.get('whatsapp'), data.get('instagram'), data.get('twitter'),
                data.get('linkedin'), data.get('facebook'), data.get('youtube'),
                data.get('tiktok'), data.get('github'), data.get('discord'),
                user_id
            ))
            message = "Links updated successfully"
        else:
            # Create new links
            conn.execute('''
                INSERT INTO links (
                    user_id, website, email, phone, whatsapp, instagram,
                    twitter, linkedin, facebook, youtube, tiktok, github, discord
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id, data.get('website'), data.get('email'), data.get('phone'),
                data.get('whatsapp'), data.get('instagram'), data.get('twitter'),
                data.get('linkedin'), data.get('facebook'), data.get('youtube'),
                data.get('tiktok'), data.get('github'), data.get('discord')
            ))
            message = "Links saved successfully"
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": message,
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/links/get/<int:user_id>', methods=['GET'])
def get_links(user_id):
    try:
        conn = get_db_connection()
        links = conn.execute('SELECT * FROM links WHERE user_id = ?', (user_id,)).fetchone()
        conn.close()
        
        if not links:
            return jsonify({"error": "Links not found"}), 404
        
        return jsonify({
            "links": dict_from_row(links),
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
        
        conn = get_db_connection()
        
        # Check if user exists
        user = conn.execute('SELECT id FROM users WHERE id = ?', (user_id,)).fetchone()
        if not user:
            conn.close()
            return jsonify({"error": "User not found"}), 404
        
        # Validate username
        if not validate_username(username):
            conn.close()
            return jsonify({"error": "Username must be 3-30 characters and contain only letters, numbers, underscore, and hyphen"}), 400
        
        # Check if username is already taken by another user
        existing_profile = conn.execute(
            'SELECT id FROM profiles WHERE username = ? AND user_id != ?', 
            (username, user_id)
        ).fetchone()
        if existing_profile:
            conn.close()
            return jsonify({"error": "Username already taken"}), 400
        
        # Validate bio word count
        bio_words = len(bio.split())
        if bio_words > 150:
            conn.close()
            return jsonify({"error": "Bio cannot exceed 150 words"}), 400
        
        # Validate other fields
        if len(organization_name) < 2:
            conn.close()
            return jsonify({"error": "Organization name must be at least 2 characters"}), 400
        
        if len(location) < 2:
            conn.close()
            return jsonify({"error": "Location must be at least 2 characters"}), 400
        
        # Generate profile URL
        profile_url = f"tapzx.app/{username}"
        
        # Check if profile already exists for this user
        existing_user_profile = conn.execute('SELECT id FROM profiles WHERE user_id = ?', (user_id,)).fetchone()
        
        if existing_user_profile:
            # Update existing profile
            conn.execute('''
                UPDATE profiles SET 
                username = ?, organization_name = ?, bio = ?, location = ?,
                profile_image = ?, profile_url = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            ''', (username, organization_name, bio, location, profile_image, profile_url, user_id))
            message = "Profile updated successfully"
        else:
            # Create new profile
            conn.execute('''
                INSERT INTO profiles (
                    user_id, username, organization_name, bio, location,
                    profile_image, profile_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, username, organization_name, bio, location, profile_image, profile_url))
            message = "Profile created successfully"
        
        # Update user's profile completion status
        conn.execute('UPDATE users SET is_profile_complete = TRUE WHERE id = ?', (user_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": message,
            "profile_url": profile_url,
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profile/get/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    try:
        conn = get_db_connection()
        profile = conn.execute('SELECT * FROM profiles WHERE user_id = ?', (user_id,)).fetchone()
        conn.close()
        
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        return jsonify({
            "profile": dict_from_row(profile),
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
        
        conn = get_db_connection()
        existing_profile = conn.execute('SELECT id FROM profiles WHERE username = ?', (username,)).fetchone()
        conn.close()
        
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
        
        conn = get_db_connection()
        
        # Get profile
        profile = conn.execute('SELECT * FROM profiles WHERE username = ?', (username,)).fetchone()
        if not profile:
            conn.close()
            return jsonify({"error": "Profile not found"}), 404
        
        # Get user info
        user = conn.execute('SELECT * FROM users WHERE id = ?', (profile['user_id'],)).fetchone()
        if not user:
            conn.close()
            return jsonify({"error": "User not found"}), 404
        
        # Get links
        links = conn.execute('SELECT * FROM links WHERE user_id = ?', (profile['user_id'],)).fetchone()
        
        conn.close()
        
        return jsonify({
            "profile": dict_from_row(profile),
            "user": {
                "full_name": user['full_name'],
                "email": user['email']
            },
            "links": dict_from_row(links) if links else None,
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Complete User Data Route

@app.route('/api/user/complete/<int:user_id>', methods=['GET'])
def get_complete_user_data(user_id):
    try:
        conn = get_db_connection()
        
        # Get user
        user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        if not user:
            conn.close()
            return jsonify({"error": "User not found"}), 404
        
        # Get links
        links = conn.execute('SELECT * FROM links WHERE user_id = ?', (user_id,)).fetchone()
        
        # Get profile
        profile = conn.execute('SELECT * FROM profiles WHERE user_id = ?', (user_id,)).fetchone()
        
        conn.close()
        
        return jsonify({
            "user": {
                "id": user['id'],
                "full_name": user['full_name'],
                "email": user['email'],
                "phone_number": user['phone_number'],
                "is_profile_complete": bool(user['is_profile_complete']),
                "created_at": user['created_at']
            },
            "links": dict_from_row(links) if links else None,
            "profile": dict_from_row(profile) if profile else None,
            "success": True
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health Check
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        conn = get_db_connection()
        conn.execute('SELECT 1').fetchone()
        conn.close()
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)