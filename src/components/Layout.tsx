import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Button, Typography, theme, Tabs } from 'antd';
import { SunIcon, MoonIcon, BookOpenIcon, BarChart2Icon, BookIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const { Header, Content, Footer } = AntLayout;
const { Title } = Typography;

const Layout: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab based on current path
  const activeKey = location.pathname === '/dashboard' ? 'dashboard' : 'books';

  const headerStyle = {
    background: `linear-gradient(90deg, #4a1d96 0%, #7e22ce 50%, #6b21a8 100%)`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'fixed' as 'fixed',
    zIndex: 1000,
    top: 0,
    left: 0,
    right: 0,
    color: 'white'
  };

  const contentStyle = {
    padding: '24px 0',
    minHeight: 'calc(100vh - 134px)', // 64px header + 70px footer
    marginTop: '124px', // Header height + tabs height + extra spacing
    width: '100%',
    position: 'relative' as 'relative',
    zIndex: 1
  };

  const footerStyle = {
    textAlign: 'center' as 'center',
    background: isDark 
      ? 'rgba(0, 0, 0, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '24px',
    width: '100%',
    position: 'relative' as 'relative',
    zIndex: 1
  };

  const tabsContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    background: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(5px)',
    borderBottom: '1px solid rgba(140, 140, 140, 0.2)',
    position: 'fixed' as 'fixed',
    top: '64px',
    left: 0,
    right: 0,
    zIndex: 999,
    padding: '0 24px'
  };

  const handleTabChange = (key: string) => {
    if (key === 'books') {
      navigate('/');
    } else if (key === 'dashboard') {
      navigate('/dashboard');
    }
  };

  const items = [
    {
      key: 'books',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookIcon size={16} />
          Books
        </span>
      ),
    },
    {
      key: 'dashboard',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2Icon size={16} />
          Dashboard
        </span>
      ),
    },
  ];

  return (
    <AntLayout className="layout-container">
      {/* Animated background */}
      <div className="animated-background"></div>
      
      <Header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpenIcon size={24} color="white" />
          <Title level={4} style={{ margin: 0, color: 'white' }}>Book Database</Title>
        </div>
        <Button
          type="text"
          icon={isDark ? <SunIcon size={18} color="white" /> : <MoonIcon size={18} color="white" />}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{ color: 'white' }}
        />
      </Header>
      
      <div style={tabsContainerStyle}>
        <Tabs 
          activeKey={activeKey} 
          onChange={handleTabChange} 
          items={items}
          size="large"
          style={{ marginBottom: 0, width: '100%' }}
          className="full-width-tabs"
        />
      </div>
      
      <Content style={contentStyle}>
        <div className="content-container">
          <Outlet />
        </div>
      </Content>
      <Footer style={footerStyle}>
        <div className="content-container">
          © 2025 Personal Database Application by Atlantis
        </div>
      </Footer>
    </AntLayout>
  );
};

export default Layout;
