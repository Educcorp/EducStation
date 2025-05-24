import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import { FaUser, FaCalendarAlt, FaTag, FaEye, FaBookOpen, FaArrowRight } from 'react-icons/fa';

// Importar utilidades
import { 
  formatDate,
  extractSummary, 
  renderImageHTML,
  formatViews,
  isBase64Image,
  isHTMLImage
} from './utils/postHelpers';

// Estilo keyframes para la animación de brillo
const shineAnimation = `
  @keyframes shine {
    0% {
      left: -100%;
      opacity: 0;
    }
    20% {
      opacity: 0.5;
    }
    100% {
      left: 200%;
      opacity: 0;
    }
  }
`;

// Añadir los estilos keyframes al documento
const addKeyframeStyles = () => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = shineAnimation;
  document.head.appendChild(styleSheet);
};

/**
 * Función mejorada para limpiar el resumen de cualquier código HTML/CSS
 * @param {string} content - Contenido HTML o texto
 * @param {number} maxLength - Longitud máxima del resumen
 * @returns {string} Texto limpio para mostrar como resumen
 */
const cleanSummary = (content, maxLength = 120) => {
  if (!content) return 'Sin contenido disponible...';
  
  try {
    // Caso especial: Detectar si es principalmente código HTML/CSS
    if (content.includes('<!DOCTYPE html>') || 
        (content.includes('<html') && content.includes('<head'))) {
      return 'Contenido HTML (vista previa no disponible)';
    }
    
    // Eliminar bloques de estilos CSS completos
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Eliminar cualquier bloque de código CSS como body { ... }
    content = content.replace(/[\w\s.#-]+\s*{[^}]*}/g, '');
    
    // Eliminar etiquetas DOCTYPE, html, head, etc.
    content = content.replace(/<!DOCTYPE[^>]*>/gi, '');
    content = content.replace(/<html[^>]*>|<\/html>/gi, '');
    content = content.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    
    // Crear un elemento temporal para procesar HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Obtener solo el texto plano
    let plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Limpiar el texto de caracteres especiales y normalizar espacios
    plainText = plainText
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]/g, ' ')
      .trim();
    
    // Verificar si quedó algo después de la limpieza
    if (!plainText || plainText.trim().length === 0) {
      return 'Sin contenido disponible...';
    }
    
    // Si el texto parece ser principalmente código, informarlo
    if ((plainText.includes('{') && plainText.includes('}') && 
         plainText.includes(';') && plainText.split(';').length > 3) ||
        (plainText.includes('<') && plainText.includes('>') && 
         plainText.split('>').length > 3)) {
      return 'Este contenido parece ser código (vista previa no disponible)';
    }
    
    // Truncar al tamaño máximo manteniendo palabras completas
    if (plainText.length <= maxLength) {
      return plainText;
    }
    
    let truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.6) {
      truncated = truncated.substring(0, lastSpace);
    }
    
    return truncated + '...';
  } catch (error) {
    console.error('Error al procesar el resumen:', error);
    // En caso de error, intentar una limpieza básica
    if (typeof content === 'string') {
      const strippedContent = content
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (strippedContent.length > 0) {
        return strippedContent.substring(0, maxLength) + '...';
      }
    }
    return 'Sin contenido disponible...';
  }
};

const PostCard = ({ post, showCategory = true, showViews = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { colors, isDarkMode } = useTheme();
  
  // Añadir los keyframes al montar el componente
  React.useEffect(() => {
    addKeyframeStyles();
  }, []);

  // Función para obtener color de categoría
  const getCategoryColor = (post) => {
    // Mapeo de IDs de categoría a colores
    const categoryColors = {
      1: '#FF6B6B', // Noticias
      2: '#4ECDC4', // Técnicas de Estudio
      3: '#FFD166', // Problemáticas en el Estudio
      4: '#6A0572', // Educación de Calidad
      5: '#1A936F', // Herramientas Tecnológicas
      6: '#3D5A80', // Desarrollo Profesional Docente
      7: '#F18F01', // Comunidad y Colaboración
      'default': '#6b7280'
    };
    
    // Intentar obtener el ID de categoría de diferentes formas
    let categoryId = null;
    
    if (post.categorias && Array.isArray(post.categorias) && post.categorias.length > 0) {
      categoryId = post.categorias[0].ID_categoria || post.categorias[0];
    } else if (post.categoria_id) {
      categoryId = post.categoria_id;
    } else if (post.ID_categoria) {
      categoryId = post.ID_categoria;
    }
    
    return categoryColors[categoryId] || categoryColors.default;
  };

  // Función para obtener el nombre de la categoría
  const getCategoryName = (post) => {
    if (post.categorias && Array.isArray(post.categorias) && post.categorias.length > 0) {
      return post.categorias[0].Nombre_categoria || post.categorias[0].Nombre || post.categoria;
    }
    return post.categoria || 'Sin categoría';
  };
  
  // Función para renderizar la imagen de portada
  const renderPortadaImage = () => {
    if (!post.Imagen_portada) {
      return (
        <div style={styles.noImage}>
          <FaBookOpen size={32} />
          <span style={{ marginLeft: spacing.sm }}>Sin imagen</span>
        </div>
      );
    }

    // Verificar tipo de imagen y renderizar apropiadamente
    if (isHTMLImage(post.Imagen_portada)) {
      return (
        <div 
          style={styles.htmlImageContainer}
          dangerouslySetInnerHTML={renderImageHTML(post.Imagen_portada)}
        />
      );
    }

    if (isBase64Image(post.Imagen_portada)) {
      return (
        <img 
          src={post.Imagen_portada}
          alt={post.Titulo}
          style={styles.cardImage}
          loading="lazy"
        />
      );
    }

    // Manejar rutas relativas
    if (post.Imagen_portada.startsWith('/assets/')) {
      return (
        <img 
          src={`${process.env.PUBLIC_URL}${post.Imagen_portada}`}
          alt={post.Titulo}
          style={styles.cardImage}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/350x200?text=Error+al+cargar+imagen';
          }}
        />
      );
    }

    // URL normal
    return (
      <img 
        src={post.Imagen_portada}
        alt={post.Titulo}
        style={styles.cardImage}
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/350x200?text=Error+al+cargar+imagen';
        }}
      />
    );
  };

  const styles = {
    card: {
      display: "flex",
      flexDirection: "column",
      borderRadius: borderRadius.lg,
      overflow: "hidden",
      transition: `${transitions.default}, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, border-color 0.3s ease`,
      backgroundColor: isDarkMode ? "#1a1e23" : colors.white,
      boxShadow: isDarkMode 
        ? `0 8px 20px rgba(0, 0, 0, 0.3)` 
        : isHovered 
          ? '0 20px 30px rgba(0, 0, 0, 0.18)' 
          : shadows.md,
      transform: isHovered ? "translateY(-12px)" : "translateY(0)",
      marginBottom: spacing.lg,
      width: "100%",
      maxWidth: "400px",
      height: "100%",
      border: `1px solid ${isDarkMode 
        ? isHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)' 
        : isHovered ? 'rgba(8, 44, 44, 0.15)' : 'rgba(0,0,0,0.03)'}`,
      position: "relative",
    },
    imageContainer: {
      position: "relative",
      width: "100%",
      height: "220px",
      overflow: "hidden",
    },
    htmlImageContainer: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    },
    categoryBadge: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: '#fff',
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      zIndex: 2,
      backdropFilter: 'blur(4px)',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
      opacity: isHovered ? 1 : 0.8,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    },
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease, filter 0.5s ease",
      transform: isHovered ? "scale(1.08)" : "scale(1)",
      filter: isHovered ? "brightness(1.05) contrast(1.05)" : "brightness(1) contrast(1)",
    },
    noImage: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      backgroundColor: isDarkMode ? "#2a2f38" : colors.gray200,
      color: isDarkMode ? colors.gray400 : colors.gray500,
      fontSize: typography.fontSize.sm,
    },
    postContent: {
      flex: "1",
      padding: spacing.lg,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: isDarkMode ? "#1a1e23" : colors.white,
      position: "relative",
      zIndex: 1,
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.textLight : colors.textDark,
      marginBottom: spacing.sm,
      lineHeight: "1.4",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
      transition: "color 0.3s ease",
    },
    postSummary: {
      color: isDarkMode ? colors.gray300 : colors.gray600,
      fontSize: typography.fontSize.sm,
      lineHeight: "1.6",
      marginBottom: spacing.md,
      flex: 1,
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    postMeta: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: typography.fontSize.xs,
      color: isDarkMode ? colors.gray400 : colors.gray500,
      marginTop: "auto",
      paddingTop: spacing.sm,
      borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
    },
    metaLeft: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.xs,
    },
    authorName: {
      fontWeight: typography.fontWeight.medium,
      color: isDarkMode ? colors.textLight : colors.textDark,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "220px",
      background: isHovered 
        ? `linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)`
        : `linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 100%)`,
      zIndex: 1,
      opacity: 1,
      transition: "opacity 0.3s ease",
      pointerEvents: "none",
    },
    shineEffect: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "80px",
      height: "100%",
      background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)",
      zIndex: 2,
      transform: "skewX(-25deg)",
      pointerEvents: "none",
      animation: isHovered ? "shine 2s ease-in-out infinite" : "none",
    },
  };

  return (
    <Link
      to={`/blog/${post.ID_publicaciones}`}
      state={{ forceReload: true }}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article style={styles.card}>
        {/* Contenedor de imagen */}
        <div style={styles.imageContainer}>
          {renderPortadaImage()}
          <div style={styles.overlay}></div>
          {isHovered && <div style={styles.shineEffect}></div>}
          
          {/* Badge de categoría */}
          {showCategory && (
            <div style={styles.categoryBadge}>
              <FaTag size={10} />
              <span>{getCategoryName(post)}</span>
            </div>
          )}
        </div>

        {/* Contenido del post */}
        <div style={styles.postContent}>
          <h3 style={styles.postTitle}>
            {post.Titulo}
          </h3>
          
          <p style={styles.postSummary}>
            {post.Resumen || post.resumen || cleanSummary(post.contenido || post.Contenido, 120)}
          </p>

          {/* Botón Leer más con animación */}
          <div style={{ marginBottom: spacing.md, display: 'flex', justifyContent: 'flex-end' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: isHovered ? "#082c2c" : "rgba(8, 44, 44, 0.6)",
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <span>Leer más</span>
              <FaArrowRight size={12} />
            </div>
          </div>
          
          {/* Metadatos */}
          <div style={styles.postMeta}>
            <div style={styles.metaLeft}>
              {/* Autor */}
              <div style={styles.metaItem}>
                <FaUser size={12} />
                <span style={styles.authorName}>
                  {post.NombreAdmin || post.autor || post.Autor || 'Autor desconocido'}
                </span>
              </div>
              
              {/* Fecha */}
              <div style={styles.metaItem}>
                <FaCalendarAlt size={12} />
                <span>{formatDate(post.Fecha_creacion)}</span>
              </div>
            </div>
            
            {/* Visualizaciones */}
            {showViews && post.visualizaciones && (
              <div style={styles.metaItem}>
                <FaEye size={12} />
                <span>{formatViews(post.visualizaciones)}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard; 