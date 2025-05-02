import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  ShoppingCart,
  Login,
  PersonAdd,
  Logout,
  Dashboard,
  Person,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './styles/Header.css';

/**
 * Header component that displays the navigation bar
 * Shows different options based on authentication status
 */
const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // User menu state
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // Toggle mobile menu
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle opening user menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  // Handle closing user menu
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Handle logout
  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" className="header">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo - visible on all screen sizes */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            MyShop
          </Typography>

          {/* Mobile menu toggle button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMobileMenuToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop navigation links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/products"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Products
            </Button>
            {isAuthenticated && (
              <Button
                component={RouterLink}
                to="/dashboard"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Dashboard
              </Button>
            )}
          </Box>

          {/* Cart button */}
          <Box sx={{ display: 'flex', mr: 2 }}>
            <IconButton
              size="large"
              aria-label="show cart items"
              color="inherit"
              component={RouterLink}
              to="/cart"
            >
              <Badge badgeContent={getCartItemCount()} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>

          {/* User menu or login buttons */}
          <Box sx={{ flexShrink: 0 }}>
            {isAuthenticated ? (
              <>
                {/* Authenticated user menu */}
                <Tooltip title="Open user menu">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem 
                    component={RouterLink} 
                    to="/dashboard"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  
                  <MenuItem 
                    component={RouterLink}
                    to="/profile" 
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  
                  <MenuItem 
                    component={RouterLink}
                    to="/settings"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Settings</Typography>
                  </MenuItem>
                  
                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              /* Guest buttons */
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button
                  startIcon={<Login />}
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PersonAdd />}
                  component={RouterLink}
                  to="/register"
                  sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)' }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile drawer menu */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleMobileMenuToggle}
        >
          <List>
            <ListItem>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                MyShop
              </Typography>
            </ListItem>
            
            <Divider />
            
            <ListItemButton component={RouterLink} to="/">
              <ListItemText primary="Home" />
            </ListItemButton>
            
            <ListItemButton component={RouterLink} to="/products">
              <ListItemText primary="Products" />
            </ListItemButton>
            
            {isAuthenticated && (
              <ListItemButton component={RouterLink} to="/dashboard">
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            )}
            
            <ListItemButton component={RouterLink} to="/cart">
              <ListItemIcon>
                <Badge badgeContent={getCartItemCount()} color="error">
                  <ShoppingCart />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Cart" />
            </ListItemButton>
            
            <Divider />
            
            {!isAuthenticated ? (
              /* Guest mobile nav */
              <>
                <ListItemButton component={RouterLink} to="/login">
                  <ListItemIcon>
                    <Login />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
                
                <ListItemButton component={RouterLink} to="/register">
                  <ListItemIcon>
                    <PersonAdd />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </>
            ) : (
              /* Authenticated mobile nav */
              <>
                <ListItemButton component={RouterLink} to="/profile">
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                
                <ListItemButton component={RouterLink} to="/settings">
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
                
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;