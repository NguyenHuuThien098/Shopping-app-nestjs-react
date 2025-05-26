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
  // them cac truong ho tro cho componet
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

    console.log('Kết quả tim kiếm: ', response.data);

    const normalizedData = response.data.data?.map((product: Product) => ({
      ...product,
      name: product.Name || product.name,
      unitPrice: product.UnitPrice || product.unitPrice
    }));

    return {
      data: normalizedData || [],
      total: response.data.total || 0
    };
  } catch (error: any) {
    console.error('Lỗi tìm kiếm sản phẩm:', error.response?.data || error.message);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Get products (public, no authentication required)
 * @param page Page number
 * @param limit Items per page
 * @returns Promise with search results
 */
export const getProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<SearchResponse> => {
  try {
    console.log(`Lấy danh sách sản phẩm, page=${page}, limit=${limit}`);
    
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.ROOT, {
      params: {
        page,
        limit,
      },
    });
    
    console.log('Kết quả danh sách sản phẩm:', response.data);
    
    // Chuẩn hóa dữ liệu để hỗ trợ cả hai kiểu đặt tên
    const normalizedData = response.data.data?.map((product: Product) => ({
      ...product,
      name: product.Name || product.name,
      unitPrice: product.UnitPrice || product.unitPrice
    }));
    
    return {
      data: normalizedData || [],
      total: response.data.total || 0
    };
  } catch (error: any) {
    console.error('Lỗi lấy danh sách sản phẩm:', error.response?.data || error.message);
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
    console.log(`Lấy chi tiết sản phẩm ID=${id}`);
    
    const endpoint = API_ENDPOINTS.PRODUCTS.DETAILS.replace(':id', id.toString());
    const response = await axios.get(endpoint);
    console.log('Chi tiết sản phẩm:', response.data);
    
    // Chuẩn hóa phản hồi để hỗ trợ cả hai kiểu đặt tên
    const product = response.data;
    return {
      ...product,
      name: product.Name || product.name,
      unitPrice: product.UnitPrice || product.unitPrice
    };
  } catch (error: any) {
    console.error('Lỗi lấy chi tiết sản phẩm:', error.response?.data || error.message);
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