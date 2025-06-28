import re
import sqlite3

def dict_from_row(row):
    """Convert sqlite3.Row to dictionary"""
    return dict(row) if row else None

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number format"""
    phone_clean = re.sub(r'[^\d+]', '', phone)
    pattern = r'^\+?[1-9]\d{9,14}$'
    return re.match(pattern, phone_clean) is not None

def validate_username(username):
    """Validate username format"""
    pattern = r'^[a-zA-Z0-9_-]{3,30}$'
    return re.match(pattern, username) is not None

def create_response(success=True, message="", data=None, error=None, status_code=200):
    """Create standardized API response"""
    response = {
        "success": success,
        "message": message
    }
    
    if data:
        response.update(data)
    
    if error:
        response["error"] = error
    
    return response, status_code

def validate_required_fields(data, required_fields):
    """Validate that all required fields are present"""
    missing_fields = []
    for field in required_fields:
        if not data.get(field):
            missing_fields.append(field)
    
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    return True, None