import React, { useState, useEffect, useRef } from 'react';
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
  const postContainerRef = useRef(null);

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

  // Nuevo useEffect para manejar el renderizado del contenido con Shadow DOM
  useEffect(() => {
    if (!loading && !error && postContent && postContainerRef.current) {
      // Limpiar cualquier contenido previo
      while (postContainerRef.current.firstChild) {
        postContainerRef.current.removeChild(postContainerRef.current.firstChild);
      }

      // Crear un Shadow DOM para aislar los estilos
      const shadowRoot = postContainerRef.current.attachShadow({ mode: 'open' });
      
      // Procesar el contenido HTML
      const processedContent = processPostContent();
      
      // Crear un elemento div para el contenido
      const contentContainer = document.createElement('div');
      contentContainer.className = 'post-content-container';
      contentContainer.innerHTML = processedContent;
      
      // Añadir el contenido al Shadow DOM
      shadowRoot.appendChild(contentContainer);
    }
  }, [loading, error, postContent, isDarkMode]);

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
      minHeight: "300px", // Garantiza altura mínima para contenido corto
      backgroundColor: "transparent",
      display: "block", // Forzar display block
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
    },
    iframeContainer: {
      width: '100%',
      height: 'auto',
      minHeight: '50vh',
      border: 'none',
      overflow: 'visible',
    }
  };

  // Función mejorada para procesar el contenido HTML - ahora retorna un string
  const processPostContent = () => {
    if (!postContent) return '';
    
    let processedContent = postContent;
    
    // Eliminar elementos HTML, HEAD y BODY si existen
    processedContent = processedContent
      .replace(/<\/?html[^>]*>/gi, '')
      .replace(/<\/?head[^>]*>/gi, '')
      .replace(/<\/?body[^>]*>/gi, '');
    
    // CSS para el Shadow DOM - Este CSS solo se aplicará dentro del contenedor aislado
    const shadowStyles = `
      <style>
        /* Estilos base para todos los elementos */
        :host {
          all: initial;
          display: block;
          width: 100%;
          box-sizing: border-box;
          font-family: ${typography.fontFamily};
          color: ${isDarkMode ? colors.textLight : colors.textDark};
          line-height: 1.6;
          font-size: 16px;
        }
        
        /* Contenedor principal */
        .post-content-container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0;
          overflow-x: hidden;
        }
        
        /* Resetear todos los elementos del HTML para asegurar consistencia */
        div, p, h1, h2, h3, h4, h5, h6, span, a, ul, ol, li, img, table, tr, td, th, pre, code, blockquote {
          max-width: 100%;
          box-sizing: border-box;
          margin-top: 0;
        }
        
        /* Headings */
        h1, h2, h3, h4, h5, h6 {
          margin-bottom: 0.5em;
          line-height: 1.3;
          color: ${isDarkMode ? colors.textLight : colors.primary};
          font-weight: 700;
        }
        
        h1 { font-size: 2.2em; margin-top: 0.8em; }
        h2 { font-size: 1.8em; margin-top: 0.8em; }
        h3 { font-size: 1.5em; margin-top: 0.7em; }
        h4 { font-size: 1.3em; margin-top: 0.6em; }
        h5 { font-size: 1.1em; margin-top: 0.5em; }
        h6 { font-size: 1em; margin-top: 0.5em; }
        
        /* Párrafos */
        p {
          margin-bottom: 1em;
          width: 100%;
        }
        
        /* Enlaces */
        a {
          color: ${colors.secondary};
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        a:hover, a:focus {
          color: ${colors.primaryLight};
          text-decoration: underline;
        }
        
        /* Imágenes */
        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1.5em auto;
          border-radius: 8px;
        }
        
        /* Listas */
        ul, ol {
          padding-left: 2em;
          margin-bottom: 1em;
        }
        
        li {
          margin-bottom: 0.5em;
        }
        
        /* Tablas */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
          overflow-x: auto;
          display: block;
        }
        
        table, th, td {
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
        }
        
        th, td {
          padding: 8px 12px;
          text-align: left;
        }
        
        th {
          background-color: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
        }
        
        /* Bloques de código */
        pre, code {
          background-color: ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'};
          border-radius: 4px;
          font-family: monospace;
          padding: 0.2em 0.4em;
          overflow-x: auto;
        }
        
        pre {
          padding: 1em;
          margin: 1em 0;
          white-space: pre-wrap;
        }
        
        pre code {
          background-color: transparent;
          padding: 0;
        }
        
        /* Citas */
        blockquote {
          margin: 1em 0;
          padding: 0.5em 1em;
          border-left: 4px solid ${colors.secondary};
          background-color: ${isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'};
          font-style: italic;
        }
        
        /* Flexbox containers */
        div[style*="display: flex"],
        div[style*="display:flex"] {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 20px !important;
          justify-content: center !important;
          width: 100% !important;
        }
        
        /* Elementos responsivos en flex containers */
        div[style*="display: flex"] > *,
        div[style*="display:flex"] > * {
          flex: 1 1 300px !important;
          min-width: 0 !important;
          max-width: 100% !important;
        }
        
        /* Responsive grid para móviles */
        @media (max-width: 768px) {
          div[style*="display: flex"],
          div[style*="display:flex"] {
            flex-direction: column !important;
          }
          
          h1 { font-size: 1.8em; }
          h2 { font-size: 1.5em; }
          h3 { font-size: 1.3em; }
        }
      </style>
    `;
    
    // Devolver el HTML procesado con los estilos del Shadow DOM
    return `${shadowStyles}${processedContent}`;
  };

  // Versión alternativa para uso con sandbox iframe si Shadow DOM no es viable
  const createSandboxContent = () => {
    if (!postContent) return '';
    
    let processedContent = postContent;
    
    // Crear un documento HTML completo para el iframe
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Resetear estilos */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: ${typography.fontFamily};
            line-height: 1.6;
            color: ${isDarkMode ? '#e1e1e1' : '#333'};
            background-color: transparent;
            width: 100%;
            overflow-x: hidden;
            padding: 20px;
          }
          
          /* Mismos estilos que para Shadow DOM... */
          h1, h2, h3, h4, h5, h6 {
            margin-bottom: 0.5em;
            line-height: 1.3;
            color: ${isDarkMode ? '#f1f1f1' : colors.primary};
            font-weight: 700;
          }
          
          h1 { font-size: 2.2em; margin-top: 0.8em; }
          h2 { font-size: 1.8em; margin-top: 0.8em; }
          h3 { font-size: 1.5em; margin-top: 0.7em; }
          
          p { margin-bottom: 1em; width: 100%; }
          
          img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1.5em auto;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        ${processedContent}
        <script>
          // Script para ajustar altura del iframe
          document.addEventListener('DOMContentLoaded', function() {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: 'resize', height: height }, '*');
          });
          
          // Notificar cuando se carguen imágenes para reajustar
          document.querySelectorAll('img').forEach(img => {
            img.onload = function() {
              const height = document.body.scrollHeight;
              window.parent.postMessage({ type: 'resize', height: height }, '*');
            }
          });
        </script>
      </body>
      </html>
    `;
    
    return htmlTemplate;
  };

  const navigateToBlog = () => {
    navigate('/blog', { state: { forceReload: true } });
  };

  // Función para manejar mensajes del iframe
  const handleIframeMessage = (event) => {
    if (event.data && event.data.type === 'resize') {
      const iframe = document.getElementById('post-content-iframe');
      if (iframe) {
        iframe.style.height = `${event.data.height + 30}px`; // Añadir margen
      }
    }
  };

  // Agregar/remover event listener para mensajes del iframe
  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  // Determinar si usar Shadow DOM o iframe sandbox basado en características del navegador
  const shouldUseShadowDOM = () => {
    return true; // Valor por defecto, podría detectarse la compatibilidad del navegador
  };

  if (!postContent && !loading) {
    return null;
  }

  return (
    <div style={styles.pageWrapper} className="pageWrapper">
      <Header />
      
      <div style={styles.mainContainer} className="mainContainer">
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
                  {shouldUseShadowDOM() ? (
                    // Opción 1: Shadow DOM
                    <div 
                      ref={postContainerRef}
                      style={styles.postContent}
                    />
                  ) : (
                    // Opción 2: iframe sandbox (alternativa para navegadores sin soporte Shadow DOM)
                    <iframe
                      id="post-content-iframe"
                      srcDoc={createSandboxContent()}
                      style={styles.iframeContainer}
                      sandbox="allow-same-origin"
                      frameBorder="0"
                      scrolling="no"
                      title="Contenido del post"
                    />
                  )}
                  
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