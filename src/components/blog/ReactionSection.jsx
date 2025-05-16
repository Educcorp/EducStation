import React, { useState, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { FaThumbsUp, FaHeart, FaCheckCircle, FaLightbulb, FaStar } from 'react-icons/fa';

function getReactionIcon(type) {
  const iconProps = {
    size: 24,
    color: type === 'love' ? '#e25555' : '#1e293b'
  };

  switch (type) {
    case 'like':
      return <FaThumbsUp {...iconProps} />;
    case 'love':
      return <FaHeart {...iconProps} />;
    case 'useful':
      return <FaCheckCircle {...iconProps} />;
    case 'think':
      return <FaLightbulb {...iconProps} />;
    case 'inspire':
      return <FaStar {...iconProps} />;
    default:
      return null;
  }
}

const ReactionSection = ({ postId }) => {
  const [reactions, setReactions] = useState({
    like: 0,  // Me gusta
    love: 0,  // Me encanta
    useful: 0,  // Útil
    think: 0,  // Me hace pensar
    inspire: 0,  // Inspirador
  });

  const [userReactions, setUserReactions] = useState({});

  const [hoveredReaction, setHoveredReaction] = useState(null);

  const reactionLabels = {
    like: 'Me gusta',
    love: 'Me encanta',
    useful: 'Me es útil',
    think: 'Me hace pensar',
    inspire: 'Inspirador',
  };

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
      justifyContent: 'center',
      padding: spacing.sm,
      backgroundColor: isSelected ? colors.primaryLight : colors.background,
      border: `2px solid ${isSelected ? colors.primary : 'transparent'}`,
      borderRadius: borderRadius.md,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '80px',
      minHeight: '80px',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: shadows.md,
      },
      position: 'relative',
    }),
    emoji: {
      marginBottom: spacing.sm,
    },
    count: (isSelected) => ({
      fontSize: typography.fontSize.sm,
      fontWeight: isSelected ? typography.fontWeight.bold : typography.fontWeight.normal,
      color: isSelected ? colors.primary : colors.textSecondary,
    }),
    info: {
      marginTop: spacing.md,
      textAlign: 'center',
    },
    tooltip: {
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(30, 41, 59, 0.95)',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 10,
      marginTop: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.2s ease',
    },
    tooltipArrow: {
      width: 0,
      height: 0,
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: '6px solid rgba(30, 41, 59, 0.95)',
      position: 'absolute',
      top: '-6px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 11,
      filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.1))',
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
            onMouseEnter={() => setHoveredReaction(emoji)}
            onMouseLeave={() => setHoveredReaction(null)}
          >
            {hoveredReaction === emoji && (
              <div style={styles.tooltip}>
                <div style={styles.tooltipArrow}></div>
                {reactionLabels[emoji]}
              </div>
            )}
            <div style={styles.emoji}>{getReactionIcon(emoji)}</div>
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