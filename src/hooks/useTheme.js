import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  
  // Para mantener compatibilidad con el código existente
  // que espera propiedades como 'isDarkMode' y 'colors'
  return {
    ...context,
    isDarkMode: context.darkMode,
    colors: {
      primary: 'var(--color-primary)',
      primaryLight: 'var(--color-primary-light)',
      primaryDark: 'var(--color-primary-dark)',
      secondary: 'var(--color-secondary)',
      secondaryLight: 'var(--color-secondary-light)',
      secondaryDark: 'var(--color-secondary-dark)',
      accent: 'var(--color-accent)',
      accentLight: 'var(--color-accent-light)',
      accentDark: 'var(--color-accent-dark)',
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      card: 'var(--color-card)',
      textPrimary: 'var(--color-text-primary)',
      textSecondary: 'var(--color-text-secondary)',
      textTertiary: 'var(--color-text-tertiary)',
      textMuted: 'var(--color-text-muted)',
      border: 'var(--color-border)',
      divider: 'var(--color-divider)',
      success: 'var(--color-success)',
      error: 'var(--color-error)',
      warning: 'var(--color-warning)',
      info: 'var(--color-info)',
      white: '#ffffff',
      black: '#000000',
      gray100: 'var(--color-gray-100)',
      gray200: 'var(--color-gray-200)',
      gray300: 'var(--color-gray-300)',
      gray400: 'var(--color-gray-400)',
      gray500: 'var(--color-gray-500)',
      gray600: 'var(--color-gray-600)',
      gray700: 'var(--color-gray-700)',
      gray800: 'var(--color-gray-800)',
      gray900: 'var(--color-gray-900)'
    }
  };
};

export default useTheme;