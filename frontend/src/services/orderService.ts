import axios from '../utils/axios.config';
import { API_ENDPOINTS } from '../utils/apiConfig';

// Type definitions
export interface OrderDetailItem {
  productId: number;
  quantity: number;
  price: number; // Changed from optional to required
}

export interface OrderRequest {
  orderDetails: OrderDetailItem[];
}

export interface OrderResponse {
  id: number;
  CustomerId: number;
  OrderDate: string;
  createdAt: string;
  updatedAt: string;
  orderDetails: Array<{
    id: number;
    OrderId: number;
    ProductId: number;
    Quantity: number;
    Price: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

/**
 * Place a new order
 * @param orderData Order data with product details
 * @returns Promise with order response
 */
export const placeOrder = async (orderData: OrderRequest): Promise<OrderResponse> => {
  try {
    // Ensure all orderDetails have price value
    if (orderData.orderDetails) {
      orderData.orderDetails = orderData.orderDetails.map(detail => {
        if (detail.price === undefined || detail.price === null) {
          throw new Error("Price is required for all order items");
        }
        return detail;
      });
    }
    
    const response = await axios.post(API_ENDPOINTS.ORDERS, orderData);
    return response.data;
  } catch (error: any) {
    // Extract error message from response if available
    if (error.response?.data?.message) {
      throw new Error(Array.isArray(error.response.data.message) 
        ? error.response.data.message.join(', ') 
        : error.response.data.message);
    }
    throw error;
  }
};

/**
 * Get orders for current customer
 * @returns Promise with customer orders
 */
export const getCustomerOrders = async (): Promise<OrderResponse[]> => {
  try {
    const response = await axios.get(API_ENDPOINTS.CUSTOMER.ORDERS);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Get order details by ID
 * @param orderId Order ID
 * @returns Promise with order details
 */
export const getOrderById = async (orderId: number): Promise<OrderResponse> => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.ORDERS}/${orderId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};