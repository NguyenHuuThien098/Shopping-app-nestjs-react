import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth để lấy thông tin người dùng
import { placeOrder } from '../services/orderService'; // Import hàm đặt hàng từ orderService

// Cart item interface
export interface CartItem {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
  stockQuantity: number;
  isPurchased?: boolean;
  imageUrl?: string;
  description?: string;
}

// Cart context interface
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateCartItemQuantity: (itemId: number, quantity: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void; // Alias for updateCartItemQuantity
  markAsPurchased: (itemIds: number[]) => void; // Add method to mark items as purchased
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  checkout: () => Promise<void>; // Thêm hàm checkout
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key for cart
const CART_STORAGE_KEY = 'shopping_cart';

/**
 * Cart provider component
 * Manages cart state and provides functions for cart operations
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Lấy thông tin người dùng từ AuthContext
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to local storage when it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart or update quantity if already exists
  const addToCart = (product:any) => {
    setCartItems(prevItems => {
      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const existingItem = prevItems.find(item => item.id === product.id && !item.isPurchased);
      
      // Tính toán số lượng hiện có trong giỏ
      const currentCartQuantity = existingItem ? existingItem.quantity : 0;
      
      // Kiểm tra nếu sản phẩm vượt quá số lượng tồn kho
      if (currentCartQuantity + 1 > product.stockQuantity) {
        // Hiển thị thông báo (có thể thông qua context khác hoặc callback)
        alert(`Không thể thêm sản phẩm. Chỉ còn ${product.stockQuantity} sản phẩm trong kho.`);
        return prevItems;
      }
      
      if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ, tăng số lượng
        return prevItems.map(item =>
          item.id === product.id && !item.isPurchased
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Nếu chưa có, thêm vào giỏ với số lượng ban đầu là 1
        return [...prevItems, { ...product, quantity: 1, isPurchased: false }];
      }
    });
  };

  // Remove item from cart by id
  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Update quantity of an item in cart
  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Alias for updateCartItemQuantity
  const updateQuantity = (itemId: number, quantity: number) => {
    updateCartItemQuantity(itemId, quantity);
  };

  // Mark items as purchased
  const markAsPurchased = (itemIds: number[]) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        itemIds.includes(item.id) ? { ...item, isPurchased: true } : item
      )
    );
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price of cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  // Count number of items in cart (not purchased)
  const getCartItemCount = () => {
    return cartItems
      .filter(item => !item.isPurchased)
      .reduce((count, item) => count + item.quantity, 0);
  };

  // Checkout function
  const checkout = async () => {
    try {
      if (!user) {
        throw new Error('Bạn cần đăng nhập để đặt hàng.');
      }

      const orderData = {
        orderDetails: cartItems.filter(item => !item.isPurchased).map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.unitPrice // Ensure price is always included
        })),
      };

      const response = await placeOrder(orderData);
      console.log('Đặt hàng thành công:', response);
      
      // Mark items as purchased instead of clearing the cart
      const itemIds = cartItems.filter(item => !item.isPurchased).map(item => item.id);
      markAsPurchased(itemIds);
    } catch (error: any) {
      console.error('Lỗi khi đặt hàng:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        updateQuantity,
        markAsPurchased,
        clearCart,
        getCartTotal,
        getCartItemCount,
        checkout, // Thêm checkout vào context
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for accessing cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};