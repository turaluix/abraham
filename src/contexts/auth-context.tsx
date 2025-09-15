"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, apiClient } from '@/api';
import { UserProfile, LoginRequest } from '@/types';
import { getCookie, setCookie, clearAuthCookies } from '@/lib/cookies';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      const token = getCookie('access_token');
      
      if (token) {
        apiClient.setToken(token);
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          clearAuthState();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authApi.getProfile();
      // Handle different response formats - extract actual user data
      const userData = (response as any).data || response;
      setUser(userData);
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  };

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    
    try {
      const response = await authApi.login(credentials);
      const data = response as any;

      // Extract tokens and user data from response
      let tokens, userData;
      
      if (data.status === 'success' && data.tokens && data.user) {
        // New API format
        tokens = data.tokens;
        userData = data.user;
      } else if (data.data) {
        // Fallback format
        tokens = { access: data.data.access, refresh: data.data.refresh };
        userData = data.data.user;
      } else {
        throw new Error('Invalid login response format');
      }

      // Store tokens
      apiClient.setToken(tokens.access);
      setCookie('access_token', tokens.access, 7);
      setCookie('refresh_token', tokens.refresh, 30);
      
      // Set user data
      setUser(userData);
      
    } catch (error) {
      clearAuthState();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Logout API failed:', error);
    }
    
    clearAuthState();
    router.push('/auth/login');
  };

  const refreshUser = async () => {
    if (!getCookie('access_token')) {
      throw new Error('No access token available');
    }
    await fetchUserProfile();
  };

  const clearAuthState = () => {
    clearAuthCookies();
    apiClient.clearToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
