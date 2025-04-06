// src/components/admin/SimpleEditorToolbar.jsx
import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';

const SimpleEditorToolbar = ({ onFormatText, activeFormats = {} }) => {
  // Estado para manejar la selección de tamaño de texto
  const [fontSize, setFontSize] = useState(16); // Tamaño por defecto
  
  // Función para incrementar o decrementar el tamaño de fuente
  const changeFontSize = (increment) => {
    const newSize = fontSize + increment;
    // Limitar el tamaño entre 8 y 72px
    if (newSize >= 8 && newSize <= 72) {
      setFontSize(newSize);
      onFormatText('fontSize', `${newSize}px`);
    }
  };

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
    }),
    iconImage: {
      width: '18px',
      height: '18px',
      objectFit: 'contain'
    },
    fontSizeControls: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xxs
    },
    fontSizeButton: {
      background: 'none',
      border: 'none',
      borderRadius: borderRadius.sm,
      padding: spacing.xs,
      cursor: 'pointer',
      color: colors.textPrimary,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: colors.gray100
      }
    },
    fontSizeDisplay: {
      fontSize: typography.fontSize.sm,
      color: colors.textPrimary,
      width: '28px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.toolbar}>
      {/* Grupo de formato de texto */}
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
          <img src="/assets/images/icons/ITALIC_icon.png" alt="Cursiva" style={styles.iconImage} />
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

      {/* Grupo de tamaño de texto - Reemplaza a los encabezados */}
      <div style={styles.group}>
        <div style={styles.fontSizeControls}>
          <button 
            type="button"
            style={styles.fontSizeButton}
            onClick={() => changeFontSize(-1)}
            title="Reducir tamaño de texto"
          >
            <span style={{ fontSize: '14px' }}>A-</span>
          </button>
          
          <span style={styles.fontSizeDisplay}>{fontSize}px</span>
          
          <button 
            type="button"
            style={styles.fontSizeButton}
            onClick={() => changeFontSize(1)}
            title="Aumentar tamaño de texto"
          >
            <span style={{ fontSize: '18px' }}>A+</span>
          </button>
        </div>
      </div>

      {/* Grupo de listas */}
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

      {/* Grupo de color de texto y enlace */}
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
          <img src="/assets/images/icons/LINK_icon.png" alt="Enlace" style={styles.iconImage} />
        </button>
      </div>

      {/* Grupo de insertar imagen */}
      <div style={styles.group}>
        <button 
          type="button"
          style={{...styles.button(false)}}
          onClick={() => onFormatText('image')}
          title="Insertar imagen"
        >
          <img src="/assets/images/icons/IMG_icon.png" alt="Imagen" style={styles.iconImage} />
        </button>
      </div>
    </div>
  );
};

export default SimpleEditorToolbar;