// src/components/admin/ImportExportActions.jsx
import React from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';

const ImportExportActions = ({ onExport, onImport }) => {
  const styles = {
    container: {
      marginTop: spacing.lg,
      padding: spacing.md,
      borderTop: `1px solid ${colors.gray200}`,
      borderBottom: `1px solid ${colors.gray200}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      boxShadow: shadows.sm
    },
    actionColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xs
    },
    actionColumnEnd: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xs,
      alignItems: 'flex-end'
    },
    button: {
      padding: `${spacing.sm} ${spacing.lg}`,
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: typography.fontSize.sm,
      border: "none",
      backgroundColor: colors.white,
      color: colors.primary,
      border: `1px solid ${colors.primary}`,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
      textAlign: 'center'
    },
    helperText: {
      fontSize: typography.fontSize.xs,
      color: colors.textSecondary
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.actionColumn}>
        <label 
          htmlFor="importFile" 
          style={styles.button}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span>📤</span> Importar HTML
        </label>
        <input
          id="importFile"
          type="file"
          accept=".html,.htm"
          style={{ display: 'none' }}
          onChange={onImport}
        />
        <p style={styles.helperText}>Importar desde archivo</p>
      </div>
      
      <div style={styles.actionColumnEnd}>
        <button 
          onClick={onExport}
          style={styles.button}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span>📥</span> Exportar HTML
        </button>
        <p style={styles.helperText}>Descargar como archivo</p>
      </div>
    </div>
  );
};

export default ImportExportActions;