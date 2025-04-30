import React from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';

const PostMetadata = ({ post, categories, onChange }) => {
  const styles = {
    card: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      boxShadow: shadows.sm,
      marginBottom: spacing.lg,
      borderTop: `3px solid ${colors.secondary}`
    },
    formGroup: {
      marginBottom: spacing.lg
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
      marginBottom: spacing.xs,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary
    },
    input: {
      width: "100%",
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.md,
      transition: "all 0.3s ease",
      marginBottom: spacing.md,
      borderLeft: `4px solid ${colors.secondary}`
    },
    select: {
      width: "100%",
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.md,
      backgroundColor: colors.white,
      borderLeft: `4px solid ${colors.secondary}`,
      transition: "all 0.3s ease"
    },
    tagsInputContainer: {
      marginBottom: spacing.md
    },
    helperText: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      lineHeight: 1.5,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs
    },
    tagContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: spacing.xs,
      marginTop: spacing.sm
    },
    tag: {
      backgroundColor: colors.secondary + '40',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.xs,
      color: colors.primary,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
      transition: "all 0.3s ease"
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="category">
          <span style={{ color: colors.secondary, fontSize: '1.1em' }}>📂</span> Categoría
        </label>
        <select
          id="category"
          name="category"
          value={post.category}
          onChange={onChange}
          style={styles.select}
          onFocus={(e) => {
            e.target.style.boxShadow = `0 0 0 2px ${colors.secondary}30`;
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>


      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="publishDate">
          <span style={{ color: colors.secondary, fontSize: '1.1em' }}>📅</span> Fecha de publicación
        </label>
        <input
          type="date"
          id="publishDate"
          name="publishDate"
          value={post.publishDate}
          onChange={onChange}
          style={styles.input}
          min={new Date().toISOString().split('T')[0]}
          onFocus={(e) => {
            e.target.style.boxShadow = `0 0 0 2px ${colors.secondary}30`;
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        />
        <p style={styles.helperText}>
          <span style={{ color: colors.secondary }}>⏰</span>
          Puedes programar la publicación para una fecha futura.
        </p>
      </div>
    </div>
  );
};

export default PostMetadata;