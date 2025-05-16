// src/components/common/ThemeToggle.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { transitions, getThemeColors, colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ inMenu = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const colors = getThemeColors(isDarkMode);

  // Definimos los estilos base para el botón
  const styles = {
    toggleButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0',
      cursor: 'pointer',
      color: colors.textPrimary,
      position: 'relative',
      padding: '10px 16px',
      transition: transitions.default,
      boxSizing: 'border-box',
      minHeight: '44px',
      gap: '12px',
    },
    icon: {
      fontSize: '20px',
      transition: `transform 0.5s ease, opacity 0.3s ease`,
      transform: isHovered ? 'rotate(30deg) scale(1.2)' : 'rotate(0deg) scale(1)',
      opacity: isHovered ? 1 : 0.8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.textPrimary,
      minWidth: '24px',
      minHeight: '24px',
    },
    tooltip: {
      position: 'absolute',
      bottom: inMenu ? 'auto' : '-30px',
      right: inMenu ? 'auto' : '0',
      left: inMenu ? 'auto' : '50%',
      transform: inMenu ? 'none' : 'translateX(-50%)',
      backgroundColor: isDarkMode ? colors.gray200 : colors.primary,
      color: isDarkMode ? colors.textPrimary : colors.white,
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      whiteSpace: 'nowrap',
      opacity: isHovered ? 1 : 0,
      visibility: isHovered ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease',
      pointerEvents: 'none',
      zIndex: 10,
      display: inMenu ? 'none' : 'block'
    },
    label: {
      marginLeft: '8px',
      fontSize: '16px',
      fontWeight: 500,
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: colors.textPrimary,
      display: inMenu ? 'inline' : 'none',
      verticalAlign: 'middle',
      lineHeight: '24px',
    },
    // Eliminamos el efecto de rayos solares para el modo claro
    sunRays: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      opacity: 0, // Establecemos la opacidad a 0 para ocultar completamente
      pointerEvents: 'none'
    },
    // Mantenemos el brillo lunar para el modo oscuro pero moderado
    moonGlow: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      opacity: isDarkMode ? (isHovered ? 0 : 0) : 0, // Reducimos la opacidad
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
      borderRadius: '50%',
      boxShadow: '0 0 10px 3px rgba(210, 185, 154, 0.4)' // Reducimos la intensidad del brillo
    }
  };

  // Manejo de eventos de hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      style={styles.toggleButton}
      onClick={toggleTheme}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <div style={styles.sunRays}></div>
      <div style={styles.moonGlow}></div>
      <span style={styles.icon}>
        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </span>
      <span style={styles.label}>
        {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
      </span>
      <span style={styles.tooltip}>
        {isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      </span>
    </button>
  );
};

export default ThemeToggle;