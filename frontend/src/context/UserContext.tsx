import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User, UserContextType } from '@/types';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const URL = import.meta.env.VITE_BACKEND_URL;

  // Axios instance with base URL
  const api = axios.create({
    baseURL: URL,
    headers: { 'Content-Type': 'application/json' },
  });

  // Attach token to all requests if available
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchUserProfile();
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/profile/');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  };

  // Register new user
  const register = async (username:string, password:string, email:string) => {
    try {
      const response = await api.post('/register/', {username, password, email});
      const { token } = response.data;

      setToken(token);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await fetchUserProfile();
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  // Login user
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/token/', { username, password });
      const { access } = response.data;

      setToken(access);
      localStorage.setItem('token', access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      await fetchUserProfile();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <UserContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
