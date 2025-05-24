/* Modificación para el componente PostViewer.jsx */
// Actualiza el componente para usar los estilos corregidos
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import ReactionSection from './ReactionSection';
// Usar solo el CSS minimalista que no interfiere con el layout del HTML
import '../../styles/postHtmlMinimal.css';
import { useTheme } from '../../context/ThemeContext';
import './PostViewer.css'; // Importaremos un archivo CSS para estilos adicionales
import ComentariosList from '../comentarios/ComentariosList';

const PostViewer = () => {
  const location = useLocation();
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

  // Estilos modificados para eliminar completamente cualquier restricción de ancho
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
      margin: "0",
      padding: "0",
      boxSizing: "border-box",
      flex: "1 0 auto",
    },
    contentContainer: {
      padding: "100px 0 0",
      position: "relative",
      width: "100%",
      margin: "0",
    },
    postContainer: {
      width: "100%",
      margin: "0",
      padding: "0",
      boxSizing: "border-box",
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
      borderRadius: "0",
      marginBottom: "0",
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
      maxWidth: "1200px",
      margin: "0 auto",
    },
    errorMessage: {
      textAlign: "center",
      padding: `${spacing.xl} 0`,
      color: colors.error,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? 'rgba(181, 61, 0, 0.2)' : 'rgba(181, 61, 0, 0.1)',
      borderRadius: borderRadius.md,
      margin: `${spacing.xl} auto`,
      maxWidth: "1200px",
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
      gap: spacing.sm,
      maxWidth: "1200px",
      margin: `${spacing.lg} auto`,
      padding: `0 ${spacing.md}`,
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
      width: "100%",
      margin: "0",
      padding: "0",
      boxSizing: "border-box",
    },
    sectionTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      marginBottom: spacing.lg,
      paddingBottom: spacing.sm,
      borderBottom: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      maxWidth: "1200px",
      margin: `0 auto ${spacing.lg} auto`,
      padding: `0 ${spacing.md} ${spacing.sm} ${spacing.md}`,
    },
    separator: {
      borderTop: `1.5px solid ${isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
      margin: '2.5rem auto',
      width: '100%',
      maxWidth: "1200px",
    }
  };

  // Función completamente rediseñada para crear el componente HTML
  const createPostComponent = () => {
    if (!postContent) return { __html: '' };
    
    let processedContent = postContent;
    
    // PASO 1: Inyectar CSS para sobrescribir COMPLETAMENTE cualquier restricción de ancho
    const overrideCss = `
      <style>
        /* Sobrescribir TODOS los posibles estilos que limiten el ancho */
        * {
          max-width: none !important;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: none !important;
        }
        
        .post-container {
          max-width: none !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 20px !important;
          box-sizing: border-box !important;
        }
        
        /* Asegurar que todos los contenedores principales no tengan restricciones */
        div, article, section, main {
          max-width: none !important;
        }
        
        /* Corregir imágenes específicamente */
        img {
          max-width: 100% !important;
          height: auto !important;
          object-fit: contain !important;
        }
        
        /* Contenedores de imágenes */
        div[style*="text-align"] {
          width: 100% !important;
        }
        
        /* Contenedores flex */
        div[style*="display: flex"] {
          width: 100% !important;
          max-width: none !important;
          flex-wrap: wrap !important;
        }
        
        /* Asegurar que el footer no se vea afectado */
        footer {
          width: 100% !important;
          max-width: none !important;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
        }
      </style>
    `;
    
    // PASO 2: Inyectar el CSS al principio del contenido HTML
    if (processedContent.includes('<head>')) {
      processedContent = processedContent.replace('</head>', overrideCss + '</head>');
    } else if (processedContent.includes('<body>')) {
      processedContent = processedContent.replace('<body>', '<body>' + overrideCss);
    } else {
      processedContent = overrideCss + processedContent;
    }
    
    // PASO 3: Eliminar elementos HTML, HEAD y BODY ya que React los manejará
    processedContent = processedContent.replace(/<\/?html[^>]*>/gi, '');
    processedContent = processedContent.replace(/<\/?head[^>]*>/gi, '');
    processedContent = processedContent.replace(/<\/?body[^>]*>/gi, '');
    
    // PASO 4: Procesar contenedores principales
    processedContent = processedContent.replace(
      /<div class="post-container"([^>]*)>/g,
      '<div class="post-container"$1 style="max-width: none !important; width: 100% !important; margin: 0 !important; padding: 20px !important; box-sizing: border-box !important;">'
    );
    
    // PASO 5: Procesar imágenes
    processedContent = processedContent.replace(
      /<img([^>]*?)>/g,
      (match, attributes) => {
        // Agregar o modificar estilos para imágenes
        if (attributes.includes('style=')) {
          const styleMatch = attributes.match(/style="([^"]*)"/);
          if (styleMatch) {
            let existingStyle = styleMatch[1];
            existingStyle = existingStyle.replace(/max-width:[^;]*;?/gi, '');
            existingStyle = existingStyle.replace(/width:[^;]*;?/gi, '');
            existingStyle += '; max-width: 100% !important; height: auto !important; object-fit: contain !important;';
            return match.replace(styleMatch[0], `style="${existingStyle}"`);
          }
        } else {
          return `<img${attributes} style="max-width: 100% !important; height: auto !important; object-fit: contain !important;">`;
        }
        return match;
      }
    );
    
    // PASO 6: Procesar contenedores de contenido
    processedContent = processedContent.replace(
      /<div([^>]*?)style="([^"]*?)"([^>]*)>/g,
      (match, before, styleContent, after) => {
        // Remover restricciones de ancho de todos los divs
        let newStyle = styleContent
          .replace(/max-width:[^;]*;?/gi, '')
          .replace(/width:\s*\d+px[^;]*;?/gi, '');
        
        // Si el div tenía display: flex, asegurar que use todo el ancho
        if (newStyle.includes('display: flex') || newStyle.includes('display:flex')) {
          newStyle += '; width: 100% !important; max-width: none !important;';
        }
        
        return `<div${before}style="${newStyle}"${after}>`;
      }
    );
    
    return {
      __html: processedContent
    };
  };

  // Función para navegar de vuelta al blog con recarga
  const navigateToBlог = () => {
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
            <Link 
              to="/"
              style={styles.breadcrumbLink}
              onMouseEnter={(e) => e.target.style.color = colors.primary} 
              onMouseLeave={(e) => e.target.style.color = isDarkMode ? colors.textLight : colors.textSecondary}
            >Inicio</Link>
            <span style={{color: isDarkMode ? 'rgba(255,255,255,0.3)' : colors.gray300, fontSize: '10px'}}>►</span>
            <button 
              onClick={navigateToBlог}
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
          <div style={styles.separator} />

          {/* Sección de Comentarios */}
          <div style={styles.commentsContainer}>
            <ComentariosList postId={postId} />
          </div>

        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default PostViewer;