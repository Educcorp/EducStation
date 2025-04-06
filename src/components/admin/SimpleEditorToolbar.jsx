// src/components/admin/SimpleEditorToolbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';

// Tamaños de fuente predeterminados como en Word
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const SimpleEditorToolbar = ({ onFormatText, activeFormats = {}, fontSize, setFontSize }) => {
  // Estado para la selección de tamaño de texto (ahora recibido como prop)
  const [customFontSize, setCustomFontSize] = useState('');
  const [isEditingFontSize, setIsEditingFontSize] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const fontSizeMenuRef = useRef(null);
  const customFontInputRef = useRef(null);
  
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
  
  // Actualizar el estado local cuando cambia el tamaño de fuente recibido
  useEffect(() => {
    if (isEditingFontSize) {
      setCustomFontSize(fontSize.toString());
    }
  }, [fontSize, isEditingFontSize]);
  
  // Función para aplicar un tamaño de fuente específico
  const applyFontSize = (size) => {
    setFontSize(size); // Usar la función proporcionada por el componente padre
    setShowFontSizeMenu(false);
    setIsEditingFontSize(false);
  };
  
  // Maneja la entrada de texto para tamaño personalizado
  const handleCustomFontSizeChange = (e) => {
    // Solo permitir números y un punto decimal
    const value = e.target.value.replace(/[^0-9.]/g, '');
    // Evitar múltiples puntos decimales
    if (value.split('.').length > 2) return;
    
    setCustomFontSize(value);
  };

  // Maneja cuando el usuario confirma un tamaño personalizado
  const handleCustomFontSizeSubmit = (e) => {
    e.preventDefault();
    
    if (customFontSize) {
      const size = parseFloat(customFontSize);
      // Validar que sea un número y esté en un rango razonable
      if (!isNaN(size) && size >= 1 && size <= 500) {
        applyFontSize(size);
      }
    }
    
    setIsEditingFontSize(false);
  };
  
  // Incrementar/decrementar tamaño de fuente
  const changeFontSize = (increment) => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    
    if (increment && currentIndex < FONT_SIZES.length - 1) {
      applyFontSize(FONT_SIZES[currentIndex + 1]);
    } else if (!increment && currentIndex > 0) {
      applyFontSize(FONT_SIZES[currentIndex - 1]);
    }
  };
  
  // Activar el modo de edición de tamaño personalizado
  const enableFontSizeEditing = () => {
    setIsEditingFontSize(true);
    setCustomFontSize(fontSize.toString());
    setShowFontSizeMenu(false);
    
    // Enfocar el input después de que se haya renderizado
    setTimeout(() => {
      if (customFontInputRef.current) {
        customFontInputRef.current.focus();
        customFontInputRef.current.select();
      }
    }, 50);
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
      border: '1px solid #e1e7e6',
      borderRadius: borderRadius.sm,
      padding: `${spacing.xxs} ${spacing.xs}`,
      margin: `0 ${spacing.xxs}`,
      fontSize: typography.fontSize.sm,
      cursor: 'pointer',
      color: '#333333', // Color más oscuro para mejor legibilidad
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
    fontSizeInput: {
      width: '40px',
      border: '1px solid #2B579A',
      borderRadius: '4px',
      padding: '4px',
      fontSize: '13px',
      color: '#333333',
      textAlign: 'center',
      outline: 'none',
      backgroundColor: 'white',
    },
    fontSizeMenu: {
      position: 'absolute',
      top: '100%',
      left: '0',
      backgroundColor: 'white',
      border: '1px solid #cccccc',
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
      color: '#333333', // Color más oscuro para mejor legibilidad
      '&:hover': {
        backgroundColor: 'rgba(43, 87, 154, 0.1)'
      }
    },
    customOption: {
      borderTop: '1px solid #e1e7e6', 
      fontStyle: 'italic',
      padding: '6px 12px',
      cursor: 'pointer',
      userSelect: 'none',
      textAlign: 'center',
      color: '#2B579A',
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
          {isEditingFontSize ? (
            /* Campo de entrada para tamaño personalizado */
            <form onSubmit={handleCustomFontSizeSubmit} style={{ display: 'flex', margin: '0 2px' }}>
              <input
                ref={customFontInputRef}
                type="text"
                value={customFontSize}
                onChange={handleCustomFontSizeChange}
                onBlur={handleCustomFontSizeSubmit}
                style={styles.fontSizeInput}
                title="Ingresa un tamaño personalizado"
              />
            </form>
          ) : (
            /* Selector de tamaño con desplegable */
            <button
              type="button"
              style={styles.fontSizeButton}
              onClick={enableFontSizeEditing} // Al hacer clic directo, abre el editor de tamaño personalizado
              onDoubleClick={() => setShowFontSizeMenu(!showFontSizeMenu)} // Doble clic muestra el menú
              title="Haz clic para editar el tamaño o mostrar opciones predefinidas"
            >
              {fontSize}
              <span style={styles.caret}>▾</span>
            </button>
          )}
          
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
            {/* Opción de tamaño personalizado */}
            <div
              style={styles.customOption}
              onClick={enableFontSizeEditing}
            >
              Personalizado
            </div>
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