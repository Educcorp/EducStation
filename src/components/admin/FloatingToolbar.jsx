import React, { useState, useEffect, useRef } from 'react';

// Tamaños de fuente predeterminados como en Word
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

// FloatingToolbar - Barra de herramientas flotante para edición de texto
// Aparece cuando se selecciona texto en el editor
const FloatingToolbar = ({ onFormatText, activeFormats, editorRef }) => {
  // Estados del componente
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [customFontSize, setCustomFontSize] = useState('');
  const [isEditingFontSize, setIsEditingFontSize] = useState(false);
  
  // Referencias
  const toolbarRef = useRef(null);
  const fontSizeMenuRef = useRef(null);
  const customFontInputRef = useRef(null);
  
  // Estilos para la barra de herramientas
  const styles = {
    floatingBar: {
      position: 'absolute',
      zIndex: 1000,
      display: visible ? 'flex' : 'none',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: '6px',
      padding: '4px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
      transition: 'opacity 0.2s ease, transform 0.2s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
      gap: '2px',
      border: '1px solid #e1e7e6' // Añadir un borde sutil para mejorar la visibilidad
    },
    button: (isActive) => ({
      background: 'none',
      border: 'none',
      borderRadius: '4px',
      padding: '6px',
      margin: '0 2px',
      fontSize: '14px',
      cursor: 'pointer',
      color: isActive ? '#2B579A' : '#4c7977',
      backgroundColor: isActive ? 'rgba(43, 87, 154, 0.1)' : 'transparent',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      '&:hover': {
        backgroundColor: 'rgba(43, 87, 154, 0.1)'
      }
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
      position: 'relative',
      '&:hover': {
        backgroundColor: 'rgba(43, 87, 154, 0.1)',
        borderColor: '#2B579A'
      }
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
    caret: {
      marginLeft: '2px',
      fontSize: '10px',
      color: '#2B579A'
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
    separator: {
      width: '1px',
      height: '20px',
      margin: '0 4px',
      backgroundColor: '#e1e7e6'
    },
    sizeControls: {
      display: 'flex',
      alignItems: 'center',
    },
    incrementButton: {
      background: 'none',
      border: 'none',
      padding: '3px 5px',
      cursor: 'pointer',
      color: '#2B579A', // Color azul estilo Word
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: 'rgba(43, 87, 154, 0.1)'
      }
    }
  };

  // Función para verificar la selección de texto
  const checkSelection = () => {
    try {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed || !editorRef.current) {
        setVisible(false);
        setShowFontSizeMenu(false);
        return;
      }
      
      // Verificar si la selección está dentro del editor
      const range = selection.getRangeAt(0);
      let container = range.commonAncestorContainer;
      
      // Si el contenedor es un nodo de texto, obtener su elemento padre
      if (container.nodeType === 3) {
        container = container.parentNode;
      }
      
      // Verificar si el contenedor o algún antecesor es el editor
      let isInEditor = false;
      let current = container;
      
      while (current && !isInEditor) {
        if (current === editorRef.current) {
          isInEditor = true;
        }
        current = current.parentNode;
      }
      
      if (!isInEditor) {
        setVisible(false);
        setShowFontSizeMenu(false);
        return;
      }
      
      // La selección está dentro del editor, mostrar la barra
      const rect = range.getBoundingClientRect();
      
      if (rect.width === 0) {
        setVisible(false);
        setShowFontSizeMenu(false);
        return;
      }
      
      // Calcular la posición de la barra
      const editorRect = editorRef.current.getBoundingClientRect();
      
      // Calculamos la altura de la barra (se estima en 40px si aún no está renderizada)
      const toolbarHeight = toolbarRef.current ? toolbarRef.current.offsetHeight : 40;
      
      // Posicionar sobre la selección con un margen adecuado
      // Colocamos la barra por encima de la línea de texto actual
      const lineHeight = parseInt(window.getComputedStyle(editorRef.current).lineHeight) || 24;
      
      const newPosition = {
        // Posicionamos la barra encima de la línea de texto con un pequeño margen
        top: rect.top - editorRect.top - toolbarHeight - 8,
        // Centramos horizontalmente respecto a la selección
        left: rect.left - editorRect.left + (rect.width / 2)
      };
      
      // Ajustar para que no se salga del editor
      if (toolbarRef.current) {
        const toolbarWidth = toolbarRef.current.offsetWidth;
        
        // Ajuste horizontal para que no se salga por los lados
        if (newPosition.left + (toolbarWidth / 2) > editorRect.width) {
          newPosition.left = editorRect.width - toolbarWidth - 10;
        }
        
        if (newPosition.left - (toolbarWidth / 2) < 0) {
          newPosition.left = toolbarWidth / 2 + 10;
        }
        
        // Si no hay espacio arriba, colocar debajo de la selección
        if (newPosition.top < 0) {
          newPosition.top = rect.bottom - editorRect.top + 8;
        }
      }
      
      setPosition(newPosition);
      setVisible(true);
    } catch (error) {
      console.error('Error al verificar selección:', error);
      setVisible(false);
      setShowFontSizeMenu(false);
    }
  };

  // Función para obtener el tamaño de fuente actual
  const getCurrentFontSize = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return 12; // Valor por defecto cambiado a 12
    
    try {
      const range = selection.getRangeAt(0);
      const element = range.commonAncestorContainer;
      
      // Intenta obtener el elemento si es un nodo de texto
      const node = element.nodeType === 3 ? element.parentNode : element;
      
      // Obtener el estilo computado
      const style = window.getComputedStyle(node);
      const fontSize = parseInt(style.fontSize);
      
      // Encontrar el tamaño preestablecido más cercano
      const closestPreset = FONT_SIZES.reduce((prev, curr) => {
        return (Math.abs(curr - fontSize) < Math.abs(prev - fontSize)) ? curr : prev;
      }, FONT_SIZES[0]);
      
      return closestPreset || 12; // Devolver 12 como valor por defecto si no se puede determinar
    } catch (error) {
      return 12; // Valor por defecto cambiado a 12
    }
  };

  // Función para aplicar un tamaño de fuente específico
  const applyFontSize = (size) => {
    onFormatText('fontSize', `${size}px`);
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
    const currentSize = getCurrentFontSize();
    const currentIndex = FONT_SIZES.indexOf(currentSize);
    
    if (increment && currentIndex < FONT_SIZES.length - 1) {
      applyFontSize(FONT_SIZES[currentIndex + 1]);
    } else if (!increment && currentIndex > 0) {
      applyFontSize(FONT_SIZES[currentIndex - 1]);
    }
  };
  
  // Activar el modo de edición de tamaño personalizado
  const enableFontSizeEditing = () => {
    setIsEditingFontSize(true);
    setCustomFontSize(getCurrentFontSize().toString());
    setShowFontSizeMenu(false);
    
    // Enfocar el input después de que se haya renderizado
    setTimeout(() => {
      if (customFontInputRef.current) {
        customFontInputRef.current.focus();
        customFontInputRef.current.select();
      }
    }, 50);
  };

  // Detectar cambios en la selección
  useEffect(() => {
    // No agregar event listeners si no hay editorRef
    if (!editorRef || !editorRef.current) return;
    
    document.addEventListener('selectionchange', checkSelection);
    editorRef.current.addEventListener('mouseup', checkSelection);
    editorRef.current.addEventListener('keyup', checkSelection);
    
    // Limpiar event listeners
    return () => {
      document.removeEventListener('selectionchange', checkSelection);
      if (editorRef.current) {
        editorRef.current.removeEventListener('mouseup', checkSelection);
        editorRef.current.removeEventListener('keyup', checkSelection);
      }
    };
  }, [editorRef?.current]);

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

  return (
    <div 
      ref={toolbarRef}
      style={{
        ...styles.floatingBar,
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)' // Centrar horizontalmente respecto al punto de referencia
      }}
    >
      {/* Formato de texto básico */}
      <button 
        type="button"
        title="Negrita"
        style={styles.button(activeFormats.bold)}
        onClick={() => onFormatText('bold')}
      >
        <strong>B</strong>
      </button>
      <button 
        type="button"
        title="Cursiva"
        style={styles.button(activeFormats.italic)}
        onClick={() => onFormatText('italic')}
      >
        <em>I</em>
      </button>
      <button 
        type="button"
        title="Subrayado"
        style={styles.button(activeFormats.underline)}
        onClick={() => onFormatText('underline')}
      >
        <u>U</u>
      </button>
      
      <div style={styles.separator} />
      
      {/* Selector de tamaño de fuente tipo Word con opción personalizada */}
      <div style={styles.sizeControls}>
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
          /* Botón de tamaño actual con desplegable */
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              title="Haz clic para editar el tamaño o mostrar opciones predefinidas"
              style={styles.fontSizeButton}
              onClick={enableFontSizeEditing} // Al hacer clic directo, abre el editor de tamaño personalizado
              onDoubleClick={() => setShowFontSizeMenu(!showFontSizeMenu)} // Doble clic muestra el menú
            >
              {getCurrentFontSize()}
              <span style={styles.caret}>▾</span>
            </button>
            
            {/* Menú desplegable con tamaños predefinidos */}
            <div 
              ref={fontSizeMenuRef}
              style={styles.fontSizeMenu}
            >
              {FONT_SIZES.map(size => (
                <div
                  key={size}
                  style={{
                    ...styles.fontSizeItem,
                    backgroundColor: getCurrentFontSize() === size 
                      ? 'rgba(43, 87, 154, 0.1)' 
                      : 'transparent',
                    fontWeight: getCurrentFontSize() === size ? 'bold' : 'normal'
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
          </div>
        )}
        
        {/* Controles de incremento/decremento */}
        <div>
          <button
            type="button"
            title="Aumentar tamaño de fuente"
            style={styles.incrementButton}
            onClick={() => changeFontSize(true)}
          >
            <span style={{ color: '#2B579A' }}>▲</span>
          </button>
          <button
            type="button"
            title="Reducir tamaño de fuente"
            style={styles.incrementButton}
            onClick={() => changeFontSize(false)}
          >
            <span style={{ color: '#2B579A' }}>▼</span>
          </button>
        </div>
      </div>
      
      <div style={styles.separator} />
      
      {/* Opciones de formato avanzadas */}
      <button 
        type="button"
        title="Color de texto"
        style={styles.button(false)}
        onClick={() => onFormatText('textColor')}
      >
        <span style={{ color: '#2B579A' }}>A</span>
      </button>
      <button 
        type="button"
        title="Insertar enlace"
        style={styles.button(activeFormats.link)}
        onClick={() => onFormatText('link')}
      >
        🔗
      </button>
    </div>
  );
};

export default FloatingToolbar;