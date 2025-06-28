# Tapzx Backend API

A Flask backend with MongoDB for the Tapzx digital business card application.

## Features

- **User Authentication**: Signup/Signin without JWT (session-based)
- **User Management**: Complete user profile management
- **Links Management**: Social media and contact links for each user
- **Profile Management**: User profiles with custom usernames and URLs
- **Database**: MongoDB with proper indexing and relationships
- **Security**: Password hashing, input validation
- **API Documentation**: RESTful API endpoints

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── database.py         # MongoDB connection and setup
├── models.py           # Data models
├── utils.py            # Utility functions
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
├── run.py             # Application runner
└── README.md          # This file
```

## Installation

1. **Navigate to backend folder**
```bash
cd backend
```

2. **Create a virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGO_URI` in `.env` file

5. **Configure environment variables**
   - Update `.env` file with your MongoDB connection string

## Running the Application

1. **Start the server**
```bash
python app.py
```

2. **Access the API**
   - API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/check-user/<user_id>` - Check user status

### Links Management
- `POST /api/links/save` - Save user links
- `GET /api/links/get/<user_id>` - Get user links

### Profile Management
- `POST /api/profile/save` - Save user profile
- `GET /api/profile/get/<user_id>` - Get user profile
- `GET /api/profile/check-username/<username>` - Check username availability
- `GET /api/profile/by-username/<username>` - Get profile by username (public)

### User Management
- `GET /api/user/complete/<user_id>` - Get complete user data

### Health Check
- `GET /api/health` - API health status

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "full_name": "string",
  "email": "string (unique)",
  "phone_number": "string (unique)",
  "password": "string (hashed)",
  "created_at": "datetime",
  "is_profile_complete": "boolean"
}
```

### Links Collection
```json
{
  "_id": "ObjectId",
  "user_id": "string (references users._id)",
  "website": "string (optional)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "whatsapp": "string (optional)",
  "instagram": "string (optional)",
  "twitter": "string (optional)",
  "linkedin": "string (optional)",
  "facebook": "string (optional)",
  "youtube": "string (optional)",
  "tiktok": "string (optional)",
  "github": "string (optional)",
  "discord": "string (optional)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Profiles Collection
```json
{
  "_id": "ObjectId",
  "user_id": "string (references users._id, unique)",
  "username": "string (unique)",
  "organization_name": "string",
  "bio": "string (max 150 words)",
  "location": "string",
  "profile_image": "string (optional)",
  "profile_url": "string (tapzx.app/username)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## User Journey

1. **Step 1**: User signs up with basic info (name, email, phone, password)
2. **Step 2**: User adds social media links (optional fields)
3. **Step 3**: User creates profile (username, organization, bio, location)
4. **Complete**: User profile is marked as complete → redirect to home

## Environment Variables

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=tapzx_db

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

## Security Features

- Password hashing with Werkzeug
- Input validation
- Unique constraints on email, phone, username
- CORS configuration for frontend integration

## Error Handling

- Proper HTTP status codes
- Detailed error messages
- Validation error responses

## Testing the API

You can test the API endpoints using tools like Postman or curl:

### Example: User Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "password": "password123",
    "confirm_password": "password123"
  }'
```

### Example: User Signin
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Production Deployment

1. **Environment**: Set `FLASK_ENV=production`
2. **Database**: Use MongoDB Atlas or production MongoDB
3. **Security**: Use strong passwords and secure connections
4. **CORS**: Update allowed origins for your frontend domain

## Support

For issues or questions, please check the API documentation or create an issue in the repository.