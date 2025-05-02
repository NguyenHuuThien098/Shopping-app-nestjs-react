import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './ProfileMenu.css';

const ProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="profile-menu" ref={menuRef}>
      <button className="profile-button" onClick={toggleMenu}>
        <div className="profile-avatar-icon">
          <AccountCircleIcon sx={{ fontSize: 40, color: '#4a6cf7' }} />
        </div>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-info">
              <h3 className="profile-name">{user.fullName}</h3>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>
          <div className="profile-menu-items">
            <Link to="/profile" className="profile-menu-item" onClick={() => setIsOpen(false)}>
              My Profile
            </Link>
            <Link to="/orders" className="profile-menu-item" onClick={() => setIsOpen(false)}>
              My Orders
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="profile-menu-item" onClick={() => setIsOpen(false)}>
                Admin Dashboard
              </Link>
            )}
            <hr className="profile-menu-divider" />
            <button className="profile-menu-item logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;