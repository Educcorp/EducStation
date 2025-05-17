// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getThemeColors } from '../styles/theme';

// Creamos el contexto
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Estado para el tema actual
  const [darkMode, setDarkMode] = useState(false);

  // Comprobar si hay una preferencia guardada al cargar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Si hay una preferencia guardada, úsala; si no, usa la preferencia del sistema
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else if (prefersDark) {
      setDarkMode(true);
    }
  }, []);

  // Actualizar el DOM cuando cambie el tema
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
    
    // Guardar la preferencia en localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Función para cambiar el tema
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Obtener colores del tema actual (para compatibilidad con código existente)
  const colors = getThemeColors(darkMode);

  // Valor del contexto que se proporcionará
  const contextValue = {
    darkMode,
    isDarkMode: darkMode, // Para compatibilidad con código existente
    toggleTheme,
    colors // Para compatibilidad con código existente
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Función useTheme para compatibilidad con código antiguo
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

export default ThemeProvider;