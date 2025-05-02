import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import RefreshIcon from '@mui/icons-material/Refresh';
import Paper from '@mui/material/Paper';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { API_ENDPOINTS, getApiUrl } from '../utils/apiConfig';

/**
 * Product data structure with essential properties for display and ordering
 */
interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

/**
 * Component props definition
 */
interface ProductListProps {
  onAddToCart: (product: Product) => void;
  cartItems?: Array<{id: number, quantity: number}>; // Add cart items to check availability
}

/**
 * ProductList component
 * 
 * Displays searchable, paginated product data in a table format
 * Handles API integration, error states, and cart functionality
 */
const ProductList: React.FC<ProductListProps> = ({ onAddToCart, cartItems = [] }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  /**
   * Fetches product data from the API with search and pagination
   * Includes comprehensive error handling for network and server issues
   */
  const fetchProducts = useCallback(async () => {
    setError(null);
    
    try {
      // Log the API URL being used
      const apiUrl = getApiUrl(API_ENDPOINTS.PRODUCTS.SEARCH);
      console.log(`Fetching products from: ${apiUrl}`);
      
      const response = await axios.get(apiUrl, {
        params: {
          page,
          pageSize,
          nameProduct: searchText,  // Match the parameter name expected by the backend API
        },
        timeout: 10000, // Add timeout to prevent long-hanging requests
      });
      
      console.log('API Response:', response.data);
      
      // Check if response has the expected format
      if (response.data && response.data.success) {
        setProducts(response.data.data || []);
        setTotal(response.data.total || 0);
      } else {
        setError('Received unexpected response format from server');
        console.error('Unexpected response format:', response.data);
      }
    } catch (err) {
      // Enhanced error logging
      console.error('Error details:', err);
      
      // Handle various error scenarios with specific user messages
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Connection timeout. Please try again.');
        } else if (err.response?.status === 404) {
          setError('Products not found. Try a different search term.');
        } else if (err.response?.status === 500) {
          setError('Server error. Our team has been notified.');
        } else if (!navigator.onLine) {
          setError('You appear to be offline. Please check your internet connection.');
        } else {
          setError(`Failed to fetch products: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  }, [page, pageSize, searchText]);

  /**
   * Load products on component mount and when dependencies change
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Initiates product search, resetting to first page
   */
  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  /**
   * Handles Enter key press in search input
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * Updates current page for pagination
   */
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  /**
   * Calculate available quantity considering items in cart
   */
  const getAvailableQuantity = (product: Product): number => {
    const cartItem = cartItems.find(item => item.id === product.id);
    return cartItem ? Math.max(0, product.quantity - cartItem.quantity) : product.quantity;
  };

  return (
    <article>
      <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Search Bar - Always visible for quick product filtering */}
        <Box component="section" sx={{ display: 'flex', gap: 2, marginBottom: 3, width: '100%', maxWidth: '800px' }}>
          <TextField
            fullWidth
            label="Search products"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch} 
            sx={{ whiteSpace: 'nowrap' }}
          >
            Search
          </Button>
        </Box>

        {/* Error Message - Only shown when errors occur */}
        {error && (
          <Paper 
            elevation={0} 
            sx={{ 
              width: '100%', 
              maxWidth: '800px', 
              mb: 3, 
              p: 2, 
              border: '1px solid #f1f1f1',
              backgroundColor: '#FFEBEE' 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ErrorOutlineIcon color="error" />
              <Typography variant="body1" color="error">{error}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                startIcon={<RefreshIcon />} 
                onClick={fetchProducts}
                variant="outlined" 
                color="error"
              >
                Try Again
              </Button>
            </Box>
          </Paper>
        )}

        {/* Product Table - Core data display */}
        {products.length > 0 && (
          <Box component="section" sx={{ width: '100%', maxWidth: '800px', overflowX: 'auto', marginBottom: 3 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Unit Price</th>
                  <th>Available</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const availableQuantity = getAvailableQuantity(product);
                  return (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>${product.unitPrice}</td>
                      <td>{availableQuantity}</td>
                      <td>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => onAddToCart({...product, quantity: product.quantity})}
                          disabled={availableQuantity <= 0}
                        >
                          Order
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        )}

        {/* No Products Message - Empty state handling */}
        {!error && products.length === 0 && (
          <Alert severity="info" sx={{ width: '100%', maxWidth: '800px', mb: 3 }}>
            No products found. Try a different search term.
          </Alert>
        )}

        {/* Pagination Controls - For navigating through results */}
        {products.length > 0 && (
          <Box component="nav" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Pagination
              count={Math.ceil(total / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </article>
  );
};

export default ProductList;