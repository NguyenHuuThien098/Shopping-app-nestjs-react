import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// import CircularProgress from '@mui/material/CircularProgress';
// import Box from '@mui/material/Box';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

/**
 * PrivateRoute component that protects routes requiring authentication
 * or specific user roles
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // Show loading state while checking authentication
  // if (loading) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = user && allowedRoles.includes(user.role);
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If authenticated and authorized, render the protected content
  return <Outlet />;
};

export default PrivateRoute;