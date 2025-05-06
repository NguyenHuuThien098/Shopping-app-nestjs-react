import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

/**
 * PrivateRoute component that protects routes requiring authentication
 * Redirects to login if user is not authenticated
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  
  // If authentication is still loading, show a loading spinner
  // if (loading) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check role-based permissions if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = user && allowedRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page if user doesn't have required role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and authorized, render the child routes
  return <Outlet />;
};

export default PrivateRoute;