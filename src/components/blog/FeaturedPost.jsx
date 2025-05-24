// src/components/blog/FeaturedPost.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { spacing, typography, shadows, borderRadius, transitions, applyHoverStyles } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import { FaArrowRight } from 'react-icons/fa';
import { AnimatedButton } from '../utils';

const FeaturedPost = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Obtener tanto los colores actuales como los colores del tema claro
  const { lightColors } = useTheme();
  
  // Usamos lightColors (colores del tema claro) en lugar de colors
  const styles = {
    featuredImage: {
      position: "relative",
      overflow: "hidden",
      borderRadius: borderRadius.xl,
      boxShadow: shadows.lg,
      transition: transitions.default,
      width: "100%",
      '&:hover': {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 40px rgba(11, 68, 68, 0.15)"
      }
    },
    featuredImgWrapper: {
      width: "100%",
      height: "350px",
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
      padding: `${spacing.xl} ${spacing.lg} ${spacing.lg}`,
      color: lightColors.white // Usar colores claros
    },
    featuredTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      lineHeight: "1.3",
      color: "#fff" // Asegurar que el título sea siempre blanco
    },
    featuredExcerpt: {
      fontSize: typography.fontSize.sm,
      opacity: "0.9",
      marginBottom: spacing.lg,
      lineHeight: "1.5",
      color: "#f0f8f7" // Asegurar que el extracto sea siempre claro
    },
    featuredNumber: {
      position: "absolute",
      left: spacing.lg,
      top: spacing.lg,
      backgroundColor: lightColors.secondary, // Usar colores claros
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      fontWeight: typography.fontWeight.bold,
      fontSize: typography.fontSize.sm,
      color: lightColors.primary, // Usar colores claros
      boxShadow: shadows.sm,
      zIndex: 1
    },
    featuredNumberSpan: {
      color: lightColors.primary, // Usar colores claros
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
      color: "#fff" // Asegurar que el meta sea siempre blanco o claro
    },
    button: {
      backgroundColor: lightColors.secondary, // Usar colores claros
      color: lightColors.primary, // Usar colores claros
      border: "none",
      borderRadius: borderRadius.round,
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: spacing.xs,
      boxShadow: "0 4px 12px rgba(210, 185, 154, 0.3)",
      transition: transitions.default,
      textDecoration: "none",
      '&:hover': {
        backgroundColor: "#fff", // Siempre blanco en hover
        transform: "translateY(-2px)",
        boxShadow: "0 6px 15px rgba(210, 185, 154, 0.4)"
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
            <span style={{color: lightColors.secondary}}>◆</span> {post.category}
          </div>
          <div style={styles.metaItem}>
            <span style={{color: "#ccc"}}>⏱</span> {post.time}
          </div>
        </div>
        <h2 style={styles.featuredTitle}>{post.title}</h2>
        <p style={styles.featuredExcerpt}>{post.excerpt}</p>
        
        <AnimatedButton 
          to={`/blog/${post.id}`}
          state={{ forceReload: true }}
          backgroundColor="rgba(8, 44, 44, 0.8)"
          hoverBackgroundColor="#082c2c"
          padding="8px 20px"
          borderRadius="20px"
          style={{ marginTop: spacing.sm }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Leer más</span>
            <FaArrowRight size={12} />
          </div>
        </AnimatedButton>
      </div>
    </div>
  );
};

export default FeaturedPost;