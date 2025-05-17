// src/components/blog/PostCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { spacing, typography, shadows, borderRadius } from '../../styles/theme';
import useTheme from '../../hooks/useTheme';

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Obtener el contexto del tema
  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDarkMode || false;
  const colors = themeContext?.colors || {
    primary: '#0b4444',
    secondary: '#2a9d8f',
    white: '#ffffff',
    background: '#ffffff',
    gray200: '#e5e7eb',
    textPrimary: '#333333',
    textSecondary: '#666666',
  };
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Crear una URL amigable basada en el título
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  // Estilos CSS - Ajustados exactamente como en la imagen de referencia
  const styles = {
    card: {
      border: "none",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "all 0.3s ease",
      backgroundColor: isDarkMode ? "#1a2e2d" : colors.white,
      boxShadow: isDarkMode ? "0 8px 20px rgba(0, 0, 0, 0.3)" : "0 6px 12px rgba(0, 0, 0, 0.05)",
      transform: isHovered ? "translateY(-5px)" : "translateY(0)",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    },
    imageContainer: {
      width: "100%",
      height: "200px",
      overflow: "hidden",
      borderRadius: "12px 12px 0 0",
      position: "relative"
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
      transform: isHovered ? "scale(1.05)" : "scale(1)"
    },
    category: {
      position: "absolute",
      top: "16px",
      left: "16px",
      color: "white",
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      backgroundColor: "#0b4444", // Color fijo como en la referencia
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: "4px", // Más cuadrado como en la referencia
      textTransform: "capitalize"
    },
    content: {
      padding: spacing.lg,
      display: "flex",
      flexDirection: "column",
      flex: "1",
      justifyContent: "space-between"
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      color: isDarkMode ? "#e0e0e0" : colors.textPrimary,
      fontWeight: typography.fontWeight.bold,
      transition: "color 0.3s ease",
      marginTop: spacing.xs,
      marginBottom: spacing.md,
      lineHeight: "1.4"
    },
    postSummary: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? "#b0b0b0" : colors.textSecondary,
      marginBottom: spacing.md,
      lineHeight: 1.6,
    },
    postMeta: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      paddingTop: spacing.md,
      marginTop: "auto"
    },
    postTime: {
      color: isDarkMode ? "#8cc9c9" : colors.textSecondary,
      fontSize: typography.fontSize.xs,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs
    },
    readMore: {
      color: isDarkMode ? "#8cc9c9" : "#0b4444", // Verde oscuro como en la referencia
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      transition: "all 0.3s ease",
      '&:hover': {
        color: isDarkMode ? "#a8dcdc" : "#166464",
        transform: "translateX(3px)"
      }
    },
    dateIcon: {
      marginRight: spacing.xs,
      fontSize: "12px"
    },
    readMoreIcon: {
      marginLeft: "4px",
      fontSize: "14px",
      transition: "transform 0.3s ease",
      transform: isHovered ? "translateX(3px)" : "translateX(0)"
    }
  };
  
  // Aplicar hover styles directamente en línea cuando es necesario
  const readMoreStyle = {
    ...styles.readMore,
    ...(isHovered ? { color: isDarkMode ? "#a8dcdc" : "#166464" } : {})
  };

  return (
    <div 
      className="post-card"
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        <img 
          src={post.image} 
          alt={post.title} 
          style={styles.image}
        />
        {post.category && (
          <div style={styles.category}>
            {post.category}
          </div>
        )}
      </div>
      <div style={styles.content}>
        <Link to={`/blog/${post.id}/${createSlug(post.title)}`} style={{ textDecoration: 'none' }}>
          <h3 style={styles.postTitle}>{post.title}</h3>
        </Link>
        <p style={styles.postSummary}>{post.excerpt}</p>
        
        <div style={styles.postMeta}>
          <span style={styles.postTime}>
            <span style={styles.dateIcon}>📅</span>
            {post.date ? formatDate(post.date) : 'Fecha no disponible'}
          </span>
          <Link 
            to={`/blog/${post.id}/${createSlug(post.title)}`} 
            style={readMoreStyle}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
          >
            Leer más
            <span style={styles.readMoreIcon}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;