import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../styles/theme';
import { FaPlus, FaBookOpen, FaSpinner } from 'react-icons/fa';
import { AnimatedButton } from '../utils';

// Importar el hook personalizado y componentes
import { usePosts } from './hooks/usePosts';
import PostCard from './PostCard';

// Componente de loading optimizado
const LoadingSpinner = memo(() => {
  const { colors } = useTheme();
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: typography.fontSize.lg,
      color: colors.textSecondary
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md
      }}>
        <FaSpinner 
          size={20} 
          style={{
            animation: 'spin 1s linear infinite'
          }}
        />
        <span>Cargando publicaciones...</span>
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Componente de estado vacío optimizado
const EmptyState = memo(() => {
  const { colors } = useTheme();
  
  return (
    <div style={{
      textAlign: 'center',
      padding: spacing.xxl,
      color: colors.textSecondary
    }}>
      <FaBookOpen size={48} style={{ marginBottom: spacing.md }} />
      <h3>No se encontraron publicaciones</h3>
      <p>No hay publicaciones disponibles en este momento.</p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

// Componente de error optimizado
const ErrorMessage = memo(({ error }) => {
  const { colors } = useTheme();
  
  return (
    <div style={{
      backgroundColor: colors.error,
      color: colors.white,
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      textAlign: 'center',
      marginBottom: spacing.xl
    }}>
      {error}
    </div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

// Componente del botón de cargar más optimizado
const LoadMoreButton = memo(({ 
  hasMore, 
  loadingMore, 
  onLoadMore, 
  colors, 
  spacing, 
  typography, 
  borderRadius 
}) => {
  if (!hasMore) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: spacing.xl
    }}>
      <AnimatedButton
        onClick={onLoadMore}
        backgroundColor={colors.primary}
        hoverBackgroundColor={colors.primaryDark}
        padding={`${spacing.md} ${spacing.xl}`}
        borderRadius={borderRadius.md}
        style={{
          opacity: loadingMore ? 0.7 : 1,
          cursor: loadingMore ? 'not-allowed' : 'pointer',
          fontSize: typography.fontSize.md,
          fontWeight: typography.fontWeight.medium,
        }}
        disabled={loadingMore}
      >
        {loadingMore ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <FaSpinner style={{
              animation: 'spin 1s linear infinite'
            }} />
            <span>Cargando...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <FaPlus />
            <span>Cargar más publicaciones</span>
          </div>
        )}
      </AnimatedButton>
    </div>
  );
});

LoadMoreButton.displayName = 'LoadMoreButton';

// Intersection Observer Hook para lazy loading
const useIntersectionObserver = (callback, options = {}) => {
  const targetRef = useRef();

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px',
      ...options
    });

    observer.observe(target);

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [callback, options]);

  return targetRef;
};

const PostList = memo(({ 
  limit, 
  categoryFilter, 
  searchTerm, 
  className, 
  sortOrder = 'recientes' 
}) => {
  const { colors, isDarkMode } = useTheme();
  
  // Usar el hook personalizado para manejar los posts
  const {
    displayPosts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMorePosts,
    stats
  } = usePosts({ limit, categoryFilter, searchTerm, sortOrder });

  // Callback para auto-cargar más posts cuando lleguemos al final
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadMorePosts();
    }
  }, [loadingMore, hasMore, loadMorePosts]);

  // Referencia para el observer de lazy loading
  const loadMoreRef = useIntersectionObserver(handleLoadMore);

  // Estilos memoizados para mejor rendimiento
  const styles = useMemo(() => ({
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${spacing.md}`,
    },
    postsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: spacing.lg,
      marginBottom: spacing.xl,
      // Optimización para GPU
      willChange: "contents",
      transform: "translateZ(0)"
    },
    statsInfo: {
      padding: spacing.sm,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      borderRadius: borderRadius.sm,
      marginBottom: spacing.md,
      fontSize: typography.fontSize.xs,
      color: colors.textSecondary,
      textAlign: 'center'
    }
  }), [colors, isDarkMode, spacing, typography, borderRadius]);

  // Renderizado optimizado de posts con key estable
  const renderPosts = useMemo(() => {
    return displayPosts.map((post, index) => (
      <div 
        key={`post-${post.ID_publicaciones}`}
        className="post-card-animation" 
        style={{
          "--animation-order": index,
          background: "transparent",
          // Optimización para el renderizado
          contain: "layout style paint"
        }}
      >
        <PostCard post={post} />
      </div>
    ));
  }, [displayPosts]);

  // Estados de carga y error
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!displayPosts || displayPosts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div style={styles.container} className={className}>
      {/* Información de estadísticas en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div style={styles.statsInfo}>
          📊 Posts: {stats.displayedPosts}/{stats.totalPosts} | 
          Progreso: {stats.loadingProgress}% | 
          Cache: {stats.cacheSize} entradas
        </div>
      )}

      {/* Grid de posts optimizado */}
      <div style={styles.postsGrid}>
        {renderPosts}
      </div>

      {/* Elemento observador para lazy loading automático */}
      {hasMore && (
        <div ref={loadMoreRef} style={{ height: '1px', margin: spacing.lg }} />
      )}

      {/* Botón de cargar más como respaldo */}
      <LoadMoreButton
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={loadMorePosts}
        colors={colors}
        spacing={spacing}
        typography={typography}
        borderRadius={borderRadius}
      />

      {/* CSS optimizado */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .post-card-animation {
          animation: fadeUpIn 0.6s ease forwards;
          animation-delay: calc(0.05s * var(--animation-order, 0));
          opacity: 0;
          will-change: opacity, transform;
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
        
        /* Optimizaciones para mejor rendimiento */
        .post-card-animation {
          contain: layout style paint;
          transform: translateZ(0);
        }
        
        /* Mejoras de scrolling en móviles */
        @media (max-width: 768px) {
          .post-card-animation {
            animation-delay: calc(0.03s * var(--animation-order, 0));
          }
        }
      `}</style>
    </div>
  );
});

PostList.displayName = 'PostList';

export default PostList; 