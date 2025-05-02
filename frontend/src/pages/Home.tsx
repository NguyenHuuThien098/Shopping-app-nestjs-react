import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Pagination,
  useTheme,
  useMediaQuery,
  Stack,
  Slider,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Divider,
  Badge,
  IconButton,
} from '@mui/material';
// Remove the duplicate Grid import
// import Grid from '@mui/material/Grid'; 

// Rest of your imports remain the same
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../utils/apiConfig';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './styles/Home.css';

// Update the import to use our new service
import { searchPublicProducts } from '../services/productService';

// Product interface
interface Product {
  id: number;
  Name: string;
  UnitPrice: number;
  quantity: number;
  product_code?: string | number;
  description?: string;
  imageUrl?: string;
  name?: string; // Added for compatibility
  unitPrice?: number; // Added for compatibility
}

// Home page component
const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Advanced filtering states
  const [minPrice, setMinPrice] = useState<number | ''>(0);
  const [maxPrice, setMaxPrice] = useState<number | ''>(1000);
  const [inStock, setInStock] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>('Name');
  const [orderDirection, setOrderDirection] = useState<string>('ASC');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const pageSize = 8;

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart, cartItems } = useCart();

  // Responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getAvailableQuantity = (product: Product): number => {
    const inCart = cartItems.find(item => item.id === product.id && !item.isPurchased);
    const cartQuantity = inCart ? inCart.quantity : 0;
    return Math.max(0, product.quantity - cartQuantity);
  };

  // Format product data for cart
  const formatProductForCart = (product: Product) => {
    return {
      id: product.id,
      name: product.Name,
      unitPrice: product.UnitPrice,
      quantity: 1, // Initial quantity in cart
      stockQuantity: product.quantity, // Available stock
      description: product.description,
      imageUrl: product.imageUrl,
    };
  };

  // Handle adding product to cart - Modified to require login first
  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      // Store product to add after login
      sessionStorage.setItem('pendingCartProduct', JSON.stringify(formatProductForCart(product)));
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    // User is authenticated, add to cart directly
    addToCart(formatProductForCart(product));
  };

  // Check for pending cart items after login
  useEffect(() => {
    if (isAuthenticated) {
      const pendingProduct = sessionStorage.getItem('pendingCartProduct');
      if (pendingProduct) {
        try {
          const productToAdd = JSON.parse(pendingProduct);
          addToCart(productToAdd);
          // Clear the pending product from storage
          sessionStorage.removeItem('pendingCartProduct');
        } catch (error) {
          console.error('Error adding pending product to cart:', error);
        }
      }
    }
  }, [isAuthenticated, addToCart]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use the public search API instead of direct axios calls
      const response = await searchPublicProducts(
        searchText.trim(), // Search query
        page, // Page number
        pageSize // Items per page
      );

      console.log('API Response:', response); // Debug response

      // Handle the response format - ensure type compatibility
      if (response && response.data) {
        const productData = response.data;
        setProducts(productData as Product[]);
        const total = response.total || 0;
        setTotalPages(Math.ceil(total / pageSize) || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
        console.error('Unexpected API response format:', response);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(`Không thể tải dữ liệu sản phẩm: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchText]);

  // Load products when component mounts or dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, page]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    fetchProducts(); // This will trigger the API call with the current searchText
  };

  // Handle search text change - implement real-time search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchText = e.target.value;
    setSearchText(newSearchText);

    // Reset to first page when search changes
    if (newSearchText !== searchText) {
      setPage(1);
    }
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter toggle
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  

  return (
    <div className="home-page">
      {/* Hero section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          {/* Authentication buttons */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            py: 1
          }}>
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  color="primary"
                  startIcon={<AccountCircleIcon />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'white' }
                  }}
                >
                  {user?.fullName || 'Tài khoản'}
                </Button>

                {/* Cart button - Only shown when authenticated */}
                <IconButton
                  component={Link}
                  to="/dashboard"
                  color="inherit"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&:hover': { bgcolor: 'white' }
                  }}
                >
                  <Badge badgeContent={cartItems.filter(item => !item.isPurchased).length} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Box>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'white' }
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    bgcolor: 'transparent',
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderColor: 'white'
                    }
                  }}
                >
                  Đăng ký
                </Button>
              </Stack>
            )}
          </Box>

          <Box className="hero-content">
            <Typography variant="h3" component="h1" className="hero-title">
              SHOP APP
            </Typography>
            <Typography variant="h6" className="hero-subtitle">
              Tìm kiếm và đặt hàng các sản phẩm
            </Typography>

            {/* Search form */}
            <Box
              component="form"
              onSubmit={handleSearch}
              className="search-form"
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchText}
                onChange={handleSearchChange} // Changed to use the new handler
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                className="search-button"
              >
                Tìm kiếm
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Products section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
            {searchText ? `Kết quả tìm kiếm: "${searchText}"` : 'Sản phẩm nổi bật'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {loading ? 'Đang tìm kiếm sản phẩm...' :
              error ? 'Đã xảy ra lỗi khi tải sản phẩm' :
                products.length === 0 ? 'Không tìm thấy sản phẩm' :
                  `Hiển thị ${products.length} sản phẩm`
            }
          </Typography>
        </Box>

        {/* Error display */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={fetchProducts}
                startIcon={<RefreshIcon />}
              >
                Thử lại
              </Button>
            }
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Loading state */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Advanced filters */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={handleToggleFilters}
                endIcon={showFilters ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              >
                Bộ lọc nâng cao
              </Button>
              <Collapse in={showFilters}>
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Typography gutterBottom>Khoảng giá</Typography>
                      <Slider
                        value={[minPrice === '' ? 0 : minPrice, maxPrice === '' ? 100000 : maxPrice]}
                        onChange={(e, newValue) => {
                          const [newMin, newMax] = newValue as number[];
                          setMinPrice(newMin);
                          setMaxPrice(newMax);
                        }}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
                      />
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={inStock}
                          onChange={(e) => setInStock(e.target.checked)}
                        />
                      }
                      label="Chỉ hiển thị sản phẩm còn hàng"
                    />
                    <FormControl fullWidth>
                      <InputLabel>Sort By</InputLabel>
                      <Select
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                      >
                        <MenuItem value="Name">Tên sản phẩm</MenuItem>
                        <MenuItem value="UnitPrice">Giá</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Order Direction</InputLabel>
                      <Select
                        value={orderDirection}
                        onChange={(e) => setOrderDirection(e.target.value)}
                      >
                        <MenuItem value="ASC">Tăng dần</MenuItem>
                        <MenuItem value="DESC">Giảm dần</MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setPage(1); // Reset to first page
                        fetchProducts();
                      }}
                    >
                      Áp dụng bộ lọc
                    </Button>
                  </Stack>
                </Box>
              </Collapse>
            </Box>

            {/* Products grid - REPLACED with MUI Grid */}
            {products.length > 0 ? (
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'flex-start'
              }}>
                {products.map((product) => {
                  // Tính số lượng còn lại của quantity
                  const availableQuantity = getAvailableQuantity(product);

                  return (
                    <Box
                      key={product.id}
                      sx={{
                        width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 18px)' },
                        display: 'flex',
                        mb: 2
                      }}
                    >
                      <Card className="product-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {/* Product image */}
                        {/* ... */}

                        {/* Product details */}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="div" className="product-title">
                            {product.Name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" className="product-description">
                            {product.description || 'No description available'}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                              ${product.UnitPrice}
                            </Typography>
                            <Typography variant="body2" color={availableQuantity > 0 ? 'success.main' : 'error.main'}>
                              {availableQuantity > 0 ? `In stock: ${availableQuantity}` : 'Out of stock'}
                            </Typography>
                          </Box>
                        </CardContent>

                        {/* Actions */}
                        <CardActions>
                          <Button
                            variant="contained"
                            startIcon={<AddShoppingCartIcon />}
                            fullWidth
                            onClick={() => handleAddToCart(product)}
                            disabled={availableQuantity <= 0}
                            color={isAuthenticated ? "primary" : "secondary"}
                          >
                            {availableQuantity <= 0 ? 'Hết hàng' :
                              isAuthenticated ? 'Thêm vào giỏ hàng' : 'Đăng nhập để mua hàng'}
                          </Button>
                        </CardActions>
                      </Card>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              // No products found
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6">
                    {searchText ? `No products found for "${searchText}"` : 'No products available'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Try adjusting your search criteria or check back later.
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Home;