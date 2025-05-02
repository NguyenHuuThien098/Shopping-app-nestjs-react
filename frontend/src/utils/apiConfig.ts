/**
 * Cấu hình API endpoints cho toàn bộ ứng dụng
 * Tập trung quản lý URL cơ sở cho các API, giúp dễ dàng thay đổi khi triển khai ở môi trường khác
 */

/**
 * Base API URL 
 * Change this value based on environment
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * API endpoint paths organized by resource
 * Used for consistent API access throughout the application
 */
export const API_ENDPOINTS = {
  PRODUCTS: {
    ROOT: '/products',
    SEARCH: '/products/search',
    PUBLIC_SEARCH: '/products', // Changed from '/products/public/search' to '/products'
    DETAILS: '/products/:id',
  },
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  ORDER_DETAILS: '/order-details',
  SHIPPERS: '/shippers',
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh', // refresh token
  },
  CUSTOMER: {
    ORDERS: '/customer/order-product',
    PROFILE: '/customer/profile',
    GETORDERS: '/customers/:customerId/orders', // lấy orders theo idcustomer
  },
};

/**
 * Helper function to construct full API URLs
 * @param endpoint - Base endpoint from API_ENDPOINTS
 * @param path - Additional path segments
 * @returns Complete API URL
 */
export const getApiUrl = (endpoint: string, path: string = '') => {
  return `${API_BASE_URL}${endpoint}${path}`;
};

/**
 * Default request headers
 * Use this for consistent headers across requests
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Storage keys for auth data
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user_data',
};

