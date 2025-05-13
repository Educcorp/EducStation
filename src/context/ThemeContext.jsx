// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { lightColors, darkColors } from '../styles/theme';

// Crear el contexto del tema
export const ThemeContext = createContext();

// Proveedor del contexto del tema
export const ThemeProvider = ({ children }) => {
  // Verificar si hay una preferencia guardada en localStorage
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
           (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  };

  // Estado para controlar si el tema es oscuro o claro
  const [isDarkMode, setIsDarkMode] = useState(getSavedTheme());

  // Función para cambiar entre tema oscuro y claro
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Actualizar localStorage cuando cambia el tema
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Actualizar el tema actual en theme.js si existe la función
    try {
      if (require('../styles/theme').setCurrentTheme) {
        require('../styles/theme').setCurrentTheme(isDarkMode ? 'dark' : 'light');
      }
    } catch (err) {
      console.warn('No se pudo actualizar el tema en theme.js:', err.message);
    }
    
    // Actualizar la clase en el elemento HTML para estilos globales
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }

    // También cambiar colores básicos del body
    const colors = isDarkMode ? darkColors : lightColors;
    if (colors) {
      document.body.style.backgroundColor = colors.background;
      document.body.style.color = colors.textPrimary;
    }
  }, [isDarkMode]); // Eliminamos colors de las dependencias

  // Obtener los colores correctos según el modo
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto del tema
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

// Función de envoltorio para componentes que no pueden usar hooks
export const withTheme = (Component) => {
  return (props) => {
    const { isDarkMode, colors } = useTheme();
    return <Component {...props} isDarkMode={isDarkMode} themeColors={colors} />;
  };
};