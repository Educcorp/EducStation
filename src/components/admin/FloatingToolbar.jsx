import React, { useState, useEffect, useRef } from 'react';
import Tooltip from '../ui/Tooltip';
import ColorPicker from './ColorPicker'; // Importamos el componente ColorPicker

// Tamaños de fuente predeterminados como en Word
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72, 120];

// Componente para el popup de enlaces
const LinkPopup = ({ onApplyLink, onClosePopup }) => {
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('https://');
  const [isNewTab, setIsNewTab] = useState(true);
  const linkTextInputRef = useRef(null);

  useEffect(() => {
    // Enfocar el campo de texto al abrir
    if (linkTextInputRef.current) {
      linkTextInputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyLink({ text: linkText, url: linkUrl, newTab: isNewTab });
  };

  const styles = {
    container: {
      position: 'absolute',
      top: 'calc(100% + 5px)',
      left: '0',
      zIndex: 1001,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.08)',
      padding: '15px',
      width: '300px',
      animation: 'fadeIn 0.2s ease',
      border: '1px solid rgba(200, 210, 220, 0.5)',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    title: {
      margin: 0,
      color: '#0b4444',
      fontSize: '16px',
      fontWeight: 600,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#666',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '26px',
      height: '26px',
      borderRadius: '50%',
      backgroundColor: '#f0f0f0',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    field: {
      marginBottom: '10px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#0b4444',
      fontSize: '14px',
      fontWeight: 500,
    },
    input: {
      width: '100%',
      padding: '8px 10px',
      border: '1px solid #dfe3e8',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#0b4444',
      boxSizing: 'border-box',
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px',
      marginBottom: '15px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '10px',
      marginTop: '5px',
    },
    button: {
      padding: '8px 15px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      transition: 'all 0.2s ease',
    },
    cancelButton: {
      backgroundColor: '#f0f0f0',
      color: '#0b4444',
    },
    applyButton: {
      backgroundColor: '#0b4444',
      color: 'white',
      flex: 1,
    }
  };

  return (
    <div style={styles.container} onClick={(e) => e.stopPropagation()}>
      <div style={styles.header}>
        <h3 style={styles.title}>Insertar enlace</h3>
        <button 
          style={styles.closeButton} 
          onClick={onClosePopup}
          title="Cerrar"
        >
          ×
        </button>
      </div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="linkText">Texto del enlace</label>
          <input
            ref={linkTextInputRef}
            id="linkText"
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Texto visible"
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="linkUrl">URL</label>
          <input
            id="linkUrl"
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://ejemplo.com"
            style={styles.input}
          />
        </div>
        <div style={styles.checkbox}>
          <input
            id="openInNewTab"
            type="checkbox"
            checked={isNewTab}
            onChange={(e) => setIsNewTab(e.target.checked)}
          />
          <label htmlFor="openInNewTab">Abrir en nueva pestaña</label>
        </div>
        <div style={styles.buttonContainer}>
          <button 
            type="button" 
            style={{...styles.button, ...styles.cancelButton}}
            onClick={onClosePopup}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            style={{...styles.button, ...styles.applyButton}}
          >
            Aplicar
          </button>
        </div>
      </form>
    </div>
  );
};

// FloatingToolbar - Barra de herramientas flotante mejorada para edición de texto
const FloatingToolbar = ({ onFormatText, activeFormats, editorRef, fontSize, setFontSize }) => {
  // Estados del componente
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [customFontSize, setCustomFontSize] = useState('');
  const [isEditingFontSize, setIsEditingFontSize] = useState(false);
  const [savedSelection, setSavedSelection] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Definir el color predeterminado como constante
  const DEFAULT_TEXT_COLOR = '#0b4444'; // Verde oscuro
  
  // Estados para el selector de color usando el color predeterminado
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentIconColor, setCurrentIconColor] = useState(DEFAULT_TEXT_COLOR);
  
  // Estado para el popup de enlaces
  const [showLinkPopup, setShowLinkPopup] = useState(false);

  // Guardar el color predeterminado en localStorage al iniciar
  useEffect(() => {
    try {
      localStorage.setItem('lastUsedTextColor', DEFAULT_TEXT_COLOR);
    } catch (e) {
      console.warn('No se pudo guardar el color por defecto:', e);
    }
  }, []);

  // Estados para animaciones
  const [animateButton, setAnimateButton] = useState(null);

  // Referencias
  const toolbarRef = useRef(null);
  const fontSizeMenuRef = useRef(null);
  const customFontInputRef = useRef(null);
  const colorButtonRef = useRef(null);
  const linkButtonRef = useRef(null);

  // Mostrar tooltip
  const showTooltip = (id) => {
    setActiveTooltip(id);
  };

  // Ocultar tooltip
  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  // Animar botón cuando se hace clic
  const animateButtonClick = (buttonId) => {
    setAnimateButton(buttonId);
    setTimeout(() => setAnimateButton(null), 300);
  };

  // Manejar clic en el botón de color
  const handleColorButtonClick = () => {
    // Guardar la selección actual antes de abrir el color picker
    saveSelection();
    animateButtonClick('color');
    // Mostrar u ocultar el selector de color
    setShowColorPicker(!showColorPicker);
    // Ocultar otros menús
    setShowFontSizeMenu(false);
  };

  // Aplicar color seleccionado y guardarlo automáticamente
  const applyTextColor = (color) => {
    if (restoreSelection()) {
      try {
        document.execCommand('foreColor', false, color);
        setShowColorPicker(false);
        // Actualizar el color del ícono al color seleccionado
        setCurrentIconColor(color);
        // Guardar el último color usado para mantener sincronización
        try {
          localStorage.setItem('lastUsedTextColor', color);
        } catch (e) {
          console.warn('No se pudo guardar el último color usado:', e);
        }
        
        // Guardar automáticamente el color en localStorage (excepto los predeterminados)
        const defaultColors = ['#91a8a4', '#0b4444', '#4c7977', '#f0f8f7', '#d2b99a'];
        
        if (!defaultColors.includes(color)) {
          try {
            // Recuperar colores guardados
            const storedColorsStr = localStorage.getItem('savedTextColors');
            let storedColors = defaultColors;
            
            if (storedColorsStr) {
              try {
                const parsed = JSON.parse(storedColorsStr);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  storedColors = parsed;
                }
              } catch (e) {
                console.warn('Error al parsear colores guardados:', e);
              }
            }
            
            // Verificar si el color ya existe
            if (!storedColors.includes(color)) {
              // Mantener solo los últimos 5 colores
              if (storedColors.length >= 5) {
                storedColors.shift();
              }
              storedColors.push(color);
              localStorage.setItem('savedTextColors', JSON.stringify(storedColors));
            }
          } catch (e) {
            console.warn('Error al guardar color:', e);
          }
        }
      } catch (e) {
        console.error('Error al aplicar color:', e);
        // En caso de error, usar un color predeterminado
        document.execCommand('foreColor', false, '#0b4444');
        setCurrentIconColor('#0b4444');
      }
    }
  };

  // Cerrar el selector de color
  const closeColorPicker = () => {
    setShowColorPicker(false);
  };

  // Obtener color de contraste para texto basado en color de fondo
  const getContrastColor = (hexColor) => {
    // Convertir hex a RGB
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    
    // Calcular luminosidad
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Retornar blanco o negro según la luminosidad del color de fondo
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  // Estilos para la barra de herramientas
  const styles = {
    floatingBar: {
      position: 'absolute',
      zIndex: 100, // Reducir el z-index para que sea menor que el del header
      display: visible ? 'flex' : 'none',
      alignItems: 'center',
      backgroundColor: 'rgb(245, 247, 250)',
      borderRadius: '12px',
      padding: '8px 10px',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      gap: '3px',
      border: '1px solid rgba(200, 210, 220, 0.5)',
      backdropFilter: 'blur(8px)',
    },
    button: (isActive, buttonId) => ({
      background: 'none',
      border: 'none',
      borderRadius: '8px',
      padding: '7px',
      margin: '0 2px',
      fontSize: '15px',
      cursor: 'pointer',
      color: isActive ? '#1b4fd9' : '#0b4444',
      backgroundColor: isActive ? 'rgba(43, 87, 154, 0.12)' : 'transparent',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      position: 'relative',
      transform: animateButton === buttonId ? 'scale(0.92)' : 'scale(1)',
      boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.05) inset' : 'none',
    }),
    colorButton: (showingPicker) => ({
      background: 'none',
      border: 'none',
      borderRadius: '8px',
      padding: '7px',
      margin: '0 2px',
      fontSize: '15px',
      cursor: 'pointer',
      color: '#0b4444',
      backgroundColor: showingPicker ? 'rgba(43, 87, 154, 0.12)' : 'transparent',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      position: 'relative',
      transform: animateButton === 'color' ? 'scale(0.92)' : 'scale(1)',
      boxShadow: showingPicker ? '0 1px 3px rgba(0, 0, 0, 0.05) inset' : 'none',
    }),
    fontSizeButton: {
      display: 'flex',
      alignItems: 'center',
      background: 'white',
      border: '1px solid #dfe3e8',
      borderRadius: '8px',
      padding: '4px 10px',
      margin: '0 3px',
      fontSize: '14px',
      cursor: 'pointer',
      color: '#333333',
      fontWeight: 'normal',
      transition: 'all 0.2s ease',
      position: 'relative',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
      minWidth: '40px',
      textAlign: 'center',
      transform: animateButton === 'fontSize' ? 'scale(0.95)' : 'scale(1)',
    },
    fontSizeInput: {
      width: '40px',
      border: '1px solid #dfe3e8',
      borderRadius: '6px',
      padding: '5px',
      fontSize: '14px',
      color: '#333333',
      textAlign: 'center',
      outline: 'none',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05) inset',
    },
    fontSizeMenu: {
      position: 'absolute',
      top: '100%',
      left: '0',
      backgroundColor: 'white',
      border: '1px solid #dfe3e8',
      borderRadius: '8px',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
      maxHeight: '300px',
      overflow: 'auto',
      zIndex: 1001,
      display: showFontSizeMenu ? 'block' : 'none',
      marginTop: '5px',
      width: '60px',
      animation: showFontSizeMenu ? 'fadeIn 0.2s ease' : 'none',
    },
    fontSizeItem: {
      padding: '8px 12px',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'background-color 0.2s',
      textAlign: 'center',
      color: '#0b4444',
      fontSize: '14px',
    },
    customOption: {
      borderTop: '1px solid #ebeef2', 
      fontStyle: 'italic',
      padding: '8px 12px',
      cursor: 'pointer',
      userSelect: 'none',
      textAlign: 'center',
      color: '#1b4fd9',
      fontSize: '13px',
    },
    separator: {
      width: '1px',
      height: '24px',
      margin: '0 6px',
      backgroundColor: '#dfe3e8'
    },
    sizeControls: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative'
    },
    incrementButton: {
      background: 'none',
      border: 'none',
      padding: '5px',
      cursor: 'pointer',
      color: '#2B579A', 
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      position: 'relative',
      transition: 'all 0.2s ease',
      transform: (animateButton === 'increaseSize' || animateButton === 'decreaseSize') ? 'scale(0.9)' : 'scale(1)',
    },
    colorIconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      backgroundColor: currentIconColor,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
    },
    colorIcon: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: getContrastColor(currentIconColor),
      transition: 'all 0.3s ease',
    },
    iconImage: {
      width: '16px',
      height: '16px',
      objectFit: 'contain'
    }
  };

  // Estilos CSS para animaciones
  const cssAnimation = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
  `;

  // Función para calcular la posición de la barra
  const calculateBarPosition = (selection) => {
    if (!editorRef.current) return;
    
    // Calcular la posición de la barra
    const editorRect = editorRef.current.getBoundingClientRect();
    
    // Altura estimada del header (ajusta este valor según la altura real de tu header)
    const headerHeight = 60;
    
    // Calculamos la altura de la barra (se estima en 50px si aún no está renderizada)
    const toolbarHeight = toolbarRef.current ? toolbarRef.current.offsetHeight : 50;
    // Calculamos el ancho de la barra (se estima en 320px si aún no está renderizada)
    const toolbarWidth = toolbarRef.current ? toolbarRef.current.offsetWidth : 320;
    
    let newPosition;
    
    // Determinar la línea en la que está el cursor (primera línea o no)
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const isFirstLine = rect.top < editorRect.top + 30; // Aproximadamente primera línea
    
    // Calcular la altura de línea aproximada (puede ajustarse según el tipo de fuente)
    const lineHeight = 22; // Altura estimada de la línea de texto
    
    const hasSelection = selection && !selection.isCollapsed && editorRef.current;
    
    if (hasSelection) {
      // Si hay selección, posicionar debajo de la selección
      if (rect.width === 0) {
        return;
      }
      
      newPosition = {
        // Posicionamos la barra debajo de la línea de texto
        top: Math.max(rect.bottom - editorRect.top + 10, headerHeight), // Asegurar que no sube más que el header
        // Alineamos con el inicio de la selección
        left: rect.left - editorRect.left
      };
    } else {
      // Si solo está activo el editor sin selección
      const isNearLeftEdge = rect.left < editorRect.left + 50;
      
      // Siempre colocar la barra debajo del cursor
      newPosition = {
        top: Math.max(rect.bottom - editorRect.top + 10, headerHeight), // Asegurar que no sube más que el header
        left: rect.left - editorRect.left // Alineado con el cursor
      };
      
      // Si no tenemos dimensiones válidas, usar posición por defecto dentro del editor
      if (rect.width === 0 && rect.height === 0) {
        newPosition = {
          top: Math.max(30 + lineHeight, headerHeight), // Usar como mínimo la altura del header
          left: 50 // Desde el borde izquierdo
        };
      }
    }
    
    // CRÍTICO: Asegurar que la barra siempre está DENTRO del editor
    // 1. Comprobar límites verticales
    if (newPosition.top < 0) {
      // Si la posición es negativa, colocar al inicio del editor
      newPosition.top = 10;
    }
    
    const editorHeight = editorRef.current.offsetHeight;
    if (newPosition.top + toolbarHeight > editorHeight) {
      // Si la barra se saldría por abajo, colocar más arriba
      newPosition.top = editorHeight - toolbarHeight - 10;
    }
    
    // 2. Comprobar límites horizontales
    if (newPosition.left < 10) {
      newPosition.left = 10;
    }
    
    const editorWidth = editorRef.current.offsetWidth;
    if (newPosition.left + toolbarWidth > editorWidth) {
      newPosition.left = editorWidth - toolbarWidth - 10;
    }
    
    // 3. Comprobar que la posición es válida
    newPosition.top = Math.max(0, newPosition.top);
    newPosition.left = Math.max(0, newPosition.left);
    
    setPosition(newPosition);
  };

  // Función para guardar la selección actual
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const ranges = [];
      for (let i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i).cloneRange());
      }
      setSavedSelection(ranges);
      return ranges;
    }
    return null;
  };

  // Función para restaurar la selección guardada
  const restoreSelection = (ranges = savedSelection) => {
    if (!ranges) return false;
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    
    ranges.forEach(range => {
      selection.addRange(range);
    });
    
    return true;
  };

  // Función para verificar la selección de texto o si el editor está activo
  const checkSelection = (event) => {
    // Obtener la selección actual
    const selection = window.getSelection();
    
    // Si hay una selección de texto (no colapsada), siempre mostrar la barra
    // independientemente del estado de escritura
    const hasTextSelection = selection && !selection.isCollapsed && selection.toString().trim() !== '';
    
    // Si estamos escribiendo y no hay selección de texto, no mostrar la barra
    if (isTyping && !hasTextSelection) return;
    
    try {
      // Verificar si se está interactuando con una imagen
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let element = range.commonAncestorContainer;
        
        // Si estamos en un nodo de texto, obtener el elemento padre
        if (element.nodeType === 3) {
          element = element.parentNode;
        }
        
        // Verificar si estamos dentro de un contenedor de imagen o sus controles
        let current = element;
        while (current) {
          if (current.classList && 
              (current.classList.contains('image-container') || 
               current.classList.contains('resize-handle'))) {
            // Si estamos dentro de una imagen o sus controles, no mostrar la barra
            setVisible(false);
            return;
          }
          if (current === editorRef.current) break;
          current = current.parentNode;
        }
      }
      
      // Evitar ocultar la barra si estamos interactuando con elementos de la barra
      if (
        toolbarRef.current &&
        (toolbarRef.current.contains(document.activeElement) ||
         (event && toolbarRef.current.contains(event.target)))
      ) {
        return;
      }

      // Prevent hiding the toolbar if interacting with the font size menu
      if (
        fontSizeMenuRef.current &&
        (fontSizeMenuRef.current.contains(document.activeElement) ||
         (selection.anchorNode && fontSizeMenuRef.current.contains(selection.anchorNode)))
      ) {
        return;
      }
      
      // Verificar si el editor está activo
      const isEditorActive = editorRef.current === document.activeElement;
      
      // Verificar si tenemos una selección válida
      const hasSelection = selection && !selection.isCollapsed && editorRef.current;
      
      // Si ni el editor está activo ni hay selección, ocultar la barra
      if (!isEditorActive && !hasSelection) {
        setVisible(false);
        setShowFontSizeMenu(false);
        return;
      }
      
      // Verificar si la selección o el cursor está dentro del editor
      let isInEditor = false;
      
      if (isEditorActive) {
        isInEditor = true;
      } else if (hasSelection) {
        const range = selection.getRangeAt(0);
        let container = range.commonAncestorContainer;
        
        // Si el contenedor es un nodo de texto, obtener su elemento padre
        if (container.nodeType === 3) {
          container = container.parentNode;
        }
        
        // Verificar si el contenedor o algún antecesor es el editor
        let current = container;
        
        while (current && !isInEditor) {
          if (current === editorRef.current) {
            isInEditor = true;
          }
          current = current.parentNode;
        }
      }
      
      if (!isInEditor) {
        setVisible(false);
        setShowFontSizeMenu(false);
        return;
      }
      
      // Calcular la posición de la barra
      calculateBarPosition(selection);
      
      setVisible(true);
      
      // Guardar la selección actual para poder restaurarla más tarde
      saveSelection();
    } catch (error) {
      console.error('Error al verificar selección:', error);
      setVisible(false);
      setShowFontSizeMenu(false);
    }
  };

  // Aplicar un tamaño de fuente específico
  const applyFontSize = (size) => {
    // Restaurar la selección antes de aplicar el formato
    if (restoreSelection()) {
      setFontSize(size); // Usar la función proporcionada por el componente padre
      animateButtonClick('fontSize');
    }
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
    // Restaurar la selección antes de cambiar el tamaño
    if (restoreSelection()) {
      const currentIndex = FONT_SIZES.indexOf(fontSize);
      
      if (increment && currentIndex < FONT_SIZES.length - 1) {
        applyFontSize(FONT_SIZES[currentIndex + 1]);
        animateButtonClick('increaseSize');
      } else if (!increment && currentIndex > 0) {
        applyFontSize(FONT_SIZES[currentIndex - 1]);
        animateButtonClick('decreaseSize');
      }
    }
  };

  // Activar el modo de edición de tamaño personalizado
  const enableFontSizeEditing = (e) => {
    e.stopPropagation(); // Evitar la propagación del evento
    
    // Guardar la selección actual si aún no se ha guardado
    if (!savedSelection) {
      saveSelection();
    }
    
    setIsEditingFontSize(true);
    setCustomFontSize(fontSize.toString());
    setShowFontSizeMenu(false);
    animateButtonClick('fontSize');
    
    // Enfocar el input después de que se haya renderizado
    setTimeout(() => {
      if (customFontInputRef.current) {
        customFontInputRef.current.focus();
        customFontInputRef.current.select();
      }
    }, 50);
  };

  // Toggle del menú de tamaños
  const toggleFontSizeMenu = (e) => {
    e.stopPropagation(); // Evitar la propagación del evento
    
    // Guardar la selección actual si aún no se ha guardado
    if (!savedSelection) {
      saveSelection();
    }
    
    setShowFontSizeMenu(!showFontSizeMenu);
    animateButtonClick('fontSize');
  };

  // Actualizar el estado local cuando cambia el tamaño de fuente recibido
  useEffect(() => {
    if (isEditingFontSize) {
      setCustomFontSize(fontSize.toString());
    }
  }, [fontSize, isEditingFontSize]);

  // Mostrar la barra al hacer clic en el editor
  useEffect(() => {
    const handleEditorClick = (e) => {
      // Verificar si se hizo clic en una imagen o sus controles
      let targetElement = e.target;
      
      // Comprobar si el clic fue en una imagen o sus controles
      while (targetElement && targetElement !== editorRef.current) {
        if (targetElement.classList && 
            (targetElement.classList.contains('image-container') || 
             targetElement.classList.contains('resize-handle'))) {
          // Si se hizo clic en una imagen, no mostrar la barra
          setVisible(false);
          return;
        }
        targetElement = targetElement.parentNode;
      }
      
      if (editorRef.current && editorRef.current === document.activeElement && !isTyping) {
        checkSelection();
      }
    };
    
    if (editorRef.current) {
      editorRef.current.addEventListener('click', handleEditorClick);
    }
    
    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('click', handleEditorClick);
      }
    };
  }, [editorRef?.current, isTyping]);

  // Detectar cambios en la selección y en el foco del editor
  useEffect(() => {
    // No agregar event listeners si no hay editorRef
    if (!editorRef || !editorRef.current) return;
    
    // Temporizador para controlar la visualización de la barra
    let typingTimer;
    
    const handleKeyDown = (e) => {
      // Marcar que estamos escribiendo
      setIsTyping(true);
      // Ocultar la barra inmediatamente al empezar a escribir
      setVisible(false);
      // Limpiar el temporizador anterior
      clearTimeout(typingTimer);
    };
    
    const handleInput = (e) => {
      // Marcar que estamos escribiendo
      setIsTyping(true);
      // Asegurarse de que la barra está oculta mientras se escribe
      setVisible(false);
      // Limpiar el temporizador anterior
      clearTimeout(typingTimer);
    };
    
    const handleKeyUp = () => {
      // Limpiar el temporizador anterior
      clearTimeout(typingTimer);
      // Configurar un nuevo temporizador
      typingTimer = setTimeout(() => {
        // Ya no estamos escribiendo
        setIsTyping(false);
        // Forzar la visualización de la barra después del tiempo de espera
        const selection = window.getSelection();
        
        if (selection && editorRef.current) {
          // Asegurarse de que el editor sigue teniendo el foco
          if (editorRef.current === document.activeElement) {
            try {
              // Calcular la posición de forma segura
              const editorRect = editorRef.current.getBoundingClientRect();
              const range = selection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              
              // Verificar que la selección está dentro del editor
              if (
                rect.top >= editorRect.top && 
                rect.bottom <= editorRect.bottom &&
                rect.left >= editorRect.left &&
                rect.right <= editorRect.right
              ) {
                // Solo si estamos dentro del editor, mostrar la barra
                calculateBarPosition(selection);
                setVisible(true);
              } else {
                // Si estamos fuera del editor, colocar en una posición segura dentro del editor
                setPosition({
                  top: 30,
                  left: 50
                });
                setVisible(true);
              }
            } catch (e) {
              console.error("Error al posicionar la barra:", e);
              // Posición por defecto dentro del editor
              setPosition({
                top: 30,
                left: 50
              });
              setVisible(true);
            }
          }
        }
      }, 1500); // Esperar 1.5 segundos después de dejar de escribir
    };
    
    // Deshabilitar temporalmente los eventos que podrían causar parpadeo
    const handleSelectionChange = () => {
      // Obtener la selección actual
      const selection = window.getSelection();
      
      // Si hay una selección de texto (no colapsada), siempre mostrar la barra
      const hasTextSelection = selection && !selection.isCollapsed && selection.toString().trim() !== '';
      
      // Verificar si se seleccionó una imagen
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let element = range.commonAncestorContainer;
        
        // Si estamos en un nodo de texto, obtener el elemento padre
        if (element.nodeType === 3) {
          element = element.parentNode;
        }
        
        // Verificar si estamos dentro de un contenedor de imagen o sus controles
        let isImageSelection = false;
        let current = element;
        while (current) {
          if (current.classList && 
              (current.classList.contains('image-container') || 
               current.classList.contains('resize-handle'))) {
            isImageSelection = true;
            break;
          }
          if (current === editorRef.current) break;
          current = current.parentNode;
        }
        
        // Si la selección es una imagen, ocultar la barra y salir
        if (isImageSelection) {
          setVisible(false);
          return;
        }
      }
      
      // Si hay texto seleccionado o no estamos escribiendo, verificar la selección
      if (hasTextSelection || !isTyping) {
        checkSelection();
      }
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    editorRef.current.addEventListener('mouseup', handleSelectionChange);
    editorRef.current.addEventListener('keydown', handleKeyDown);
    editorRef.current.addEventListener('input', handleInput);
    editorRef.current.addEventListener('keyup', handleKeyUp);
    editorRef.current.addEventListener('focus', handleSelectionChange);
    
    // Limpiar event listeners
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (editorRef.current) {
        editorRef.current.removeEventListener('mouseup', handleSelectionChange);
        editorRef.current.removeEventListener('mouseup', handleSelectionChange);
        editorRef.current.removeEventListener('keydown', handleKeyDown);
        editorRef.current.removeEventListener('input', handleInput);
        editorRef.current.removeEventListener('keyup', handleKeyUp);
        editorRef.current.removeEventListener('focus', handleSelectionChange);
      }
      clearTimeout(typingTimer);
    };
  }, [editorRef?.current, isTyping]);

  // Aplicar enlace con los datos del formulario
  const applyLink = ({ text, url, newTab }) => {
    if (restoreSelection()) {
      try {
        const selection = window.getSelection();
        // Si hay texto seleccionado, usamos ese texto, si no, usamos el texto proporcionado
        const selectionText = selection.toString().trim();
        
        if (selectionText === '') {
          // Si no hay texto seleccionado, crear un nuevo nodo de enlace
          const linkElement = document.createElement('a');
          linkElement.href = url;
          linkElement.textContent = text;
          
          if (newTab) {
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';
          }
          
          // Insertar el enlace en la posición del cursor
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(linkElement);
          
          // Mover el cursor después del enlace
          range.setStartAfter(linkElement);
          range.setEndAfter(linkElement);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // Si hay texto seleccionado, primero creamos el enlace usando execCommand
          document.execCommand('createLink', false, url);
          
          // Luego encontramos el enlace creado y le añadimos el atributo target si es necesario
          const range = selection.getRangeAt(0);
          const linkElements = range.commonAncestorContainer.querySelectorAll('a[href="' + url + '"]');
          
          // Actualizar los atributos del enlace más reciente
          if (linkElements.length > 0) {
            const link = linkElements[linkElements.length - 1];
            
            if (newTab) {
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
            }
          }
        }
      } catch (e) {
        console.error('Error al aplicar enlace:', e);
        // Fallback a método simple
        document.execCommand('createLink', false, url);
      }
    }
    // Cerrar el popup
    setShowLinkPopup(false);
  };

  // Manejar clic en el botón de enlace
  const handleLinkButtonClick = () => {
    // Guardar la selección actual antes de abrir el popup
    saveSelection();
    animateButtonClick('link');
    // Mostrar u ocultar el popup de enlace
    setShowLinkPopup(!showLinkPopup);
    // Ocultar otros menús
    setShowFontSizeMenu(false);
    setShowColorPicker(false);
  };

  // Cerrar el popup de enlace
  const closeLinkPopup = () => {
    setShowLinkPopup(false);
  };

  // Cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cerrar selector de tamaño
      if (fontSizeMenuRef.current && !fontSizeMenuRef.current.contains(event.target)) {
        setShowFontSizeMenu(false);
      }
      
      // Cerrar selector de color si no se está haciendo clic en él o en su botón
      if (showColorPicker && 
          colorButtonRef.current && 
          !colorButtonRef.current.contains(event.target) &&
          !event.target.closest('.color-picker-container')) {
        setShowColorPicker(false);
      }
      
      // Cerrar popup de enlace si no se está haciendo clic en él o en su botón
      if (showLinkPopup && 
          linkButtonRef.current && 
          !linkButtonRef.current.contains(event.target) &&
          !event.target.closest('[style*="position: absolute"][style*="z-index: 1001"]')) {
        setShowLinkPopup(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker, showLinkPopup]);

  return (
    <>
      {/* Estilos para animaciones */}
      <style>{cssAnimation}</style>
      
      <div 
        ref={toolbarRef}
        style={{
          ...styles.floatingBar,
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {/* Formato de texto básico */}
        <button 
          type="button"
          style={styles.button(activeFormats.bold, 'bold')}
          onClick={() => {
            restoreSelection();
            onFormatText('bold');
            animateButtonClick('bold');
          }}
          onMouseEnter={() => showTooltip('bold')}
          onMouseLeave={hideTooltip}
        >
          <strong>B</strong>
          <Tooltip
            isVisible={activeTooltip === 'bold'}
            text="Negrita"
          />
        </button>
        <button 
          type="button"
          style={styles.button(activeFormats.italic, 'italic')}
          onClick={() => {
            restoreSelection();
            onFormatText('italic');
            animateButtonClick('italic');
          }}
          onMouseEnter={() => showTooltip('italic')}
          onMouseLeave={hideTooltip}
        >
          <em>I</em>
          <Tooltip
            isVisible={activeTooltip === 'italic'}
            text="Cursiva"
          />
        </button>
        <button 
          type="button"
          style={styles.button(activeFormats.underline, 'underline')}
          onClick={() => {
            restoreSelection();
            onFormatText('underline');
            animateButtonClick('underline');
          }}
          onMouseEnter={() => showTooltip('underline')}
          onMouseLeave={hideTooltip}
        >
          <u>U</u>
          <Tooltip
            isVisible={activeTooltip === 'underline'}
            text="Subrayado"
          />
        </button>
        
        <div style={styles.separator} />
        
        {/* Selector de tamaño de fuente mejorado */}
        <div style={styles.sizeControls}>
          {isEditingFontSize ? (
            /* Campo de entrada para tamaño personalizado */
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCustomFontSizeSubmit(e);
              }} 
              style={{ display: 'flex', margin: '0 2px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={customFontInputRef}
                type="text"
                value={customFontSize}
                onChange={handleCustomFontSizeChange}
                onBlur={(e) => {
                  // Permitir un poco de tiempo para que se procese el clic antes de cerrar
                  setTimeout(() => {
                    handleCustomFontSizeSubmit(e);
                  }, 100);
                }}
                style={styles.fontSizeInput}
                onClick={(e) => e.stopPropagation()}
              />
            </form>
          ) : (
            /* Botón de tamaño actual con desplegable */
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                style={styles.fontSizeButton}
                onClick={enableFontSizeEditing} // Al hacer clic directo, abre el editor de tamaño personalizado
                onDoubleClick={toggleFontSizeMenu} // Doble clic muestra el menú
                onMouseEnter={() => showTooltip('fontSize')}
                onMouseLeave={hideTooltip}
              >
                {fontSize}
                <Tooltip
                  isVisible={activeTooltip === 'fontSize'}
                  text="Tamaño de fuente"
                />
              </button>
              
              {/* Menú desplegable con tamaños predefinidos */}
              <div 
                ref={fontSizeMenuRef}
                style={styles.fontSizeMenu}
                onClick={(e) => e.stopPropagation()}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      applyFontSize(size);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(43, 87, 154, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (fontSize !== size) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {size}
                  </div>
                ))}
                {/* Opción de tamaño personalizado */}
                <div
                  style={styles.customOption}
                  onClick={(e) => {
                    e.stopPropagation();
                    enableFontSizeEditing(e);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(43, 87, 154, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Personalizado
                </div>
              </div>
            </div>
          )}
          
          {/* Controles de incremento/decremento */}
          <div>
            <button
              type="button"
              style={styles.incrementButton}
              onClick={(e) => {
                e.stopPropagation();
                changeFontSize(true);
              }}
              onMouseEnter={() => showTooltip('increaseFontSize')}
              onMouseLeave={hideTooltip}
            >
              <span style={{ color: '#0b4444' }}>▲</span>
              <Tooltip
                isVisible={activeTooltip === 'increaseFontSize'}
                text="Aumentar tamaño"
              />
            </button>
            <button
              type="button"
              style={styles.incrementButton}
              onClick={(e) => {
                e.stopPropagation();
                changeFontSize(false);
              }}
              onMouseEnter={() => showTooltip('decreaseFontSize')}
              onMouseLeave={hideTooltip}
            >
              <span style={{ color: '#0b4444' }}>▼</span>
              <Tooltip
                isVisible={activeTooltip === 'decreaseFontSize'}
                text="Reducir tamaño"
              />
            </button>
          </div>
        </div>
        
        <div style={styles.separator} />
        
          {/* Botón de color de texto mejorado */}
          <div style={{ position: 'relative' }}>
            <button 
              ref={colorButtonRef}
              type="button"
              style={styles.colorButton(showColorPicker)}
              onClick={handleColorButtonClick}
              onMouseEnter={() => showTooltip('textColor')}
              onMouseLeave={hideTooltip}
            >
              <div style={styles.colorIconContainer}>
                {/* Se eliminó la letra "A" aquí, dejando solo el rectángulo de color */}
              </div>
              <Tooltip
                isVisible={activeTooltip === 'textColor'}
                text="Color de texto"
              />
            </button>
            
            {/* Componente selector de color */}
            {showColorPicker && (
              <div className="color-picker-container">
                <ColorPicker 
                  onSelectColor={applyTextColor}
                  onCloseColorPicker={closeColorPicker}
                />
              </div>
            )}
          </div>

        {/* Opciones de formato avanzadas */}
        <button 
          type="button"
          style={styles.button(activeFormats.unorderedList, 'unorderedList')}
          onClick={() => {
            restoreSelection();
            onFormatText('unorderedList');
            animateButtonClick('unorderedList');
          }}
          onMouseEnter={() => showTooltip('unorderedList')}
          onMouseLeave={hideTooltip}
        >
          •
          <Tooltip
            isVisible={activeTooltip === 'unorderedList'}
            text="Lista con viñetas"
          />
        </button>
        
        {/* Botón de enlace con popup personalizado */}
        <div style={{ position: 'relative' }}>
          <button 
            ref={linkButtonRef}
            type="button"
            style={styles.button(activeFormats.link, 'link')}
            onClick={handleLinkButtonClick}
            onMouseEnter={() => showTooltip('link')}
            onMouseLeave={hideTooltip}
          >
            <span style={{ fontSize: '16px' }}><img src="/assets/images/icons/LINK_icon.png" alt="Enlace" style={styles.iconImage} /></span>
            <Tooltip
              isVisible={activeTooltip === 'link'}
              text="Insertar enlace"
            />
          </button>
          
          {/* Popup para insertar enlaces */}
          {showLinkPopup && (
            <LinkPopup 
              onApplyLink={applyLink}
              onClosePopup={closeLinkPopup}
            />
          )}
        </div>
        
        <button 
          type="button"
          style={styles.button(false, 'image')}
          onClick={() => {
            restoreSelection();
            onFormatText('image');
            animateButtonClick('image');
          }}
          onMouseEnter={() => showTooltip('image')}
          onMouseLeave={hideTooltip}
        >
          <span style={{ fontSize: '16px' }}><img src="/assets/images/icons/IMG_icon.png" alt="Imagen" style={styles.iconImage} /></span>
          <Tooltip
            isVisible={activeTooltip === 'image'}
            text="Insertar imagen"
          />
        </button>
      </div>
    </>
  );
};

export default FloatingToolbar;