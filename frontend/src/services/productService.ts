import axios from '../utils/axios.config';
import { API_ENDPOINTS } from '../utils/apiConfig';

// Type definitions
export interface Product {
  id: number;
  Name: string;
  UnitPrice: number;
  quantity: number;
  product_code?: string | number; // Updated to accept both string and number
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add these properties to align with components
  name?: string;
  unitPrice?: number;
}

export interface SearchResponse {
  data: Product[];
  total: number;
}

/**
 * Search products (requires authentication)
 * @param query Search query
 * @param page Page number
 * @param limit Items per page
 * @returns Promise with search results
 */
export const searchProducts = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchResponse> => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: {
        q: query,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Search products (public, no authentication required)
 * @param query Search query
 * @param page Page number
 * @param limit Items per page
 * @returns Promise with search results
 */
export const searchPublicProducts = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchResponse> => {
  try {
    // Use the parameter names that the API actually expects
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.PUBLIC_SEARCH, {
      params: {
        q: query, // Changed from 'nameProduct' to 'q'
        page,
        limit, // Changed from 'pageSize' to 'limit'
      },
    });
    
    // Normalize data to include name and unitPrice fields for compatibility
    const normalizedData = response.data.data?.map((product: Product) => ({
      ...product,
      name: product.Name, // Add name field
      unitPrice: product.UnitPrice // Add unitPrice field
    }));
    
    return {
      data: normalizedData || [],
      total: response.data.total || 0
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Get product details by ID
 * @param id Product ID
 * @returns Promise with product details
 */
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.DETAILS.replace(':id', id.toString()));
    
    // Normalize response to include both naming conventions
    const product = response.data;
    return {
      ...product,
      name: product.Name,
      unitPrice: product.UnitPrice
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// Legacy function - updated to use the correct parameter names
export const fetchProducts = async (
  searchText: string = '',
  page: number = 1,
  pageSize: number = 10
): Promise<SearchResponse> => {
  try {
    // Use the parameter names expected by the API
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: {
        q: searchText, // Changed from 'nameProduct' to 'q'
        page,
        limit: pageSize, // Changed from 'pageSize' to 'limit'
      },
    });
    
    // Normalize data to include name and unitPrice fields for compatibility
    const normalizedData = response.data.data?.map((product: Product) => ({
      ...product,
      name: product.Name, // Add name field
      unitPrice: product.UnitPrice // Add unitPrice field
    }));
    
    return {
      data: normalizedData || [],
      total: response.data.total || 0
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};