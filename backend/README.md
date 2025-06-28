# Tapzx Backend API with SQLite

A Flask backend with SQLite database for the Tapzx digital business card application.

## Features

- **User Authentication**: Signup/Signin without JWT (session-based)
- **User Management**: Complete user profile management
- **Links Management**: Social media and contact links for each user
- **Profile Management**: User profiles with custom usernames and URLs
- **Database**: SQLite with proper relationships and constraints
- **Security**: Password hashing, input validation
- **API Documentation**: RESTful API endpoints

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── database.py         # SQLite connection and setup
├── models.py           # Data models
├── utils.py            # Utility functions
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
├── run.py             # Application runner
├── tapzx.db           # SQLite database file (auto-created)
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

4. **Configure environment variables**
   - The `.env` file is already configured for SQLite
   - Database file will be created automatically

## Running the Application

1. **Start the server**
```bash
python app.py
```

2. **Access the API**
   - API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_profile_complete BOOLEAN DEFAULT FALSE
);
```

### Links Table
```sql
CREATE TABLE links (
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
);
```

### Profiles Table
```sql
CREATE TABLE profiles (
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
);
```

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

## User Journey

1. **Step 1**: User signs up with basic info (name, email, phone, password)
2. **Step 2**: User adds social media links (optional fields)
3. **Step 3**: User creates profile (username, organization, bio, location)
4. **Complete**: User profile is marked as complete → redirect to home

## Environment Variables

```env
# SQLite Database Configuration
DATABASE_PATH=tapzx.db

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# Server Configuration
HOST=0.0.0.0
PORT=5000
```

## Key Differences from MongoDB Version

1. **Database**: Uses SQLite instead of MongoDB
2. **IDs**: Uses integer auto-increment IDs instead of ObjectIds
3. **Relationships**: Uses foreign key constraints
4. **Queries**: Uses SQL instead of MongoDB queries
5. **File-based**: Database is stored in a single file (`tapzx.db`)

## Advantages of SQLite

- **No Setup Required**: No need to install or configure a database server
- **File-based**: Entire database in a single file
- **ACID Compliant**: Full transaction support
- **Fast**: Excellent performance for small to medium applications
- **Portable**: Database file can be easily moved or backed up
- **SQL Standard**: Uses standard SQL syntax

## Testing the API

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

## Database Management

### View Database Contents
You can use any SQLite browser or command line:

```bash
sqlite3 tapzx.db
.tables
SELECT * FROM users;
SELECT * FROM links;
SELECT * FROM profiles;
```

### Backup Database
```bash
cp tapzx.db tapzx_backup.db
```

### Reset Database
```bash
rm tapzx.db
# Restart the application to recreate tables
```

## Production Deployment

1. **Environment**: Set `FLASK_ENV=production`
2. **Database**: Ensure proper file permissions for SQLite file
3. **Security**: Use strong SECRET_KEY
4. **Backup**: Regular database file backups
5. **Performance**: Consider connection pooling for high traffic

## Security Features

- Password hashing with Werkzeug
- Input validation and sanitization
- Unique constraints on email, phone, username
- SQL injection prevention with parameterized queries
- CORS configuration for frontend integration

## Error Handling

- Proper HTTP status codes
- Detailed error messages
- Database constraint error handling
- Validation error responses

## Support

For issues or questions, please check the API documentation or create an issue in the repository.