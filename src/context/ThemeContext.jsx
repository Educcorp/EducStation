// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { lightColors, darkColors } from '../styles/theme';

// Crear el contexto del tema
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: {},
  lightColors: {}, // Agregamos lightColors
  forceLightMode: false, // Añadimos propiedad para forzar el modo claro
});

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
  // Estado para forzar el modo claro en ciertas páginas
  const [forceLightMode, setForceLightMode] = useState(false);

  // Función para cambiar entre tema oscuro y claro
  const toggleTheme = () => {
    if (!forceLightMode) {
      setIsDarkMode(prevMode => !prevMode);
    }
  };

  // Actualizar localStorage cuando cambia el tema
  useEffect(() => {
    // Solo guardamos la preferencia si no estamos forzando el modo claro
    if (!forceLightMode) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
    
    // Actualizar el tema actual en theme.js si existe la función
    try {
      if (require('../styles/theme').setCurrentTheme) {
        require('../styles/theme').setCurrentTheme((forceLightMode ? false : isDarkMode) ? 'dark' : 'light');
      }
    } catch (err) {
      console.warn('No se pudo actualizar el tema en theme.js:', err.message);
    }
    
    // Actualizar la clase en el elemento HTML para estilos globales
    if (forceLightMode || !isDarkMode) {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    }

    // También cambiar colores básicos del body
    const colors = (forceLightMode || !isDarkMode) ? lightColors : darkColors;
    if (colors) {
      document.body.style.backgroundColor = colors.background;
      document.body.style.color = colors.textPrimary;
    }
  }, [isDarkMode, forceLightMode]); // Agregamos forceLightMode como dependencia

  // Obtener los colores correctos según el modo
  const colors = (forceLightMode || !isDarkMode) ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode: forceLightMode ? false : isDarkMode, 
      toggleTheme, 
      colors: (forceLightMode || !isDarkMode) ? lightColors : darkColors,
      lightColors, // Exportamos los colores claros siempre
      forceLightMode,
      setForceLightMode // Exportamos la función para forzar el modo claro
    }}>
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
    const { isDarkMode, colors, forceLightMode, setForceLightMode } = useTheme();
    return <Component {...props} isDarkMode={isDarkMode} themeColors={colors} forceLightMode={forceLightMode} setForceLightMode={setForceLightMode} />;
  };
};