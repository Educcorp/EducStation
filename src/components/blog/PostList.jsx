import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPublicaciones } from '../../services/publicacionesService';
import { searchPublicaciones, searchByTags } from '../../services/searchService';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../styles/theme';
import { FaCalendarAlt, FaTag, FaEye } from 'react-icons/fa';

const PostList = ({ limit, categoryFilter, searchTerm, className }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
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
    postCard: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : colors.white,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      boxShadow: shadows.md,
      transition: 'all 0.3s ease',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      opacity: 0,
      transform: 'translateY(20px)'
    },
    postImageContainer: {
      position: 'relative',
      overflow: 'hidden',
      height: '200px'
    },
    postImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease'
    },
    postImageOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: spacing.sm,
      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    postDate: {
      color: colors.white,
      fontSize: typography.fontSize.sm,
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    postCategory: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: `${spacing.xs} ${spacing.sm}`,
      backgroundColor: colors.secondary,
      color: colors.white,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
    },
    postContent: {
      padding: spacing.lg,
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.sm,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      transition: 'color 0.3s ease'
    },
    postSummary: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.gray300 : colors.textSecondary,
      marginBottom: spacing.md,
      lineHeight: '1.6',
      flexGrow: 1
    },
    postFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
      paddingTop: spacing.md,
      borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
    },
    readMoreLink: {
      color: colors.secondary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      transition: 'color 0.3s ease'
    },
    viewCount: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      color: isDarkMode ? colors.gray400 : colors.gray500,
      fontSize: typography.fontSize.sm
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: `4px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      borderTop: `4px solid ${colors.secondary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    errorContainer: {
      padding: spacing.xl,
      backgroundColor: isDarkMode ? 'rgba(220,38,38,0.1)' : '#FEE2E2',
      color: isDarkMode ? '#F87171' : '#B91C1C',
      borderRadius: borderRadius.lg,
      textAlign: 'center',
      boxShadow: shadows.md,
      border: '1px solid rgba(220,38,38,0.2)'
    },
    noPostsMessage: {
      textAlign: 'center',
      padding: spacing.xxl,
      color: isDarkMode ? colors.gray300 : colors.textSecondary,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm
    },
    searchInfo: {
      marginBottom: spacing.lg,
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.gray300 : colors.textSecondary,
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      borderRadius: borderRadius.md,
      display: 'inline-block'
    },
  };

  // Agregar estilos para la animación del spinner y las tarjetas
  const animations = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .blog-post-card {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease;
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{animations}</style>
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
          <h3 style={{marginBottom: spacing.md, color: isDarkMode ? colors.gray200 : colors.primary}}>
            No hay publicaciones disponibles
          </h3>
          {searchTerm && <p>No se encontraron resultados para "{searchTerm}"</p>}
          {categoryFilter && <p>No hay publicaciones en esta categoría</p>}
          {!searchTerm && !categoryFilter && <p>Vuelve más tarde para ver nuevo contenido.</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{animations}</style>
      <h2 style={styles.heading}>
        {searchTerm 
          ? 'Resultados de búsqueda' 
          : categoryFilter 
            ? 'Publicaciones por categoría' 
            : 'Últimas Publicaciones'}
        <div style={styles.headingUnderline}></div>
      </h2>
      
      {searchTerm && (
        <div style={styles.searchInfo}>
          Mostrando resultados para: <strong>{searchTerm}</strong> ({posts.length} encontrados)
        </div>
      )}
      
      <div style={styles.postGrid}>
        {posts.map((post) => (
          <div 
            key={post.ID_publicaciones} 
            className="blog-post-card"
            style={{
              ...styles.postCard,
              transform: hoveredCard === post.ID_publicaciones ? 'translateY(-5px)' : undefined,
              boxShadow: hoveredCard === post.ID_publicaciones ? shadows.lg : shadows.md
            }}
            onMouseEnter={() => setHoveredCard(post.ID_publicaciones)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Link to={`/blog/${post.ID_publicaciones}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={styles.postImageContainer}>
                {post.Imagen_destacada_ID ? (
                  <img 
                    src={`${process.env.REACT_APP_API_URL}/api/imagenes/${post.Imagen_destacada_ID}`} 
                    alt={post.Titulo} 
                    style={{
                      ...styles.postImage,
                      transform: hoveredCard === post.ID_publicaciones ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                ) : (
                  <div 
                    style={{
                      ...styles.postImage,
                      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.gray200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDarkMode ? colors.gray500 : colors.gray500,
                    }}
                  >
                    Sin imagen
                  </div>
                )}
                <div style={styles.postImageOverlay}>
                  <span style={styles.postDate}>
                    <FaCalendarAlt size={12} /> {formatDate(post.Fecha_creacion)}
                  </span>
                  {post.categorias && post.categorias.length > 0 && (
                    <span style={styles.postCategory}>
                      <FaTag size={10} /> {post.categorias[0].Nombre_categoria}
                    </span>
                  )}
                </div>
              </div>
              <div style={styles.postContent}>
                <h3 style={{
                  ...styles.postTitle,
                  color: hoveredCard === post.ID_publicaciones 
                    ? colors.secondary 
                    : (isDarkMode ? colors.textLight : colors.textPrimary)
                }}>
                  {post.Titulo}
                </h3>
                <p style={styles.postSummary}>
                  {post.Resumen || extractSummary(post.Contenido)}
                </p>
                <div style={styles.postFooter}>
                  <span style={{
                    ...styles.readMoreLink,
                    color: hoveredCard === post.ID_publicaciones ? colors.primary : colors.secondary
                  }}>
                    Leer más &rarr;
                  </span>
                  <span style={styles.viewCount}>
                    <FaEye size={14} /> {Math.floor(Math.random() * 1000) + 100}
                  </span>
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
