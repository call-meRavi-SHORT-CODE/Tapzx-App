import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  is_profile_complete: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Verify user still exists in backend
        try {
          const response = await apiService.checkUser(userData.id);
          if (response.success) {
            setUser(response.user);
          } else {
            await clearAuth();
          }
        } catch (error) {
          console.error('User verification failed:', error);
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
    await AsyncStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiService.signIn({ email, password });
      
      const userData = response.user;

      // Store user data
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (userData: any) => {
    try {
      const response = await apiService.signUp(userData);
      
      // After signup, sign in the user
      await signIn(userData.email, userData.password);
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
    isLoading,
    isAuthenticated: !!user,
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