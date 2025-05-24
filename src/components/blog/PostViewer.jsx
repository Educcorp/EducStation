import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import ReactionSection from './ReactionSection';
import { useTheme } from '../../context/ThemeContext';
import ComentariosList from '../comentarios/ComentariosList';

const PostViewer = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchPostContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
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

  const styles = {
    pageWrapper: {
      width: "100%",
      fontFamily: typography.fontFamily,
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    mainContainer: {
      width: "100%",
      flex: "1 0 auto",
      display: "flex",
      flexDirection: "column",
    },
    contentContainer: {
      width: "100%",
      flex: "1",
      paddingTop: "100px",
    },
    postWrapper: {
      width: "100%",
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
    },
    postContainer: {
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `${spacing.xl} ${spacing.md}`,
      boxSizing: "border-box",
    },
    postContent: {
      width: "100%",
      backgroundColor: "transparent",
    },
    commentsWrapper: {
      width: "100%",
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
      padding: `${spacing.xl} 0`,
    },
    commentsContainer: {
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      boxShadow: shadows.md,
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      boxSizing: "border-box",
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
    },
    loadingMessage: {
      textAlign: "center",
      padding: `${spacing.xxl} 0`,
      color: isDarkMode ? colors.textLight : colors.primary,
      fontSize: typography.fontSize.lg,
    },
    errorMessage: {
      textAlign: "center",
      padding: `${spacing.xl} 0`,
      color: colors.error,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? 'rgba(181, 61, 0, 0.2)' : 'rgba(181, 61, 0, 0.1)',
      borderRadius: borderRadius.md,
      margin: `${spacing.xl} auto`,
      maxWidth: "800px",
    },
    breadcrumb: {
      padding: `${spacing.lg} 0`,
      color: isDarkMode ? colors.textLight : colors.textSecondary,
      fontSize: typography.fontSize.sm,
      display: "flex",
      alignItems: "center",
      gap: spacing.sm,
      maxWidth: "1200px",
      margin: "0 auto",
      paddingLeft: spacing.md,
      paddingRight: spacing.md,
    },
    breadcrumbLink: {
      color: isDarkMode ? colors.textLight : colors.textSecondary,
      textDecoration: "none",
      transition: "all 0.3s ease",
      cursor: "pointer",
      background: "none",
      border: "none",
      fontFamily: "inherit",
      fontSize: "inherit",
      padding: 0,
    },
    reactionWrapper: {
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `0 ${spacing.md}`,
    },
    separator: {
      borderTop: `1.5px solid ${isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
      margin: `${spacing.xxl} auto`,
      width: '100%',
      maxWidth: "1200px",
    }
  };

  // Función mejorada para procesar el contenido HTML
  const processPostContent = () => {
    if (!postContent) return { __html: '' };
    
    let processedContent = postContent;
    
    // CSS global para sobrescribir cualquier restricción de ancho
    const globalStyles = `
      <style>
        /* Reset global para el contenedor del post */
        .post-html-content {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          overflow-x: hidden !important;
        }
        
        /* Asegurar que TODOS los elementos internos respeten el ancho */
        .post-html-content * {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        /* Contenedor principal del post */
        .post-html-content .post-container,
        .post-html-content > div:first-child {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 auto !important;
          padding: 40px 20px !important;
          box-sizing: border-box !important;
        }
        
        /* Imágenes responsivas */
        .post-html-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 20px auto !important;
          object-fit: contain !important;
        }
        
        /* Contenedores de imagen */
        .post-html-content div[style*="text-align: center"],
        .post-html-content div[style*="text-align:center"] {
          width: 100% !important;
          max-width: 100% !important;
          margin: 20px auto !important;
        }
        
        /* Contenedores flex */
        .post-html-content div[style*="display: flex"],
        .post-html-content div[style*="display:flex"] {
          width: 100% !important;
          max-width: 100% !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 20px !important;
        }
        
        /* Elementos con ancho fijo */
        .post-html-content div[style*="width: 48%"],
        .post-html-content div[style*="width:48%"] {
          width: calc(50% - 10px) !important;
          min-width: 280px !important;
          max-width: 500px !important;
          flex: 0 0 calc(50% - 10px) !important;
        }
        
        /* Párrafos y texto */
        .post-html-content p,
        .post-html-content h1,
        .post-html-content h2,
        .post-html-content h3,
        .post-html-content h4,
        .post-html-content h5,
        .post-html-content h6 {
          max-width: 100% !important;
          width: 100% !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        /* Tablas responsivas */
        .post-html-content table {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          display: block !important;
        }
        
        /* Listas */
        .post-html-content ul,
        .post-html-content ol {
          max-width: 100% !important;
          padding-left: 20px !important;
        }
        
        /* Elementos especiales */
        .post-html-content .stat-box,
        .post-html-content .highlight-box,
        .post-html-content .news-card {
          width: 100% !important;
          max-width: 100% !important;
          margin: 20px auto !important;
        }
        
        /* Responsive para móviles */
        @media (max-width: 768px) {
          .post-html-content .post-container,
          .post-html-content > div:first-child {
            padding: 20px 15px !important;
          }
          
          .post-html-content div[style*="width: 48%"],
          .post-html-content div[style*="width:48%"] {
            width: 100% !important;
            flex: 0 0 100% !important;
            max-width: 100% !important;
          }
          
          .post-html-content div[style*="display: flex"],
          .post-html-content div[style*="display:flex"] {
            flex-direction: column !important;
            align-items: center !important;
          }
        }
        
        /* Modo oscuro */
        .post-html-content.dark-mode {
          color: ${colors.textLight};
        }
        
        .post-html-content.dark-mode h1,
        .post-html-content.dark-mode h2,
        .post-html-content.dark-mode h3,
        .post-html-content.dark-mode h4,
        .post-html-content.dark-mode h5,
        .post-html-content.dark-mode h6 {
          color: ${colors.textLight};
        }
        
        /* Prevenir overflow horizontal */
        .post-html-content pre {
          max-width: 100% !important;
          overflow-x: auto !important;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
        }
        
        /* Asegurar que el footer no se vea afectado */
        body > footer,
        #root > div > footer {
          width: 100% !important;
          max-width: 100% !important;
          position: relative !important;
          margin-top: auto !important;
        }
      </style>
    `;
    
    // Eliminar elementos HTML, HEAD y BODY
    processedContent = processedContent
      .replace(/<\/?html[^>]*>/gi, '')
      .replace(/<\/?head[^>]*>/gi, '')
      .replace(/<\/?body[^>]*>/gi, '');
    
    // Envolver el contenido en un div con clase específica
    processedContent = `
      ${globalStyles}
      <div class="post-html-content ${isDarkMode ? 'dark-mode' : ''}">
        ${processedContent}
      </div>
    `;
    
    // Procesar imágenes para asegurar responsividad
    processedContent = processedContent.replace(
      /<img([^>]*?)>/g,
      (match, attributes) => {
        // Remover estilos de ancho fijo
        let newAttributes = attributes
          .replace(/width="?\d+"?/gi, '')
          .replace(/height="?\d+"?/gi, '')
          .replace(/style="[^"]*"/gi, '');
        
        return `<img${newAttributes} style="max-width: 100%; height: auto; display: block; margin: 20px auto; object-fit: contain;">`;
      }
    );
    
    // Procesar contenedores con estilos inline problemáticos
    processedContent = processedContent.replace(
      /<div([^>]*?)style="([^"]*?)"([^>]*)>/g,
      (match, before, styleContent, after) => {
        let newStyle = styleContent;
        
        // Remover anchos fijos excepto los porcentuales específicos
        if (!styleContent.includes('width: 48%') && !styleContent.includes('width:48%')) {
          newStyle = newStyle.replace(/width:\s*\d+px/gi, 'width: 100%');
        }
        
        // Remover max-width restrictivos
        newStyle = newStyle.replace(/max-width:\s*\d+px/gi, 'max-width: 100%');
        
        return `<div${before}style="${newStyle}"${after}>`;
      }
    );
    
    return { __html: processedContent };
  };

  const navigateToBlog = () => {
    navigate('/blog', { state: { forceReload: true } });
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
            <Link to="/" style={styles.breadcrumbLink}>Inicio</Link>
            <span>►</span>
            <button onClick={navigateToBlog} style={styles.breadcrumbLink}>
              Blog
            </button>
            <span>►</span>
            <span>Post {postId}</span>
          </div>
          
          {/* Post Content */}
          <div style={styles.postWrapper}>
            <div style={styles.postContainer}>
              {loading ? (
                <div style={styles.loadingMessage}>
                  Cargando contenido del post...
                </div>
              ) : error ? (
                <div style={styles.errorMessage}>
                  Error: {error}
                </div>
              ) : (
                <>
                  <div
                    style={styles.postContent}
                    dangerouslySetInnerHTML={processPostContent()}
                  />
                  
                  <div style={styles.reactionWrapper}>
                    <ReactionSection postId={postId} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Separador */}
          <div style={styles.separator} />

          {/* Comentarios */}
          <div style={styles.commentsWrapper}>
            <div style={styles.commentsContainer}>
              <ComentariosList postId={postId} />
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default PostViewer;