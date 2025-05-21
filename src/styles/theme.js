// src/styles/theme.js
// Configuración completa de temas claro y oscuro

// Tema claro (base)


export const lightColors = {
  // Colores principales de la paleta
  primary: '#0b4444',         // Verde oscuro
  primaryLight: '#4c7977',    // Verde azulado
  primaryDark: '#043333',     // Versión más oscura del primary
  secondary: '#d2b99a',       // Beige
  background: '#91a8a4',      // Verde grisáceo (fondo)
  white: '#f0f8f7',           // Blanco hueso/menta
  
  // Colores de texto
  textPrimary: '#0b4444',     // Verde oscuro para textos principales
  textSecondary: '#4c7977',   // Verde azulado para textos secundarios
  textLight: '#f0f8f7',       // Blanco hueso para textos en fondos oscuros
  
  // Colores adicionales derivados
  accent: '#d2b99a',          // Beige como color de acento
  
  // Tonos de gris
  gray100: '#e1e7e6',
  gray200: '#c4d0ce',
  gray300: '#a7b9b6',
  
  // Colores de estado
  error: '#b53d00',           // Rojo terracota (tono acorde con la paleta)
  success: '#3b6b69',         // Verde azulado más oscuro
  warning: '#d2a579',         // Beige más anaranjado
};

// Tema oscuro 


export const darkColors = {
  // Colores principales de la paleta
  primary: '#4c7977',         // Verde azulado más claro como color principal
  primaryLight: '#5d8a88',    // Una versión más clara del primaryLight
  primaryDark: '#0b4444',     // El verde oscuro original como primario oscuro
  secondary: '#d2b99a',       // Mantener el beige como secundario
  background: '#1a2e2d',      // Fondo muy oscuro con tono verdoso
  white: '#0a1919',           // Casi negro con tinte verdoso para fondos
  
  // Colores de texto
  textPrimary: '#e1e7e6',     // Casi blanco para textos principales
  textSecondary: '#a7b9b6',   // Gris claro para textos secundarios
  textLight: '#f0f8f7',       // Blanco hueso para textos destacados
  
  // Colores adicionales derivados
  accent: '#e0c7a8',          // Beige más claro como acento
  
  // Tonos de gris (invertidos)
  gray100: '#223938',
  gray200: '#2d4a49',
  gray300: '#3a5c5b',
  
  // Colores de estado
  error: '#ff5722',           // Naranja más brillante para errores
  success: '#4db6ac',         // Verde azulado más claro para éxito
  warning: '#ffb74d',         // Ámbar más brillante para advertencias
};



// Exportar la función para seleccionar colores basados en el tema
export const getThemeColors = (isDarkMode) => {
  return isDarkMode ? darkColors : lightColors;
};

// Sombras para el tema claro
export const shadows = {
  sm: '0 1px 3px rgba(11, 68, 68, 0.08)',
  md: '0 4px 15px rgba(11, 68, 68, 0.1)',
  lg: '0 10px 30px rgba(11, 68, 68, 0.12)',
  primary: '0 4px 12px rgba(11, 68, 68, 0.15)',
};

// Sombras para el tema oscuro
export const darkShadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
  md: '0 4px 15px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 30px rgba(0, 0, 0, 0.5)',
  primary: '0 4px 12px rgba(0, 0, 0, 0.4)',
};

// Función para obtener las sombras según el tema
export const getThemeShadows = (isDarkMode) => {
  return isDarkMode ? darkShadows : shadows;
};

// Espaciados
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// Radios de bordes
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  round: '24px',
  circle: '50%',
};

// Tipografía
export const typography = {
  fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
};

// Transiciones
export const transitions = {
  default: 'all 0.3s ease',
  fast: 'all 0.2s ease',
  slow: 'all 0.5s ease',
};

// Función para aplicar estilos de hover de manera consistente
export const applyHoverStyles = (styleObj) => {
  const newStyles = { ...styleObj };
  if (styleObj['&:hover']) {
    Object.assign(newStyles, styleObj['&:hover']);
    delete newStyles['&:hover'];
  }
  return newStyles;
};

// Reemplaza la exportación de colors
let currentTheme = 'light';

// Función para obtener el tema currente
export const getCurrentTheme = () => currentTheme;

// Función para establecer el tema currente
export const setCurrentTheme = (theme) => {
  currentTheme = theme;
  // Si quieres que esta función realmente cambie los colores exportados,
  // necesitarías implementar un sistema más complejo con getters/setters
  console.log('Tema actual cambiado a:', theme);
};

// Exportar colors como un getter dinámico
Object.defineProperty(exports, 'colors', {
  get: function() {
    return currentTheme === 'dark' ? darkColors : lightColors;
  }
});

export const colors = {
  primary: '#064A74',
  primaryDark: '#053959',
  primaryLight: '#356F9E',
  secondary: '#2B6CA3',
  secondaryDark: '#1B4D78',
  secondaryLight: '#5791C2',
  accent: '#FFA000',
  accentDark: '#CC8000',
  accentLight: '#FFB333',
  background: '#F5F7FA',
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F0F2F5',
  gray200: '#E1E4E8',
  gray300: '#D1D5DA',
  gray400: '#959DA5',
  gray500: '#6A737D',
  gray600: '#586069',
  gray700: '#444D56',
  gray800: '#2F363D',
  gray900: '#24292E',
  textPrimary: '#24292E',
  textSecondary: '#586069',
  error: '#E53935',
  success: '#43A047',
  warning: '#FFA000'
};