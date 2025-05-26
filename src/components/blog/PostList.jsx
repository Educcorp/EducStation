import React, { useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../styles/theme';
import { FaPlus, FaBookOpen } from 'react-icons/fa';
import { AnimatedButton } from '../utils';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// Importar el hook personalizado y componentes
import { usePosts } from './hooks/usePosts';
import PostCard from './PostCard';

// Componente para renderizar cada ítem de la grid virtualizada
const GridItem = ({ data, columnIndex, rowIndex, style }) => {
  const { posts, columns } = data;
  const index = rowIndex * columns + columnIndex;
  
  if (index >= posts.length) {
    return null;
  }
  
  const post = posts[index];
  
  return (
    <div 
      className="post-card-animation" 
      style={{
        ...style,
        padding: '10px',
        "--animation-order": index,
        background: "transparent"
      }}
    >
      <PostCard post={post} />
    </div>
  );
};

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

  // Función para calcular el número de columnas basado en el ancho disponible
  const getColumnCount = (width) => {
    if (width < 600) return 1;
    if (width < 900) return 2;
    if (width < 1200) return 3;
    return 4;
  };

  // Función para calcular el número de filas
  const getRowCount = useCallback((columnCount, itemCount) => {
    return Math.ceil(itemCount / columnCount);
  }, []);

  // Estilos siguiendo la estructura de CategoryPage
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${spacing.md}`,
      height: '100%',
    },
    gridContainer: {
      height: displayPosts?.length > 0 ? '800px' : 'auto',
      width: '100%',
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
      {/* Grid virtualizado de posts */}
      <div style={styles.gridContainer}>
        <AutoSizer>
          {({ height, width }) => {
            const columnCount = getColumnCount(width);
            const rowCount = getRowCount(columnCount, displayPosts.length);
            const columnWidth = width / columnCount;
            const rowHeight = 400; // Altura estimada de cada tarjeta
            
            return (
              <FixedSizeGrid
                columnCount={columnCount}
                columnWidth={columnWidth}
                height={Math.min(height, rowCount * rowHeight)}
                rowCount={rowCount}
                rowHeight={rowHeight}
                width={width}
                itemData={{
                  posts: displayPosts,
                  columns: columnCount
                }}
                overscanRowCount={1}
                className="posts-grid"
              >
                {GridItem}
              </FixedSizeGrid>
            );
          }}
        </AutoSizer>
      </div>

      {/* Botón para cargar más posts */}
      {hasMore && (
        <div style={styles.loadMoreContainer}>
          <AnimatedButton
            onClick={loadMorePosts}
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
          >
            {loadingMore ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
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
        
        .posts-grid::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .posts-grid::-webkit-scrollbar-track {
          background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
          border-radius: 4px;
        }
        
        .posts-grid::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          border-radius: 4px;
        }
        
        .posts-grid::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
        }
      `}</style>
    </div>
  );
};

export default React.memo(PostList); 