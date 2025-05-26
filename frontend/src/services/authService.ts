import axios, { setAuthToken } from '../utils/axios.config';
import { API_ENDPOINTS } from '../utils/apiConfig';

// Type definitions
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AdminRegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface CustomerRegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  address?: string;
  phone?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  access_token: string;
}

/**
 * Register a new customer
 * @param userData Customer registration data
 * @returns Promise with the registration response
 */
export const registerCustomer = async (userData: CustomerRegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post(API_ENDPOINTS.CUSTOMERS.REGISTER, userData);
    
    // Save the token in memory for future authenticated requests
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
    }
    
    return response.data;
  } catch (error: any) {
    // Extract and throw the error message from the API response if available
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Register a new admin
 * @param userData Admin registration data
 * @returns Promise with the registration response
 */
export const registerAdmin = async (userData: AdminRegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post(API_ENDPOINTS.ADMIN.REGISTER, userData);
    
    // Save the token in memory for future authenticated requests
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
    }
    
    return response.data;
  } catch (error: any) {
    // Extract and throw the error message from the API response if available
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Login a user (general authentication)
 * @param credentials User login credentials
 * @returns Promise with the login response
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    // Save the token in memory for future authenticated requests
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Login an admin user
 * @param credentials Admin login credentials
 * @returns Promise with the login response
 */
export const adminLogin = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post(API_ENDPOINTS.ADMIN.LOGIN, credentials);
    
    // Save the token in memory for future authenticated requests
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Logout the current user
 * @returns Promise with the logout response
 */
export const logout = async (): Promise<{ message: string }> => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGOUT);
    
    // Clear the token from memory
    setAuthToken(null);
    
    return response.data;
  } catch (error: any) {
    // Clear token even if logout fails on the server
    setAuthToken(null);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Get the current user's profile
 * @returns Promise with the user profile
 */
export const getUserProfile = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  } catch (error: any) {
    console.error('Profile API error:', error.response?.data || error.message);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Get customer profile with detailed information
 * @returns Promise with the customer profile
 */
export const getCustomerProfile = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.CUSTOMERS.PROFILE);
    return response.data;
  } catch (error: any) {
    console.error('Customer profile API error:', error.response?.data || error.message);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * For backward compatibility
 * @param userData User registration data
 * @returns Promise with the registration response
 */
export const register = registerCustomer;