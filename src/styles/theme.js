export const colors = {
    primary: '#7c4dff',
    primaryLight: '#b47cff',
    primaryDark: '#3a1c91',
    secondary: '#448aff',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    background: '#f8f9fc',
    white: '#ffffff',
    gray100: '#f2f4f8',
    gray200: '#e2e8f0',
    gray300: '#cbd5e1',
    error: '#ef4444',
  };
  
  export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  };
  
  export const borderRadius = {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '24px',
    circle: '50%',
  };
  
  export const shadows = {
    sm: '0 1px 3px rgba(0,0,0,0.05)',
    md: '0 4px 15px rgba(0,0,0,0.05)',
    lg: '0 10px 30px rgba(0,0,0,0.1)',
    primary: '0 4px 12px rgba(124, 77, 255, 0.3)',
  };
  
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