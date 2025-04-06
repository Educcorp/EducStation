// src/components/admin/SimpleEditorToolbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';

// Tamaños de fuente predeterminados como en Word
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const SimpleEditorToolbar = ({ onFormatText, activeFormats = {} }) => {
  // Estado para manejar la selección de tamaño de texto
  const [fontSize, setFontSize] = useState(16); // Tamaño por defecto
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const fontSizeMenuRef = useRef(null);
  
  // Cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fontSizeMenuRef.current && !fontSizeMenuRef.current.contains(event.target)) {
        setShowFontSizeMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Función para aplicar un tamaño de fuente específico
  const applyFontSize = (size) => {
    setFontSize(size);
    onFormatText('fontSize', `${size}px`);
    setShowFontSizeMenu(false);
  };
  
  // Incrementar/decrementar tamaño de fuente
  const changeFontSize = (increment) => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    
    if (increment && currentIndex < FONT_SIZES.length - 1) {
      const newSize = FONT_SIZES[currentIndex + 1];
      setFontSize(newSize);
      onFormatText('fontSize', `${newSize}px`);
    } else if (!increment && currentIndex > 0) {
      const newSize = FONT_SIZES[currentIndex - 1];
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
      paddingRight: spacing.sm,
      alignItems: 'center'
    },
    button: (isActive) => ({
      background: 'none',
      border: 'none',
      borderRadius: borderRadius.sm,
      padding: spacing.xs,
      margin: `0 ${spacing.xxs}`,
      fontSize: '16px',
      cursor: 'pointer',
      color: isActive ? '#2B579A' : colors.textPrimary,
      backgroundColor: isActive ? 'rgba(43, 87, 154, 0.1)' : 'transparent',
      transition: 'all 0.2s ease',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: 'rgba(43, 87, 154, 0.1)'
      }
    }),
    iconImage: {
      width: '18px',
      height: '18px',
      objectFit: 'contain'
    },
    fontSizeButton: {
      background: 'none',
      border: 'none',
      borderRadius: borderRadius.sm,
      padding: `${spacing.xxs} ${spacing.xs}`,
      margin: `0 ${spacing.xxs}`,
      fontSize: typography.fontSize.sm,
      cursor: 'pointer',
      color: colors.textPrimary,
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.2s ease',
      position: 'relative',
      '&:hover': {
        backgroundColor: 'rgba(43, 87, 154, 0.1)'
      }
    },
    fontSizeDisplay: {
      margin: `0 ${spacing.xs}`,
      minWidth: '30px',
      textAlign: 'center'
    },
    fontSizeMenu: {
      position: 'absolute',
      top: '100%',
      left: '0',
      backgroundColor: 'white',
      border: '1px solid #e1e7e6',
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      maxHeight: '300px',
      overflow: 'auto',
      zIndex: 1001,
      display: showFontSizeMenu ? 'block' : 'none',
      marginTop: '2px',
      width: '50px'
    },
    fontSizeItem: {
      padding: '6px 12px',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'background-color 0.2s',
      textAlign: 'center',
      '&:hover': {
        backgroundColor: 'rgba(43, 87, 154, 0.1)'
      }
    },
    caret: {
      marginLeft: '2px',
      fontSize: '10px'
    },
    incrementButton: {
      background: 'none',
      border: 'none',
      padding: '3px 5px',
      cursor: 'pointer',
      color: '#2B579A', // Color azul estilo Word
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: 'rgba(43, 87, 154, 0.1)'
      }
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

      {/* Grupo de tamaño de texto */}
      <div style={styles.group}>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          {/* Selector de tamaño con desplegable */}
          <button
            type="button"
            style={styles.fontSizeButton}
            onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
            title="Tamaño de fuente"
          >
            {fontSize}
            <span style={styles.caret}>▾</span>
          </button>
          
          {/* Menú desplegable */}
          <div 
            ref={fontSizeMenuRef}
            style={styles.fontSizeMenu}
          >
            {FONT_SIZES.map(size => (
              <div
                key={size}
                style={{
                  ...styles.fontSizeItem,
                  backgroundColor: fontSize === size 
                    ? 'rgba(43, 87, 154, 0.1)' 
                    : 'transparent',
                  fontWeight: fontSize === size ? 'bold' : 'normal'
                }}
                onClick={() => applyFontSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
          
          {/* Controles de incremento/decremento */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              type="button"
              style={styles.incrementButton}
              onClick={() => changeFontSize(true)}
              title="Aumentar tamaño de fuente"
            >
              <span style={{ color: '#2B579A' }}>▲</span>
            </button>
            <button
              type="button"
              style={styles.incrementButton}
              onClick={() => changeFontSize(false)}
              title="Reducir tamaño de fuente"
            >
              <span style={{ color: '#2B579A' }}>▼</span>
            </button>
          </div>
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
          <span style={{ color: '#2B579A' }}>A</span>
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