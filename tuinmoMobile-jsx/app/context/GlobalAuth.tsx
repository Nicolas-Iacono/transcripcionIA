import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (jwt: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUsername = await AsyncStorage.getItem('username');
      
      if (storedToken && storedUsername) {
        setToken(storedToken);
        setUsername(storedUsername);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading auth from storage:', error);
    }
  };

  const login = async (jwt: string, username: string) => {
    try {
      await AsyncStorage.setItem('authToken', jwt);
      await AsyncStorage.setItem('username', username);
      setToken(jwt);
      setUsername(username);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth to storage:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('username');
      setToken(null);
      setUsername(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing auth from storage:', error);
    }
  };

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isAuthenticated,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
