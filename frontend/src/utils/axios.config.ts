import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './apiConfig';

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important: For CORS with credentials, the server must specify an exact origin, not wildcard '*'
  withCredentials: false // Changed from true to false to avoid CORS issues with wildcard origin
});

// Token used for authenticated requests - stored in memory
let inMemoryToken: string | null = null;
// Track user role for role-specific API endpoints
let userRole: string | null = null;

// Function to set the token from outside (typically from AuthContext)
export const setAuthToken = (token: string | null, role?: string | null) => {
  inMemoryToken = token;
  
  if (role) {
    userRole = role;
  }
  
  // Store token in localStorage
  if (token) {
    localStorage.setItem('auth_token', token);
    if (role) {
      localStorage.setItem('user_role', role);
    }
  } else {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    userRole = null;
  }
  
  console.log('Auth token updated in axios instance');
};

// Function to get the current token
export const getAuthToken = () => {
  if (!inMemoryToken) {
    const storedToken = localStorage.getItem('auth_token');
    // Get token from localStorage
    if (storedToken) {
      inMemoryToken = storedToken;
    }
    
    // Get role from localStorage if not already set
    if (!userRole) {
      const storedRole = localStorage.getItem('user_role');
      if (storedRole) {
        userRole = storedRole;
      }
    }
  }
  return inMemoryToken;
};

// Function to get the current user role
export const getUserRole = () => {
  if (!userRole) {
    const storedRole = localStorage.getItem('user_role');
    if (storedRole) {
      userRole = storedRole;
    }
  }
  return userRole;
};

// Add interceptor for requests to automatically attach authentication token
axiosInstance.interceptors.request.use(
  (config) => {
    // Use token from memory instead of localStorage
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle response errors, especially 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Attempting to refresh token after 401 error...");

        // Use the correct refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              // Add Authorization header if we have a token
              ...(inMemoryToken && { Authorization: `Bearer ${inMemoryToken}` })
            }
          }
        );

        if (response.data && response.data.access_token) {
          const newToken = response.data.access_token;
          console.log("Token refreshed successfully!");

          // Update the in-memory token
          setAuthToken(newToken, userRole);

          // Trigger an auth state update event
          const tokenRefreshEvent = new CustomEvent('token-refreshed', {
            detail: { token: newToken }
          });
          window.dispatchEvent(tokenRefreshEvent);

          // Update token in header and retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } else {
          console.log("Server returned success but no new token");
        }
      } catch (refreshError) {
        console.error('Unable to refresh token:', refreshError);

        // Check for server response details if available
        if (axios.isAxiosError(refreshError) && refreshError.response) {
          console.error('Error details from server:', refreshError.response.data);
        }

        // Clear the in-memory token
        setAuthToken(null);

        // Trigger an auth state update event for logout
        const logoutEvent = new CustomEvent('auth-logout');
        window.dispatchEvent(logoutEvent);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;