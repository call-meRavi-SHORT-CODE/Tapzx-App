# Tapzx Frontend - React Native Expo App

This is the frontend React Native Expo application for Tapzx digital business card app.

## Backend Integration

The backend API is running on `http://localhost:8000` by default.

### API Endpoints Used:

1. **Authentication**
   - `POST /api/v1/auth/signup` - User registration
   - `POST /api/v1/auth/signin` - User login
   - `GET /api/v1/auth/me` - Get current user
   - `POST /api/v1/auth/verify-token` - Verify JWT token

2. **Links Management**
   - `POST /api/v1/links/` - Save user links
   - `GET /api/v1/links/` - Get user links

3. **Profile Management**
   - `POST /api/v1/profile/` - Save user profile
   - `GET /api/v1/profile/` - Get user profile
   - `GET /api/v1/profile/check-username/{username}` - Check username availability

4. **User Management**
   - `GET /api/v1/user/complete-profile` - Get complete user data
   - `GET /api/v1/user/public/username/{username}` - Get public profile

## Authentication Flow

1. App starts → Check if user is authenticated
2. If not authenticated → Show SignIn page
3. If authenticated → Show HomePage
4. New users go through: SignUp → AddLinks → EditProfile → HomePage

## Required Changes for Backend Integration

You'll need to update the following files to integrate with the backend:

### 1. Create API Service (`app/services/api.ts`)
```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiService = {
  // Auth endpoints
  signup: (userData) => fetch(`${API_BASE_URL}/auth/signup`, {...}),
  signin: (credentials) => fetch(`${API_BASE_URL}/auth/signin`, {...}),
  verifyToken: (token) => fetch(`${API_BASE_URL}/auth/verify-token`, {...}),
  
  // Links endpoints
  saveLinks: (links, token) => fetch(`${API_BASE_URL}/links/`, {...}),
  getLinks: (token) => fetch(`${API_BASE_URL}/links/`, {...}),
  
  // Profile endpoints
  saveProfile: (profile, token) => fetch(`${API_BASE_URL}/profile/`, {...}),
  getProfile: (token) => fetch(`${API_BASE_URL}/profile/`, {...}),
  checkUsername: (username) => fetch(`${API_BASE_URL}/profile/check-username/${username}`, {...}),
};
```

### 2. Update Authentication Context (`app/context/AuthContext.tsx`)
```typescript
// Add authentication state management
// Store JWT token in AsyncStorage
// Handle login/logout/token refresh
```

### 3. Update Components
- `app/components/SignUp.tsx` - Connect to signup API
- `app/components/SignIn.tsx` - Connect to signin API
- `app/(tabs)/AddLinks.tsx` - Connect to links API
- `app/(tabs)/EditProfile.tsx` - Connect to profile API

### 4. Add Token Storage
```bash
npm install @react-native-async-storage/async-storage
```

## Running the Full Stack

1. **Start Backend**:
```bash
cd backend
python run.py
```

2. **Start Frontend**:
```bash
cd frontend  # (your current expo app)
npm start
```

The frontend will connect to the backend API for all data operations.