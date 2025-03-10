// src/components/admin/SyntaxHighlighter.jsx
import React, { useEffect, useRef, useState } from 'react';
import { applySyntaxHighlighting, syntaxHighlightingStyles } from './utils/syntaxHighlighting';

/**
 * Componente que proporciona resaltado de sintaxis para editores de código
 * con corrección para evitar elementos adicionales
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.content - El contenido a resaltar
 * @param {string} props.mode - El modo de editor ('markdown' o 'html')
 * @param {function} props.onChange - Función para manejar cambios en el contenido
 * @param {Object} props.textAreaRef - Referencia al textarea original
 */
const SyntaxHighlighter = ({ content, mode, onChange, textAreaRef }) => {
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
    if (highlighterRef.current && textAreaRef.current) {
      try {
        // Aplicar el resaltado de sintaxis
        const highlightedContent = applySyntaxHighlighting(content, mode);
        highlighterRef.current.innerHTML = highlightedContent;
        
        // Configurar event listeners
        textAreaRef.current.addEventListener('scroll', syncScroll);
        
      } catch (error) {
        console.error("Error applying syntax highlighting:", error);
      }
      
      // Limpiar event listeners
      return () => {
        if (textAreaRef.current) {
          textAreaRef.current.removeEventListener('scroll', syncScroll);
        }
      };
    }
  }, [content, mode]);

  // Manejar cambios en el texto
  const handleChange = (e) => {
    // Ignorar cualquier evento extraño o inserción automática
    if (e && e.target && typeof e.target.value === 'string') {
      // Eliminar cualquier texto de marcado no deseado antes de pasar el cambio
      const cleanValue = e.target.value.replace(/class="editor-[^"]*"/g, '');
      
      // Crear un evento limpio para pasar al padre
      const cleanEvent = {
        target: {
          name: e.target.name,
          value: cleanValue
        }
      };
      
      onChange(cleanEvent);
    } else {
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
      onChange(event);
    }
  };

  // Estilos para el componente
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
      color: '#d4d4d4',
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
      {/* Estilos para el resaltado de sintaxis */}
      <style dangerouslySetInnerHTML={{ __html: syntaxHighlightingStyles }} />
      
      {/* Capa de resaltado (solo visual) */}
      <pre 
        ref={highlighterRef}
        className="syntax-highlight-editor"
        style={styles.highlighter}
      />
      
      {/* Textarea para edición (visible pero con texto transparente) */}
      <textarea
        ref={textAreaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        style={styles.textarea}
        spellCheck="false"
        placeholder={mode === 'markdown' 
          ? "Escribe tu post en formato Markdown..." 
          : "Escribe código HTML aquí..."
        }
      />
    </div>
  );
};

export default SyntaxHighlighter;