// src/components/admin/SyntaxHighlighter.jsx
import React, { useEffect, useRef } from 'react';

const SyntaxHighlighter = ({ content, onChange, textAreaRef }) => {
  const highlighterRef = useRef(null);
  const containerRef = useRef(null);
  
  // Sincronizar scroll entre el textArea y el resaltador
  const syncScroll = () => {
    if (highlighterRef.current && textAreaRef.current) {
      highlighterRef.current.scrollTop = textAreaRef.current.scrollTop;
      highlighterRef.current.scrollLeft = textAreaRef.current.scrollLeft;
    }
  };

  // Actualizar el contenido resaltado cuando cambia el contenido
  useEffect(() => {
    console.log("SyntaxHighlighter - Contenido actualizado:", content ? content.substring(0, 50) + "..." : "vacío");
    
    if (highlighterRef.current && textAreaRef.current) {
      try {
        // Simplemente escapar HTML - sin añadir clases o modificar el texto
        const escapedContent = escapeHtml(content);
        highlighterRef.current.innerHTML = createDivs(escapedContent);
        
        // Configurar event listeners
        textAreaRef.current.addEventListener('scroll', syncScroll);
        
      } catch (error) {
        console.error("Error applying syntax highlighting:", error);
      }
    }
    
    // Función de limpieza separada
    return () => {
      if (textAreaRef.current) {
        textAreaRef.current.removeEventListener('scroll', syncScroll);
      }
    };
  }, [content]);

  // Asegurarse de que el texto se renderice correctamente sin perder formato
  useEffect(() => {
    // Verificar que textAreaRef exista
    if (textAreaRef.current) {
      // Cuando el editor reciba el foco, queremos asegurar que el contenido
      // se mantenga exactamente como fue escrito, preservando espacios y saltos
      const preserveFormatting = () => {
        if (textAreaRef.current) {
          textAreaRef.current.style.whiteSpace = 'pre';
          textAreaRef.current.style.overflowWrap = 'normal';
        }
      };
      
      textAreaRef.current.addEventListener('focus', preserveFormatting);
      
      // Aplicar inmediatamente
      preserveFormatting();
      
      return () => {
        if (textAreaRef.current) {
          textAreaRef.current.removeEventListener('focus', preserveFormatting);
        }
      };
    }
  }, [textAreaRef.current]);

  // Función para escapar HTML de forma segura
  const escapeHtml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  // Crear divs para cada línea, manteniendo líneas vacías
  const createDivs = (html) => {
    if (!html) return '<div>&nbsp;</div>';
    
    const lines = html.split('\n');
    return lines.map(line => `<div>${line || "&nbsp;"}</div>`).join('');
  };

  // Manejar cambios en el texto
  const handleChange = (e) => {
    console.log("SyntaxHighlighter - handleChange:", e.target.value ? e.target.value.substring(0, 50) + "..." : "vacío");
    if (onChange) {
      onChange(e);
    }
  };

  // Manejar eventos de teclado (Tab, Enter, etc.)
  const handleKeyDown = (e) => {
    // Implementar tabulación personalizada con 2 espacios
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      // Obtener el valor del textarea
      const value = e.target.value;
      
      // Insertar 2 espacios en la posición actual
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      
      // Establecer el nuevo valor
      e.target.value = newValue;
      
      // Mover el cursor después de los espacios insertados
      e.target.selectionStart = e.target.selectionEnd = start + 2;
      
      // Disparar evento de cambio
      const event = {
        target: {
          name: 'content',
          value: newValue
        }
      };
      handleChange(event);
    }
  };

  // Manejar eventos de pegado
  const handlePaste = (e) => {
    console.log("SyntaxHighlighter - handlePaste detectado");
    try {
      // Obtener el contenido pegado del portapapeles
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData('text');
      
      console.log("SyntaxHighlighter - Contenido pegado longitud:", pastedData.length);
      console.log("SyntaxHighlighter - Muestra del contenido pegado:", 
        pastedData.substring(0, 100) + (pastedData.length > 100 ? '...' : ''));
      
      // No prevenimos el evento, dejamos que se maneje naturalmente
      // pero nos aseguramos de que el nuevo valor se propague correctamente
      setTimeout(() => {
        if (textAreaRef.current) {
          const newContent = textAreaRef.current.value;
          // Propagar el cambio al componente padre
          const event = {
            target: {
              name: 'content',
              value: newContent
            }
          };
          handleChange(event);
        }
      }, 0);
    } catch (error) {
      console.error("Error al manejar el pegado en SyntaxHighlighter:", error);
    }
  };

  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '600px',
      fontSize: '14px',
      lineHeight: 1.5,
      overflow: 'hidden',
      borderRadius: '8px',
      border: '1px solid #e1e4e8'
    },
    highlighter: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      padding: '16px',
      backgroundColor: '#1e1e1e',
      color: '#E34C26', // Color para HTML
      fontFamily: "'Cascadia Code', 'Consolas', 'Monaco', 'Courier New', monospace",
      fontSize: '14px',
      lineHeight: 1.5,
      overflow: 'auto',
      whiteSpace: 'pre',
      pointerEvents: 'none',
      zIndex: 1
    },
    textarea: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      padding: '16px',
      color: 'transparent',
      caretColor: '#f8f8f8',
      backgroundColor: 'transparent',
      fontFamily: "'Cascadia Code', 'Consolas', 'Monaco', 'Courier New', monospace",
      fontSize: '14px',
      lineHeight: 1.5,
      border: 'none',
      resize: 'none',
      whiteSpace: 'pre',
      overflow: 'auto',
      outline: 'none',
      zIndex: 2
    }
  };

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Estilos para el resaltado */}
      <style dangerouslySetInnerHTML={{ __html: `
        .syntax-highlight-editor {
          counter-reset: line;
          padding-left: 60px;
        }
        
        .syntax-highlight-editor div {
          position: relative;
          min-height: 1.5em;
        }
        
        .syntax-highlight-editor div:before {
          content: counter(line);
          counter-increment: line;
          position: absolute;
          left: -50px;
          top: 0;
          width: 40px;
          color: #636d83;
          text-align: right;
          user-select: none;
          opacity: 0.5;
        }
      ` }} />
      
      {/* Capa de resaltado (solo visual) */}
      <pre 
        ref={highlighterRef}
        className="syntax-highlight-editor"
        style={styles.highlighter}
      />
      
      {/* Textarea para edición (visible pero con texto transparente) */}
      <textarea
        ref={textAreaRef}
        value={content || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        onPaste={handlePaste}
        style={styles.textarea}
        spellCheck="false"
        placeholder="Escribe o pega tu código HTML aquí..."
      />
    </div>
  );
};

export default SyntaxHighlighter;