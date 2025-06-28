import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  created_at: string;
  is_profile_complete: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        // Verify token is still valid
        try {
          const tokenVerification = await apiService.verifyToken(storedToken);
          if (tokenVerification.valid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid, clear storage
            await clearAuth();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          await clearAuth();
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setToken(null);
    setUser(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiService.signIn({ email, password });
      
      const newToken = response.access_token;
      const userData = {
        id: response.user_id,
        full_name: '', // Will be fetched separately
        email,
        phone_number: '',
        created_at: new Date().toISOString(),
        is_profile_complete: response.is_profile_complete,
      };

      // Get complete user data
      try {
        const userInfo = await apiService.getCurrentUser(newToken);
        userData.full_name = userInfo.full_name;
        userData.phone_number = userInfo.phone_number;
        userData.created_at = userInfo.created_at;
        userData.is_profile_complete = userInfo.is_profile_complete;
      } catch (error) {
        console.error('Error fetching user info:', error);
      }

      // Store auth data
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (userData: any) => {
    try {
      const response = await apiService.signUp(userData);
      
      const newToken = response.access_token;
      const newUser = {
        id: response.user_id,
        full_name: userData.full_name,
        email: userData.email,
        phone_number: userData.phone_number,
        created_at: new Date().toISOString(),
        is_profile_complete: false,
      };

      // Store auth data
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await clearAuth();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}