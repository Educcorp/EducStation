import React, { useEffect, useRef } from 'react';
import { colors, spacing } from '../../styles/theme';

const StatusMessage = ({ type, text, icon }) => {
  const messageRef = useRef(null);
  
  useEffect(() => {
    // Aplicar animación cuando el componente se monta
    if (messageRef.current) {
      if (type === 'error') {
        messageRef.current.style.animation = 'fadeIn 0.3s ease-in-out, shake 0.5s ease-in-out';
      } else if (type === 'warning') {
        messageRef.current.style.animation = 'fadeIn 0.3s ease-in-out, pulse 0.8s ease-in-out 2';
      } else if (text.includes('publicado')) {
        messageRef.current.style.animation = 'fadeIn 0.3s ease-in-out, pulse 1s ease-in-out';
      } else {
        messageRef.current.style.animation = 'fadeIn 0.3s ease-in-out';
      }
    }
  }, [type, text]);

  const getMessageStyle = () => {
    switch (type) {
      case 'success':
        return styles.successMessage;
      case 'warning':
        return styles.warningMessage;
      case 'error':
        return styles.errorMessage;
      default:
        return styles.successMessage;
    }
  };

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
    },
    warningMessage: {
      backgroundColor: "rgba(255, 193, 7, 0.1)",
      color: '#856404',
      padding: spacing.md,
      borderRadius: "4px",
      fontSize: "14px",
      marginTop: spacing.md,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      borderLeft: '3px solid #ffc107'
    }
  };

  return (
    <div 
      ref={messageRef}
      id="save-message"
      style={getMessageStyle()}
    >
      <span style={{ fontSize: '1.2em' }}>{icon}</span>
      {text}
    </div>
  );
};

export default StatusMessage;