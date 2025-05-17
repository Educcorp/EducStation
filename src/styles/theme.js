// src/styles/theme.js
// Configuración completa de temas claro y oscuro

// Objeto para almacenar el tema actual
let currentTheme = 'light';

// Definiciones de color para cada tema
const themes = {
  light: {
    primary: '#0b4444',
    primaryLight: '#166464',
    primaryDark: '#093333',
    secondary: '#2a9d8f',
    secondaryLight: '#3ab7a7',
    secondaryDark: '#218177',
    accent: '#e9c46a',
    accentLight: '#f0d285',
    accentDark: '#e0b547',
    background: '#ffffff',
    surface: '#f8f9fa',
    card: '#ffffff',
    textPrimary: '#333333',
    textSecondary: '#666666',
    textTertiary: '#888888',
    textMuted: '#aaaaaa',
    border: '#e0e0e0',
    divider: '#eeeeee',
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    // Colores específicos
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    white: '#ffffff',
    black: '#000000'
  },
  dark: {
    primary: '#136363',
    primaryLight: '#1a7777',
    primaryDark: '#0e4d4d',
    secondary: '#2a9d8f',
    secondaryLight: '#3ab7a7',
    secondaryDark: '#218177',
    accent: '#e9c46a',
    accentLight: '#f0d285',
    accentDark: '#e0b547',
    background: '#121212',
    surface: '#1e1e1e',
    card: '#2c2c2c',
    textPrimary: '#e0e0e0',
    textSecondary: '#b0b0b0',
    textTertiary: '#909090',
    textMuted: '#707070',
    border: '#404040',
    divider: '#333333',
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    // Colores específicos
    gray50: '#18191a',
    gray100: '#242526',
    gray200: '#3a3b3c',
    gray300: '#4e4f50',
    gray400: '#6a6c6d',
    gray500: '#8a8c8e',
    gray600: '#a8a9ab',
    gray700: '#c5c6c7',
    gray800: '#e4e6eb',
    gray900: '#f5f6f7',
    white: '#ffffff',
    black: '#000000'
  }
};

// Extraer colores del tema actual para exportarlos directamente
const colors = themes[currentTheme];
const lightColors = themes.light;
const darkColors = themes.dark;

// Espaciado consistente
const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
  xxxl: '4rem'
};

// Tipografía
const typography = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem'
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2
  }
};

// Bordes
const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  xl: '1rem',
  full: '9999px'
};

// Sombras
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
};

// Transiciones
const transitions = {
  fast: '150ms',
  default: '300ms',
  slow: '500ms'
};

// Función para obtener el tema currentTheme
const getTheme = () => {
  return themes[currentTheme];
};

// Función para establecer el tema currentTheme
const setCurrentTheme = (theme) => {
  if (theme === 'dark' || theme === 'light') {
    currentTheme = theme;
  }
};

// Función para obtener colores según el tema (compatible con código existente)
const getThemeColors = (isDarkMode) => {
  return isDarkMode ? themes.dark : themes.light;
};

// Función para aplicar estilos de hover (compatible con código existente)
const applyHoverStyles = (baseColor, hoverColor) => {
  return {
    backgroundColor: baseColor,
    transition: 'background-color 0.3s, transform 0.3s',
    '&:hover': {
      backgroundColor: hoverColor,
      transform: 'translateY(-3px)'
    }
  };
};

// Exportamos todos los componentes de nuestro tema
export {
  getTheme,
  setCurrentTheme,
  getThemeColors,
  applyHoverStyles,
  colors,
  lightColors,
  darkColors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions
};

// Por defecto, exportamos los colores del tema actual para facilitar el uso
export default colors;