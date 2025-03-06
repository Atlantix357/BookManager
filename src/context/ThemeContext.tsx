import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { theme as antTheme, ConfigProvider } from 'antd';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeMode) || 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', isDark);
    
    // Apply theme to body
    if (isDark) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#141414';
      document.body.style.color = 'rgba(255, 255, 255, 0.85)';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#fff';
      document.body.style.color = 'rgba(0, 0, 0, 0.85)';
    }
  }, [theme, isDark]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Configure Ant Design theme
  const { defaultAlgorithm, darkAlgorithm } = antTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: '#1677ff',
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
