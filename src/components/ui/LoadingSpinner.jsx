import React from 'react';
import { colors } from '../../styles/theme';

/**
 * Componente de spinner de carga
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.size='medium'] - Tamaño del spinner: 'small', 'medium', 'large'
 * @param {string} [props.color] - Color del spinner (por defecto: primary)
 * @returns {JSX.Element} Componente de spinner
 */
const LoadingSpinner = ({ size = 'medium', color }) => {
  // Determinar tamaño
  const sizeMap = {
    small: 16,
    medium: 32,
    large: 48
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;
  const spinnerColor = color || colors.primary;
  
  return (
    <div style={styles.container}>
      <div 
        style={{
          ...styles.spinner,
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: Math.max(2, spinnerSize / 8),
          borderTopColor: spinnerColor,
        }}
      ></div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    border: `2px solid ${colors.gray200}`,
    borderRadius: '50%',
    borderTopColor: colors.primary,
    animation: 'spin 0.8s linear infinite',
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
};

// Añadir la animación al documento
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default LoadingSpinner; 