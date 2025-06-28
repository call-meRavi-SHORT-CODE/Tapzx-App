const API_BASE_URL = 'http://localhost:8000/api/v1';

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
        throw new Error(data.detail || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  private async makeAuthenticatedRequest(endpoint: string, token: string, options: RequestInit = {}) {
    return this.makeRequest(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
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

  async verifyToken(token: string) {
    return this.makeAuthenticatedRequest('/auth/verify-token', token, {
      method: 'POST',
    });
  }

  async getCurrentUser(token: string) {
    return this.makeAuthenticatedRequest('/auth/me', token);
  }

  // Links endpoints
  async saveLinks(linksData: LinksData, token: string) {
    return this.makeAuthenticatedRequest('/links/', token, {
      method: 'POST',
      body: JSON.stringify(linksData),
    });
  }

  async getLinks(token: string) {
    return this.makeAuthenticatedRequest('/links/', token);
  }

  async getLinksByUserId(userId: string) {
    return this.makeRequest(`/links/${userId}`);
  }

  // Profile endpoints
  async saveProfile(profileData: ProfileData, token: string) {
    return this.makeAuthenticatedRequest('/profile/', token, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile(token: string) {
    return this.makeAuthenticatedRequest('/profile/', token);
  }

  async getProfileByUsername(username: string) {
    return this.makeRequest(`/profile/username/${username}`);
  }

  async checkUsernameAvailability(username: string) {
    return this.makeRequest(`/profile/check-username/${username}`);
  }

  // User endpoints
  async getCompleteProfile(token: string) {
    return this.makeAuthenticatedRequest('/user/complete-profile', token);
  }

  async getPublicProfile(userId: string) {
    return this.makeRequest(`/user/public/${userId}`);
  }

  async getPublicProfileByUsername(username: string) {
    return this.makeRequest(`/user/public/username/${username}`);
  }

  async deleteAccount(token: string) {
    return this.makeAuthenticatedRequest('/user/account', token, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();