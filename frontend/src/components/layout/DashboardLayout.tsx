import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

/**
 * Dashboard layout for authenticated pages
 * Similar to MainLayout but might include different styling or components
 * specifically for authenticated users (e.g., dashboard sidebar)
 */
const DashboardLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: (theme) => theme.palette.background.default
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          <Outlet />
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default DashboardLayout;