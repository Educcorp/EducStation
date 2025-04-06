import React, { useState, useEffect, useRef } from 'react';

// Tamaños de fuente predeterminados como en Word
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

// FloatingToolbar - Barra de herramientas flotante para edición de texto
// Aparece cuando se selecciona texto en el editor
const FloatingToolbar = ({ onFormatText, activeFormats, editorRef, fontSize, setFontSize }) => {
  // Estados del componente
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [customFontSize, setCustomFontSize] = useState('');
  const [isEditingFontSize, setIsEditingFontSize] = useState(false);
  const [savedSelection, setSavedSelection] = useState(null);
  
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
      height: '28px'
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
      color: '#333333'
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
      alignItems: 'center'
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
      borderRadius: '3px'
    }
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

  // Función para verificar la selección de texto
  const checkSelection = (event) => {
    try {
      const selection = window.getSelection();

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
          newPosition.left = editorRect.width - (toolbarWidth / 2) - 10;
        }
        
        if (newPosition.left - (toolbarWidth / 2) < 0) {
          newPosition.left = (toolbarWidth / 2) + 10;
        }
        
        // Si no hay espacio arriba, colocar debajo de la selección
        if (newPosition.top < 0) {
          newPosition.top = rect.bottom - editorRect.top + 8;
        }
      }
      
      setPosition(newPosition);
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

  // Actualizar el tamaño personalizado cuando cambia el tamaño de fuente
  useEffect(() => {
    if (isEditingFontSize) {
      setCustomFontSize(fontSize.toString());
    }
  }, [fontSize]);

  // Aplicar estilos de hover
  const getHoverStyle = (style) => {
    if (style['&:hover']) {
      const hoverStyle = {...style};
      Object.assign(hoverStyle, style['&:hover']);
      delete hoverStyle['&:hover'];
      return hoverStyle;
    }
    return style;
  };

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
        style={activeFormats.bold ? getHoverStyle(styles.button(true)) : styles.button(false)}
        onClick={() => {
          restoreSelection();
          onFormatText('bold');
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(43, 87, 154, 0.1)';
        }}
        onMouseLeave={(e) => {
          if (!activeFormats.bold) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <strong>B</strong>
      </button>
      <button 
        type="button"
        title="Cursiva"
        style={activeFormats.italic ? getHoverStyle(styles.button(true)) : styles.button(false)}
        onClick={() => {
          restoreSelection();
          onFormatText('italic');
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(43, 87, 154, 0.1)';
        }}
        onMouseLeave={(e) => {
          if (!activeFormats.italic) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <em>I</em>
      </button>
      <button 
        type="button"
        title="Subrayado"
        style={activeFormats.underline ? getHoverStyle(styles.button(true)) : styles.button(false)}
        onClick={() => {
          restoreSelection();
          onFormatText('underline');
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(43, 87, 154, 0.1)';
        }}
        onMouseLeave={(e) => {
          if (!activeFormats.underline) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <u>U</u>
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
              title="Ingresa un tamaño personalizado"
              onClick={(e) => e.stopPropagation()}
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
              onDoubleClick={toggleFontSizeMenu} // Doble clic muestra el menú
            >
              {fontSize}
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
            title="Aumentar tamaño de fuente"
            style={styles.incrementButton}
            onClick={(e) => {
              e.stopPropagation();
              changeFontSize(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(43, 87, 154, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ color: '#2B579A' }}>▲</span>
          </button>
          <button
            type="button"
            title="Reducir tamaño de fuente"
            style={styles.incrementButton}
            onClick={(e) => {
              e.stopPropagation();
              changeFontSize(false);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(43, 87, 154, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
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
        onClick={() => {
          restoreSelection();
          onFormatText('textColor');
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(43, 87, 154, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <span style={{ color: '#2B579A' }}>A</span>
      </button>
      <button 
        type="button"
        title="Insertar enlace"
        style={activeFormats.link ? getHoverStyle(styles.button(true)) : styles.button(false)}
        onClick={() => {
          restoreSelection();
          onFormatText('link');
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(43, 87, 154, 0.1)';
        }}
        onMouseLeave={(e) => {
          if (!activeFormats.link) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        🔗
      </button>
    </div>
  );
};

export default FloatingToolbar;