// src/components/blog/PostCard.jsx
import React, { useState } from 'react';
import { colors, spacing, typography, shadows, borderRadius, transitions, applyHoverStyles } from '../../styles/theme';

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const styles = {
    postCard: {
      display: "flex",
      gap: spacing.lg,
      marginBottom: spacing.lg,
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      boxShadow: shadows.sm,
      transition: transitions.default,
      '&:hover': {
        transform: "translateY(-5px)",
        boxShadow: shadows.md
      }
    },
    postImage: {
      flex: "0 0 150px",
      height: "100px",
      overflow: "hidden",
      borderRadius: borderRadius.md
    },
    postImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: transitions.slow,
      '&:hover': {
        transform: "scale(1.1)"
      }
    },
    postContent: {
      flex: "1"
    },
    postMeta: {
      display: "flex",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.sm,
      flexWrap: "wrap"
    },
    postNumber: {
      fontWeight: typography.fontWeight.bold,
      fontSize: typography.fontSize.sm,
      color: colors.primary
    },
    postCategory: {
      color: colors.white,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      backgroundColor: colors.primary,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.round,
      textTransform: "capitalize"
    },
    postTime: {
      color: colors.textSecondary,
      fontSize: typography.fontSize.xs,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs
    },
    postLikes: {
      color: colors.textSecondary,
      fontSize: typography.fontSize.xs,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
      marginLeft: "auto"
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      fontWeight: typography.fontWeight.semiBold,
      transition: transitions.default,
      '&:hover': {
        color: colors.primary
      }
    }
  };

  return (
    <div 
      style={isHovered ? applyHoverStyles(styles.postCard) : styles.postCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.postImage}>
        <img
          src={post.image}
          alt={post.title}
          style={isHovered ? applyHoverStyles(styles.postImg) : styles.postImg}
        />
      </div>
      <div style={styles.postContent}>
        <div style={styles.postMeta}>
          <div style={styles.postNumber}>#{post.number}</div>
          <div style={styles.postCategory}>{post.category}</div>
          <div style={styles.postTime}>
            <span style={{fontSize: '10px', marginRight: '2px'}}>⏱</span> {post.time}
          </div>
          <div style={styles.postLikes}>
            <span style={{fontSize: '10px', marginRight: '2px', color: colors.error}}>♥</span> {post.likes}
          </div>
        </div>
        <h3 
          style={isHovered ? applyHoverStyles(styles.postTitle) : styles.postTitle}
        >{post.title}</h3>
      </div>
    </div>
  );
};

export default PostCard;