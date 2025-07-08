'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, AuthUser } from '@/services/authService';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (email: string, password: string, userData: {
    firstName: string;
    lastName?: string;
    username: string;
  }) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const user = await AuthService.signIn(email, password);
    setUser(user);
    return user;
  };

  const signUp = async (email: string, password: string, userData: {
    firstName: string;
    lastName?: string;
    username: string;
  }) => {
    const user = await AuthService.signUp(email, password, userData);
    setUser(user);
    return user;
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: any) => {
    if (user) {
      await AuthService.updateUserProfile(user.uid, updates);
      // Refresh user data
      const updatedProfile = await AuthService.getUserProfile(user.uid);
      setUser({ ...user, profile: updatedProfile });
    }
  };

  const refreshUser = async () => {
    if (user) {
      const updatedProfile = await AuthService.getUserProfile(user.uid);
      setUser({ ...user, profile: updatedProfile });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 