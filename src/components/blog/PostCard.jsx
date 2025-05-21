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
    
    // Verificar si la imagen está en formato Base64
    const isBase64 = post.Imagen_portada.startsWith('data:image');
    
    if (isBase64) {
      // Si es Base64, mostrar como una imagen normal
      return (
        <img 
          src={post.Imagen_portada}
          alt={post.Titulo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      );
    } else {
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
    }
  };
  
  const styles = {
    card: {
      display: "flex",
      flexDirection: "column",
      borderRadius: borderRadius.lg,
      overflow: "hidden",
      transition: `${transitions.default}, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
      backgroundColor: isDarkMode ? "#1a1e23" : colors.white,
      boxShadow: isDarkMode ? `0 8px 20px rgba(0, 0, 0, 0.3)` : shadows.md,
      transform: isHovered ? "translateY(-5px)" : "translateY(0)",
      marginBottom: spacing.lg,
      width: "100%",
      maxWidth: "400px",
      height: "100%"
    },
    imageContainer: {
      position: "relative",
      width: "100%",
      height: "200px",
      overflow: "hidden",
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
            renderImageHTML()
          ) : post.Imagen_destacada_ID ? (
            <img
              src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/imagenes/${post.Imagen_destacada_ID}`}
              alt={post.Titulo}
              style={styles.cardImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/350x200?text=Sin+imagen';
              }}
            />
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
          
          <div style={styles.postSummary}>
            {post.Resumen || extractSummary(post.Contenido)}
          </div>
          
          <div style={styles.postMeta}>
            <div style={styles.postTime}>
              <span style={{fontSize: '14px', marginRight: '2px', opacity: 0.8}}>⏱</span> 
              {formatDate(post.Fecha_creacion)}
            </div>
            
            {post.NombreAdmin && (
              <div style={styles.postAuthor}>
                <span style={{fontSize: '14px', marginRight: '2px', opacity: 0.8}}>👤</span>
                {post.NombreAdmin}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;