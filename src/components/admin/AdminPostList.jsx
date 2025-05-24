import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../styles/theme';

// Importar el hook personalizado
import { useAdminPosts } from './utils/useAdminPosts';

const AdminPostList = ({ 
  adminId, 
  searchTerm, 
  filter = 'all', 
  sortOrder = 'recientes',
  onDelete,
  className 
}) => {
  const { colors, isDarkMode } = useTheme();
  
  // Usar el hook personalizado para manejar los posts
  const {
    posts: displayPosts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMorePosts
  } = useAdminPosts({ adminId, searchTerm, filter, sortOrder });

  // Estilos para el componente
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${spacing.md}`,
    },
    postsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: spacing.lg,
      marginBottom: spacing.xl
    },
    loadMoreContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: spacing.xl
    },
    loadMoreButton: {
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      padding: `${spacing.md} ${spacing.xl}`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      transition: 'all 0.3s ease',
      boxShadow: shadows.sm,
    },
    errorMessage: {
      backgroundColor: colors.error,
      color: colors.white,
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      textAlign: 'center',
      marginBottom: spacing.xl
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: typography.fontSize.lg,
      color: colors.textSecondary
    },
    emptyState: {
      textAlign: 'center',
      padding: spacing.xxl,
      color: colors.textSecondary
    },
    postCard: {
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      boxShadow: shadows.md,
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
    },
    postImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.backgroundLight
    },
    postContent: {
      padding: spacing.lg,
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
      color: isDarkMode ? colors.white : colors.textPrimary,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    postExcerpt: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.textLight : colors.textSecondary,
      marginBottom: spacing.md,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    postMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
      paddingTop: spacing.md,
      borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
    },
    postDate: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? colors.textLight : colors.textSecondary
    },
    postStatus: {
      display: 'inline-block',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium
    },
    actionsContainer: {
      display: 'flex',
      gap: spacing.sm,
      marginTop: spacing.md,
      justifyContent: 'flex-end'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    editButton: {
      backgroundColor: isDarkMode ? colors.warningDark : colors.warning,
      color: isDarkMode ? colors.black : colors.white
    },
    viewButton: {
      backgroundColor: isDarkMode ? colors.infoDark : colors.info,
      color: colors.white
    },
    deleteButton: {
      backgroundColor: isDarkMode ? colors.errorDark : colors.error,
      color: colors.white
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'publicado': return { bg: isDarkMode ? '#1b4d3e' : '#e6f7ef', text: isDarkMode ? '#4ade80' : '#166534' };
      case 'borrador': return { bg: isDarkMode ? '#3b3054' : '#f3e8ff', text: isDarkMode ? '#c084fc' : '#7e22ce' };
      default: return { bg: isDarkMode ? '#374151' : '#f3f4f6', text: isDarkMode ? '#9ca3af' : '#4b5563' };
    }
  };

  // Procesar imagen de portada
  const getImageUrl = (imageData) => {
    if (!imageData) return '/assets/images/placeholder.jpg';
    
    // Si ya es una URL o un string de base64, devolverlo tal cual
    if (typeof imageData === 'string') {
      if (imageData.startsWith('http') || imageData.startsWith('/assets')) {
        return imageData;
      }
      return imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`;
    }
    
    return '/assets/images/placeholder.jpg';
  };

  if (loading) {
    return (
      <div style={styles.loadingSpinner}>
        <div>Cargando publicaciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorMessage}>
        {error}
      </div>
    );
  }

  if (!displayPosts || displayPosts.length === 0) {
    return (
      <div style={styles.emptyState}>
        <FaPlus size={48} style={{ marginBottom: spacing.md }} />
        <h3>No se encontraron publicaciones</h3>
        <p>No hay publicaciones disponibles con los filtros actuales.</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className={className}>
      {/* Grid de posts */}
      <div style={styles.postsGrid}>
        {displayPosts.map((post, index) => (
          <div 
            className="admin-post-card-animation" 
            key={post.ID_publicaciones}
            style={{
              "--animation-order": index,
              background: "transparent"
            }}
          >
            <div style={styles.postCard}>
              <img 
                src={getImageUrl(post.Imagen_portada)} 
                alt={post.Titulo} 
                style={styles.postImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/images/placeholder.jpg';
                }}
              />
              <div style={styles.postContent}>
                <h3 style={styles.postTitle}>{post.Titulo}</h3>
                <p style={styles.postExcerpt}>{post.Resumen}</p>
                
                <div style={styles.postMeta}>
                  <div>
                    <div style={styles.postDate}>
                      {formatDate(post.Fecha_creacion)}
                    </div>
                    <div 
                      style={{
                        ...styles.postStatus,
                        backgroundColor: getStatusColor(post.Estado).bg,
                        color: getStatusColor(post.Estado).text
                      }}
                    >
                      {post.Estado === 'publicado' ? 'Publicado' : 'Borrador'}
                    </div>
                  </div>
                </div>
                
                <div style={styles.actionsContainer}>
                  <Link to={`/blog/post/${post.ID_publicaciones}`}>
                    <button 
                      style={{...styles.actionButton, ...styles.viewButton}}
                      title="Ver publicación"
                    >
                      <FaEye />
                    </button>
                  </Link>
                  <Link to={`/admin/post/edit/${post.ID_publicaciones}`}>
                    <button 
                      style={{...styles.actionButton, ...styles.editButton}}
                      title="Editar publicación"
                    >
                      <FaEdit />
                    </button>
                  </Link>
                  <button 
                    style={{...styles.actionButton, ...styles.deleteButton}}
                    onClick={() => onDelete && onDelete(post.ID_publicaciones)}
                    title="Eliminar publicación"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón para cargar más posts */}
      {hasMore && (
        <div style={styles.loadMoreContainer}>
          <button
            onClick={loadMorePosts}
            disabled={loadingMore}
            style={{
              ...styles.loadMoreButton,
              opacity: loadingMore ? 0.7 : 1,
              cursor: loadingMore ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!loadingMore) {
                e.target.style.backgroundColor = colors.primaryDark;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = shadows.md;
              }
            }}
            onMouseLeave={(e) => {
              if (!loadingMore) {
                e.target.style.backgroundColor = colors.primary;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = shadows.sm;
              }
            }}
          >
            {loadingMore ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Cargando...
              </>
            ) : (
              <>
                <FaPlus />
                Cargar más publicaciones
              </>
            )}
          </button>
        </div>
      )}

      {/* Estilos para las animaciones */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeUpIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .admin-post-card-animation {
          animation: fadeUpIn 0.6s ease forwards;
          animation-delay: calc(0.1s * var(--animation-order, 0));
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background-color: transparent;
        }
        
        .admin-post-card-animation:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default AdminPostList; 