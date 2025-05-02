import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';

/**
 * Logo component for the application
 * Displayed in the top-left corner of the header
 */
const Logo: React.FC = () => {
  return (
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        color: 'primary.main',
      }}>
        <StorefrontIcon sx={{ mr: 1, fontSize: { xs: 28, md: 32 } }} />
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            letterSpacing: '.1rem',
            color: 'inherit',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          MYSHOP
        </Typography>
      </Box>
    </Link>
  );
};

export default Logo;