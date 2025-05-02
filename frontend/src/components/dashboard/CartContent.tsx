import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Avatar, 
  Divider, 
  useMediaQuery,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { placeOrder } from '../../services/orderService';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const CartContent: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, markAsPurchased } = useCart();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Filter unpurchased items
  const unpurchasedItems = cartItems.filter(item => !item.isPurchased);

  // Calculate total price
  const calculateTotal = () => {
    return unpurchasedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  // Calculate total items
  const calculateTotalItems = () => {
    return unpurchasedItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Dialog handlers
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  // Buy/checkout handler
  const handleBuy = async () => {
    try {
      setIsSubmitting(true);

      // Ensure user is authenticated
      if (!user) {
        setSnackbarMessage('Bạn cần đăng nhập để đặt hàng.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      
      const orderData = {
        orderDetails: unpurchasedItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.unitPrice // Add the required price property
        })),
      };

      await placeOrder(orderData);
      markAsPurchased(unpurchasedItems.map(item => item.id));
      handleCloseDialog();
      
      // Show success dialog
      setOpenSuccessDialog(true);
    } catch (error: any) {
      console.error('Lỗi khi đặt hàng:', error);
      setSnackbarMessage(error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go to shop/home
  const goShopping = () => {
    navigate('/');
  };

  return (
    <Box>
      {/* Cart Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Giỏ hàng của bạn
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {unpurchasedItems.length === 0 
            ? 'Giỏ hàng của bạn đang trống.' 
            : `Bạn có ${calculateTotalItems()} sản phẩm trong giỏ hàng.`}
        </Typography>
      </Box>

      {/* Empty cart state */}
      {unpurchasedItems.length === 0 && (
        <Paper elevation={2} sx={{ py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 3 }, textAlign: 'center', borderRadius: 3 }}>
          <ShoppingCartIcon sx={{ fontSize: { xs: 60, sm: 80 }, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Giỏ hàng trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
          </Typography>
          <Button
            variant="contained"
            onClick={goShopping}
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Mua sắm ngay
          </Button>
        </Paper>
      )}

      {/* Cart items list */}
      {unpurchasedItems.length > 0 && (
        <>
          <Box sx={{ mb: 3 }}>
            {unpurchasedItems.map((item) => (
              <Paper
                key={item.id}
                elevation={1}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                {/* Product info */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: { xs: 1.5, sm: 2 },
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 1, sm: 0 }
                }}>
                  {/* Product image */}
                  {item.imageUrl ? (
                    <Avatar
                      src={item.imageUrl}
                      alt={item.name}
                      variant="rounded"
                      sx={{ 
                        width: { xs: 50, sm: 60 }, 
                        height: { xs: 50, sm: 60 }, 
                        mr: { xs: 1, sm: 2 },
                        flexShrink: 0
                      }}
                    />
                  ) : (
                    <Avatar
                      variant="rounded"
                      sx={{ 
                        width: { xs: 50, sm: 60 }, 
                        height: { xs: 50, sm: 60 }, 
                        mr: { xs: 1, sm: 2 },
                        bgcolor: 'primary.main',
                        flexShrink: 0
                      }}
                    >
                      {item.name.charAt(0)}
                    </Avatar>
                  )}

                  {/* Product details */}
                  <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      mt: { xs: 1, sm: 0 }
                    }}>
                      {item.name}
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mt: 1 
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        ${item.unitPrice} x {item.quantity}
                      </Typography>
                      <Typography 
                        variant="subtitle2" 
                        color="primary.main" 
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' } 
                        }}
                      >
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>

                    {item.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider />

                {/* Quantity controls and delete button */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'background.default',
                  p: { xs: 0.75, sm: 1 }
                }}>
                  <IconButton
                    color="error"
                    onClick={() => removeFromCart(item.id)}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.04)'
                      }
                    }}
                  >
                    <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>

                  {/* Quantity controls */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <IconButton
                      size={isMobile ? "small" : "medium"}
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, item.quantity - 1);
                        } else {
                          removeFromCart(item.id);
                        }
                      }}
                      color="primary"
                    >
                      <RemoveIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                    <Typography sx={{ 
                      mx: { xs: 1, sm: 2 }, 
                      fontWeight: 'bold', 
                      minWidth: '24px', 
                      textAlign: 'center',
                      fontSize: { xs: '0.8rem', sm: '1rem' }
                    }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size={isMobile ? "small" : "medium"}
                      onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.stockQuantity))}
                      color="primary"
                      disabled={item.quantity >= item.stockQuantity}
                    >
                      <AddIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Order summary and checkout button */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              bgcolor: '#f9f9f9',
              mt: 3
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tổng quan đơn hàng
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tổng số sản phẩm:</Typography>
                <Typography variant="body1" fontWeight={500}>{calculateTotalItems()}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tạm tính:</Typography>
                <Typography variant="body1" fontWeight={500}>${calculateTotal().toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={700}>Tổng thanh toán:</Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">${calculateTotal().toFixed(2)}</Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<ShoppingBagIcon />}
              onClick={handleOpenDialog}
              sx={{ 
                mt: 2, 
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              Thanh toán ngay
            </Button>
          </Paper>
        </>
      )}

      {/* Confirmation dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullScreen={isMobile}
      >
        <DialogTitle>Xác nhận thanh toán</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có muốn tiếp tục thanh toán cho {calculateTotalItems()} sản phẩm với tổng giá trị ${calculateTotal().toFixed(2)} không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button 
            onClick={handleBuy} 
            variant="contained" 
            color="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success dialog */}
      <Dialog
        open={openSuccessDialog}
        onClose={handleCloseSuccessDialog}
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>Đặt hàng thành công</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          <DialogContentText>
            Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </DialogContentText>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Bạn có thể theo dõi trạng thái đơn hàng trong phần lịch sử đơn hàng.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleCloseSuccessDialog} 
            variant="contained" 
            color="primary"
          >
            Tiếp tục mua sắm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ 
          vertical: isMobile ? 'top' : 'bottom', 
          horizontal: 'right' 
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartContent;