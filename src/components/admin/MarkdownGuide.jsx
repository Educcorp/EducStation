import React from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';

const MarkdownGuide = () => {
  const styles = {
    card: {
      backgroundColor: `${colors.primary}05`,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      boxShadow: shadows.sm,
      marginBottom: spacing.lg,
      borderLeft: `4px solid ${colors.primary}`,
      maxHeight: '400px',
      overflowY: 'auto'
    },
    title: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      color: colors.primary,
      borderBottom: `1px solid ${colors.gray200}`,
      paddingBottom: spacing.sm
    },
    guideContent: {
      fontSize: typography.fontSize.xs,
      color: colors.textSecondary,
      lineHeight: 1.5
    },
    previewSection: {
      marginTop: spacing.lg,
      padding: spacing.md,
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.xs,
      color: colors.textSecondary,
      boxShadow: shadows.sm
    },
    previewTitle: {
      marginTop: 0, 
      color: colors.primary, 
      marginBottom: spacing.sm
    },
    tipBox: {
      marginTop: spacing.lg,
      fontSize: typography.fontSize.xs,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary + '10',
      border: `1px dashed ${colors.primary}`,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm
    }
  };

  const markdownExamples = [
    { syntax: '# Título', description: 'Encabezado nivel 1' },
    { syntax: '## Subtítulo', description: 'Encabezado nivel 2' },
    { syntax: '**texto**', description: 'Texto en negrita' },
    { syntax: '*texto*', description: 'Texto en cursiva' },
    { syntax: '[texto](url)', description: 'Enlace' },
    { syntax: '![alt](url)', description: 'Imagen' },
    { syntax: '- item', description: 'Lista con viñetas' },
    { syntax: '1. item', description: 'Lista numerada' },
    { syntax: '`código`', description: 'Código en línea' },
    { syntax: '```\ncódigo\n```', description: 'Bloque de código' },
    { syntax: '> texto', description: 'Cita' },
    { syntax: '| a | b |\n| -- | -- |\n| 1 | 2 |', description: 'Tabla' },
    { syntax: '---', description: 'Línea divisoria horizontal' },
    { syntax: '<div>HTML</div>', description: 'Contenido HTML' },
    { syntax: '![alt](https://ejemplo.com/imagen.gif)', description: 'GIF externo' }
  ];

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        Guía de Markdown
      </h3>
      <div style={styles.guideContent}>
        {markdownExamples.map((example, index) => (
          <p key={index}>
            <code>{example.syntax}</code> - {example.description}
          </p>
        ))}
      </div>
      
      <div style={styles.previewSection}>
        <h4 style={styles.previewTitle}>Vista previa</h4>
        <p>Haz clic en la pestaña "Preview" para ver cómo quedará tu contenido con formato.</p>
        <p>Todos los cambios se guardan automáticamente como borrador mientras escribes.</p>
      </div>
      
      <div style={styles.tipBox}>
        <span style={{color: colors.primary, fontSize: '1.2em'}}>💡</span>
        <span>El editor admite HTML y embebidos de GIFs para hacer tus posts más atractivos.</span>
      </div>
    </div>
  );
};

export default MarkdownGuide;