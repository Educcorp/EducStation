import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import ReactionSection from './ReactionSection';
import ComentariosList from '../comentarios/ComentariosList';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';

/**
 * Componente PostViewer optimizado
 * Utiliza un iframe con aislamiento total para mostrar el contenido HTML de los posts
 * Implementa técnicas de optimización para mejorar el rendimiento
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
  
  // Referencia al iframe
  const iframeRef = useRef(null);
  
  // AbortController para cancelar peticiones
  const abortControllerRef = useRef(null);

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

  // Cargar el contenido del post con optimizaciones
  useEffect(() => {
    const fetchPostContent = async () => {
      try {
        // Cancelar peticiones previas si existen
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Crear nuevo AbortController para esta petición
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;
        
        setLoading(true);
        setError(null);
        
        const postPath = postId === 'featured' 
          ? `/post/postfeature.html` 
          : `/post/post${postId}.html`;
        
        const response = await fetch(postPath, { signal });
        
        if (!response.ok) {
          throw new Error(`Error al cargar el post: ${response.status}`);
        }
        
        const htmlContent = await response.text();
        
        // Verificar si la petición fue cancelada antes de actualizar el estado
        if (!signal.aborted) {
          setPostHTML(htmlContent);
          setLoading(false);
        }
      } catch (err) {
        // Solo mostrar error si no fue por cancelación
        if (err.name !== 'AbortError') {
          console.error('Error al cargar el post:', err);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    if (postId) {
      fetchPostContent();
    }
    
    // Limpiar al desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [postId]);

  // Generar el documento HTML completo para el iframe (memoizado)
  const iframeContent = useMemo(() => {
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
            scroll-behavior: smooth;
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
            will-change: transform; /* Optimización para GPU */
            transform: translateZ(0); /* Forzar aceleración GPU */
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
            will-change: transform; /* Optimización para GPU */
            transform: translateZ(0); /* Forzar aceleración GPU */
          }
          
          /* Listas */
          ul, ol {
            width: 100%;
            padding-left: 2em;
            margin-bottom: 1.2em;
          }
          
          /* Bloques de código */
          pre, code {
            background-color: var(--code-bg);
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
            padding: 0.2em 0.4em;
            overflow-x: auto;
          }
          
          pre {
            padding: 1em;
            margin: 1.5em 0;
            white-space: pre-wrap;
          }
          
          pre code {
            padding: 0;
            background: none;
          }
          
          /* Citas */
          blockquote {
            border-left: 4px solid var(--link-color);
            padding: 0.5em 1em;
            margin: 1.5em 0;
            background-color: var(--blockquote-bg);
            font-style: italic;
          }
          
          /* Tablas */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            overflow-x: auto;
            display: block;
          }
          
          th, td {
            border: 1px solid var(--border-color);
            padding: 0.5em;
            text-align: left;
          }
          
          th {
            background-color: var(--blockquote-bg);
          }
          
          /* Optimizaciones de rendimiento */
          * {
            text-rendering: optimizeSpeed;
          }
          
          /* Animaciones optimizadas */
          @media (prefers-reduced-motion: no-preference) {
            a {
              transition: color 0.3s ease;
            }
            
            img, iframe, video {
              transition: transform 0.3s ease;
            }
          }
          
          /* Script para calcular la altura del contenido y enviarla al padre */
          window.addEventListener('load', function() {
            const sendHeight = () => {
              const height = document.body.scrollHeight;
              window.parent.postMessage({ type: 'post-height', height: height }, '*');
            };
            
            // Enviar altura inicial
            sendHeight();
            
            // Observar cambios en el DOM para recalcular altura
            const observer = new MutationObserver(sendHeight);
            observer.observe(document.body, { 
              childList: true, 
              subtree: true,
              attributes: true,
              characterData: true
            });
            
            // Recalcular cuando se carguen imágenes
            document.querySelectorAll('img').forEach(img => {
              if (!img.complete) {
                img.addEventListener('load', sendHeight);
              }
            });
          });
        </style>
      </head>
      <body>
        <div class="post-container">
          ${postHTML}
        </div>
      </body>
      </html>
    `;
  }, [postHTML, isDarkMode]);

  // Navegar de vuelta al blog
  const navigateToBlog = () => {
    navigate('/blog');
  };

  // Estilos del componente
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${spacing.md}`,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    contentContainer: {
      flex: 1,
      marginTop: spacing.xl,
      marginBottom: spacing.xl
    },
    iframeContainer: {
      width: '100%',
      height: `${iframeHeight}px`,
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      transition: 'height 0.3s ease',
      marginBottom: spacing.xl,
      boxShadow: shadows.md
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      backgroundColor: 'transparent'
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      color: isDarkMode ? '#e1e1e1' : '#333',
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.lg,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      fontSize: typography.fontSize.md
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
      width: '100%',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9',
      borderRadius: borderRadius.md,
      color: isDarkMode ? '#e1e1e1' : '#333',
      fontSize: typography.fontSize.lg
    },
    errorContainer: {
      padding: spacing.lg,
      backgroundColor: colors.error,
      color: colors.white,
      borderRadius: borderRadius.md,
      marginBottom: spacing.xl
    }
  };

  return (
    <>
      <Header />
      <main style={styles.container}>
        <div style={styles.contentContainer}>
          {/* Botón para volver */}
          <button 
            onClick={navigateToBlog}
            style={styles.backButton}
          >
            ← Volver al blog
          </button>
          
          {/* Contenido del post */}
          {loading ? (
            <div style={styles.loadingContainer}>
              <div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  margin: '0 auto',
                  border: '3px solid transparent',
                  borderTop: `3px solid ${isDarkMode ? '#e1e1e1' : '#333'}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ marginTop: spacing.md }}>Cargando contenido...</p>
              </div>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <h3>Error al cargar el post</h3>
              <p>{error}</p>
            </div>
          ) : (
            <div style={styles.iframeContainer}>
              <iframe
                ref={iframeRef}
                key={iframeKey}
                style={styles.iframe}
                srcDoc={iframeContent}
                title="Post Content"
                sandbox="allow-same-origin allow-scripts"
                loading="lazy"
              />
            </div>
          )}
          
          {/* Sección de reacciones */}
          {!loading && !error && postId && (
            <ReactionSection postId={postId} />
          )}
          
          {/* Comentarios */}
          {!loading && !error && postId && (
            <ComentariosList postId={postId} />
          )}
        </div>
      </main>
      <Footer />
      
      {/* Estilos para animaciones */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default React.memo(PostViewer);