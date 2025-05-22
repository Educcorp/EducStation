// src/components/blog/PostCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { colors, isDarkMode } = useTheme();
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para extraer un resumen del contenido HTML
  const extractSummary = (content, maxLength = 150) => {
    if (!content) return '';
    // Eliminar etiquetas HTML
    const plainText = content.replace(/<[^>]+>/g, '');
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };
  
  // Función para renderizar la imagen HTML o Base64 de forma segura
  const renderImageHTML = () => {
    if (!post.Imagen_portada) return null;
    
    // Verificar primero si Imagen_portada es un string
    if (typeof post.Imagen_portada !== 'string') {
      console.error("Error: Imagen_portada no es un string", post.Imagen_portada);
      return (
        <img 
          src="https://via.placeholder.com/350x200?text=Error+de+imagen"
          alt={post.Titulo} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      );
    }
    
    // Verificar si la imagen está en formato Base64
    const isBase64 = post.Imagen_portada.startsWith('data:image');
    
    // Verificar si es una ruta relativa que necesita ser corregida
    if (post.Imagen_portada.startsWith('/assets/')) {
      return (
        <img 
          src={`${process.env.PUBLIC_URL}${post.Imagen_portada}`}
          alt={post.Titulo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/350x200?text=Error+al+cargar+imagen';
          }}
        />
      );
    } else if (isBase64) {
      // Si es Base64, mostrar como una imagen normal
      return (
        <img 
          src={post.Imagen_portada}
          alt={post.Titulo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      );
    } else if (post.Imagen_portada.includes('<img')) {
      // Si es HTML, renderizar como HTML
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: post.Imagen_portada }} 
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        />
      );
    } else {
      // Si no es Base64 ni HTML, intentar mostrar como URL
      return (
        <img 
          src={post.Imagen_portada}
          alt={post.Titulo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/350x200?text=Error+al+cargar+imagen';
          }}
        />
      );
    }
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
    categoryBadge: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      backgroundColor: 'rgba(0,0,0,0.5)',
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
      backgroundColor: isDarkMode ? "#2a2f38" : colors.gray200,
      color: isDarkMode ? colors.gray400 : colors.gray500,
      fontSize: typography.fontSize.sm,
    },
    cardNumber: {
      position: "absolute",
      left: spacing.sm,
      top: spacing.sm,
      backgroundColor: "#6ebf99",
      color: "white",
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
    },
    postContent: {
      flex: "1",
      padding: spacing.lg,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: isDarkMode ? "#1a1e23" : colors.white,
    },
    postCategory: {
      alignSelf: "flex-start",
      color: "white",
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      backgroundColor: "#507c74",
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      textTransform: "capitalize",
      marginBottom: spacing.sm,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: isHovered ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      color: isDarkMode ? "white" : colors.textPrimary,
      fontWeight: typography.fontWeight.bold,
      transition: transitions.default,
      marginTop: spacing.sm,
      marginBottom: spacing.md,
    },
    postSummary: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? "rgba(255,255,255,0.8)" : colors.textSecondary,
      marginBottom: spacing.md,
      lineHeight: 1.5,
    },
    postMeta: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: spacing.md,
      transition: 'opacity 0.3s ease',
      opacity: isHovered ? 1 : 0.8,
    },
    postTime: {
      color: isDarkMode ? "rgba(255,255,255,0.6)" : colors.textSecondary,
      fontSize: typography.fontSize.xs,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs
    },
    postAuthor: {
      color: isDarkMode ? "rgba(255,255,255,0.6)" : colors.textSecondary,
      fontSize: typography.fontSize.xs,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
    },
    readMore: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.sm,
      color: isDarkMode ? colors.secondary : colors.primary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      opacity: isHovered ? 1 : 0,
      transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)`,
      opacity: isHovered ? 1 : 0.7,
      transition: 'opacity 0.3s ease',
      zIndex: 1,
    },
  };

  if (!post || !post.ID_publicaciones) {
    return null;
  }

  return (
    <Link to={`/blog/${post.ID_publicaciones}`} style={{ textDecoration: "none" }}>
      <div 
        style={styles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.imageContainer}>
          {post.Imagen_portada ? (
            <>
              <div style={styles.overlay}></div>
              {renderImageHTML()}
              {post.categorias && post.categorias.length > 0 && (
                <div style={styles.categoryBadge}>
                  {post.categorias[0].Nombre_categoria}
                </div>
              )}
            </>
          ) : post.Imagen_destacada_ID ? (
            <>
              <div style={styles.overlay}></div>
              <img
                src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/imagenes/${post.Imagen_destacada_ID}`}
                alt={post.Titulo}
                style={styles.cardImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/350x200?text=Sin+imagen';
                }}
              />
              {post.categorias && post.categorias.length > 0 && (
                <div style={styles.categoryBadge}>
                  {post.categorias[0].Nombre_categoria}
                </div>
              )}
            </>
          ) : (
            <div style={{
              ...styles.noImage,
              backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
              color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
            }}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '32px', marginBottom: '8px'}}>📄</div>
                <div>Sin imagen</div>
              </div>
            </div>
          )}
        </div>
        
        <div style={styles.postContent}>
          {post.categorias && post.categorias.length > 0 && (
            <div style={styles.postCategory}>
              {post.categorias[0].Nombre_categoria}
            </div>
          )}
          
          <h3 style={styles.postTitle}>{post.Titulo}</h3>
          
          <p style={styles.postSummary}>
            {extractSummary(post.Contenido)}
          </p>
          
          <div style={styles.postMeta}>
            <div style={styles.postTime}>
              {formatDate(post.Fecha_creacion)}
            </div>
            
            <div style={styles.readMore}>
              Leer más →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;