import React, { useState, useEffect, useRef } from 'react';

// FloatingToolbar - Barra de herramientas flotante para edición de texto
// Aparece cuando se selecciona texto en el editor
const FloatingToolbar = ({ 
  onFormatText, 
  activeFormats, 
  editorRef 
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef(null);
  
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
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      gap: '2px'
    },
    button: (isActive) => ({
      background: 'none',
      border: 'none',
      borderRadius: '4px',
      padding: '6px',
      margin: '0 2px',
      fontSize: '14px',
      cursor: 'pointer',
      color: isActive ? '#0b4444' : '#4c7977',
      backgroundColor: isActive ? '#0b444415' : 'transparent',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px'
    }),
    separator: {
      width: '1px',
      height: '20px',
      margin: '0 4px',
      backgroundColor: '#e1e7e6'
    },
    fontSizeControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px'
    },
    fontSizeDisplay: {
      fontSize: '12px',
      marginLeft: '2px',
      marginRight: '2px',
      color: '#4c7977',
      width: '24px',
      textAlign: 'center'
    }
  };

  // Función para verificar la selección de texto
  const checkSelection = () => {
    try {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed || !editorRef.current) {
        setVisible(false);
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
        return;
      }
      
      // La selección está dentro del editor, mostrar la barra
      const rect = range.getBoundingClientRect();
      
      if (rect.width === 0) {
        setVisible(false);
        return;
      }
      
      // Calcular la posición de la barra
      const editorRect = editorRef.current.getBoundingClientRect();
      
      // Posicionar sobre la selección
      const newPosition = {
        top: rect.top - editorRect.top - 40, // 40px encima de la selección
        left: rect.left - editorRect.left + (rect.width / 2) // Centrado horizontalmente
      };
      
      // Ajustar para que no se salga del editor
      if (toolbarRef.current) {
        const toolbarWidth = toolbarRef.current.offsetWidth;
        
        if (newPosition.left + toolbarWidth > editorRect.width) {
          newPosition.left = editorRect.width - toolbarWidth - 10;
        }
        
        if (newPosition.left < 0) {
          newPosition.left = 10;
        }
        
        if (newPosition.top < 0) {
          // Si no hay espacio arriba, colocar debajo
          newPosition.top = rect.bottom - editorRect.top + 10;
        }
      }
      
      setPosition(newPosition);
      setVisible(true);
    } catch (error) {
      console.error('Error al verificar selección:', error);
      setVisible(false);
    }
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

  // Función para obtener el tamaño de fuente actual
  const getCurrentFontSize = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return null;
    
    try {
      const range = selection.getRangeAt(0);
      const element = range.commonAncestorContainer;
      
      // Intenta obtener el elemento si es un nodo de texto
      const node = element.nodeType === 3 ? element.parentNode : element;
      
      // Obtener el estilo computado
      const style = window.getComputedStyle(node);
      const fontSize = parseInt(style.fontSize);
      
      return fontSize || 16; // Devolver 16 como valor por defecto si no se puede determinar
    } catch (error) {
      return 16; // Valor por defecto
    }
  };

  // Cambiar el tamaño de fuente
  const changeFontSize = (increment) => {
    const currentSize = getCurrentFontSize();
    const newSize = currentSize + increment;
    
    // Limitar el tamaño entre 8 y 72px
    if (newSize >= 8 && newSize <= 72) {
      onFormatText('fontSize', `${newSize}px`);
    }
  };

  return (
    <div 
      ref={toolbarRef}
      style={{
        ...styles.floatingBar,
        top: `${position.top}px`,
        left: `${position.left}px`
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
      
      {/* Control de tamaño de fuente */}
      <div style={styles.fontSizeControls}>
        <button 
          type="button"
          title="Reducir tamaño de fuente"
          style={styles.button(false)}
          onClick={() => changeFontSize(-1)}
        >
          <span style={{ fontSize: '12px' }}>A-</span>
        </button>
        
        <span style={styles.fontSizeDisplay}>{getCurrentFontSize()}</span>
        
        <button 
          type="button"
          title="Aumentar tamaño de fuente"
          style={styles.button(false)}
          onClick={() => changeFontSize(1)}
        >
          <span style={{ fontSize: '14px' }}>A+</span>
        </button>
      </div>
      
      <div style={styles.separator} />
      
      {/* Opciones de formato avanzadas */}
      <button 
        type="button"
        title="Color de texto"
        style={styles.button(false)}
        onClick={() => onFormatText('textColor')}
      >
        <span style={{ color: '#0b4444' }}>A</span>
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