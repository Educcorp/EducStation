// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto del tema
export const ThemeContext = createContext();

// Proveedor del contexto del tema
export const ThemeProvider = ({ children }) => {
  // Verificar si hay una preferencia guardada en localStorage
  const getSavedTheme = () => {
    try {
      const savedTheme = localStorage.getItem('theme');
      // Si hay un tema guardado, usarlo. Si no, usar la preferencia del sistema
      return savedTheme === 'dark' || 
             (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (error) {
      // Si hay algún error (ej. localStorage no disponible), usar tema claro por defecto
      console.warn('Error accessing theme preferences:', error);
      return false;
    }
  };

  // Estado para controlar si el tema es oscuro o claro
  const [isDarkMode, setIsDarkMode] = useState(getSavedTheme());

  // Función para cambiar entre tema oscuro y claro
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Actualizar localStorage y clases CSS cuando cambia el tema
  useEffect(() => {
    try {
      // Guardar preferencia en localStorage
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      
      // Actualizar la clase en el elemento HTML para estilos globales
      if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    } catch (error) {
      console.warn('Error saving theme preferences:', error);
    }
  }, [isDarkMode]);

  // También verificar si cambia la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Solo ajustar el tema si no hay una preferencia guardada
    const handleChange = (e) => {
      if (localStorage.getItem('theme') === null) {
        setIsDarkMode(e.matches);
      }
    };

    // Agregar listener para cambios (compatibilidad cruzada entre navegadores)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Para navegadores más antiguos
      mediaQuery.addListener(handleChange);
    }

    // Limpiar
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

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