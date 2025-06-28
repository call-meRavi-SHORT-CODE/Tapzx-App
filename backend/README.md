# Tapzx Backend API

A FastAPI backend with MongoDB for the Tapzx digital business card application.

## Features

- **User Authentication**: JWT-based authentication with signup/signin
- **User Management**: Complete user profile management
- **Links Management**: Social media and contact links for each user
- **Profile Management**: User profiles with custom usernames and URLs
- **Database**: MongoDB with proper indexing and relationships
- **Security**: Password hashing, JWT tokens, input validation
- **API Documentation**: Auto-generated docs with Swagger UI

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # MongoDB connection and setup
│   ├── models.py            # Pydantic models
│   ├── auth.py              # Authentication utilities
│   └── routes/
│       ├── auth.py          # Authentication routes
│       ├── links.py         # Links management routes
│       ├── profile.py       # Profile management routes
│       └── user.py          # User management routes
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
├── run.py                   # Application runner
└── README.md               # This file
```

## Installation

1. **Clone the repository and navigate to backend folder**
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
   - Update the `MONGODB_URL` in `.env` file

5. **Configure environment variables**
   - Copy `.env` file and update the values
   - Generate a secure `SECRET_KEY` for JWT tokens

## Running the Application

1. **Start the server**
```bash
python run.py
```

2. **Access the API**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create new user account
- `POST /api/v1/auth/signin` - Sign in user
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/verify-token` - Verify JWT token

### Links Management
- `POST /api/v1/links/` - Create/update user links
- `GET /api/v1/links/` - Get current user's links
- `GET /api/v1/links/{user_id}` - Get links by user ID (public)
- `DELETE /api/v1/links/` - Delete user's links

### Profile Management
- `POST /api/v1/profile/` - Create/update user profile
- `GET /api/v1/profile/` - Get current user's profile
- `GET /api/v1/profile/username/{username}` - Get profile by username (public)
- `GET /api/v1/profile/{user_id}` - Get profile by user ID (public)
- `GET /api/v1/profile/check-username/{username}` - Check username availability
- `DELETE /api/v1/profile/` - Delete user's profile

### User Management
- `GET /api/v1/user/complete-profile` - Get complete user profile
- `GET /api/v1/user/public/{user_id}` - Get public user profile by ID
- `GET /api/v1/user/public/username/{username}` - Get public user profile by username
- `DELETE /api/v1/user/account` - Delete user account

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "full_name": "string",
  "email": "string (unique)",
  "phone_number": "string (unique)",
  "hashed_password": "string",
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

## Authentication Flow

1. **Signup**: User creates account → JWT token returned
2. **Signin**: User authenticates → JWT token returned
3. **Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Token Verification**: Validate token and get user info

## User Journey

1. **Step 1**: User signs up with basic info (name, email, phone, password)
2. **Step 2**: User adds social media links (optional fields)
3. **Step 3**: User creates profile (username, organization, bio, location)
4. **Complete**: User profile is marked as complete → redirect to home

## Environment Variables

```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=tapzx_db

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Pydantic
- Unique constraints on email, phone, username
- Protected routes with authentication middleware
- CORS configuration for frontend integration

## Error Handling

- Proper HTTP status codes
- Detailed error messages
- Global exception handling
- Validation error responses

## Development

1. **Add new routes**: Create new files in `app/routes/`
2. **Add models**: Update `app/models.py`
3. **Database changes**: Update `app/database.py` for indexes
4. **Testing**: Use the interactive docs at `/docs`

## Production Deployment

1. **Environment**: Set `DEBUG=False` in production
2. **Database**: Use MongoDB Atlas or production MongoDB
3. **Security**: Generate secure `SECRET_KEY`
4. **CORS**: Update allowed origins for your frontend domain
5. **HTTPS**: Use reverse proxy (nginx) with SSL certificate

## API Testing

Use the interactive documentation at `http://localhost:8000/docs` to test all endpoints with a user-friendly interface.

## Support

For issues or questions, please check the API documentation or create an issue in the repository.