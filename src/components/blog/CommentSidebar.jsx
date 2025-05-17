import React, { useState, useEffect, useContext, useRef } from 'react';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/theme';
import { AuthContext } from '../../context/AuthContext';
import { getTimeAgo } from '../../utils/dateUtils';
import { getComentarios, createComentario, deleteComentario } from '../../services/comentariosService';
import LoadingSpinner from '../ui/LoadingSpinner';
import IconButton from '../common/IconButton';
import { useTheme } from '../../context/ThemeContext';

const CommentSidebar = ({ publicacionId, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const { isAuth, user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const sidebarRef = useRef(null);
  const textareaRef = useRef(null);

  // Cargar comentarios al montar el componente o cuando cambia el ID de publicación
  useEffect(() => {
    if (publicacionId && isOpen) {
      fetchComments();
    }
  }, [publicacionId, isOpen]);

  // Enfocar el textarea cuando se abre la barra
  useEffect(() => {
    if (isOpen && isAuth && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 300);
    }
  }, [isOpen, isAuth]);

  // Detectar clics fuera de la barra lateral para cerrarla
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Efecto para bloquear el scroll del body cuando la barra está abierta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

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
      
      // Reproducir una animación sutil para indicar éxito
      if (sidebarRef.current) {
        sidebarRef.current.classList.add('success-pulse');
        setTimeout(() => {
          sidebarRef.current?.classList.remove('success-pulse');
        }, 1000);
      }
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
      
      // Efecto de eliminación con animación
      const commentElement = document.getElementById(`comment-${comentarioId}`);
      if (commentElement) {
        commentElement.classList.add('delete-animation');
        
        // Esperar a que termine la animación antes de eliminar del estado
        setTimeout(() => {
          setComments(comments.filter(comment => comment.ID_comentario !== comentarioId));
        }, 500);
      } else {
        // Si no se encontró el elemento, actualizar el estado directamente
        setComments(comments.filter(comment => comment.ID_comentario !== comentarioId));
      }
    } catch (error) {
      setError(error.message || 'No se pudo eliminar el comentario. Por favor, inténtalo de nuevo.');
      console.error('Error al eliminar comentario:', error);
    }
  };

  // Verificar si un comentario pertenece al usuario actual
  const canDeleteComment = (comment) => {
    return user && (comment.ID_Usuario === user.id || user.is_staff || user.is_superuser);
  };

  // Alternar la expansión de un comentario
  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Verificar si el comentario debería mostrarse expandido
  const isCommentExpanded = (commentId, contenido) => {
    // Si el contenido es corto, no es necesario expandirlo
    if (contenido.length < 100) return true;
    return !!expandedComments[commentId];
  };

  // Renderizar un comentario individual
  const renderComment = (comment) => {
    const { ID_comentario, Nickname, Contenido, Fecha_publicacion } = comment;
    const isExpanded = isCommentExpanded(ID_comentario, Contenido);
    const needsExpansion = Contenido.length >= 100;
    
    return (
      <div 
        key={ID_comentario} 
        style={commentStyles.comment(isDarkMode)}
        id={`comment-${ID_comentario}`}
        className="comment-item"
      >
        <div style={commentStyles.commentHeader}>
          <div style={commentStyles.commentAuthor(isDarkMode)}>
            <div style={commentStyles.avatarCircle(isDarkMode)}>
              {Nickname.charAt(0).toUpperCase()}
            </div>
            <div style={commentStyles.authorInfo}>
              <div style={commentStyles.authorName(isDarkMode)}>{Nickname}</div>
              <div style={commentStyles.commentDate}>{getTimeAgo(Fecha_publicacion)}</div>
            </div>
          </div>
          {canDeleteComment(comment) && (
            <IconButton 
              icon="trash-alt"
              onClick={() => handleDeleteComment(ID_comentario)}
              color="error"
              size="small"
              ariaLabel="Eliminar comentario"
              tooltip="Eliminar comentario"
            />
          )}
        </div>
        
        <div style={commentStyles.commentContent(isExpanded)}>
          {isExpanded ? Contenido : `${Contenido.substring(0, 100)}...`}
        </div>
        
        {needsExpansion && (
          <button 
            style={commentStyles.expandButton(isDarkMode)}
            onClick={() => toggleCommentExpansion(ID_comentario)}
          >
            {isExpanded ? 'Mostrar menos' : 'Mostrar más'}
          </button>
        )}
        
        <div style={commentStyles.commentActions}>
          <IconButton 
            icon="thumbs-up" 
            size="small" 
            color={isDarkMode ? "primary" : "secondary"}
            tooltip="Me gusta" 
          />
          <IconButton 
            icon="thumbs-down" 
            size="small" 
            color={isDarkMode ? "primary" : "secondary"}
            tooltip="No me gusta" 
          />
          <IconButton 
            icon="reply" 
            text="Responder" 
            size="small" 
            color={isDarkMode ? "primary" : "secondary"}
            tooltip="Responder a este comentario" 
          />
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div 
        ref={sidebarRef}
        style={styles.sidebar(isDarkMode)}
        className="comment-sidebar"
      >
        <div style={styles.header(isDarkMode)}>
          <h3 style={styles.title(isDarkMode)}>
            Comentarios <span style={styles.count}>{comments.length}</span>
          </h3>
          <IconButton 
            icon="times"
            onClick={onClose}
            ariaLabel="Cerrar comentarios"
            tooltip="Cerrar panel de comentarios"
            size="medium"
            color={isDarkMode ? "primary" : "secondary"}
          />
        </div>
        
        {isAuth ? (
          <form onSubmit={handleCommentSubmit} style={styles.form(isDarkMode)}>
            <div style={styles.inputContainer}>
              <textarea
                ref={textareaRef}
                style={styles.textarea(isDarkMode)}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe un comentario..."
                required
                disabled={isSubmitting}
              />
              <button 
                type="submit" 
                style={styles.submitButton(isDarkMode, isSubmitting)}
                disabled={isSubmitting}
                aria-label="Enviar comentario"
              >
                {isSubmitting ? <LoadingSpinner size="small" /> : <i className="fas fa-paper-plane"></i>}
              </button>
            </div>
          </form>
        ) : (
          <div style={styles.loginMessage(isDarkMode)}>
            Inicia sesión para dejar un comentario
          </div>
        )}
        
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <div style={styles.commentsContainer}>
          {isLoading ? (
            <div style={styles.loadingContainer}>
              <LoadingSpinner size="medium" />
            </div>
          ) : comments.length > 0 ? (
            comments.map(comment => renderComment(comment))
          ) : (
            <div style={styles.emptyMessage(isDarkMode)}>
              <i className="fas fa-comments" style={styles.emptyIcon}></i>
              <p>No hay comentarios todavía. ¡Sé el primero en comentar!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Estilos de animación */}
      <style>
        {`
          .comment-sidebar {
            animation: slideIn 0.3s ease-out;
            transform-origin: right center;
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .success-pulse {
            animation: successPulse 1s ease-out;
          }
          
          @keyframes successPulse {
            0% {
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
            }
          }
          
          .comment-item {
            animation: fadeIn 0.5s ease-out;
            transition: all 0.3s ease;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .delete-animation {
            animation: fadeOut 0.5s ease-out forwards;
          }
          
          @keyframes fadeOut {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </div>
  );
};

// Estilos para la barra lateral
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  sidebar: (isDarkMode) => ({
    width: '400px',
    height: '100%',
    backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
    boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  }),
  header: (isDarkMode) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing.md} ${spacing.lg}`,
    borderBottom: `1px solid ${isDarkMode ? colors.borderDark : colors.gray200}`,
  }),
  title: (isDarkMode) => ({
    fontSize: typography.fontSize.lg,
    color: isDarkMode ? colors.textLight : colors.primary,
    fontWeight: typography.fontWeight.semiBold,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  }),
  count: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  form: (isDarkMode) => ({
    padding: `${spacing.md} ${spacing.lg}`,
    borderBottom: `1px solid ${isDarkMode ? colors.borderDark : colors.gray200}`,
    backgroundColor: isDarkMode ? colors.backgroundDark : colors.gray100,
    borderRadius: `0 0 ${borderRadius.md} ${borderRadius.md}`,
  }),
  inputContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    position: 'relative',
  },
  textarea: (isDarkMode) => ({
    width: '100%',
    minHeight: '80px',
    padding: `${spacing.md} ${spacing.md} ${spacing.lg} ${spacing.md}`,
    borderRadius: borderRadius.md,
    border: `1px solid ${isDarkMode ? colors.borderDark : colors.gray200}`,
    backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
    color: isDarkMode ? colors.textLight : colors.textPrimary,
    fontSize: typography.fontSize.md,
    resize: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: colors.primary,
      boxShadow: `0 0 0 2px ${isDarkMode ? colors.primary + '30' : colors.primary + '20'}`,
    },
  }),
  submitButton: (isDarkMode, isSubmitting) => ({
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    backgroundColor: isSubmitting ? colors.gray400 : isDarkMode ? colors.primary : colors.secondary,
    color: colors.white,
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: isSubmitting ? colors.gray400 : isDarkMode ? colors.primaryDark : colors.secondaryDark,
      transform: isSubmitting ? 'none' : 'scale(1.05)',
    },
  }),
  commentsContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: `${spacing.md} ${spacing.lg}`,
  },
  loginMessage: (isDarkMode) => ({
    textAlign: 'center',
    padding: spacing.md,
    margin: `${spacing.md} ${spacing.lg}`,
    backgroundColor: isDarkMode ? colors.backgroundDark : colors.gray100,
    borderRadius: borderRadius.md,
    color: isDarkMode ? colors.textLight : colors.textSecondary,
    fontSize: typography.fontSize.sm,
    boxShadow: isDarkMode ? 'none' : '0 2px 5px rgba(0, 0, 0, 0.05)',
  }),
  errorMessage: {
    backgroundColor: colors.errorLight,
    color: colors.error,
    padding: spacing.md,
    margin: `0 ${spacing.lg} ${spacing.md}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyMessage: (isDarkMode) => ({
    textAlign: 'center',
    color: isDarkMode ? colors.textSecondary : colors.textSecondary,
    padding: spacing.xl,
    fontStyle: 'italic',
    fontSize: typography.fontSize.md,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
  }),
  emptyIcon: {
    fontSize: '3rem',
    color: colors.gray300,
    marginBottom: spacing.md,
  }
};

// Estilos para los comentarios individuales
const commentStyles = {
  comment: (isDarkMode) => ({
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderBottom: `1px solid ${isDarkMode ? colors.borderDark : colors.gray200}`,
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    },
  }),
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  commentAuthor: (isDarkMode) => ({
    display: 'flex',
    alignItems: 'center',
    color: isDarkMode ? colors.textLight : colors.textPrimary,
  }),
  avatarCircle: (isDarkMode) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: isDarkMode ? colors.primary : colors.secondary,
    color: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.sm,
    fontSize: typography.fontSize.sm,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  }),
  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  authorName: (isDarkMode) => ({
    fontWeight: typography.fontWeight.semiBold,
    fontSize: typography.fontSize.sm,
    color: isDarkMode ? colors.textLight : colors.primary,
    marginBottom: '2px',
  }),
  commentDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  commentContent: (isExpanded) => ({
    fontSize: typography.fontSize.sm,
    lineHeight: '1.5',
    marginBottom: spacing.sm,
    whiteSpace: 'pre-wrap',
    maxHeight: isExpanded ? 'none' : '4.5em',
    overflow: isExpanded ? 'visible' : 'hidden',
    position: 'relative',
  }),
  expandButton: (isDarkMode) => ({
    backgroundColor: 'transparent',
    border: 'none',
    color: isDarkMode ? colors.primary : colors.secondary,
    padding: 0,
    fontSize: typography.fontSize.xs,
    cursor: 'pointer',
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.sm,
    '&:hover': {
      textDecoration: 'underline',
    },
  }),
  commentActions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
};

export default CommentSidebar; 