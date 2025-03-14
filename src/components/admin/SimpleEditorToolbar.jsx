// src/components/admin/SimpleEditorToolbar.jsx
import React from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';

const SimpleEditorToolbar = ({ onFormatText, activeFormats = {} }) => {
  const styles = {
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: colors.white,
      padding: spacing.xs,
      borderBottom: `1px solid ${colors.gray200}`,
      overflowX: 'auto'
    },
    group: {
      display: 'flex',
      borderRight: `1px solid ${colors.gray200}`,
      marginRight: spacing.sm,
      paddingRight: spacing.sm
    },
    button: (isActive) => ({
      background: 'none',
      border: 'none',
      borderRadius: borderRadius.sm,
      padding: spacing.xs,
      margin: `0 ${spacing.xxs}`,
      fontSize: '16px',
      cursor: 'pointer',
      color: isActive ? colors.primary : colors.textPrimary,
      backgroundColor: isActive ? `${colors.primary}15` : 'transparent',
      transition: 'all 0.2s ease',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: colors.gray100
      }
    })
  };

  return (
    <div style={styles.toolbar}>
      {/* Text formatting */}
      <div style={styles.group}>
        <button 
          type="button"
          style={{
            ...styles.button(activeFormats.bold),
            fontWeight: 'bold'
          }}
          onClick={() => onFormatText('bold')}
          title="Negrita"
        >
          B
        </button>
        <button 
          type="button"
          style={{
            ...styles.button(activeFormats.italic),
            fontStyle: 'italic'
          }}
          onClick={() => onFormatText('italic')}
          title="Cursiva"
        >
          I
        </button>
        <button 
          type="button"
          style={{
            ...styles.button(activeFormats.underline),
            textDecoration: 'underline'
          }}
          onClick={() => onFormatText('underline')}
          title="Subrayado"
        >
          U
        </button>
      </div>

      {/* Headings */}
      <div style={styles.group}>
        <button 
          type="button"
          style={{...styles.button(activeFormats.h1)}}
          onClick={() => onFormatText('h1')}
          title="Encabezado 1"
        >
          H1
        </button>
        <button 
          type="button"
          style={{...styles.button(activeFormats.h2)}}
          onClick={() => onFormatText('h2')}
          title="Encabezado 2"
        >
          H2
        </button>
        <button 
          type="button"
          style={{...styles.button(activeFormats.h3)}}
          onClick={() => onFormatText('h3')}
          title="Encabezado 3"
        >
          H3
        </button>
      </div>

      {/* Lists */}
      <div style={styles.group}>
        <button 
          type="button"
          style={{...styles.button(activeFormats.unorderedList)}}
          onClick={() => onFormatText('unorderedList')}
          title="Lista con viñetas"
        >
          •
        </button>
        <button 
          type="button"
          style={{...styles.button(activeFormats.orderedList)}}
          onClick={() => onFormatText('orderedList')}
          title="Lista numerada"
        >
          1.
        </button>
      </div>

      {/* Text color and link */}
      <div style={styles.group}>
        <button 
          type="button"
          style={{...styles.button(false)}}
          onClick={() => onFormatText('textColor')}
          title="Color de texto"
        >
          A
        </button>
        <button 
          type="button"
          style={{...styles.button(activeFormats.link)}}
          onClick={() => onFormatText('link')}
          title="Insertar enlace"
        >
          🔗
        </button>
      </div>

      {/* Insert image */}
      <div style={styles.group}>
        <button 
          type="button"
          style={{...styles.button(false)}}
          onClick={() => onFormatText('image')}
          title="Insertar imagen"
        >
          🖼️
        </button>
      </div>
    </div>
  );
};

export default SimpleEditorToolbar;