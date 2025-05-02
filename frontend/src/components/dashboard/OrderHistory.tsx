import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Mock data for order history
// In production, this would come from an API call
const orderHistory = [
  {
    id: '1',
    date: '2025-04-20',
    status: 'Đã giao hàng',
    total: 125.95,
    items: 3,
    paymentMethod: 'COD',
    products: [
      { name: 'Sản phẩm A', quantity: 1, price: 45.99 },
      { name: 'Sản phẩm B', quantity: 2, price: 39.98 }
    ]
  },
  {
    id: '2',
    date: '2025-04-15',
    status: 'Đang giao hàng',
    total: 89.99,
    items: 1,
    paymentMethod: 'Online',
    products: [
      { name: 'Sản phẩm C', quantity: 1, price: 89.99 }
    ]
  },
  {
    id: '3',
    date: '2025-04-10',
    status: 'Đã hủy',
    total: 55.50,
    items: 2,
    paymentMethod: 'COD',
    products: [
      { name: 'Sản phẩm D', quantity: 1, price: 30.50 },
      { name: 'Sản phẩm E', quantity: 1, price: 25.00 }
    ]
  }
];

// Get color for status chip
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Đã giao hàng':
      return 'success';
    case 'Đang giao hàng':
      return 'info';
    case 'Đang xử lý':
      return 'warning';
    case 'Đã hủy':
      return 'error';
    default:
      return 'default';
  }
};

const OrderHistory: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Render mobile view with accordions
  const renderMobileView = () => (
    <Box>
      {orderHistory.map((order) => (
        <Accordion key={order.id} sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`order-${order.id}-content`}
            id={`order-${order.id}-header`}
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {order.id}
                </Typography>
                <Chip 
                  label={order.status} 
                  size="small" 
                  color={getStatusColor(order.status) as any} 
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {new Date(order.date).toLocaleDateString('vi-VN')}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Tổng tiền:</Typography>
                <Typography variant="body1" fontWeight={500}>${order.total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Số lượng:</Typography>
                <Typography variant="body2">{order.items} sản phẩm</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Thanh toán:</Typography>
                <Typography variant="body2">{order.paymentMethod}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Các sản phẩm:</Typography>
            
            {order.products.map((product, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  {product.name} x {product.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${product.price.toFixed(2)}
                </Typography>
                {idx < order.products.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
            
            <Button 
              variant="outlined" 
              fullWidth 
              size="small" 
              sx={{ mt: 2 }}
              startIcon={<VisibilityIcon />}
            >
              Xem chi tiết
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  // Render desktop view with table
  const renderDesktopView = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table aria-label="order history table">
        <TableHead>
          <TableRow sx={{ bgcolor: 'background.default' }}>
            <TableCell>Mã đơn hàng</TableCell>
            <TableCell>Ngày đặt</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Tổng tiền</TableCell>
            <TableCell>Số lượng</TableCell>
            <TableCell>Thanh toán</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderHistory.map((order) => (
            <TableRow
              key={order.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{order.id}</TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>
                <Chip 
                  label={order.status} 
                  size="small" 
                  color={getStatusColor(order.status) as any} 
                />
              </TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>{order.items} sản phẩm</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell align="right">
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<VisibilityIcon />}
                >
                  Chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Lịch sử đơn hàng
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Theo dõi và quản lý các đơn hàng của bạn
        </Typography>
      </Box>

      {/* Render different views based on screen size */}
      {isMobile ? renderMobileView() : renderDesktopView()}
    </Box>
  );
};

export default OrderHistory;