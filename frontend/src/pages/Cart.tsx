import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../utils/apiConfig';
import './styles/Cart.css';

/**
 * Cart page component
 * Displays current cart items and allows quantity adjustment and checkout
 */
const Cart: React.FC = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  // Handle quantity change for an item
  const handleQuantityChange = (id: number, newQuantity: number, stockQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > stockQuantity) newQuantity = stockQuantity;
    
    updateCartItemQuantity(id, newQuantity);
  };

  // Handle item removal
  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  // Open checkout confirmation dialog
  const handleOpenCheckoutDialog = () => {
    setOpenConfirmDialog(true);
  };
  
  // Close checkout confirmation dialog
  const handleCloseCheckoutDialog = () => {
    setOpenConfirmDialog(false);
  };

  // Process order checkout
  const handleCheckout = async () => {
    setOrderProcessing(true);
    setOrderError(null);
    setOpenConfirmDialog(false);
    
    try {
      // Prepare order data
      const orderData = {
        orderDetails: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.unitPrice // Ensure price is always included
        })),
        shippingAddress: {
          // In a real app, you'd collect this info or use user's default
          address: "123 Main St",
          city: "Anytown",
          state: "State",
          postalCode: "12345",
          country: "Country"
        }
      };
      
      // Send order to API
      const response = await axios.post(
        getApiUrl(API_ENDPOINTS.ORDERS),
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Handle successful order
      setOrderSuccess(true);
      clearCart(); // Clear cart after successful order
      
      // Redirect to order confirmation after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error: any) {
      console.error('Error processing order:', error);
      setOrderError(error.response?.data?.message || 'Failed to process order. Please try again.');
    } finally {
      setOrderProcessing(false);
    }
  };

  // Empty cart message
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" className="cart-page">
        <Box className="cart-empty-container">
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button 
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Browse Products
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="cart-page">
      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Your Cart
      </Typography>
      
      {/* Order success message */}
      {orderSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Your order has been placed successfully! Redirecting to dashboard...
        </Alert>
      )}
      
      {/* Order error message */}
      {orderError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {orderError}
        </Alert>
      )}
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        {/* Cart items list */}
        <Box sx={{ flex: 2 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.imageUrl && (
                          <Box 
                            component="img"
                            src={item.imageUrl}
                            alt={item.name}
                            sx={{ 
                              width: 60, 
                              height: 60, 
                              mr: 2, 
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                          />
                        )}
                        <Typography variant="body1">{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stockQuantity)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          variant="outlined"
                          size="small"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            handleQuantityChange(item.id, value, item.stockQuantity);
                          }}
                          inputProps={{
                            min: 1,
                            max: item.stockQuantity,
                            style: { textAlign: 'center', width: '40px' }
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stockQuantity)}
                          disabled={item.quantity >= item.stockQuantity}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        
        {/* Order summary */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Tax (10%):</Typography>
                  <Typography variant="body1">${tax.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Shipping:</Typography>
                  <Typography variant="body1">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">${total.toFixed(2)}</Typography>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleOpenCheckoutDialog}
                disabled={orderProcessing}
              >
                {orderProcessing ? 'Processing...' : 'Checkout'}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Stack>
      
      {/* Checkout confirmation dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseCheckoutDialog}>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to place this order for ${total.toFixed(2)}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckoutDialog}>Cancel</Button>
          <Button onClick={handleCheckout} variant="contained" color="primary">
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;