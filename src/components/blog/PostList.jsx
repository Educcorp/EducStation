import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../styles/theme';
import { FaCalendarAlt, FaTag, FaEye, FaPlus, FaUser, FaBookOpen, FaClock } from 'react-icons/fa';

// Importar el hook personalizado y utilidades
import { usePosts } from './hooks/usePosts';
import { 
  formatDate, 
  extractSummary, 
  renderImageHTML,
  calculateReadingTime,
  formatViews,
  isBase64Image,
  isHTMLImage
} from './utils/postHelpers';

const PostList = ({ limit, categoryFilter, searchTerm, className, sortOrder = 'recientes' }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const { colors, isDarkMode } = useTheme();
  
  // Usar el hook personalizado para manejar los posts
  const {
    displayPosts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMorePosts,
    POSTS_PER_PAGE
  } = usePosts({ limit, categoryFilter, searchTerm, sortOrder });

  // Función para renderizar la imagen de portada
  const renderPortadaImage = (post) => {
    const { Imagen_portada, contenido } = post;
    
    if (!Imagen_portada) {
      return (
        <div style={getPostImageStyles(post.ID_publicaciones)}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: colors.lightGray,
            color: colors.textSecondary
          }}>
            <FaBookOpen size={40} />
          </div>
        </div>
      );
    }

    if (isHTMLImage(Imagen_portada)) {
      return (
        <div 
          style={getPostImageStyles(post.ID_publicaciones)}
          dangerouslySetInnerHTML={renderImageHTML(Imagen_portada)}
        />
      );
    }

    if (isBase64Image(Imagen_portada)) {
      return (
        <div style={getPostImageStyles(post.ID_publicaciones)}>
          <img 
            src={Imagen_portada} 
            alt={post.Titulo}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      );
    }

    // Fallback para URLs normales
    return (
      <div style={getPostImageStyles(post.ID_publicaciones)}>
        <img 
          src={Imagen_portada} 
          alt={post.Titulo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: ${colors.lightGray}; color: ${colors.textSecondary};">
                <i class="fa fa-book-open" style="font-size: 40px;"></i>
              </div>
            `;
          }}
        />
      </div>
    );
  };

  // Estilos para la lista de posts
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    heading: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.xl,
      color: isDarkMode ? colors.textLight : colors.primary,
      borderBottom: `2px solid ${colors.secondary}`,
      paddingBottom: spacing.sm,
      position: 'relative',
      display: 'inline-block'
    },
    headingUnderline: {
      position: 'absolute',
      bottom: '-2px',
      left: '0',
      width: '60px',
      height: '4px',
      backgroundColor: colors.secondary,
      borderRadius: '2px'
    },
    postGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: spacing.xl,
      marginBottom: spacing.xxl
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
      '&:hover': {
        backgroundColor: colors.primaryDark,
        transform: 'translateY(-2px)',
        boxShadow: shadows.md
      },
      '&:disabled': {
        backgroundColor: colors.gray,
        cursor: 'not-allowed',
        transform: 'none'
      }
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
    }
  };

  // Función para obtener estilos de tarjeta de post
  const getPostCardStyles = (postId) => {
    const isHovered = hoveredCard === postId;
    return {
      backgroundColor: isDarkMode ? colors.cardDark : colors.white,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      boxShadow: isHovered ? shadows.lg : shadows.sm,
      transition: 'all 0.3s ease',
      transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      border: `1px solid ${isDarkMode ? colors.borderDark : colors.border}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    };
  };

  // Función para obtener estilos de imagen de post
  const getPostImageStyles = (postId) => {
    return {
      width: '100%',
      height: '200px',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: colors.lightGray
    };
  };

  // Función para obtener estilos de contenido de post
  const getPostContentStyles = () => {
    return {
      padding: spacing.lg,
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    };
  };

  // Función para obtener estilos de título de post
  const getPostTitleStyles = () => {
    return {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.textLight : colors.textDark,
      marginBottom: spacing.sm,
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    };
  };

  // Función para obtener estilos de resumen de post
  const getPostSummaryStyles = () => {
    return {
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      lineHeight: '1.6',
      marginBottom: spacing.md,
      flex: 1
    };
  };

  // Función para obtener estilos de metadatos de post
  const getPostMetaStyles = () => {
    return {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: typography.fontSize.xs,
      color: colors.textSecondary,
      marginTop: 'auto'
    };
  };

  // Función para obtener estilos de etiquetas de metadatos
  const getMetaTagStyles = () => {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs
    };
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
        <FaBookOpen size={48} style={{ marginBottom: spacing.md }} />
        <h3>No se encontraron publicaciones</h3>
        <p>No hay publicaciones disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className={className}>
      <div style={styles.postGrid}>
        {displayPosts.map((post) => (
          <Link
            key={post.ID_publicaciones}
            to={`/blog/${post.ID_publicaciones}`}
            style={{ textDecoration: 'none' }}
            onMouseEnter={() => setHoveredCard(post.ID_publicaciones)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <article style={getPostCardStyles(post.ID_publicaciones)}>
              {/* Imagen de portada */}
              {renderPortadaImage(post)}
              
              {/* Contenido del post */}
              <div style={getPostContentStyles()}>
                <h3 style={getPostTitleStyles()}>
                  {post.Titulo}
                </h3>
                
                <p style={getPostSummaryStyles()}>
                  {extractSummary(post.contenido || post.Contenido, 120)}
                </p>
                
                {/* Metadatos */}
                <div style={getPostMetaStyles()}>
                  <div style={getMetaTagStyles()}>
                    <FaCalendarAlt />
                    <span>{formatDate(post.Fecha_creacion)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: spacing.md }}>
                    <div style={getMetaTagStyles()}>
                      <FaClock />
                      <span>{calculateReadingTime(post.contenido || post.Contenido)}</span>
                    </div>
                    
                    {post.visualizaciones && (
                      <div style={getMetaTagStyles()}>
                        <FaEye />
                        <span>{formatViews(post.visualizaciones)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Categoría si está disponible */}
                {post.categoria && (
                  <div style={{
                    marginTop: spacing.sm,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs
                  }}>
                    <FaTag style={{ color: colors.secondary }} />
                    <span style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.secondary,
                      fontWeight: typography.fontWeight.medium
                    }}>
                      {post.categoria}
                    </span>
                  </div>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Botón para cargar más posts */}
      {hasMore && (
        <div style={styles.loadMoreContainer}>
          <button
            onClick={loadMorePosts}
            disabled={loadingMore}
            style={styles.loadMoreButton}
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

      {/* Estilos para la animación de carga */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PostList; 