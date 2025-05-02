import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

interface LayoutProps {
  children?: React.ReactNode; // Make children optional
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <div className="container">
          <Outlet /> {/* Render nested routes here */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;