import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius } from '../../styles/theme';
import ComentariosList from '../comentarios/ComentariosList';
import PostSidebar from './PostSidebar';
import { FaThumbsUp } from 'react-icons/fa';

/**
 * Componente rediseñado para mostrar el detalle de un post
 * Utiliza un iframe aislado para el contenido HTML
 */
const PostDetail = ({ post }) => {
  const { colors, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: urlId } = useParams();
  const [iframeHeight, setIframeHeight] = useState(500);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [likes, setLikes] = useState(post?.contador_likes || 0);
  const [liked, setLiked] = useState(false);

  // Asegurarse de que tenemos un ID válido, sea del objeto post o de la URL
  const postId = post?.ID_publicaciones || urlId;

  // Escuchar mensajes desde el iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'post-height') {
        setIframeHeight(event.data.height + 50); // Añadir margen
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Detectar cambios de tema para refrescar el iframe
  useEffect(() => {
    setIframeKey(Date.now());
  }, [isDarkMode]);

  // Si el post cambia, actualizar likes
  useEffect(() => {
    setLikes(post?.contador_likes || 0);
    setLiked(false);
  }, [post?.ID_publicaciones]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para renderizar la imagen de portada (Base64 o HTML)
  const renderFeaturedImage = () => {
    // Prioridad 1: Imagen en Base64 desde Imagen_portada
    if (post.Imagen_portada) {
      // Verificar primero si Imagen_portada es un string
      if (typeof post.Imagen_portada !== 'string') {
        console.error("Error: Imagen_portada no es un string", post.Imagen_portada);
        return (
          <img
            src="https://via.placeholder.com/800x400?text=Error+de+imagen"
            alt={post.Titulo}
            style={styles.featuredImage}
          />
        );
      }

      // Verificar si es Base64
      if (post.Imagen_portada.startsWith('data:image')) {
        return (
          <img
            src={post.Imagen_portada}
            alt={post.Titulo}
            style={styles.featuredImage}
          />
        );
      } else if (post.Imagen_portada.includes('<img')) {
        // Si es etiqueta HTML img, renderizarla como tal
        // Modificar el HTML para aplicar el estilo a la imagen
        const modifiedHTML = post.Imagen_portada.replace('<img', `<img style="width:100%;height:100%;object-fit:cover;"`);

        return (
          <div
            style={styles.featuredImageContainer}
            dangerouslySetInnerHTML={{ __html: modifiedHTML }}
          />
        );
      } else {
        // Si no es Base64 ni etiqueta img, intentar renderizar como URL
        return (
          <img
            src={post.Imagen_portada}
            alt={post.Titulo}
            style={styles.featuredImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x400?text=Error+al+cargar+imagen';
            }}
          />
        );
      }
    }

    // Prioridad 2: Imagen desde Imagen_destacada_ID
    if (post.Imagen_destacada_ID) {
      return (
        <img
          src={`${process.env.REACT_APP_API_URL}/api/imagenes/${post.Imagen_destacada_ID}`}
          alt={post.Titulo}
          style={styles.featuredImage}
        />
      );
    }

    // Si no hay imagen, no mostrar nada
    return null;
  };

  // Generar el documento HTML completo para el iframe
  const generateIframeContent = () => {
    if (!post || !post.Contenido) return '';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${post.Titulo || 'Post'}</title>
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
            --link-hover: ${colors.secondary};
            --border-color: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
            --code-bg: ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'};
            --blockquote-bg: ${isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'};
          }
          
          html, body {
            width: 100%;
            font-family: ${typography.fontFamily.replace(/"/g, '\\"')}, -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--bg-color);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Contenedor principal */
          .post-container {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            padding: 0;
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
          
          /* Estilos adicionales para elementos flex */
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
          
          /* Estilos para divs con width específico */
          div[style*="width:"],
          div[style*="width: "] {
            max-width: 100% !important;
          }
          
          /* Media queries para responsividad */
          @media (max-width: 768px) {
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
          ${post.Contenido}
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

  // Función para navegar de vuelta al blog con recarga
  const navigateToBlог = () => {
    navigate('/blog', { state: { forceReload: true } });
  };

  // Aplicar estilos responsivos dinámicamente
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estilos para el componente
  const styles = {
    container: {
      display: 'flex',
      gap: spacing.xl,
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: spacing.lg,
    },
    mainContent: {
      flex: '2',
      minWidth: 0, // Permite que el contenido se contraiga
    },
    sidebarContent: {
      flex: '1',
      maxWidth: '350px',
      minWidth: '300px',
    },
    article: {
      width: '100%',
      padding: spacing.lg,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : '#ffffff',
      borderRadius: borderRadius.md,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
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
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    featuredImage: {
      width: '100%',
      maxHeight: '400px',
      objectFit: 'cover',
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
    },
    featuredImageContainer: {
      width: '100%',
      maxHeight: '400px',
      overflow: 'hidden',
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
    },
    iframeContainer: {
      width: "100%",
      height: `${iframeHeight}px`,
      border: "none",
      transition: "height 0.3s ease",
      backgroundColor: "transparent",
      overflow: "hidden",
      display: "block",
      borderRadius: borderRadius.md,
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
    },
    backLink: {
      display: 'inline-block',
      marginTop: spacing.xl,
      color: colors.secondary,
      textDecoration: 'none',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
    },
  };

  // Estilos dinámicos basados en el tamaño de pantalla
  const dynamicStyles = {
    container: {
      ...styles.container,
      ...(isMobile && {
        flexDirection: 'column',
        gap: spacing.lg,
        padding: spacing.md,
      }),
    },
    mainContent: styles.mainContent,
    sidebarContent: {
      ...styles.sidebarContent,
      ...(isMobile && {
        maxWidth: 'none',
        minWidth: 'auto',
      }),
    },
    article: {
      ...styles.article,
      ...(isMobile && {
        padding: spacing.md,
      }),
    },
    header: styles.header,
    title: {
      ...styles.title,
      ...(isMobile && {
        fontSize: typography.fontSize.xl,
      }),
    },
    meta: {
      ...styles.meta,
      ...(isMobile && {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacing.xs,
      }),
    },
    featuredImage: styles.featuredImage,
    featuredImageContainer: styles.featuredImageContainer,
    iframeContainer: styles.iframeContainer,
    categories: styles.categories,
    category: styles.category,
    backLink: styles.backLink,
  };

  const handleLike = async () => {
    if (liked) return;
    try {
      const response = await fetch(`/api/publicaciones/${post.ID_publicaciones}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (err) {
      // Manejar error si se desea
    }
  };

  if (!post) {
    return null;
  }

  return (
    <div style={dynamicStyles.container}>
      {/* Contenido Principal */}
      <div style={dynamicStyles.mainContent}>
        <article style={dynamicStyles.article}>
          <header style={dynamicStyles.header}>
            <h1 style={dynamicStyles.title}>{post.Titulo}</h1>
            <div style={dynamicStyles.meta}>
              <span>Por {post.NombreAdmin || 'Admin'}</span>
              <span>{formatDate(post.Fecha_creacion)}</span>
            </div>
            
            {renderFeaturedImage()}
          </header>

          {/* Contenido del post en un iframe para aislamiento total */}
          <div style={{ marginBottom: spacing.lg }}>
            <iframe
              key={iframeKey}
              title={post.Titulo || 'Post'}
              style={dynamicStyles.iframeContainer}
              srcDoc={generateIframeContent()}
              sandbox="allow-same-origin allow-scripts"
              frameBorder="0"
              scrolling="no"
            />
          </div>

          {post.categorias && post.categorias.length > 0 && (
            <div style={dynamicStyles.categories}>
              <span>Categorías: </span>
              {post.categorias.map(cat => (
                <Link
                  key={cat.ID_categoria}
                  to={`/categoria/${cat.ID_categoria}`}
                  style={dynamicStyles.category}
                >
                  {cat.Nombre_categoria}
                </Link>
              ))}
            </div>
          )}

          {/* Separador visual antes de los comentarios */}
          <div className="comentarios-separador" style={{
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            margin: '2rem 0',
            width: '100%'
          }}></div>

          {/* Sección de comentarios */}
          <ComentariosList postId={postId} />

          <button
            onClick={navigateToBlог}
            style={{
              ...dynamicStyles.backLink,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit'
            }}
          >
            ← Volver al blog
          </button>
        </article>
      </div>

      {/* Sidebar */}
      <div style={dynamicStyles.sidebarContent}>
        <PostSidebar currentPost={post} />
      </div>
    </div>
  );
};

export default PostDetail;
