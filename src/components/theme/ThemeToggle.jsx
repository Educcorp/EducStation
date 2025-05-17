import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className }) => {
  const { darkMode, toggleTheme, colors } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className={`theme-toggle ${className || ''}`}
      aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-2)',
        color: 'var(--color-text-primary)',
        borderRadius: 'var(--border-radius-full)',
        transition: 'transform var(--transition-fast), background-color var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.backgroundColor = 'var(--color-surface)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {darkMode ? (
        <FaSun size={22} className="animate-pulse" style={{ color: 'var(--color-accent)' }} />
      ) : (
        <FaMoon size={22} style={{ color: 'var(--color-primary)' }} />
      )}
    </button>
  );
};

export default ThemeToggle;