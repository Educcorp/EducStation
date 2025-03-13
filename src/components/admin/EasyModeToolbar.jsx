// src/components/admin/EasyModeToolbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import Tooltip from '../ui/Tooltip';

const EasyModeToolbar = ({ actions, onSelectionChange }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const colorPickerRef = useRef(null);
  const bgColorPickerRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Colores predefinidos
  const colorPalette = [
    '#0b4444', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51',
    '#264653', '#d2b99a', '#4c7977', '#d23a00', '#000000'
  ];

  // Emojis comunes
  const commonEmojis = [
    '😊', '👍', '🎉', '❤️', '🔥', '✅', '⭐', '📌',
    '📝', '💡', '⚠️', '❓', '📊', '🔄', '📅', '⏰'
  ];

  // Mostrar tooltip
  const showTooltip = (id) => {
    setActiveTooltip(id);
  };

  // Ocultar tooltip
  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  // Manejador para aplicar formato
  const handleFormat = (format) => {
    onSelectionChange();
    actions.applyFormat(format);
  };

  // Manejador para insertar elemento
  const handleInsert = (element, data = null) => {
    onSelectionChange();
    actions.insertElement(element, data);
  };

  // Manejar selección de color
  const handleColorSelect = (color) => {
    handleInsert('color', color);
    setShowColorPicker(false);
  };

  // Manejar selección de color de fondo
  const handleBgColorSelect = (color) => {
    handleInsert('background', color);
    setShowBgColorPicker(false);
  };

  // Manejar selección de emoji
  const handleEmojiSelect = (emoji) => {
    handleInsert('emoji', emoji);
    setShowEmojiPicker(false);
  };

  // Cerrar popups cuando se hace clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColorPicker && colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
      if (showBgColorPicker && bgColorPickerRef.current && !bgColorPickerRef.current.contains(event.target)) {
        setShowBgColorPicker(false);
      }
      if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker, showBgColorPicker, showEmojiPicker]);

  // Estilos para la barra de herramientas
  const styles = {
    toolbarContainer: {
      display: "flex",
      gap: spacing.xs,
      flexWrap: "wrap",
      padding: spacing.sm,
      backgroundColor: colors.white,
      borderBottom: `1px solid ${colors.gray200}`,
      borderRadius: `${borderRadius.md} ${borderRadius.md} 0 0`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      position: "sticky",
      top: 0,
      zIndex: 10
    },
    toolbarSection: {
      display: "flex",
      borderRight: `1px solid ${colors.gray200}`,
      paddingRight: spacing.sm,
      marginRight: spacing.sm,
      gap: spacing.xs
    },
    toolbarButton: {
      padding: spacing.sm,
      border: "none",
      backgroundColor: "transparent",
      color: colors.primary,
      borderRadius: borderRadius.sm,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: typography.fontSize.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "36px",
      height: "36px",
      position: "relative"
    },
    activeButton: {
      backgroundColor: `${colors.primary}15`,
      color: colors.primary
    },
    colorPickerButton: {
      width: "36px",
      height: "36px",
      padding: "0",
      border: `1px solid ${colors.gray200}`,
      borderRadius: borderRadius.sm,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden"
    },
    colorSwatch: (color) => ({
      width: "100%",
      height: "100%",
      backgroundColor: color,
      display: "block"
    }),
    colorPickerContainer: {
      position: "absolute",
      top: "100%",
      left: "0",
      marginTop: spacing.xs,
      padding: spacing.sm,
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      boxShadow: shadows.lg,
      display: "flex",
      flexWrap: "wrap",
      gap: spacing.xs,
      zIndex: 20,
      width: "220px"
    },
    colorOption: (color) => ({
      width: "24px",
      height: "24px",
      backgroundColor: color,
      borderRadius: borderRadius.sm,
      cursor: "pointer",
      border: `1px solid ${colors.gray200}`,
      transition: "transform 0.2s ease"
    }),
    emojiPickerContainer: {
      position: "absolute",
      top: "100%",
      left: "0",
      marginTop: spacing.xs,
      padding: spacing.sm,
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      boxShadow: shadows.lg,
      display: "flex",
      flexWrap: "wrap",
      gap: spacing.xs,
      zIndex: 20,
      width: "220px"
    },
    emojiOption: {
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      cursor: "pointer",
      borderRadius: borderRadius.sm,
      transition: "background-color 0.2s ease",
      "&:hover": {
        backgroundColor: `${colors.gray100}`
      }
    },
    divider: {
      width: "1px",
      backgroundColor: colors.gray200,
      margin: `0 ${spacing.xs}`
    },
    iconImage: {
      width: "18px",
      height: "18px",
      objectFit: "contain"
    }
  };

  // Grupos de botones para la barra de herramientas
  const toolbarGroups = [
    {
      id: 'text-format',
      buttons: [
        { id: 'heading1', icon: 'H1', tooltip: 'Encabezado H1', action: () => handleInsert('h1') },
        { id: 'heading2', icon: 'H2', tooltip: 'Encabezado H2', action: () => handleInsert('h2') },
        { id: 'heading3', icon: 'H3', tooltip: 'Encabezado H3', action: () => handleInsert('h3') },
        { id: 'paragraph', icon: 'P', tooltip: 'Párrafo', action: () => handleInsert('paragraph') }
      ]
    },
    {
      id: 'formatting',
      buttons: [
        { id: 'bold', icon: <strong>B</strong>, tooltip: 'Negrita', action: () => handleFormat('bold') },
        { id: 'italic', icon: <em>I</em>, tooltip: 'Cursiva', action: () => handleFormat('italic') },
        { id: 'underline', icon: <u>U</u>, tooltip: 'Subrayado', action: () => handleFormat('underline') },
        {
          id: 'color',
          icon: <div style={{ 
            width: '16px', 
            height: '16px', 
            backgroundColor: '#0b4444', 
            borderRadius: '2px' 
          }}></div>,
          tooltip: 'Color de texto',
          action: () => setShowColorPicker(!showColorPicker),
          hasPopup: true,
          ref: colorPickerRef,
          popup: showColorPicker && (
            <div style={styles.colorPickerContainer}>
              {colorPalette.map((color, index) => (
                <div
                  key={index}
                  style={styles.colorOption(color)}
                  onClick={() => handleColorSelect(color)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                ></div>
              ))}
            </div>
          )
        },
        {
          id: 'background',
          icon: <div style={{ 
            width: '16px', 
            height: '16px', 
            backgroundColor: '#f0f8f7', 
            border: '1px solid #ccc',
            borderRadius: '2px' 
          }}></div>,
          tooltip: 'Color de fondo',
          action: () => setShowBgColorPicker(!showBgColorPicker),
          hasPopup: true,
          ref: bgColorPickerRef,
          popup: showBgColorPicker && (
            <div style={styles.colorPickerContainer}>
              {colorPalette.map((color, index) => (
                <div
                  key={index}
                  style={styles.colorOption(color)}
                  onClick={() => handleBgColorSelect(color)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                ></div>
              ))}
            </div>
          )
        }
      ]
    },
    {
      id: 'lists',
      buttons: [
        { id: 'unordered-list', icon: '•', tooltip: 'Lista con viñetas', action: () => handleFormat('insertUnorderedList') },
        { id: 'ordered-list', icon: '1.', tooltip: 'Lista numerada', action: () => handleFormat('insertOrderedList') }
      ]
    },
    {
      id: 'media',
      buttons: [
        { id: 'link', icon: '🔗', tooltip: 'Insertar enlace', action: () => handleInsert('link') },
        { id: 'image', icon: '🖼️', tooltip: 'Insertar imagen', action: () => handleInsert('image') },
        { id: 'table', icon: '⊞', tooltip: 'Insertar tabla', action: () => handleInsert('table') },
        { id: 'quote', icon: '""', tooltip: 'Cita', action: () => handleInsert('quote') },
        { id: 'code', icon: '{ }', tooltip: 'Bloque de código', action: () => handleInsert('code') }
      ]
    },
    {
      id: 'misc',
      buttons: [
        { id: 'divider', icon: '―', tooltip: 'Línea divisoria', action: () => handleInsert('divider') },
        {
          id: 'emoji',
          icon: '😊',
          tooltip: 'Insertar emoji',
          action: () => setShowEmojiPicker(!showEmojiPicker),
          hasPopup: true,
          ref: emojiPickerRef,
          popup: showEmojiPicker && (
            <div style={styles.emojiPickerContainer}>
              {commonEmojis.map((emoji, index) => (
                <div
                  key={index}
                  style={styles.emojiOption}
                  onClick={() => handleEmojiSelect(emoji)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.gray100}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {emoji}
                </div>
              ))}
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div style={styles.toolbarContainer}>
      {toolbarGroups.map((group) => (
        <div key={group.id} style={styles.toolbarSection}>
          {group.buttons.map((button) => (
            <div
              key={button.id}
              ref={button.ref}
              style={{ position: 'relative' }}
            >
              <button
                style={styles.toolbarButton}
                onClick={button.action}
                onMouseEnter={() => showTooltip(button.id)}
                onMouseLeave={hideTooltip}
              >
                {typeof button.icon === 'string' ? button.icon : button.icon}
                <Tooltip
                  isVisible={activeTooltip === button.id}
                  text={button.tooltip}
                />
              </button>
              {button.hasPopup && button.popup}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EasyModeToolbar;