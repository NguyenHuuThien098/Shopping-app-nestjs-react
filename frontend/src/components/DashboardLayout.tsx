import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../contexts/CartContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Chiều rộng của ngăn điều hướng (px)
 * Được sử dụng để tính khoảng cách cho phần nội dung chính
 */
const drawerWidth = 240;

/**
 * Component bố cục chính cho toàn bộ ứng dụng
 * 
 * Cung cấp:
 * - Thanh điều hướng bên có thể thu gọn trên thiết bị di động
 * - Hiển thị số lượng sản phẩm trong giỏ hàng
 * - Layout responsive cho cả di động và desktop
 * - Điều hướng giữa các trang chính
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // Quản lý trạng thái mở/đóng drawer trên thiết bị di động
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  
  // Đếm số lượng sản phẩm chưa mua cho badge
  const cartItemCount = cartItems.filter(item => !item.isPurchased).length;

  /**
   * Chuyển đổi trạng thái đóng/mở của drawer trên di động
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /**
   * Cấu hình các mục trong menu điều hướng
   * Mỗi mục định nghĩa văn bản hiển thị, biểu tượng và đường dẫn
   */
  const menuItems = [
    {
      text: 'Trang chủ',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Giỏ hàng',
      icon: (
        <Badge badgeContent={cartItemCount} color="error">
          <ShoppingCartIcon />
        </Badge>
      ),
      path: '/cart',
    },
  ];

  /**
   * Nội dung ngăn drawer được dùng chung cho cả mobile và desktop
   */
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Shop App
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Thanh header - dịch sang phải trên desktop để nhường chỗ cho drawer cố định */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Hệ thống quản lý sản phẩm
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/cart')}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Drawer cho thiết bị di động - tạm thời, đóng khi chọn mục */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Tối ưu hiệu suất mở trên thiết bị di động
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer cho desktop - cố định, luôn hiển thị */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Vùng nội dung chính - điều chỉnh chiều rộng dựa trên trạng thái drawer */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;