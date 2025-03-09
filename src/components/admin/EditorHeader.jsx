import React from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';

const EditorHeader = ({ postStatus, isSaving, isPublishing, onSaveDraft, onPublish }) => {
  const styles = {
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.xl
    },
    title: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary
    },
    actionsContainer: {
      display: "flex",
      gap: spacing.md
    },
    button: {
      padding: `${spacing.sm} ${spacing.lg}`,
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: typography.fontSize.sm,
      border: "none"
    },
    secondaryButton: {
      backgroundColor: colors.white,
      color: colors.primary,
      border: `1px solid ${colors.primary}`
    },
    primaryButton: {
      backgroundColor: colors.secondary,
      color: colors.primary,
      boxShadow: shadows.sm
    },
    disabledButton: {
      opacity: 0.7,
      cursor: "not-allowed"
    },
    statusBadge: {
      display: "inline-block",
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium
    },
    draftBadge: {
      backgroundColor: colors.gray200,
      color: colors.textSecondary
    },
    publishedBadge: {
      backgroundColor: "rgba(11, 68, 68, 0.1)",
      color: colors.primary
    }
  };

  return (
    <div style={styles.header}>
      <h1 style={styles.title}>
        {postStatus === 'draft' ? 'Crear nuevo post' : 'Editar post'}
        <span 
          style={{
            ...styles.statusBadge, 
            ...(postStatus === 'draft' ? styles.draftBadge : styles.publishedBadge),
            marginLeft: spacing.md
          }}
        >
          {postStatus === 'draft' ? 'Borrador' : 'Publicado'}
        </span>
      </h1>
      <div style={styles.actionsContainer}>
        <button 
          style={{
            ...styles.button, 
            ...styles.secondaryButton,
            ...(isSaving ? styles.disabledButton : {})
          }}
          onClick={onSaveDraft}
          disabled={isSaving}
          onMouseEnter={(e) => {
            if (!isSaving) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = shadows.md;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSaving) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {isSaving ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <span className="spinner" style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: `2px solid ${colors.gray200}`,
                borderTopColor: colors.primary,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
              Guardando...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <span>💾</span> Guardar borrador
            </span>
          )}
        </button>
        <button 
          style={{
            ...styles.button, 
            ...styles.primaryButton,
            ...(isPublishing ? styles.disabledButton : {})
          }}
          onClick={onPublish}
          disabled={isPublishing}
          onMouseEnter={(e) => {
            if (!isPublishing) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = shadows.md;
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.white;
            }
          }}
          onMouseLeave={(e) => {
            if (!isPublishing) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = shadows.sm;
              e.currentTarget.style.backgroundColor = colors.secondary;
              e.currentTarget.style.color = colors.primary;
            }
          }}
        >
          {isPublishing ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <span className="spinner" style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: `2px solid ${colors.gray200}`,
                borderTopColor: colors.white,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
              Publicando...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <span>{postStatus === 'published' ? '🔄' : '🚀'}</span> 
              {postStatus === 'published' ? 'Actualizar post' : 'Publicar post'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default EditorHeader;