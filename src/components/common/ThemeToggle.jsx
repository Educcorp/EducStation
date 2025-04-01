// src/components/common/ThemeToggle.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { transitions, getThemeColors } from '../../styles/theme';

const ThemeToggle = ({ inMenu = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const colors = getThemeColors(isDarkMode);
  
  // Definimos los estilos base para el botón
  const styles = {
    toggleButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: inMenu ? 'auto' : '40px',
      height: inMenu ? 'auto' : '40px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      color: colors.textPrimary,
      position: 'relative',
      padding: inMenu ? '8px 12px' : '0',
      transition: transitions.default
    },
    icon: {
      fontSize: '20px',
      transition: `transform 0.5s ease, opacity 0.3s ease`,
      transform: isHovered ? 'rotate(30deg) scale(1.2)' : 'rotate(0deg) scale(1)',
      opacity: isHovered ? 1 : 0.8
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
      fontSize: '14px',
      fontWeight: '500',
      display: inMenu ? 'block' : 'none'
    },
    sunRays: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      opacity: isDarkMode ? 0 : (isHovered ? 0.8 : 0.2),
      transition: 'opacity 0.3s ease',
      animation: isHovered && !isDarkMode ? 'pulse 2s infinite' : 'none',
      pointerEvents: 'none'
    },
    moonGlow: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      opacity: isDarkMode ? (isHovered ? 0.8 : 0.2) : 0,
      transition: 'opacity 0.3s ease',
      animation: isHovered && isDarkMode ? 'pulse 2s infinite' : 'none',
      pointerEvents: 'none',
      borderRadius: '50%',
      boxShadow: '0 0 15px 5px rgba(210, 185, 154, 0.7)'
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
        {isDarkMode ? "🌙" : "☀️"}
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