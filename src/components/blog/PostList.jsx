import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../styles/theme';
import { FaPlus, FaBookOpen } from 'react-icons/fa';

// Importar el hook personalizado y componentes
import { usePosts } from './hooks/usePosts';
import PostCard from './PostCard';

const PostList = ({ limit, categoryFilter, searchTerm, className, sortOrder = 'recientes' }) => {
  const { colors, isDarkMode } = useTheme();
  
  // Usar el hook personalizado para manejar los posts
  const {
    displayPosts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMorePosts
  } = usePosts({ limit, categoryFilter, searchTerm, sortOrder });

  // Estilos siguiendo la estructura de CategoryPage
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${spacing.md}`,
    },
    postsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
    }
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
      {/* Grid de posts usando la misma estructura que CategoryPage */}
      <div style={styles.postsGrid}>
        {displayPosts.map((post, index) => (
          <div 
            className="post-card-animation" 
            key={post.ID_publicaciones}
            style={{
              "--animation-order": index,
              background: "transparent"
            }}
          >
            <PostCard post={post} />
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
        
        .post-card-animation {
          animation: fadeUpIn 0.6s ease forwards;
          animation-delay: calc(0.1s * var(--animation-order, 0));
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background-color: transparent;
        }
        
        .post-card-animation:hover {
          transform: translateY(-5px);
        }
        
        .post-card-animation > a > div {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};

export default PostList; 