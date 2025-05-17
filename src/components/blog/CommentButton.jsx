import React from 'react';
import { colors, spacing, borderRadius, shadows } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import IconButton from '../common/IconButton';

const CommentButton = ({ onClick, commentCount = 0 }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={styles.container}>
      <div style={styles.button(isDarkMode)} className="comment-btn-wrapper">
        <IconButton
          icon="comments"
          text="Comentarios"
          onClick={onClick}
          color={isDarkMode ? 'primary' : 'secondary'}
          filled={true}
          style={styles.iconButton}
          ariaLabel="Mostrar comentarios"
        />
        {commentCount > 0 && (
          <span style={styles.count(isDarkMode)}>
            {commentCount}
          </span>
        )}
      </div>
      
      {/* Estilos y animaciones para el botón */}
      <style>
        {`
          .comment-btn-wrapper {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .comment-btn-wrapper:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }
          
          .comment-btn-wrapper:active {
            transform: translateY(-1px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(11, 68, 68, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(11, 68, 68, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(11, 68, 68, 0);
            }
          }
          
          @keyframes count-bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-5px);
            }
            60% {
              transform: translateY(-2px);
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    right: spacing.xl,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 100,
  },
  button: (isDarkMode) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: shadows.lg,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  }),
  iconButton: {
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.md,
    fontWeight: 'bold',
    gap: spacing.sm,
  },
  count: (isDarkMode) => ({
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: isDarkMode ? colors.error : colors.error,
    color: colors.white,
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    animation: 'count-bounce 2s infinite',
  }),
};

export default CommentButton; 