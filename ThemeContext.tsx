import React, { createContext, useContext, useMemo } from 'react';

interface ThemeTokens {
  brandAccent: string;
  brandText: string;
  companyName: string;
  logoUrl: string;
}

interface ThemeContextType {
  tokens: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const tokens = useMemo((): ThemeTokens => {
    return {
      brandAccent: '#0d9488', // Teal 600
      brandText: '#FFFFFF',
      companyName: 'MasarZero',
      logoUrl: '', // Will use SVG or text for MasarZero
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ tokens }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
