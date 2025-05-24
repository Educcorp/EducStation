import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import ReactionSection from './ReactionSection';
import ComentariosList from '../comentarios/ComentariosList';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';

/**
 * Componente PostViewer rediseñado desde cero
 * Utiliza un iframe con aislamiento total para mostrar el contenido HTML de los posts
 */
const PostViewer = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeHeight, setIframeHeight] = useState(500); // Altura inicial
  const [postHTML, setPostHTML] = useState('');
  const [iframeKey, setIframeKey] = useState(Date.now()); // Clave para forzar re-render

  // Escuchar mensajes desde el iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Verificar que el mensaje sea del iframe de contenido
      if (event.data && event.data.type === 'post-height') {
        setIframeHeight(event.data.height + 50); // Añadir margen
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Detectar cambios de tema para refrescar el iframe
  useEffect(() => {
    // Cuando cambia el tema, actualizar el iframe con una nueva clave
    setIframeKey(Date.now());
  }, [isDarkMode]);

  // Cargar el contenido del post
  useEffect(() => {
    const fetchPostContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postPath = postId === 'featured' 
          ? `/post/postfeature.html` 
          : `/post/post${postId}.html`;
        
        const response = await fetch(postPath);
        
        if (!response.ok) {
          throw new Error(`Error al cargar el post: ${response.status}`);
        }
        
        const htmlContent = await response.text();
        setPostHTML(htmlContent);
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

  // Generar el documento HTML completo para el iframe
  const generateIframeContent = () => {
    if (!postHTML) return '';

    // Extraer el título del post, si existe
    let title = 'Post';
    const titleMatch = postHTML.match(/<h1[^>]*>(.*?)<\/h1>/i) || 
                      postHTML.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]+>/g, ''); // Eliminar etiquetas HTML dentro del título
    }

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          /* Resetear todos los estilos */
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          :root {
            --text-color: ${isDarkMode ? '#e1e1e1' : '#333'};
            --bg-color: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
            --heading-color: ${isDarkMode ? '#f1f1f1' : colors.primary};
            --link-color: ${colors.secondary};
            --link-hover: ${colors.primaryLight};
            --border-color: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
            --code-bg: ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'};
            --blockquote-bg: ${isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'};
            --font-family: ${typography.fontFamily.replace(/"/g, '\\"')}, -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          html, body {
            width: 100%;
            font-family: var(--font-family);
            font-size: 16px;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--bg-color);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Contenedor principal - Con margen y padding controlados */
          .post-container {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            padding: 20px;
          }
          
          /* Estilos para encabezados */
          h1, h2, h3, h4, h5, h6 {
            margin: 1.5em 0 0.5em;
            line-height: 1.3;
            color: var(--heading-color);
            font-weight: 700;
            width: 100%;
          }
          
          h1 { font-size: 2.2em; margin-top: 0.8em; }
          h2 { font-size: 1.8em; }
          h3 { font-size: 1.5em; }
          h4 { font-size: 1.3em; }
          h5 { font-size: 1.1em; }
          h6 { font-size: 1em; }
          
          /* Párrafos y texto */
          p {
            margin-bottom: 1.2em;
            width: 100%;
          }
          
          /* Enlaces */
          a {
            color: var(--link-color);
            text-decoration: none;
            transition: color 0.3s ease, text-decoration 0.3s ease;
          }
          
          a:hover, a:focus {
            color: var(--link-hover);
            text-decoration: underline;
          }
          
          /* Imágenes */
          img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1.5em auto;
            border-radius: 8px;
            object-fit: contain;
          }
          
          /* Sobreescribir cualquier estilo inline de imágenes */
          img[style] {
            max-width: 100% !important;
            height: auto !important;
            margin: 1.5em auto !important;
          }
          
          /* Videos e iframes */
          iframe, video {
            max-width: 100%;
            margin: 1.5em auto;
            display: block;
            border-radius: 8px;
            border: none;
          }
          
          /* Listas */
          ul, ol {
            width: 100%;
            padding-left: 2em;
            margin-bottom: 1.2em;
          }
          
          li {
            margin-bottom: 0.5em;
            width: 100%;
          }
          
          /* Tablas */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            overflow-x: auto;
            display: block;
          }
          
          table, th, td {
            border: 1px solid var(--border-color);
          }
          
          th, td {
            padding: 12px;
            text-align: left;
          }
          
          th {
            background-color: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
            font-weight: 600;
          }
          
          /* Bloques de código */
          pre, code {
            font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
            background-color: var(--code-bg);
            border-radius: 4px;
          }
          
          code {
            padding: 0.2em 0.4em;
            font-size: 0.9em;
          }
          
          pre {
            padding: 1em;
            margin: 1.5em 0;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          
          pre code {
            background-color: transparent;
            padding: 0;
            font-size: 0.95em;
            color: inherit;
          }
          
          /* Citas */
          blockquote {
            margin: 1.5em 0;
            padding: 1em 1.5em;
            border-left: 4px solid var(--link-color);
            background-color: var(--blockquote-bg);
            font-style: italic;
            position: relative;
          }
          
          blockquote p:last-child {
            margin-bottom: 0;
          }
          
          /* Separadores */
          hr {
            margin: 2em 0;
            border: 0;
            height: 1px;
            background-color: var(--border-color);
          }
          
          /* Estilos adicionales para elementos flex */
          div[style*="display: flex"],
          div[style*="display:flex"] {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 20px !important;
            justify-content: center !important;
            width: 100% !important;
          }
          
          /* Corrección para elementos en flex containers */
          div[style*="display: flex"] > *,
          div[style*="display:flex"] > * {
            flex: 1 1 300px !important;
            min-width: 0 !important;
            max-width: 100% !important;
          }
          
          /* Estilos para divs con width específico */
          div[style*="width:"],
          div[style*="width: "] {
            max-width: 100% !important;
          }
          
          /* Anotaciones y figcaption */
          figcaption, .caption, .annotation {
            font-size: 0.9em;
            color: ${isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'};
            text-align: center;
            margin-top: 0.5em;
            font-style: italic;
          }
          
          /* Media queries para responsividad */
          @media (max-width: 768px) {
            .post-container {
              padding: 15px;
            }
            
            h1 { font-size: 1.8em; }
            h2 { font-size: 1.6em; }
            h3 { font-size: 1.4em; }
            
            div[style*="display: flex"],
            div[style*="display:flex"] {
              flex-direction: column !important;
              align-items: center !important;
            }
            
            div[style*="display: flex"] > *,
            div[style*="display:flex"] > * {
              flex: 1 1 100% !important;
            }
            
            blockquote {
              padding: 0.8em 1em;
            }
          }
        </style>
      </head>
      <body>
        <div class="post-container">
          ${postHTML}
        </div>
        <script>
          // Función para notificar la altura al padre
          function notifyHeight() {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ 
              type: 'post-height',
              height: height
            }, '*');
          }
          
          // Observar cambios en el DOM para detectar cuando se cargan imágenes o cambia el contenido
          const observer = new MutationObserver(notifyHeight);
          observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true,
            characterData: true
          });
          
          // Notificar altura cuando se carga la página
          document.addEventListener('DOMContentLoaded', notifyHeight);
          
          // Notificar altura cuando se cargan las imágenes
          document.querySelectorAll('img').forEach(img => {
            if (img.complete) {
              notifyHeight();
            } else {
              img.addEventListener('load', notifyHeight);
              img.addEventListener('error', notifyHeight);
            }
          });
          
          // Notificar altura cuando se cargan iframes o videos
          document.querySelectorAll('iframe, video').forEach(media => {
            media.addEventListener('load', notifyHeight);
          });
          
          // Ejecutar inmediatamente y también después de un pequeño retraso
          notifyHeight();
          setTimeout(notifyHeight, 100);
          setTimeout(notifyHeight, 500);
          setTimeout(notifyHeight, 1000);
          
          // Ajustar ancho de elementos con ancho fijo en inline styles
          document.querySelectorAll('[style*="width"]').forEach(el => {
            if (el.style.width && el.style.width.includes('px')) {
              const width = parseInt(el.style.width);
              if (width > window.innerWidth - 40) {
                el.style.width = '100%';
              }
            }
          });
        </script>
      </body>
      </html>
    `;
  };

  // Navegación al blog
  const navigateToBlog = () => {
    navigate('/blog', { state: { forceReload: true } });
  };
  
  // Estilos del componente principal
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
    iframeContainer: {
      width: "100%",
      height: `${iframeHeight}px`,
      border: "none",
      transition: "height 0.3s ease",
      backgroundColor: "transparent",
      overflow: "hidden",
      display: "block",
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
      padding: `${spacing.xl} ${spacing.md} 0`,
    },
    separator: {
      borderTop: `1.5px solid ${isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
      margin: `${spacing.xxl} auto`,
      width: '100%',
      maxWidth: "1200px",
    }
  };

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
                  {/* Contenido del post en un iframe para aislamiento total */}
                  <iframe 
                    key={iframeKey}
                    title={`Post ${postId}`}
                    style={styles.iframeContainer}
                    srcDoc={generateIframeContent()}
                    sandbox="allow-same-origin allow-scripts"
                    frameBorder="0"
                    scrolling="no"
                  />
                  
                  {/* Sección de reacciones */}
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