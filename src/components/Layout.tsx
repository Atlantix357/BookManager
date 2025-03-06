import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout, Button, Typography, theme } from 'antd';
import { SunIcon, MoonIcon, BookOpenIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const { Header, Content, Footer } = AntLayout;
const { Title } = Typography;

const Layout: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const { token } = theme.useToken();

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
    padding: '24px',
    minHeight: 'calc(100vh - 134px)', // 64px header + 70px footer
    marginTop: '64px', // Header height
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

  return (
    <AntLayout style={{ minHeight: '100vh', width: '100%', position: 'relative' }}>
      {/* Animated background */}
      <div className="animated-background"></div>
      
      <Header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpenIcon size={24} color="white" />
          <Title level={4} style={{ margin: 0, color: 'white' }}>Book Manager</Title>
        </div>
        <Button
          type="text"
          icon={isDark ? <SunIcon size={18} color="white" /> : <MoonIcon size={18} color="white" />}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{ color: 'white' }}
        />
      </Header>
      <Content style={contentStyle}>
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '100%', 
            margin: '0 auto',
            background: isDark 
              ? 'rgba(0, 0, 0, 0.7)' 
              : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={footerStyle}>
        © 2025 Local Book Management Application
      </Footer>
    </AntLayout>
  );
};

export default Layout;
