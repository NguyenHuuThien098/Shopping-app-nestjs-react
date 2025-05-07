/**
 * Loại dữ liệu cho thông tin người dùng
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

/**
 * Thông tin đăng nhập
 */
// Login credentials interface
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Thông tin đăng ký
 */
// Registration credentials interface
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

/**
 * Phản hồi xác thực từ API
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
 * Phản hồi lấy thông tin profile từ API
 */
export interface ProfileResponse {
  success: boolean;
  data?: {
    user: User;
    customerProfile?: any;
  };
}

/**
 * Trạng thái xác thực trong Context
 */
// Authentication state interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}