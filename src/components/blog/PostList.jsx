import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPublicaciones } from '../../services/publicacionesService';
import { searchPublicaciones, searchByTags } from '../../services/searchService';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../styles/theme';

const PostList = ({ limit, categoryFilter, searchTerm }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let data;

        // Si hay término de búsqueda, usamos el servicio de búsqueda
        if (searchTerm && searchTerm.trim() !== '') {
          data = await searchPublicaciones(searchTerm, limit || 10, 0);
        }
        // Si hay filtro de categoría, buscamos por categoría
        else if (categoryFilter) {
          data = await searchByTags(categoryFilter, limit || 10, 0);
        }
        // Si no hay filtros, obtenemos todas las publicaciones
        else {
          data = await getAllPublicaciones(limit || 10, 0, 'publicado');
        }

        setPosts(data);
        setError(null);
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        setError('No se pudieron cargar las publicaciones. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit, categoryFilter, searchTerm]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para extraer un resumen del contenido HTML
  const extractSummary = (content, maxLength = 150) => {
    // Eliminar etiquetas HTML
    const plainText = content.replace(/<[^>]+>/g, '');
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  // Estilos para la lista de posts
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: spacing.lg,
    },
    heading: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.lg,
      color: isDarkMode ? colors.textLight : colors.primary,
      borderBottom: `2px solid ${colors.secondary}`,
      paddingBottom: spacing.sm,
    },
    postGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: spacing.lg,
    },
    postCard: {
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      boxShadow: shadows.md,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: shadows.lg,
      },
    },
    postImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
    },
    postContent: {
      padding: spacing.md,
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.sm,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
    },
    postSummary: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.textLight : colors.textSecondary,
      marginBottom: spacing.md,
    },
    postMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
    },
    postCategory: {
      display: 'inline-block',
      padding: `${spacing.xs} ${spacing.sm}`,
      backgroundColor: colors.secondary,
      color: colors.white,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: `4px solid ${colors.gray200}`,
      borderTop: `4px solid ${colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    errorContainer: {
      padding: spacing.lg,
      backgroundColor: '#FEE2E2',
      color: '#B91C1C',
      borderRadius: borderRadius.md,
      textAlign: 'center',
    },
    noPostsMessage: {
      textAlign: 'center',
      padding: spacing.xl,
      color: isDarkMode ? colors.textLight : colors.textSecondary,
    },
    searchInfo: {
      marginBottom: spacing.lg,
      fontSize: typography.fontSize.md,
      color: colors.textSecondary,
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.noPostsMessage}>
          <h3>No hay publicaciones disponibles</h3>
          {searchTerm && <p>No se encontraron resultados para "{searchTerm}"</p>}
          {categoryFilter && <p>No hay publicaciones en esta categoría</p>}
          {!searchTerm && !categoryFilter && <p>Vuelve más tarde para ver nuevo contenido.</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        {searchTerm 
          ? 'Resultados de búsqueda' 
          : categoryFilter 
            ? 'Publicaciones por categoría' 
            : 'Últimas Publicaciones'}
      </h2>
      
      {searchTerm && (
        <div style={styles.searchInfo}>
          Mostrando resultados para: <strong>{searchTerm}</strong> ({posts.length} encontrados)
        </div>
      )}
      
      <div style={styles.postGrid}>
        {posts.map((post) => (
          <div key={post.ID_publicaciones} style={styles.postCard}>
            <Link to={`/blog/${post.ID_publicaciones}`} style={{ textDecoration: 'none' }}>
              {post.Imagen_destacada_ID ? (
                <img 
                  src={`${process.env.REACT_APP_API_URL}/api/imagenes/${post.Imagen_destacada_ID}`} 
                  alt={post.Titulo} 
                  style={styles.postImage}
                />
              ) : (
                <div 
                  style={{
                    ...styles.postImage,
                    backgroundColor: colors.gray200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.gray500,
                  }}
                >
                  Sin imagen
                </div>
              )}
              <div style={styles.postContent}>
                <h3 style={styles.postTitle}>{post.Titulo}</h3>
                <p style={styles.postSummary}>
                  {post.Resumen || extractSummary(post.Contenido)}
                </p>
                <div style={styles.postMeta}>
                  <span>{formatDate(post.Fecha_creacion)}</span>
                  {post.categorias && post.categorias.length > 0 && (
                    <span style={styles.postCategory}>{post.categorias[0].Nombre_categoria}</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
