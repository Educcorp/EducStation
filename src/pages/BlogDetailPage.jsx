// src/pages/BlogDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicacionById } from '../services/publicacionesService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography, borderRadius } from '../styles/theme';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPublicacionById(id);
        setPost(data);
        setError(null);
        
        // Actualizar título de la página
        document.title = `${data.Titulo} | EducStation`;
      } catch (error) {
        console.error('Error al cargar la publicación:', error);
        setError('No se pudo cargar la publicación. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Estilos para la página de detalles
  const styles = {
    container: {
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    main: {
      flex: 1,
      padding: `${spacing.xl} 0`,
    },
    article: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: spacing.lg,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      borderRadius: borderRadius.md,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
      marginBottom: spacing.xl,
    },
    title: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.textLight : colors.primary,
      marginBottom: spacing.md,
    },
    meta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
    },
    featuredImage: {
      width: '100%',
      maxHeight: '400px',
      objectFit: 'cover',
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
    },
    content: {
      fontSize: typography.fontSize.md,
      lineHeight: '1.7',
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      '& h1, & h2, & h3, & h4, & h5, & h6': {
        color: isDarkMode ? colors.textLight : colors.primary,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
      },
      '& p': {
        marginBottom: spacing.md,
      },
      '& a': {
        color: colors.secondary,
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      '& img': {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: borderRadius.sm,
        margin: `${spacing.md} 0`,
      },
      '& ul, & ol': {
        marginLeft: spacing.lg,
        marginBottom: spacing.md,
      },
      '& li': {
        marginBottom: spacing.xs,
      },
      '& blockquote': {
        borderLeft: `4px solid ${colors.secondary}`,
        paddingLeft: spacing.md,
        fontStyle: 'italic',
        margin: `${spacing.md} 0`,
      },
      '& pre': {
        backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
        padding: spacing.md,
        borderRadius: borderRadius.sm,
        overflowX: 'auto',
        marginBottom: spacing.md,
      },
      '& code': {
        fontFamily: 'monospace',
        backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
        padding: '2px 4px',
        borderRadius: '3px',
      },
    },
    categories: {
      display: 'flex',
      gap: spacing.sm,
      marginTop: spacing.lg,
      flexWrap: 'wrap',
    },
    category: {
      display: 'inline-block',
      padding: `${spacing.xs} ${spacing.sm}`,
      backgroundColor: colors.secondary,
      color: colors.white,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      textDecoration: 'none',
      '&:hover': {
        backgroundColor: colors.secondaryDark,
      },
    },
    backLink: {
      display: 'inline-block',
      marginTop: spacing.xl,
      color: colors.secondary,
      textDecoration: 'none',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: `5px solid ${colors.gray200}`,
      borderTop: `5px solid ${colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    errorContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: spacing.lg,
      backgroundColor: '#FEE2E2',
      color: '#B91C1C',
      borderRadius: borderRadius.md,
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.main}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <p>{error}</p>
            <Link to="/blog" style={styles.backLink}>Volver al blog</Link>
          </div>
        ) : post ? (
          <article style={styles.article}>
            <header style={styles.header}>
              <h1 style={styles.title}>{post.Titulo}</h1>
              <div style={styles.meta}>
                <span>Por {post.NombreAdmin || 'Admin'}</span>
                <span>{formatDate(post.Fecha_creacion)}</span>
              </div>
              {post.Imagen_destacada_ID && (
                <img 
                  src={`${process.env.REACT_APP_API_URL}/api/imagenes/${post.Imagen_destacada_ID}`} 
                  alt={post.Titulo} 
                  style={styles.featuredImage}
                />
              )}
            </header>
            
            <div 
              style={styles.content}
              dangerouslySetInnerHTML={{ __html: post.Contenido }}
            />
            
            {post.categorias && post.categorias.length > 0 && (
              <div style={styles.categories}>
                <span>Categorías: </span>
                {post.categorias.map(cat => (
                  <Link 
                    key={cat.ID_categoria} 
                    to={`/categoria/${cat.ID_categoria}`} 
                    style={styles.category}
                  >
                    {cat.Nombre_categoria}
                  </Link>
                ))}
              </div>
            )}
            
            <Link to="/blog" style={styles.backLink}>
              ← Volver al blog
            </Link>
          </article>
        ) : (
          <div style={styles.errorContainer}>
            <p>No se encontró la publicación solicitada.</p>
            <Link to="/blog" style={styles.backLink}>Volver al blog</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;

