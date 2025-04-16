// src/components/common/ThemeToggleButton.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggleButton = ({ preventPropagation = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Estilos para el botón
  const styles = {
    toggleButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      color: isDarkMode ? '#f0f8f7' : '#0b4444',
      position: 'relative',
      transition: 'all 0.3s ease'
    },
    icon: {
      fontSize: '20px',
      transition: 'transform 0.5s ease, opacity 0.3s ease',
      transform: isHovered ? 'rotate(30deg) scale(1.2)' : 'rotate(0deg) scale(1)',
      opacity: isHovered ? 1 : 0.8
    },
    tooltip: {
      position: 'absolute',
      bottom: '-30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: isDarkMode ? '#4c7977' : '#0b4444',
      color: '#f0f8f7',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      whiteSpace: 'nowrap',
      opacity: isHovered ? 1 : 0,
      visibility: isHovered ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease',
      pointerEvents: 'none',
      zIndex: 10
    }
  };

  // Manejo de eventos de hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e) => {
    if (preventPropagation) {
      e.stopPropagation();
    }
    toggleTheme();
  };

  return (
    <button
      style={styles.toggleButton}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <span style={styles.icon}>
        {isDarkMode ? "🌙" : "☀️"}
      </span>
      <span style={styles.tooltip}>
        {isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      </span>
    </button>
  );
};

export default ThemeToggleButton;