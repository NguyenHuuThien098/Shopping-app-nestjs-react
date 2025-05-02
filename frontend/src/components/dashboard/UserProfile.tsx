import React from 'react';
import { Typography, Box, Paper, Avatar, Divider, TextField, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import PersonIcon from '@mui/icons-material/Person';

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Thông tin cá nhân
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Xem và cập nhật thông tin tài khoản của bạn
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mr: 2
            }}
          >
            {user?.fullName?.charAt(0) || <PersonIcon fontSize="large" />}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user?.fullName || 'Người dùng'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email || 'email@example.com'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box component="form">
          {/* Form fields using flexbox instead of Grid */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Họ và tên"
                variant="outlined"
                defaultValue={user?.fullName || ''}
                margin="normal"
              />
            </Box>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                defaultValue={user?.email || ''}
                margin="normal"
                disabled
              />
            </Box>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                variant="outlined"
                defaultValue={user?.username || ''}
                margin="normal"
                disabled
              />
            </Box>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Số điện thoại"
                variant="outlined"
                defaultValue=""
                margin="normal"
              />
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField
                fullWidth
                label="Địa chỉ"
                variant="outlined"
                defaultValue=""
                margin="normal"
                multiline
                rows={3}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ minWidth: 120 }}
            >
              Cập nhật
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;