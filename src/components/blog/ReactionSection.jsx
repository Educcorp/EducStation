import React, { useState, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';

const ReactionSection = ({ postId }) => {
  const [reactions, setReactions] = useState({
    '👍': 0,  // Me gusta
    '❤️': 0,  // Me encanta
    '🎯': 0,  // Útil
    '🤔': 0,  // Me hace pensar
    '💡': 0,  // Inspirador
  });
  
  const [userReactions, setUserReactions] = useState({});
  
  useEffect(() => {
    // Cargar reacciones guardadas
    const savedReactions = localStorage.getItem(`post_reactions_${postId}`);
    const savedUserReactions = localStorage.getItem(`user_reactions_${postId}`);
    
    if (savedReactions) {
      setReactions(JSON.parse(savedReactions));
    }
    if (savedUserReactions) {
      setUserReactions(JSON.parse(savedUserReactions));
    }
  }, [postId]);

  const handleReaction = (emoji) => {
    const newReactions = { ...reactions };
    const newUserReactions = { ...userReactions };

    // Si el usuario ya reaccionó con este emoji, quitar la reacción
    if (newUserReactions[emoji]) {
      newReactions[emoji]--;
      delete newUserReactions[emoji];
    } else {
      // Si el usuario ya tiene 1 reaccion, no permitir más
      if (Object.keys(newUserReactions).length >= 1) {
        showNotification('¡Máximo 1 reaccion por post!', 'warning');
        return;
      }
      newReactions[emoji]++;
      newUserReactions[emoji] = true;
    }

    setReactions(newReactions);
    setUserReactions(newUserReactions);

    // Guardar en localStorage
    localStorage.setItem(`post_reactions_${postId}`, JSON.stringify(newReactions));
    localStorage.setItem(`user_reactions_${postId}`, JSON.stringify(newUserReactions));
  };

  const showNotification = (message, type) => {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = type === 'warning' ? '#ffd700' : colors.primary;
    notification.style.color = type === 'warning' ? '#000' : '#fff';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.textContent = message;

    document.body.appendChild(notification);

    // Eliminar después de 3 segundos
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const styles = {
    container: {
      marginTop: spacing.xl,
      padding: spacing.lg,
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
    },
    title: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    reactionGrid: {
      display: 'flex',
      justifyContent: 'center',
      gap: spacing.md,
      flexWrap: 'wrap',
    },
    reactionButton: (isSelected) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: spacing.sm,
      backgroundColor: isSelected ? colors.primaryLight : colors.background,
      border: `2px solid ${isSelected ? colors.primary : 'transparent'}`,
      borderRadius: borderRadius.md,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '80px',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: shadows.md,
      },
    }),
    emoji: {
      fontSize: '24px',
      marginBottom: spacing.xs,
    },
    count: (isSelected) => ({
      fontSize: typography.fontSize.sm,
      color: isSelected ? colors.white : colors.textSecondary,
      fontWeight: isSelected ? typography.fontWeight.bold : typography.fontWeight.medium,
      transition: 'all 0.3s ease',
    }),
    info: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>¿Qué te pareció este post?</h3>
      <div style={styles.reactionGrid}>
        {Object.entries(reactions).map(([emoji, count]) => (
          <div
            key={emoji}
            style={styles.reactionButton(userReactions[emoji])}
            onClick={() => handleReaction(emoji)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = shadows.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={styles.emoji}>{emoji}</span>
            <span style={styles.count(userReactions[emoji])}>{count}</span>
          </div>
        ))}
      </div>
      <p style={styles.info}>
        Puedes elegir 1 reaccion por post
      </p>
    </div>
  );
};

export default ReactionSection; 