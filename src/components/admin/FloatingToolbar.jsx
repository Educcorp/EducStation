import React, { useState, useEffect, useRef } from 'react';
import Tooltip from '../ui/Tooltip';
import ColorPicker from './ColorPicker'; // Importamos el nuevo componente ColorPicker

// Tamaños de fuente predeterminados como en Word
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,120];

// FloatingToolbar - Barra de herramientas flotante para edición de texto
// Aparece cuando se hace clic en el editor o se selecciona texto
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

// Estados para el selector de color
const [showColorPicker, setShowColorPicker] = useState(false);
const [currentIconColor, setCurrentIconColor] = useState('#0b4444'); // Color inicial del ícono

// Referencias
const toolbarRef = useRef(null);
const fontSizeMenuRef = useRef(null);
const customFontInputRef = useRef(null);
const colorButtonRef = useRef(null);

// Mostrar tooltip
const showTooltip = (id) => {
  setActiveTooltip(id);
};

// Ocultar tooltip
const hideTooltip = () => {
  setActiveTooltip(null);
};

// Manejar clic en el botón de color
const handleColorButtonClick = () => {
  // Guardar la selección actual antes de abrir el color picker
  saveSelection();
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
      
      // Guardar automáticamente el color en localStorage
      const defaultColors = ['#91a8a4', '#0b4444', '#4c7977', '#f0f8f7', '#d2b99a'];
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

// Estilos para la barra de herramientas
const styles = {
        floatingBar: {
    position: 'absolute',
    zIndex: 1000,
    display: visible ? 'flex' : 'none',
    alignItems: 'center',
    backgroundColor:  'rgb(209, 224, 217)',
    borderRadius: '9px',
    padding: '6px',
    boxShadow: '0 3px 12px rgba(61, 42, 42, 0.2)',
    transition: 'opacity 2s ease, transform 2s ease', // Transición más lenta (2 segundos)
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(10px)', // Quitar translateX para evitar centrado
    gap: '2px',
    border: 'rgb(0, 0, 0)' // Añadir un borde sutil para mejorar la visibilidad
  },
  button: (isActive) => ({
    background: 'none',
    border: 'none',
    borderRadius: '4px',
    padding: '6px',
    margin: '0 2px',
    fontSize: '14px',
    cursor: 'pointer',
    color: isActive ? '#1b4fd9' : '#0b4444',
    backgroundColor: isActive ? 'rgba(43, 87, 154, 0.1)' : 'transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    position: 'relative'
  }),
  colorButton: (showingPicker) => ({
    background: 'none',
    border: 'none',
    borderRadius: '4px',
    padding: '6px',
    margin: '0 2px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#0b4444',
    backgroundColor: showingPicker ? 'rgba(43, 87, 154, 0.1)' : 'transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    position: 'relative'
  }),
  fontSizeButton: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: '1px solid #e1e7e6',
    borderRadius: '4px',
    padding: '4px 8px',
    margin: '0 2px',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#333333', // Color más oscuro para mejor legibilidad
    fontWeight: 'normal',
    transition: 'all 0.2s ease',
    position: 'relative'
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
    backgroundColor: 'white'
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
    color: '#0b4444'
  },
  customOption: {
    borderTop: '1px solid #e1e7e6', 
    fontStyle: 'italic',
    padding: '6px 12px',
    cursor: 'pointer',
    userSelect: 'none',
    textAlign: 'center',
    color: '#2B579A'
  },
  separator: {
    width: '1px',
    height: '20px',
    margin: '0 4px',
    backgroundColor: '#e1e7e6'
  },
  sizeControls: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  incrementButton: {
    background: 'none',
    border: 'none',
    padding: '3px 5px',
    cursor: 'pointer',
    color: '#2B579A', 
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '3px',
    position: 'relative'
  },
  colorIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  colorIcon: {
    fontWeight: 'bold',
    color: currentIconColor,
    fontSize: '16px',
    transition: 'color 0.3s ease'
  }
};

// Función para calcular la posición de la barra
const calculateBarPosition = (selection) => {
  if (!editorRef.current) return;
  
  // Calcular la posición de la barra
  const editorRect = editorRef.current.getBoundingClientRect();
  
  // Calculamos la altura de la barra (se estima en 40px si aún no está renderizada)
  const toolbarHeight = toolbarRef.current ? toolbarRef.current.offsetHeight : 40;
  // Calculamos el ancho de la barra (se estima en 300px si aún no está renderizada)
  const toolbarWidth = toolbarRef.current ? toolbarRef.current.offsetWidth : 300;
  
  let newPosition;
  
  // Determinar la línea en la que está el cursor (primera línea o no)
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const isFirstLine = rect.top < editorRect.top + 30; // Aproximadamente primera línea
  
  // Calcular la altura de línea aproximada (puede ajustarse según el tipo de fuente)
  const lineHeight = 20; // Altura estimada de la línea de texto
  
  const hasSelection = selection && !selection.isCollapsed && editorRef.current;
  
  if (hasSelection) {
    // Si hay selección, posicionar debajo de la selección
    if (rect.width === 0) {
      return;
    }
    
    newPosition = {
      // Posicionamos la barra debajo de la línea de texto
      top: rect.bottom - editorRect.top + 8,
      // Alineamos con el inicio de la selección
      left: rect.left - editorRect.left
    };
  } else {
    // Si solo está activo el editor sin selección
    const isNearLeftEdge = rect.left < editorRect.left + 50;
    
    // Siempre colocar la barra debajo del cursor
    newPosition = {
      top: rect.bottom - editorRect.top + 8, // Debajo del cursor
      left: rect.left - editorRect.left // Alineado con el cursor
    };
    
    // Si no tenemos dimensiones válidas, usar posición por defecto dentro del editor
    if (rect.width === 0 && rect.height === 0) {
      newPosition = {
        top: 30 + lineHeight, // Debajo de la primera línea
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
    } else if (!increment && currentIndex > 0) {
      applyFontSize(FONT_SIZES[currentIndex - 1]);
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
};

// Actualizar el estado local cuando cambia el tamaño de fuente recibido
useEffect(() => {
  if (isEditingFontSize) {
    setCustomFontSize(fontSize.toString());
  }
}, [fontSize, isEditingFontSize]);

// Mostrar la barra al hacer clic en el editor
useEffect(() => {
  const handleEditorClick = () => {
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
      editorRef.current.removeEventListener('keydown', handleKeyDown);
      editorRef.current.removeEventListener('input', handleInput);
      editorRef.current.removeEventListener('keyup', handleKeyUp);
      editorRef.current.removeEventListener('focus', handleSelectionChange);
    }
    clearTimeout(typingTimer);
  };
}, [editorRef?.current, isTyping]);

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
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showColorPicker]);

return (
  <div 
    ref={toolbarRef}
    style={{
      ...styles.floatingBar,
      top: `${position.top}px`,
      left: `${position.left}px`,
      // Ya no transformamos con translateX(-50%) para evitar centrado
    }}
  >
    {/* Formato de texto básico */}
    <button 
      type="button"
      style={styles.button(activeFormats.bold)}
      onClick={() => {
        restoreSelection();
        onFormatText('bold');
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

      style={styles.button(activeFormats.italic)}
      onClick={() => {
        restoreSelection();
        onFormatText('italic');
      }}
      onMouseEnter={() => showTooltip('italic')}
      onMouseLeave={hideTooltip}
    >
      <em>Ｉ</em>
      <Tooltip
        isVisible={activeTooltip === 'italic'}
        text="Cursiva"
      />
    </button>
    <button 
      type="button"
      style={styles.button(activeFormats.underline)}
      onClick={() => {
        restoreSelection();
        onFormatText('underline');
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
    
    {/* Selector de tamaño de fuente tipo Word con opción personalizada */}
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
    
    {/* Botón de color de texto con ícono dinámico */}
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
          <span style={styles.colorIcon}>𒊹</span>
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
      style={styles.button(activeFormats.unorderedList)}
      onClick={() => {
        restoreSelection();
        onFormatText('unorderedList');
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
    <button 
      type="button"
      style={styles.button(activeFormats.link)}
      onClick={() => {
        restoreSelection();
        onFormatText('link');
      }}
      onMouseEnter={() => showTooltip('link')}
      onMouseLeave={hideTooltip}
    >
      <img src="/assets/images/icons/LINK_icon.png" style={styles.iconImage} />
      <Tooltip
        isVisible={activeTooltip === 'link'}
        text="Insertar enlace"
      />
    </button>
    
    <button 
      type="button"
      style={styles.button(false)}
      onClick={() => {
        restoreSelection();
        onFormatText('image');
      }}
      onMouseEnter={() => showTooltip('image')}
      onMouseLeave={hideTooltip}
    >
      <img src="/assets/images/icons/IMG_icon.png"  style={styles.iconImage} />
      <Tooltip
        isVisible={activeTooltip === 'image'}
        text="Insertar imagen"
      />
    </button>
  </div>
);
}
export default FloatingToolbar;
