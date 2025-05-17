import React from 'react';
import useTheme from '../../hooks/useTheme';
import { getTheme } from '../../styles/theme';

// Este componente envuelve a otros componentes y les proporciona colores temáticos
const ThemeWrapper = ({ children }) => {
  const { darkMode } = useTheme();
  const currentTheme = getTheme();
  
  // Actualizar estilos globales según el tema
  React.useEffect(() => {
    // Actualizar las variables CSS en tiempo real si es necesario
    const root = document.documentElement;
    Object.entries(currentTheme).forEach(([key, value]) => {
      // Convertir camelCase a kebab-case para las variables CSS
      const cssKey = key
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();
      root.style.setProperty(`--color-${cssKey}`, value);
    });
  }, [darkMode, currentTheme]);
  
  return (
    <div className={darkMode ? 'theme-dark' : 'theme-light'}>
      {children}
    </div>
  );
};

export default ThemeWrapper;