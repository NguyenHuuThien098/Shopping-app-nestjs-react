import React, { useState, useEffect } from 'react';
import { Typography, Button, Snackbar, Alert, Paper, Avatar, Divider, Stack, Badge, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { useCart } from '../contexts/CartContext';
import { placeOrder, OrderRequest } from '../services/orderService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';

/**
 * Trang Giỏ Hàng
 * 
 * Hiển thị danh sách sản phẩm đã thêm vào giỏ hàng và cho phép người dùng:
 * - Điều chỉnh số lượng sản phẩm
 * - Xóa sản phẩm khỏi giỏ
 * - Thanh toán đơn hàng với nhiều phương thức khác nhau
 * - Thiết kế responsive trên cả thiết bị di động và desktop
 */
const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, markAsPurchased } = useCart();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  const [showStickyTotal, setShowStickyTotal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lọc ra những sản phẩm chưa được mua
  const unpurchasedItems = cartItems.filter(item => !item.isPurchased);

  /**
   * Tính tổng tiền của các sản phẩm trong giỏ hàng
   * @returns Tổng giá trị đơn hàng
   */
  const calculateTotal = () => {
    return unpurchasedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  /**
   * Tính tổng số lượng sản phẩm trong giỏ hàng
   * @returns Tổng số sản phẩm
   */
  const calculateTotalItems = () => {
    return unpurchasedItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  /**
   * Hiển thị tổng tiền cố định khi người dùng cuộn trang
   * Tích hợp hiệu ứng xuất hiện và biến mất dựa vào vị trí cuộn
   */
  useEffect(() => {
    setShowStickyTotal(false);
    
    const handleScroll = () => {
      setShowStickyTotal(window.scrollY > 150);
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /**
   * Quản lý hộp thoại xác nhận thanh toán
   */
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    navigate('/dashboard');
  };

  /**
   * Xử lý quy trình đặt hàng
   * - Tạo đối tượng đơn hàng từ dữ liệu giỏ hàng
   * - Gọi API để lưu đơn hàng
   * - Cập nhật trạng thái đã mua cho sản phẩm
   * - Hiển thị thông báo thành công
   */
  const handleBuy = async () => {
    try {
      setIsSubmitting(true);
      
      // Create order request using the structure expected by the API
      const orderData: OrderRequest = {
        orderDetails: unpurchasedItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.unitPrice // Ensure price is always included
        }))
      };

      // Call the placeOrder service function
      await placeOrder(orderData);
      
      // Mark items as purchased in the local cart
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

  // Chuyển hướng người dùng về trang sản phẩm
  const goToDashboard = () => navigate('/dashboard');

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      {/* Thanh header cố định - hiển thị tổng quan giỏ hàng */}
      <Box sx={{ 
        position: 'sticky',
        top: 0,
        bgcolor: 'background.paper',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        zIndex: 10,
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: { xs: 2, sm: 3 },
        py: 2,
        mb: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Badge badgeContent={calculateTotalItems()} color="primary" sx={{ mr: 2 }}>
              <ShoppingBasketIcon color="action" />
            </Badge>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Giỏ hàng của bạn
            </Typography>
          </Box>
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center"
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-end', sm: 'flex-start' },
              mt: { xs: 1, sm: 0 }
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ${calculateTotal().toFixed(2)}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={handleOpenDialog}
              sx={{ fontWeight: 'bold' }}
            >
              Thanh toán
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ padding: { xs: 1, sm: 2, md: 3 }, pt: 0 }}>
        {/* Trạng thái giỏ hàng trống */}
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
              onClick={goToDashboard}
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Mua sắm ngay
            </Button>
          </Paper>
        )}

        {/* Danh sách sản phẩm trong giỏ hàng */}
        {unpurchasedItems.length > 0 && (
          <>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Sản phẩm trong giỏ hàng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unpurchasedItems.length} {unpurchasedItems.length === 1 ? 'sản phẩm' : 'sản phẩm'}
              </Typography>
            </Box>

            {/* Vùng cuộn danh sách sản phẩm */}
            <Box sx={{ pb: { xs: 12, sm: 16 } }}> 
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
                  {/* Thông tin sản phẩm */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: { xs: 1.5, sm: 2 },
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: { xs: 1, sm: 0 }
                  }}>
                    {/* Hiển thị hình ảnh sản phẩm hoặc avatar chữ cái đầu */}
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

                    {/* Chi tiết sản phẩm - tên, giá, mô tả */}
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

                  {/* Phần điều khiển số lượng và xóa sản phẩm */}
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

                    {/* Điều chỉnh số lượng sản phẩm */}
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
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        color="primary"
                      >
                        <AddIcon fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
            
            {/* Thanh tổng tiền cố định - hiển thị khi cuộn */}
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: '#1890ff',
                color: 'white',
                width: '100%',
                transition: 'transform 0.3s ease',
                transform: showStickyTotal ? 'translateY(0)' : 'translateY(100%)',
                boxShadow: '0px -4px 10px rgba(0,0,0,0.15)',
                maxWidth: { sm: `calc(100% - ${240}px)` },
                marginLeft: { sm: '240px' },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'stretch', sm: 'center' },
                  padding: { xs: 1.5, sm: 2 },
                  maxWidth: 1200,
                  mx: 'auto',
                  gap: { xs: 1, sm: 2 }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'space-between', sm: 'flex-start' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingBagIcon sx={{ mr: 1, color: 'white', fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                    <Typography sx={{ 
                      fontWeight: 'bold', 
                      color: 'white',
                      fontSize: { xs: '0.8rem', sm: '1rem' }
                    }}>
                      Tổng cộng ({calculateTotalItems()} sản phẩm):
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: 'white', 
                      ml: 2,
                      fontSize: { xs: '1rem', sm: '1.25rem' } 
                    }}
                  >
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth={isMobile}
                  onClick={handleOpenDialog}
                  sx={{
                    py: { xs: 0.75, sm: 1.2 },
                    px: { xs: 2, sm: 4 },
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    color: '#1890ff',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                    textTransform: 'uppercase',
                    fontSize: { xs: '0.75rem', sm: '0.9rem' },
                    letterSpacing: '1px',
                  }}
                >
                  THANH TOÁN
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Hộp thoại xác nhận thanh toán */}
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

      {/* Hộp thoại thông báo đặt hàng thành công */}
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

      {/* Thông báo snackbar cho lỗi */}
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

export default CartPage;