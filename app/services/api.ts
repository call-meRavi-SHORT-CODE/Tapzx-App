const API_BASE_URL = 'http://localhost:5000/api';

export interface SignUpData {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface LinksData {
  user_id: number;
  website?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  github?: string;
  discord?: string;
}

export interface ProfileData {
  user_id: number;
  username: string;
  organization_name: string;
  bio: string;
  location: string;
  profile_image?: string;
}

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async signUp(userData: SignUpData) {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signIn(credentials: SignInData) {
    return this.makeRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async checkUser(userId: number) {
    return this.makeRequest(`/auth/check-user/${userId}`);
  }

  // Links endpoints
  async saveLinks(linksData: LinksData) {
    return this.makeRequest('/links/save', {
      method: 'POST',
      body: JSON.stringify(linksData),
    });
  }

  async getLinks(userId: number) {
    return this.makeRequest(`/links/get/${userId}`);
  }

  // Profile endpoints
  async saveProfile(profileData: ProfileData) {
    return this.makeRequest('/profile/save', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile(userId: number) {
    return this.makeRequest(`/profile/get/${userId}`);
  }

  async checkUsernameAvailability(username: string) {
    return this.makeRequest(`/profile/check-username/${username}`);
  }

  async getProfileByUsername(username: string) {
    return this.makeRequest(`/profile/by-username/${username}`);
  }

  // User endpoints
  async getCompleteUserData(userId: number) {
    return this.makeRequest(`/user/complete/${userId}`);
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }
}

export const apiService = new ApiService();