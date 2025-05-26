// src/components/blog/FeaturedPost.jsx
import React, { useState } from 'react';
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
    container: {
      position: "relative",
      borderRadius: borderRadius.xl,
      overflow: "hidden",
      boxShadow: shadows.lg,
      transition: transitions.default,
      width: "100%",
      '&:hover': {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 40px rgba(11, 68, 68, 0.15)"
      }
    },
    imageContainer: {
      width: "100%",
      height: "350px",
      overflow: "hidden"
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: transitions.slow,
      '&:hover': {
        transform: "scale(1.03)"
      }
    },
    content: {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
      background: "linear-gradient(to top, rgba(11, 68, 68, 0.9), transparent)",
      padding: `${spacing.xl} ${spacing.lg} ${spacing.lg}`,
      color: lightColors.white // Usar colores claros
    },
    title: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      lineHeight: "1.3",
      color: "#fff" // Asegurar que el título sea siempre blanco
    },
    excerpt: {
      fontSize: typography.fontSize.sm,
      opacity: "0.9",
      marginBottom: spacing.lg,
      lineHeight: "1.5",
      color: "#f0f8f7" // Asegurar que el extracto sea siempre claro
    },
    category: {
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
    meta: {
      display: "flex",
      alignItems: "center",
      gap: spacing.md,
      marginBottom: spacing.sm
    },
    time: {
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
      fontSize: typography.fontSize.sm,
      color: "#fff" // Asegurar que el meta sea siempre blanco o claro
    }
  };

  return (
    <div 
      style={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        <img
          src={post.image}
          alt={post.title}
          style={styles.image}
          onError={(e) => {
            e.target.src = '/assets/images/tecnologia.jpg';
          }}
        />
      </div>
      
      <div style={styles.content}>
        <div style={styles.meta}>
          <div style={styles.time}>
            <span style={{color: lightColors.secondary}}>◆</span> {post.category}
          </div>
          <div style={styles.time}>
            <span style={{color: "#ccc"}}>⏱</span> {post.time}
          </div>
        </div>
        <h2 style={styles.title}>{post.title}</h2>
        <p style={styles.excerpt}>{post.excerpt}</p>
      </div>
    </div>
  );
};

export default FeaturedPost;