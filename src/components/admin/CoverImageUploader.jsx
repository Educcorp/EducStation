import React from 'react';
import { spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const CoverImageUploader = ({ coverImagePreview, onChange }) => {
  // Usar el hook useTheme para obtener los colores según el tema actual
  const { colors } = useTheme();

  const styles = {
    card: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      boxShadow: shadows.sm,
      marginBottom: spacing.lg
    },
    formGroup: {
      marginBottom: spacing.lg
    },
    label: {
      display: "block",
      marginBottom: spacing.xs,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary
    },
    coverImageContainer: {
      marginBottom: spacing.md,
      cursor: "pointer",
      backgroundColor: colors.gray100,
      borderRadius: borderRadius.md,
      width: "100%",
      height: "150px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      boxShadow: shadows.sm,
      transition: "all 0.3s ease"
    },
    coverImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease"
    },
    imageUploadText: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: colors.textSecondary,
      cursor: "pointer",
      transition: "transform 0.3s ease"
    },
    imageIcon: {
      fontSize: "28px",
      marginBottom: spacing.xs
    },
    helperText: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      lineHeight: 1.5,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="coverImage">Imagen de portada</label>
        <input
          type="file"
          id="coverImage"
          name="coverImage"
          onChange={onChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <label 
          htmlFor="coverImage" 
          style={styles.coverImageContainer}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = shadows.sm;
          }}
        >
          {coverImagePreview ? (
            <img 
              src={coverImagePreview} 
              alt="Vista previa de la portada" 
              style={styles.coverImage}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
          ) : (
            <div style={styles.imageUploadText}>
              <span style={styles.imageIcon}>🖼️</span>
              <span>Subir imagen de portada</span>
            </div>
          )}
        </label>
        <p style={styles.helperText}>
          <span style={{color: colors.primary}}>💡</span>
          Recomendación: Usar imágenes de al menos 1200x600px para una mejor visualización.
        </p>
      </div>
    </div>
  );
};

export default CoverImageUploader;