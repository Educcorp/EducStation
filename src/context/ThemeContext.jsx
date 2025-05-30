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
  // Estado para forzar el modo claro en ciertas páginas
  const [forceLightMode, setForceLightMode] = useState(false);
  
  // Verificar si hay una preferencia guardada en localStorage
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    // Siempre retornamos false (modo claro) por defecto, ignorando preferencia del sistema
    return savedTheme === 'dark';
  };

  // Estado para controlar si el tema es oscuro o claro
  const [isDarkMode, setIsDarkMode] = useState(getSavedTheme());

  // Función para cambiar entre tema oscuro y claro
  const toggleTheme = () => {
    if (!forceLightMode) {
      setIsDarkMode(prevMode => !prevMode);
    }
  };

  // Aplicar el tema correcto inmediatamente
  const applyTheme = (darkMode, forceLight) => {
    // Determinar si debemos usar el tema claro
    const useLightTheme = forceLight || !darkMode;
    
    // Actualizar clases en el documento
    if (useLightTheme) {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    }

    // Actualizar colores básicos del body
    const colors = useLightTheme ? lightColors : darkColors;
    if (colors) {
      document.body.style.backgroundColor = colors.background;
      document.body.style.color = colors.textPrimary;
    }
  };

  // Aplicar el tema inmediatamente al montar el componente
  useEffect(() => {
    applyTheme(isDarkMode, forceLightMode);
  }, []);

  // Actualizar localStorage y aplicar tema cuando cambian las preferencias
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
    
    // Aplicar el tema
    applyTheme(isDarkMode, forceLightMode);
    
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