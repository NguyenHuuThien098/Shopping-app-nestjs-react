/**
 * Type definitions for authentication
 */
// User interface representing the authenticated user
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Extended user profile for customers
export interface CustomerProfile extends User {
  address?: string;
  phone?: string;
  // Any additional customer-specific fields
}

// Extended user profile for admins
export interface AdminProfile extends User {
  permissions?: string[];
  department?: string;
  // Any additional admin-specific fields
}

/**
 * Login credentials
 */
// Login credentials interface
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Registration credentials
 */
// Base registration credentials
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

// Customer-specific registration
export interface CustomerRegisterCredentials extends RegisterCredentials {
  address?: string;
  phone?: string;
}

// Admin-specific registration
export interface AdminRegisterCredentials extends RegisterCredentials {
  department?: string;
  permissions?: string[];
}

/**
 * Authentication API responses
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    role: string;
    token: string;
  };
}

/**
 * Profile response from API
 */
export interface ProfileResponse {
  success: boolean;
  data?: {
    user: User;
    customerProfile?: any;
    adminProfile?: any;
  };
}

/**
 * Authentication state in Context
 */
// Authentication state interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}