import React, { useState, useEffect, useContext } from 'react';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/theme';
import { AuthContext } from '../../context/AuthContext';
import Comment from './Comment';
import { getComentarios, createComentario, deleteComentario } from '../../services/comentariosService';
import LoadingSpinner from '../ui/LoadingSpinner';

const CommentSection = ({ publicacionId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { isAuth, user } = useContext(AuthContext);

  // Cargar comentarios al montar el componente
  useEffect(() => {
    if (publicacionId) {
      fetchComments();
    }
  }, [publicacionId]);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const comentarios = await getComentarios(publicacionId);
      setComments(comentarios);
    } catch (error) {
      setError('No se pudieron cargar los comentarios. Por favor, inténtalo de nuevo más tarde.');
      console.error('Error al cargar comentarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      const nuevoComentario = await createComentario(publicacionId, commentText);
      setComments([nuevoComentario, ...comments]);
      setCommentText('');
    } catch (error) {
      setError(error.message || 'No se pudo enviar el comentario. Por favor, inténtalo de nuevo.');
      console.error('Error al enviar comentario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (comentarioId) => {
    try {
      await deleteComentario(comentarioId);
      setComments(comments.filter(comment => comment.ID_comentario !== comentarioId));
    } catch (error) {
      setError(error.message || 'No se pudo eliminar el comentario. Por favor, inténtalo de nuevo.');
      console.error('Error al eliminar comentario:', error);
    }
  };

  // Verificar si un comentario pertenece al usuario actual
  const canDeleteComment = (comment) => {
    return user && (comment.ID_Usuario === user.id || user.is_staff || user.is_superuser);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Comentarios</h3>
      
      {isAuth ? (
        <form onSubmit={handleCommentSubmit} style={styles.form}>
          <div style={styles.textareaContainer}>
            <textarea
              style={styles.textarea}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe tu comentario aquí..."
              required
              disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      ) : (
        <div style={styles.loginMessage}>
          <p>Inicia sesión para dejar un comentario</p>
        </div>
      )}
      
      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <div style={styles.commentList}>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <LoadingSpinner size="medium" />
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <Comment 
              key={comment.ID_comentario} 
              comment={comment} 
              canDelete={canDeleteComment(comment)}
              onDelete={handleDeleteComment}
            />
          ))
        ) : (
          <div style={styles.emptyMessage}>
            No hay comentarios todavía. ¡Sé el primero en comentar!
          </div>
        )}
      </div>
    </div>
  );
};

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
  form: {
    marginBottom: spacing.xl,
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
    },
    '&:disabled': {
      backgroundColor: colors.gray400,
      cursor: 'not-allowed',
    }
  },
  commentList: {
    marginTop: spacing.lg,
  },
  emptyMessage: {
    textAlign: 'center',
    color: colors.textSecondary,
    padding: spacing.lg,
    fontStyle: 'italic',
  },
  loginMessage: {
    textAlign: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  errorMessage: {
    backgroundColor: colors.errorLight,
    color: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    fontSize: typography.fontSize.sm,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: spacing.xl,
  }
};

export default CommentSection;
