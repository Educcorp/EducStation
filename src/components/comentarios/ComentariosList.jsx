import React, { useState, useEffect } from 'react';
import { comentarioService } from '../../services/comentarioService';
import { toast } from 'react-toastify';
import ComentarioItem from './ComentarioItem';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext';
import { FaSync } from 'react-icons/fa';
import { spacing, typography, borderRadius } from '../../styles/theme';

const ComentariosList = ({ postId: propPostId, publicacionId: propPublicacionId }) => {
  // Usar el ID proporcionado, ya sea postId o publicacionId
  const postId = propPostId || propPublicacionId;
  
  console.log('ComentariosList - ID del post usado:', {
    propPostId,
    propPublicacionId,
    postId
  });
  
  const [comentarios, setComentarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comentarioText, setComentarioText] = useState('');
  const [orden, setOrden] = useState('reciente'); // 'reciente' o 'antiguo'
  
  const { isAuthenticated, user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  const cargarComentarios = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!postId) {
        console.error('Error: No se proporcionó ID de post para cargar comentarios');
        setError('No se pudo identificar la publicación');
        setIsLoading(false);
        return;
      }
      
      console.log('Cargando comentarios para el post:', postId);
      const data = await comentarioService.getComentariosByPost(postId);
      setComentarios(data || []);
      console.log('Comentarios cargados:', data);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setError('No se pudieron cargar los comentarios.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (postId) {
      cargarComentarios();
    } else {
      setComentarios([]);
    }
  }, [postId]);
  
  const handleCrearComentario = async (e) => {
    e.preventDefault();
    
    console.log('Intentando crear comentario con texto:', comentarioText);
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comentar');
      return;
    }
    
    if (!comentarioText.trim()) {
      console.log('Texto del comentario vacío, cancelando envío');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!postId) {
        toast.error('Error al identificar la publicación');
        return;
      }
      
      const nuevoComentario = {
        contenido: comentarioText,
        publicacionId: postId,
        postId: postId // Para compatibilidad con ambas formas de pasar el ID
      };
      
      console.log('Enviando comentario al servidor:', nuevoComentario);
      
      await comentarioService.createComentario(nuevoComentario);
      setComentarioText('');
      toast.success('Comentario publicado exitosamente');
      cargarComentarios();
    } catch (error) {
      console.error('Error detallado al crear comentario:', error);
      toast.error('Error al publicar el comentario: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEliminarComentario = async (id) => {
    try {
      await comentarioService.deleteComentario(id);
      toast.success('Comentario eliminado exitosamente');
      cargarComentarios();
    } catch (error) {
      toast.error('Error al eliminar el comentario');
    }
  };
  
  const handleActualizarComentario = async (id, contenido) => {
    try {
      await comentarioService.updateComentario(id, { contenido });
      toast.success('Comentario actualizado exitosamente');
      cargarComentarios();
    } catch (error) {
      toast.error('Error al actualizar el comentario');
    }
  };

  // Ordenar comentarios según el filtro seleccionado
  const comentariosOrdenados = [...comentarios].sort((a, b) => {
    const fechaA = new Date(a.fechaCreacion || a.Fecha_publicacion);
    const fechaB = new Date(b.fechaCreacion || b.Fecha_publicacion);
    
    if (orden === 'reciente') {
      return fechaB - fechaA;
    } else {
      return fechaA - fechaB;
    }
  });

  const styles = {
    container: {
      marginTop: spacing.lg,
    },
    title: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      marginBottom: spacing.md,
    },
    form: {
      marginBottom: spacing.xl,
    },
    textarea: {
      width: '100%',
      minHeight: '100px',
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : colors.gray300}`,
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      fontSize: typography.fontSize.md,
      resize: 'vertical',
      marginBottom: spacing.sm,
    },
    submitButton: {
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: borderRadius.md,
      padding: `${spacing.sm} ${spacing.lg}`,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    disabledButton: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    filterLabel: {
      marginRight: spacing.sm,
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? colors.textLight : colors.textSecondary,
    },
    select: {
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : colors.gray300}`,
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      fontSize: typography.fontSize.sm,
    },
    loadingContainer: {
      textAlign: 'center',
      padding: spacing.lg,
      color: isDarkMode ? colors.textLight : colors.textSecondary,
    },
    errorContainer: {
      padding: spacing.md,
      backgroundColor: isDarkMode ? 'rgba(220, 53, 69, 0.2)' : 'rgba(220, 53, 69, 0.1)',
      borderRadius: borderRadius.md,
      color: colors.error,
      marginBottom: spacing.lg,
    },
    refreshButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: isDarkMode ? colors.textLight : colors.primary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
      fontSize: typography.fontSize.sm,
      marginLeft: 'auto',
    },
    emptyMessage: {
      textAlign: 'center',
      padding: spacing.lg,
      color: isDarkMode ? colors.textLight : colors.textSecondary,
      fontSize: typography.fontSize.md,
      fontStyle: 'italic',
    },
    loginMessage: {
      textAlign: 'center',
      padding: spacing.md,
      backgroundColor: isDarkMode ? 'rgba(0, 123, 255, 0.2)' : 'rgba(0, 123, 255, 0.1)',
      borderRadius: borderRadius.md,
      color: isDarkMode ? colors.textLight : colors.primary,
      marginBottom: spacing.lg,
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Comentarios</h2>
      
      {isAuthenticated ? (
        <form style={styles.form} onSubmit={handleCrearComentario}>
          <textarea
            style={styles.textarea}
            placeholder="Escribe tu comentario..."
            required
            value={comentarioText}
            onChange={(e) => setComentarioText(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(isSubmitting || !comentarioText.trim() ? styles.disabledButton : {})
            }}
            disabled={isSubmitting || !comentarioText.trim()}
            aria-label="Enviar comentario"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar comentario'}
          </button>
        </form>
      ) : (
        <div style={styles.loginMessage}>
          Inicia sesión para dejar un comentario
        </div>
      )}
      
      <div style={styles.filterContainer}>
        <label style={styles.filterLabel} htmlFor="ordenComentarios">Ordenar por:</label>
        <select
          id="ordenComentarios"
          style={styles.select}
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
        >
          <option value="reciente">Más recientes primero</option>
          <option value="antiguo">Más antiguos primero</option>
        </select>
        
        <button
          style={styles.refreshButton}
          onClick={cargarComentarios}
          disabled={isLoading}
        >
          <FaSync style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          Actualizar
        </button>
      </div>
      
      {isLoading ? (
        <div style={styles.loadingContainer}>
          Cargando comentarios...
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <p>{error}</p>
          <button
            style={styles.refreshButton}
            onClick={cargarComentarios}
          >
            <FaSync /> Reintentar
          </button>
        </div>
      ) : comentarios.length === 0 ? (
        <div style={styles.emptyMessage}>
          <p>Aún no hay comentarios en esta publicación. ¡Sé el primero en comentar!</p>
        </div>
      ) : (
        comentariosOrdenados.map((comentario, index) => (
          <ComentarioItem
            key={comentario.ID_comentario || comentario.id || index}
            comentario={comentario}
            onDelete={handleEliminarComentario}
            onUpdate={handleActualizarComentario}
            currentUser={user}
          />
        ))
      )}
    </div>
  );
};

export default ComentariosList; 