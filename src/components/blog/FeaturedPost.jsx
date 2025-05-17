// src/components/blog/FeaturedPost.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import useTheme from '../../hooks/useTheme';

const FeaturedPost = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  // Obtener el contexto del tema
  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDarkMode || false;
  const colors = themeContext?.colors || {
    primary: '#0b4444',
    secondary: '#2a9d8f',
    textPrimary: '#333333',
    white: '#ffffff',
    background: '#ffffff'
  };
  
  // Aplicar estilos hover
  const applyHoverStyles = (styleObj) => {
    if (styleObj && styleObj['&:hover']) {
      return {
        ...styleObj,
        ...styleObj['&:hover']
      };
    }
    return styleObj;
  };
  
  // Estilos actualizados para modo oscuro y para coincidor con la referencia
  const styles = {
    featuredImage: {
      position: "relative",
      overflow: "hidden",
      borderRadius: borderRadius.lg,
      boxShadow: isDarkMode ? "0 10px 30px rgba(0, 0, 0, 0.3)" : shadows.lg,
      transition: transitions.default,
      width: "100%",
      '&:hover': {
        transform: "translateY(-5px)",
        boxShadow: isDarkMode ? "0 15px 40px rgba(0, 0, 0, 0.4)" : "0 15px 40px rgba(11, 68, 68, 0.15)"
      }
    },
    featuredImgWrapper: {
      width: "100%",
      height: "300px", // Altura reducida para coincidir con la referencia
      overflow: "hidden"
    },
    featuredImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: transitions.slow,
      '&:hover': {
        transform: "scale(1.03)"
      }
    },
    featuredContent: {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
      background: "linear-gradient(to top, rgba(11, 68, 68, 0.9), transparent)",
      padding: `${spacing.lg} ${spacing.lg} ${spacing.lg}`,
      color: "#ffffff"
    },
    featuredTitle: {
      fontSize: typography.fontSize.lg, // Tamaño reducido para coincidir con la referencia
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      lineHeight: "1.3",
      color: "#fff"
    },
    featuredExcerpt: {
      fontSize: typography.fontSize.sm, // Tamaño reducido para coincidir con la referencia
      opacity: "0.9",
      marginBottom: spacing.md, // Margen reducido
      lineHeight: "1.5",
      color: "#f0f8f7"
    },
    featuredNumber: {
      position: "absolute",
      left: spacing.md,
      top: spacing.md,
      backgroundColor: isDarkMode ? "#2a7979" : colors.secondary,
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      fontWeight: typography.fontWeight.bold,
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? "#ffffff" : colors.primary,
      boxShadow: shadows.sm,
      zIndex: 1
    },
    featuredNumberSpan: {
      color: isDarkMode ? "#ffffff" : colors.primary,
      marginRight: spacing.xs,
      fontWeight: typography.fontWeight.bold
    },
    featuredMeta: {
      display: "flex",
      alignItems: "center",
      gap: spacing.md,
      marginBottom: spacing.sm
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
      fontSize: typography.fontSize.sm,
      color: "#fff"
    },
    button: {
      backgroundColor: isDarkMode ? "#2a7979" : colors.secondary,
      color: isDarkMode ? "#ffffff" : colors.primary,
      border: "none",
      borderRadius: borderRadius.round,
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: spacing.xs,
      boxShadow: isDarkMode ? "0 4px 12px rgba(42, 121, 121, 0.3)" : "0 4px 12px rgba(42, 157, 143, 0.3)",
      transition: transitions.default,
      textDecoration: "none",
      '&:hover': {
        backgroundColor: isDarkMode ? "#35898a" : "#fff",
        color: isDarkMode ? "#ffffff" : colors.primary,
        transform: "translateY(-2px)",
        boxShadow: isDarkMode ? "0 6px 15px rgba(42, 121, 121, 0.4)" : "0 6px 15px rgba(42, 157, 143, 0.4)"
      }
    }
  };

  return (
    <div 
      style={isHovered ? applyHoverStyles(styles.featuredImage) : styles.featuredImage}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.featuredImgWrapper}>
        <img
          src={post.image}
          alt={post.title}
          style={isHovered ? applyHoverStyles(styles.featuredImg) : styles.featuredImg}
        />
      </div>
      <div style={styles.featuredContent}>
        <div style={styles.featuredMeta}>
          <div style={styles.metaItem}>
            <span style={{color: isDarkMode ? "#35898a" : colors.secondary}}>◆</span> {post.category}
          </div>
          <div style={styles.metaItem}>
            <span style={{color: "#ccc"}}>⏱</span> {post.readTime}
          </div>
        </div>
        <h2 style={styles.featuredTitle}>{post.title}</h2>
        <p style={styles.featuredExcerpt}>{post.excerpt}</p>
        
        <Link 
          to={`/blog/${post.id}`}
          style={isButtonHovered ? applyHoverStyles(styles.button) : styles.button}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          Leer más <span>→</span>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedPost;