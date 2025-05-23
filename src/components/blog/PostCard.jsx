import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import { FaUser, FaCalendarAlt, FaTag, FaEye, FaBookOpen } from 'react-icons/fa';

// Importar utilidades
import { 
  formatDate,
  extractSummary, 
  renderImageHTML,
  formatViews,
  isBase64Image,
  isHTMLImage
} from './utils/postHelpers';

const PostCard = ({ post, showCategory = true, showViews = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { colors, isDarkMode } = useTheme();
  
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
      transition: `${transitions.default}, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease`,
      backgroundColor: isDarkMode ? "#1a1e23" : colors.white,
      boxShadow: isDarkMode 
        ? `0 8px 20px rgba(0, 0, 0, 0.3)` 
        : isHovered 
          ? '0 15px 30px rgba(0, 0, 0, 0.15)' 
          : shadows.md,
      transform: isHovered ? "translateY(-10px)" : "translateY(0)",
      marginBottom: spacing.lg,
      width: "100%",
      maxWidth: "400px",
      height: "100%",
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
    },
    imageContainer: {
      position: "relative",
      width: "100%",
      height: "200px",
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
      padding: `${spacing.xs} ${spacing.sm}`,
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
      gap: spacing.xs
    },
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
      transform: isHovered ? "scale(1.05)" : "scale(1)",
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
    }
  };

  return (
    <Link
      to={`/blog/${post.ID_publicaciones}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article style={styles.card}>
        {/* Contenedor de imagen */}
        <div style={styles.imageContainer}>
          {renderPortadaImage()}
          
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
            {extractSummary(post.contenido || post.Contenido, 120)}
          </p>
          
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