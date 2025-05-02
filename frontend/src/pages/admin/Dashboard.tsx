import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Stack,
  Card, 
  CardContent, 
  Divider, 
  List, 
  ListItem,
  ListItemText, 
  CircularProgress,
  Paper,
  Chip,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../../utils/apiConfig';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import '../styles/Dashboard.css';

// Order interface
interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items?: {
    id: number;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

/**
 * Dashboard page component
 * Displays user information and recent orders
 */
const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token || !user?.id) {
          setLoading(false);
          return;
        }
        
        console.log("Fetching orders with token:", token?.substring(0, 15) + "...");
        
        // Replace the customerId parameter in the endpoint
        const ordersEndpoint = API_ENDPOINTS.CUSTOMER.GETORDERS.replace(':customerId', user.id.toString());
        
        const response = await axios.get(
          `${API_BASE_URL}${ordersEndpoint}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        console.log("Orders response:", response.data);
        setOrders(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [token, user?.id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status color for order chips
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" className="dashboard-page">
      {/* Welcome message */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.fullName || 'Customer'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your account and recent orders.
        </Typography>
      </Box>
      
      {/* Error message if any */}
      {error && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: 'error.light', 
            color: 'error.contrastText' 
          }}
        >
          {error}
        </Paper>
      )}
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        {/* Customer info card */}
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Card className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h6">Account Information</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <List dense disablePadding>
                <ListItem disableGutters>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={user?.fullName || 'N/A'} 
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemText 
                    primary="Email" 
                    secondary={user?.email || 'N/A'} 
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemText 
                    primary="Username" 
                    secondary={user?.username || 'N/A'} 
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemText 
                    primary="Account Type" 
                    secondary={user?.role || 'Customer'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
        
        {/* Orders and shipping section */}
        <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
          {/* Recent orders card */}
          <Card className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingBagIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h6">Recent Orders</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {orders.length === 0 ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    You haven't placed any orders yet.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/')}
                    sx={{ mt: 1 }}
                  >
                    Browse Products
                  </Button>
                </Box>
              ) : (
                <List>
                  {orders.slice(0, 5).map((order) => (
                    <React.Fragment key={order.id}>
                      <ListItem 
                        alignItems="flex-start" 
                        sx={{ px: 0 }}
                        secondaryAction={
                          <Chip 
                            label={order.status} 
                            color={getStatusColor(order.status) as any}
                            size="small"
                          />
                        }
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography component="span">
                                Order #{order.id}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                ${order.totalAmount.toFixed(2)}
                              </Typography>
                              {" • "}
                              {formatDate(order.orderDate)}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
              
              {orders.length > 0 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button variant="outlined" size="small">
                    View All Orders
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* Shipping information card */}
          <Card className="dashboard-card" sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h6">Shipping Information</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                Add your shipping addresses to make checkout faster.
              </Typography>
              
              <Button variant="outlined" sx={{ mt: 2 }}>
                Manage Addresses
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Container>
  );
};

export default Dashboard;