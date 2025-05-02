import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getUserProfile as apiGetProfile } from '../services/authService';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';
import { setAuthToken, getAuthToken } from '../utils/axios.config';

// Context default values
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

// Create the auth context
const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}>({
  ...defaultAuthState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  
  // Clear any error message
  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if we have a token in memory
        const currentToken = getAuthToken();
        
        if (currentToken) {
          console.log("Found existing token, verifying...");
          
          // Try to get user profile to check if token is still valid
          const profileResponse = await apiGetProfile();
          
          if (profileResponse && profileResponse.user) {
            console.log("Token valid, user authenticated");
            // Valid token and user profile
            setAuthState({
              isAuthenticated: true,
              user: profileResponse.user,
              token: currentToken,
              loading: false,
              error: null,
            });
          } else {
            // Token exists but is invalid
            console.log("Token exists but is invalid");
            setAuthState({
              isAuthenticated: false,
              user: null,
              token: null,
              loading: false,
              error: null,
            });
            setAuthToken(null);
          }
        } else {
          // No token at all
          console.log("No token found, user is not authenticated");
          setAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        // Authentication check failed
        console.log('Auth check failed:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null,
        });
        setAuthToken(null);
      }
    };

    checkAuthStatus();
    
    // Add listener for token refresh events
    const handleTokenRefreshed = (event: CustomEvent) => {
      const newToken = event.detail?.token;
      if (newToken) {
        setAuthState(prev => ({ 
          ...prev, 
          token: newToken
        }));
      }
    };
    
    // Add listener for forced logout events
    const handleLogout = () => {
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      });
    };
    
    window.addEventListener('token-refreshed', handleTokenRefreshed as EventListener);
    window.addEventListener('auth-logout', handleLogout);
    
    return () => {
      window.removeEventListener('token-refreshed', handleTokenRefreshed as EventListener);
      window.removeEventListener('auth-logout', handleLogout);
    };
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      
      const response = await apiLogin(credentials);
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.access_token,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        loading: false,
        error: error.message || 'Login failed. Please check your credentials.',
      }));
    }
  };

  // Register function
  const register = async (userData: RegisterCredentials) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      
      const response = await apiRegister(userData);
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.access_token,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Registration failed. Please try again.',
      }));
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));
      
      await apiLogout();
      
      // Clear auth state
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if there's an error, we still want to clear the local state
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        token: authState.token,
        loading: authState.loading,
        error: authState.error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);