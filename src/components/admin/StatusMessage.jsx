import React, { useEffect, useRef } from 'react';
import { colors, spacing } from '../../styles/theme';

const StatusMessage = ({ type, text, icon }) => {
  const messageRef = useRef(null);
  
  useEffect(() => {
    // Aplicar animación cuando el componente se monta
    if (messageRef.current) {
      messageRef.current.style.animation = type === 'error' 
        ? 'fadeIn 0.3s ease-in-out, shake 0.5s ease-in-out' 
        : (text.includes('publicado') 
          ? 'fadeIn 0.3s ease-in-out, pulse 1s ease-in-out'
          : 'fadeIn 0.3s ease-in-out');
    }
  }, [type, text]);

  const styles = {
    successMessage: {
      backgroundColor: "rgba(11, 68, 68, 0.1)",
      color: colors.primary,
      padding: spacing.md,
      borderRadius: "4px",
      fontSize: "14px",
      marginTop: spacing.md,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm
    },
    errorMessage: {
      backgroundColor: "rgba(210, 185, 154, 0.1)",
      color: '#b53d00',
      padding: spacing.md,
      borderRadius: "4px",
      fontSize: "14px",
      marginTop: spacing.md,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm
    }
  };

  return (
    <div 
      ref={messageRef}
      id="save-message"
      style={type === 'success' ? styles.successMessage : styles.errorMessage}
    >
      <span style={{ fontSize: '1.2em' }}>{icon}</span>
      {text}
    </div>
  );
};

export default StatusMessage;