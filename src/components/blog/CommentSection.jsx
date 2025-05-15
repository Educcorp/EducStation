import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/theme';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  // Estilos actualizados para mantener consistencia con el diseño general
  const styles = {
    container: {
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      boxShadow: shadows.md,
      marginBottom: spacing.xxl,
      boxSizing: 'border-box',
    },
    title: {
      fontSize: typography.fontSize.xl,
      color: colors.primary,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.lg,
    },
    textareaContainer: {
      marginBottom: spacing.md,
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.md,
      color: colors.textPrimary,
      resize: 'vertical',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease',
      '&:focus': {
        borderColor: colors.primary,
        outline: 'none',
      }
    },
    button: {
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: borderRadius.md,
      padding: `${spacing.sm} ${spacing.lg}`,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: colors.primaryDark,
        transform: 'translateY(-2px)',
      }
    },
    commentList: {
      marginTop: spacing.xl,
      padding: 0,
      listStyleType: 'none',
    },
    commentItem: {
      padding: spacing.md,
      borderBottom: `1px solid ${colors.gray200}`,
      marginBottom: spacing.md,
      fontSize: typography.fontSize.md,
      color: colors.textPrimary,
      lineHeight: 1.6,
    },
    emptyMessage: {
      textAlign: 'center',
      color: colors.textSecondary,
      padding: spacing.lg,
      fontStyle: 'italic',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Comentarios</h3>
      <form onSubmit={handleCommentSubmit}>
        <div style={styles.textareaContainer}>
          <textarea
            style={{
              ...styles.textarea,
              '&:focus': {
                borderColor: colors.primary,
                outline: 'none',
              }
            }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu comentario aquí..."
            required
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 1px ${colors.primary}`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.gray200;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <button 
          type="submit" 
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.primaryDark;
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.primary;
            e.target.style.transform = 'none';
          }}
        >
          Enviar
        </button>
      </form>
      
      {comments.length > 0 ? (
        <ul style={styles.commentList}>
          {comments.map((c, index) => (
            <li key={index} style={styles.commentItem}>{c}</li>
          ))}
        </ul>
      ) : (
        <div style={styles.emptyMessage}>
          No hay comentarios todavía. ¡Sé el primero en comentar!
        </div>
      )}
    </div>
  );
};

export default CommentSection;
