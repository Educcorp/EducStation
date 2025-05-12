// src/components/blog/PostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const PostCard = ({ post }) => {
  // Usar el hook useTheme para obtener los colores según el tema actual
  const { colors, isDarkMode } = useTheme();
  
  const [isHovered, setIsHovered] = React.useState(false);
  
  const styles = {
    card: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      boxShadow: shadows.sm,
      transition: transitions.default,
      backgroundColor: colors.white, // Usar colores del tema actual
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
      boxShadow: isHovered ? shadows.md : shadows.sm,
    },
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      height: '200px',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)'
    },
    content: {
      padding: spacing.lg,
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    category: {
      display: 'inline-block',
      backgroundColor: colors.primary,
      color: colors.white,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.xs,
      textTransform: 'uppercase',
      fontWeight: typography.fontWeight.medium,
      marginBottom: spacing.sm
    },
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      lineHeight: 1.3,
      color: colors.textPrimary, // Usar colores del tema actual
      transition: transitions.default,
      textDecoration: 'none'
    },
    meta: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto',
      color: colors.textSecondary // Usar colores del tema actual
    },
    time: {
      fontSize: typography.fontSize.sm,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs
    },
    likes: {
      fontSize: typography.fontSize.sm,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs
    },
    number: {
      position: 'absolute',
      top: spacing.md,
      left: spacing.md,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      color: colors.primary,
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: typography.fontWeight.bold,
      fontSize: typography.fontSize.sm
    }
  };

  return (
    <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
      <div 
        style={styles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.imageContainer}>
          <img src={post.image} alt={post.title} style={styles.image} />
          <div style={styles.number}>{post.number}</div>
        </div>
        <div style={styles.content}>
          <div style={styles.category}>{post.category}</div>
          <h3 style={styles.title}>{post.title}</h3>
          <div style={styles.meta}>
            <div style={styles.time}>
              <span style={{color: colors.gray300}}>⏱</span> {post.time}
            </div>
            <div style={styles.likes}>
              <span style={{color: colors.error}}>♥</span> {post.likes}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;