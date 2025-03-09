// src/components/ui/Tooltip.jsx
import React from 'react';
import { colors, spacing, borderRadius } from '../../styles/theme';

/**
 * Componente reutilizable para mostrar tooltips
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isVisible - Controla si el tooltip es visible
 * @param {string} props.text - Texto a mostrar en el tooltip
 * @param {string} props.position - Posición del tooltip ('top', 'bottom', 'left', 'right')
 * @param {Object} props.style - Estilos adicionales para el tooltip
 */
const Tooltip = ({ 
  isVisible, 
  text, 
  position = 'bottom', 
  style = {}
}) => {
  // Calcular posicionamiento según la posición requerida
  let positionStyles = {};
  
  switch(position) {
    case 'top':
      positionStyles = {
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)'
      };
      break;
    case 'bottom':
      positionStyles = {
        top: '30px',
        left: '50%',
        transform: 'translateX(-50%)'
      };
      break;
    case 'left':
      positionStyles = {
        right: '30px',
        top: '50%',
        transform: 'translateY(-50%)'
      };
      break;
    case 'right':
      positionStyles = {
        left: '30px',
        top: '50%',
        transform: 'translateY(-50%)'
      };
      break;
    default:
      positionStyles = {
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)'
      };
  }

  const styles = {
    tooltipContainer: {
      position: "absolute",
      backgroundColor: colors.primary,
      color: colors.white,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      fontSize: "12px",
      whiteSpace: "nowrap",
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' : 'hidden',
      transition: "opacity 0.2s ease, visibility 0.2s ease",
      zIndex: 3,
      pointerEvents: "none",
      ...positionStyles,
      ...style
    }
  };

  return (
    <span style={styles.tooltipContainer}>
      {text}
    </span>
  );
};

export default Tooltip;