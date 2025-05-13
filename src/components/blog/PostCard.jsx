// src/components/blog/PostCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { colors, isDarkMode } = useTheme();
  
  const styles = {
    card: {
      display: "flex",
      flexDirection: "column", // Cambiado a column para que sea similar a la imagen deseada
      borderRadius: borderRadius.lg,
      overflow: "hidden",
      transition: transitions.default,
      backgroundColor: isDarkMode ? "#1a1e23" : colors.white, // Color de fondo más oscuro en modo oscuro
      boxShadow: isDarkMode ? `0 8px 20px rgba(0, 0, 0, 0.3)` : shadows.md,
      transform: isHovered ? "translateY(-5px)" : "translateY(0)",
      marginBottom: spacing.lg,
      width: "100%",
      maxWidth: "400px", // Limitando el ancho máximo para que se vea como en la imagen
    },
    imageContainer: {
      position: "relative",
      width: "100%", // Ancho completo
      height: "200px", // Alto fijo para la imagen
      overflow: "hidden",
    },
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
      transform: isHovered ? "scale(1.05)" : "scale(1)",
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
      backgroundColor: isDarkMode ? "#1a1e23" : colors.white, // Color de fondo más oscuro en modo oscuro
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
      color: isDarkMode ? "white" : colors.textPrimary, // Texto blanco en modo oscuro
      fontWeight: typography.fontWeight.bold,
      transition: transitions.default,
      marginTop: spacing.sm,
      marginBottom: spacing.md,
    },
    postMeta: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: spacing.md,
    },
    postTime: {
      color: isDarkMode ? "rgba(255,255,255,0.6)" : colors.textSecondary, // Más claro en modo oscuro
      fontSize: typography.fontSize.xs,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs
    },
    postLikes: {
      color: isDarkMode ? "rgba(255,255,255,0.6)" : colors.textSecondary, // Más claro en modo oscuro
      fontSize: typography.fontSize.xs,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
    },
    heartIcon: {
      color: "#e63946" // Color rojo para el corazón
    }
  };

  return (
    <Link to={`/blog/${post.id}`} style={{ textDecoration: "none" }}>
      <div 
        style={styles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.imageContainer}>
          <img
            src={post.image}
            alt={post.title}
            style={styles.cardImage}
          />
          <div style={styles.cardNumber}>#{post.number}</div>
        </div>
        
        <div style={styles.postContent}>
          <div style={styles.postCategory}>
            {post.category}
          </div>
          
          <h3 style={styles.postTitle}>{post.title}</h3>
          
          <div style={styles.postMeta}>
            <div style={styles.postTime}>
              <span style={{fontSize: '14px', marginRight: '2px', opacity: 0.8}}>⏱</span> {post.time}
            </div>
            <div style={styles.postLikes}>
              <span style={{...styles.heartIcon, fontSize: '14px', marginRight: '2px'}}>❤</span> {post.likes}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;