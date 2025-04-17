'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUsername } from '@/store/slices/ideaCreationSlice';

// Define the shape of the user data
interface User {
  _id: string;
  uuid: string;
  name: string;
  permanentUsername: string;
  email: string;
  isIdVerified: boolean;
  validityExpiry?: string;
  hasUsedFreeIdea: boolean;
}

// Define the context's value type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Initialize the context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

// Create the provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // Complete the loading state after auth check
  }, []);

  // Memoize login and logout functions to prevent unnecessary re-renders
  const login = useCallback(
    (userData: any, token: string) => {
      localStorage.setItem('user_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      dispatch(setUsername(userData.permanentUsername));
      // router.push('/');
    },
    [router]
  );

  const logout = useCallback(() => {
    // localStorage.clear();
    localStorage.removeItem('user_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    dispatch(setUsername(''));
    router.push('/');
  }, [router]);

  // Memoize the context value
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      setUser
    }),
    [user, isAuthenticated, loading, login, logout, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the context
export const useAuth = () => useContext(AuthContext);