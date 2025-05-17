import React from 'react';
import { colors, spacing, borderRadius } from '../../styles/theme';

/**
 * Botón con icono personalizable
 * @param {Object} props - Propiedades del componente
 * @param {string} props.icon - Nombre del icono de FontAwesome (sin el "fa-")
 * @param {string} props.text - Texto opcional que acompaña al icono
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 * @param {string} props.color - Color principal del botón (primary, secondary, error, etc)
 * @param {boolean} props.filled - Si es true, el botón tendrá color de fondo
 * @param {Object} props.style - Estilos adicionales para el botón
 * @param {string} props.size - Tamaño del botón (small, medium, large)
 * @param {string} props.tooltip - Texto del tooltip
 * @param {boolean} props.disabled - Si el botón está desactivado
 * @returns {JSX.Element}
 */
const IconButton = ({ 
  icon, 
  text, 
  onClick, 
  color = 'primary', 
  filled = false,
  style = {},
  size = 'medium',
  tooltip,
  disabled = false,
  className = '',
  ariaLabel
}) => {
  // Mapear los tamaños a valores de estilo
  const sizeMap = {
    small: {
      padding: spacing.xs,
      fontSize: '0.85rem',
      iconSize: '0.9rem'
    },
    medium: {
      padding: spacing.sm,
      fontSize: '1rem',
      iconSize: '1.1rem'
    },
    large: {
      padding: spacing.md,
      fontSize: '1.2rem',
      iconSize: '1.3rem'
    }
  };
  
  const sizeStyle = sizeMap[size] || sizeMap.medium;
  
  // Mapear color a valores del tema
  const colorMap = {
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info
  };
  
  const buttonColor = colorMap[color] || colorMap.primary;
  
  // Estilo base del botón
  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: text ? `${sizeStyle.padding} ${sizeStyle.padding * 1.5}` : sizeStyle.padding,
    borderRadius: filled ? borderRadius.md : borderRadius.sm,
    border: filled ? 'none' : `1px solid ${buttonColor}`,
    backgroundColor: filled ? buttonColor : 'transparent',
    color: filled ? colors.white : buttonColor,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    fontSize: sizeStyle.fontSize,
    ...style
  };
  
  // Estilo del icono
  const iconStyle = {
    fontSize: sizeStyle.iconSize
  };
  
  return (
    <button
      style={buttonStyle}
      onClick={!disabled ? onClick : undefined}
      title={tooltip}
      aria-label={ariaLabel || text || icon}
      className={`icon-button ${className}`}
      disabled={disabled}
    >
      <i className={`fas fa-${icon}`} style={iconStyle}></i>
      {text && <span>{text}</span>}
    </button>
  );
};

export default IconButton; 