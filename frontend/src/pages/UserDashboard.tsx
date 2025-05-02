import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Divider,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import CartContent from '../components/dashboard/CartContent';
import UserProfile from '../components/dashboard/UserProfile';
import OrderHistory from '../components/dashboard/OrderHistory';

// Define Tab Panel props interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TabPanel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// UserDashboard component
const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle navigation to home page
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      pt: { xs: 2, sm: 3 },
      pb: { xs: 8, sm: 6 }
    }}>
      <Container maxWidth="lg">
        {/* Dashboard Header */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: { xs: 2, sm: 3 }, 
            borderRadius: 2,
            backgroundColor: '#fff'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                Tài khoản của tôi
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Xin chào, {user?.fullName || 'Khách hàng'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                Trang chủ
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Dashboard Content with Tabs */}
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              centered={!isMobile}
              scrollButtons={isMobile ? "auto" : false}
            >
              <Tab 
                icon={<ShoppingCartIcon />} 
                iconPosition="start" 
                label={isMobile ? "" : "Giỏ hàng"} 
                aria-label="Giỏ hàng"
              />
              <Tab 
                icon={<PersonIcon />} 
                iconPosition="start" 
                label={isMobile ? "" : "Thông tin cá nhân"} 
                aria-label="Thông tin cá nhân"
              />
              <Tab 
                icon={<HistoryIcon />} 
                iconPosition="start" 
                label={isMobile ? "" : "Lịch sử đơn hàng"} 
                aria-label="Lịch sử đơn hàng"
              />
            </Tabs>
          </Box>

          {/* Tab Contents */}
          <TabPanel value={activeTab} index={0}>
            <CartContent />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <UserProfile />
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <OrderHistory />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserDashboard;