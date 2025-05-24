/* Modificación para el componente PostViewer.jsx */
// Actualiza el componente para usar los estilos corregidos
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import ReactionSection from './ReactionSection';
// Importamos el archivo CSS específico para posts
import '../../styles/posts.css';
import { useTheme } from '../../context/ThemeContext';
import './PostViewer.css'; // Importaremos un archivo CSS para estilos adicionales
import ComentariosList from '../comentarios/ComentariosList';

const PostViewer = () => {
  const { postId } = useParams(); // Obtiene el ID del post de la URL
  const location = useLocation();
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchPostContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar el archivo HTML correspondiente al ID del post
        const postPath = postId === 'featured' ? `/post/postfeature.html` : `/post/post${postId}.html`;
        console.log('Intentando cargar post desde:', postPath);
        
        const response = await fetch(postPath);
        
        if (!response.ok) {
          throw new Error(`Error al cargar el post: ${response.status}`);
        }
        
        const htmlContent = await response.text();
        setPostContent(htmlContent);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar el post:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostContent();
    }
  }, [postId]);

  // Estilos modificados para corregir la alineación
  const styles = {
    pageWrapper: {
      width: "100%",
      fontFamily: typography.fontFamily,
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh", // Asegura que la página ocupe al menos la altura de la ventana
    },
    mainContainer: {
      width: "100%",
      maxWidth: "1200px", // Este ancho máximo se aplicará a todo
      margin: "0 auto", // Centrado horizontal
      padding: `0 ${spacing.md}`, // Padding horizontal consistente
      boxSizing: "border-box",
      flex: "1 0 auto", // Hace que el contenedor principal ocupe el espacio disponible
    },
    contentContainer: {
      padding: `100px 0 ${spacing.xxl}`,
      position: "relative",
      width: "100%",
    },
    postContainer: {
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      boxShadow: shadows.md,
      marginBottom: spacing.xl,
      width: "100%",
      boxSizing: "border-box",
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
    },
    commentsContainer: {
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      boxShadow: shadows.md,
      width: "100%",
      boxSizing: "border-box",
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
    },
    loadingMessage: {
      textAlign: "center",
      padding: `${spacing.xxl} 0`,
      color: isDarkMode ? colors.textLight : colors.primary,
      fontSize: typography.fontSize.lg
    },
    errorMessage: {
      textAlign: "center",
      padding: `${spacing.xl} 0`,
      color: colors.error,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? 'rgba(181, 61, 0, 0.2)' : 'rgba(181, 61, 0, 0.1)',
      borderRadius: borderRadius.md,
      margin: `${spacing.xl} 0`
    },
    errorDetails: {
      marginTop: spacing.md,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm
    },
    errorHelp: {
      marginTop: spacing.lg,
      padding: spacing.lg,
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      color: colors.textPrimary,
      border: `1px solid ${colors.gray200}`
    },
    breadcrumb: {
      margin: `${spacing.lg} 0`,
      color: isDarkMode ? colors.textLight : colors.textSecondary,
      fontSize: typography.fontSize.sm,
      display: "flex",
      alignItems: "center",
      gap: spacing.sm
    },
    breadcrumbLink: {
      color: isDarkMode ? colors.textLight : colors.textSecondary,
      textDecoration: "none",
      transition: "all 0.3s ease",
      '&:hover': {
        color: colors.primary
      }
    },
    returnButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: spacing.xs,
      marginTop: spacing.lg,
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: colors.secondary,
      color: colors.primary,
      borderRadius: borderRadius.md,
      textDecoration: "none",
      fontWeight: typography.fontWeight.medium,
      transition: "all 0.3s ease",
      '&:hover': {
        backgroundColor: colors.primary,
        color: colors.white
      }
    },
    container: {
      fontSize: typography.fontSize.md,
      lineHeight: '1.7',
      color: isDarkMode ? colors.textLight : colors.textPrimary,
    },
    sectionTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      marginBottom: spacing.lg,
      paddingBottom: spacing.sm,
      borderBottom: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    }
  };

  // Función para crear un componente con el contenido HTML
  const createPostComponent = () => {
    return {
      __html: postContent
    };
  };

  if (!postContent) {
    return null;
  }

  return (
    <div style={styles.pageWrapper}>
      <Header />
      
      <div style={styles.mainContainer}>
        <main style={styles.contentContainer}>
          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            <Link 
              to="/"
              style={styles.breadcrumbLink}
              onMouseEnter={(e) => e.target.style.color = colors.primary} 
              onMouseLeave={(e) => e.target.style.color = isDarkMode ? colors.textLight : colors.textSecondary}
            >Inicio</Link>
            <span style={{color: isDarkMode ? 'rgba(255,255,255,0.3)' : colors.gray300, fontSize: '10px'}}>►</span>
            <button 
              onClick={() => {
                // Navigate to blog page with instant reload
                if(location.pathname === '/blog') {
                  window.location.reload();
                } else {
                  window.location.href = '/blog';
                }
              }}
              style={{
                ...styles.breadcrumbLink,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                fontSize: 'inherit'
              }}
              onMouseEnter={(e) => e.target.style.color = colors.primary} 
              onMouseLeave={(e) => e.target.style.color = isDarkMode ? colors.textLight : colors.textSecondary}
            >Blog</button>
            <span style={{color: isDarkMode ? 'rgba(255,255,255,0.3)' : colors.gray300, fontSize: '10px'}}>►</span>
            <span>Post {postId}</span>
          </div>
          
          {/* Contenedor del Post */}
          <div style={styles.postContainer}>
            {loading ? (
              <div style={styles.loadingMessage}>
                Cargando contenido del post...
              </div>
            ) : error ? (
              <div style={styles.errorMessage}>
                <div>Error: {error}</div>
                <div style={styles.errorDetails}>
                  No se pudo cargar el contenido del post solicitado.
                </div>
                <div style={styles.errorHelp}>
                  <p><strong>Posibles soluciones:</strong></p>
                  <ul>
                    <li>Verifica que el archivo HTML del post exista en la carpeta 'public/post/'</li>
                    <li>El nombre del archivo debe ser 'post{postId}.html'</li>
                    <li>Si estás en desarrollo local, reinicia el servidor</li>
                  </ul>
                  <Link
                    to="/"
                    style={styles.returnButton}
                  >
                    ← Volver a la página principal
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`post-content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                  style={styles.container}
                  dangerouslySetInnerHTML={createPostComponent()}
                />
                <ReactionSection postId={postId} />
              </>
            )}
          </div>

          {/* Separador visual */}
          <div style={{
            borderTop: `1.5px solid ${isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
            margin: '2.5rem 0',
            width: '100%'
          }} />

          {/* Sección de Comentarios */}
          <div style={{
            backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            boxShadow: shadows.md,
            width: '100%',
            boxSizing: 'border-box',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
            marginBottom: spacing.xl
          }}>
            <ComentariosList postId={postId} />
          </div>

        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default PostViewer;