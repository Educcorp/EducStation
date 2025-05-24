// src/pages/BlogDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { getPublicacionById } from '../services/publicacionesService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostDetail from '../components/blog/PostDetail';
import PostViewer from '../components/blog/PostViewer';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography, borderRadius } from '../styles/theme';

const BlogDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { colors, isDarkMode } = useTheme();

  console.log('BlogDetailPage - ID del post en parámetros:', id);

  // Recarga forzada al entrar (solo una vez por sesión) - OPTIMIZADA
  useEffect(() => {
    const reloadKey = `blogdetail-${id}-reloaded`;
    
    if (location.state && location.state.forceReload) {
      if (!sessionStorage.getItem(reloadKey)) {
        // Establecer marcadores INMEDIATAMENTE antes de recargar
        sessionStorage.setItem('viewing-post', id);
        sessionStorage.setItem('came-from-blog', 'true');
        sessionStorage.setItem(reloadKey, 'true');
        // Recarga inmediata sin delay
        window.history.replaceState(null, '', window.location.pathname);
        window.location.reload();
      }
    } else {
      // Limpiar marcas de recarga de otros posts
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('blogdetail-') && key.endsWith('-reloaded')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }, [location, id]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPublicacionById(id);
        setPost(data);
        setError(null);
        
        console.log('BlogDetailPage - Datos del post recibidos:', {
          id: id,
          postData: data
        });
        
        // Establecer marcadores solo si no se recargó (para evitar duplicación)
        if (!sessionStorage.getItem(`blogdetail-${id}-reloaded`)) {
          sessionStorage.setItem('viewing-post', id);
          sessionStorage.setItem('came-from-blog', 'true');
        }
        
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
    } else {
      console.error('BlogDetailPage - No se proporcionó ID en los parámetros de la URL');
      setError('No se proporcionó un ID de publicación válido.');
      setLoading(false);
    }
  }, [id]);

  // Limpiar marcadores al desmontar el componente - OPTIMIZADO
  useEffect(() => {
    return () => {
      // Solo establecer marcador de salida si estamos viendo un post
      const viewingPost = sessionStorage.getItem('viewing-post');
      if (viewingPost) {
        sessionStorage.setItem('left-post', viewingPost);
        sessionStorage.removeItem('viewing-post');
      }
    };
  }, []);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para navegar de vuelta al blog con recarga
  const navigateToBlог = () => {
    navigate('/blog', { state: { forceReload: true } });
  };

  // Estilos para la página de detalles
  const styles = {
    container: {
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      width: '100%',
    },
    main: {
      flex: 1,
      width: '100%',
      padding: `${spacing.xl} 0`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    contentWrapper: {
      width: '100%',
      maxWidth: '800px',
      padding: `0 ${spacing.md}`,
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
        <div style={styles.contentWrapper}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <p>{error}</p>
              <button 
                onClick={navigateToBlог}
                style={{
                  ...styles.backLink,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 'inherit'
                }}
              >
                Volver al blog
              </button>
            </div>
          ) : post ? (
            <PostDetail post={post} />
          ) : (
            <div style={styles.errorContainer}>
              <p>No se encontró la publicación solicitada.</p>
              <button 
                onClick={navigateToBlог}
                style={{
                  ...styles.backLink,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 'inherit'
                }}
              >
                Volver al blog
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;

