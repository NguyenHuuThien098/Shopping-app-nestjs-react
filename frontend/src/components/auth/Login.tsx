import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(formData);
      // After successful login, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Error is already set in context
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error-message">{error}</div>}
          
          <div className="auth-form-group">
            <label htmlFor="username">Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập hoặc email"
            />
          </div>
          
          <div className="auth-form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-submit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
          <p>
            <Link to="/">Về trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;