// src/components/blog/FeaturedPost.jsx
import React, { useState } from 'react';
import { colors, spacing, typography, shadows, borderRadius, transitions, applyHoverStyles } from '../../styles/theme';

const FeaturedPost = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const styles = {
    featuredImage: {
      position: "relative",
      overflow: "hidden",
      borderRadius: borderRadius.xl,
      boxShadow: shadows.lg,
      transition: transitions.default,
      '&:hover': {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.15)"
      }
    },
    featuredImg: {
      width: "100%",
      height: "350px",
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
      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
      padding: `${spacing.xl} ${spacing.lg} ${spacing.lg}`,
      color: colors.white
    },
    featuredTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      lineHeight: "1.3"
    },
    featuredExcerpt: {
      fontSize: typography.fontSize.sm,
      opacity: "0.9",
      marginBottom: spacing.lg,
      lineHeight: "1.5"
    },
    featuredNumber: {
      position: "absolute",
      left: spacing.lg,
      top: spacing.lg,
      backgroundColor: "rgba(255,255,255,0.9)",
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      fontWeight: typography.fontWeight.bold,
      fontSize: typography.fontSize.sm,
      color: colors.textPrimary,
      boxShadow: shadows.sm,
      zIndex: 1
    },
    featuredNumberSpan: {
      color: colors.primary,
      marginRight: spacing.xs
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
      fontSize: typography.fontSize.sm
    },
    button: {
      backgroundColor: colors.primary,
      color: colors.white,
      border: "none",
      borderRadius: borderRadius.round,
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: spacing.xs,
      boxShadow: shadows.primary,
      transition: transitions.default,
      '&:hover': {
        backgroundColor: colors.primaryDark,
        transform: "translateY(-2px)",
        boxShadow: "0 6px 15px rgba(124, 77, 255, 0.4)"
      }
    }
  };

  return (
    <div 
      style={isHovered ? applyHoverStyles(styles.featuredImage) : styles.featuredImage}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={post.image}
        alt={post.title}
        style={isHovered ? applyHoverStyles(styles.featuredImg) : styles.featuredImg}
      />
      <div style={styles.featuredNumber}>
        <span style={styles.featuredNumberSpan}>#{post.number}</span> Destacado
      </div>
      <div style={styles.featuredContent}>
        <div style={styles.featuredMeta}>
          <div style={styles.metaItem}>
            <span style={{color: colors.primary}}>◆</span> {post.category}
          </div>
          <div style={styles.metaItem}>
            <span style={{color: colors.gray300}}>⏱</span> {post.time}
          </div>
        </div>
        <h2 style={styles.featuredTitle}>{post.title}</h2>
        <p style={styles.featuredExcerpt}>{post.excerpt}</p>
        <button 
          style={isButtonHovered ? applyHoverStyles(styles.button) : styles.button}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          Leer más <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default FeaturedPost;