/* Modificación para el componente PostViewer.jsx */
// Actualiza el componente para usar los estilos corregidos
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';

const PostViewer = () => {
  const { postId } = useParams(); // Obtiene el ID del post de la URL
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Siempre usamos post1.html para todos los posts por ahora
        const postPath = `/post/post1.html`;
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

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `100px ${spacing.md} ${spacing.xxl}`,
      position: "relative",
      width: "100%",
      boxSizing: "border-box"
    },
    postContainer: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      boxShadow: shadows.md,
      marginBottom: spacing.xxl,
      width: "100%",
      boxSizing: "border-box"
    },
    loadingMessage: {
      textAlign: "center",
      padding: `${spacing.xxl} 0`,
      color: colors.primary,
      fontSize: typography.fontSize.lg
    },
    errorMessage: {
      textAlign: "center",
      padding: `${spacing.xl} 0`,
      color: colors.error,
      fontSize: typography.fontSize.md,
      backgroundColor: "rgba(181, 61, 0, 0.1)",
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
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      display: "flex",
      alignItems: "center",
      gap: spacing.sm
    },
    breadcrumbLink: {
      color: colors.textSecondary,
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
    }
  };

  // Función para crear un componente con el contenido HTML
  const createPostComponent = () => {
    return {
      __html: postContent
    };
  };

  return (
    <div style={{ fontFamily: typography.fontFamily, backgroundColor: colors.background, width: "100%" }}>
      <Header />
      
      <main style={styles.container}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link 
            to="/"
            style={styles.breadcrumbLink}
            onMouseEnter={(e) => e.target.style.color = colors.primary} 
            onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
          >Inicio</Link>
          <span style={{color: colors.gray300, fontSize: '10px'}}>►</span>
          <Link 
            to="/blog"
            style={styles.breadcrumbLink}
            onMouseEnter={(e) => e.target.style.color = colors.primary} 
            onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
          >Blog</Link>
          <span style={{color: colors.gray300, fontSize: '10px'}}>►</span>
          <span>Post {postId}</span>
        </div>
        
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
                  <li>El nombre del archivo debe ser 'post1.html'</li>
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
            <div
              dangerouslySetInnerHTML={createPostComponent()}
              style={{ width: "100%" }}
              className="post-content"
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PostViewer;