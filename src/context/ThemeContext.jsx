// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';

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
    
    // Actualizar la clase en el elemento HTML para estilos globales
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
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