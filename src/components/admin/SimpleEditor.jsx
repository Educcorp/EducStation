// src/components/admin/SimpleEditor.jsx

import React, { useState, useRef, useEffect } from 'react';
import { spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import FloatingToolbar from './FloatingToolbar';
import { lightColors } from '../../styles/theme'; // Importamos específicamente los colores claros

const SimpleEditor = ({ content, onChange }) => {
  const editorRef = useRef(null);
  const [internalContent, setInternalContent] = useState(content || '');
  // Estado compartido para el tamaño de fuente - importante para sincronización
  const [currentFontSize, setCurrentFontSize] = useState(12); // Valor predeterminado
  
  // Usamos directamente lightColors en lugar de colors que depende del tema
  const colors = lightColors;
  
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    h1: false,
    h2: false,
    h3: false,
    unorderedList: false,
    orderedList: false,
    link: false,
  });

  // Initialize the editor with content
  useEffect(() => {
    if (editorRef.current) {
      // Make editable
      editorRef.current.contentEditable = true;
      
      // Set initial content
      if (content && content !== internalContent) {
        editorRef.current.innerHTML = content;
        setInternalContent(content);
      }
      
      // Focus if empty
      if (!content) {
        setTimeout(() => {
          editorRef.current.focus();
        }, 100);
      }
      
      // Add event listener for selection change to check active formats
      document.addEventListener('selectionchange', checkActiveFormats);
      
      // Habilitar el posicionamiento libre permitiendo clics en cualquier lugar
      editorRef.current.style.minHeight = '600px';
      editorRef.current.style.position = 'relative';
      
      return () => {
        document.removeEventListener('selectionchange', checkActiveFormats);
      };
    }
  }, [content]);

  // Track content changes and notify parent
  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setInternalContent(newContent);
      onChange(newContent);
    }
  };

  // Check which formats are currently active
  const checkActiveFormats = () => {
    if (!document.activeElement || document.activeElement !== editorRef.current) {
      return;
    }
    
    try {
      // Basic formatting commands
      const formats = {
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        unorderedList: document.queryCommandState('insertUnorderedList'),
        orderedList: document.queryCommandState('insertOrderedList'),
        link: document.queryCommandState('createLink')
      };
      
      // Check for headings
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let element = range.commonAncestorContainer;
        
        // Navigate to element node if we're in a text node
        if (element.nodeType === 3) {
          element = element.parentNode;
        }
        
        // Check parent nodes for heading tags
        let currentNode = element;
        while (currentNode && currentNode !== editorRef.current) {
          const tagName = currentNode.tagName?.toLowerCase();
          if (tagName === 'h1') formats.h1 = true;
          if (tagName === 'h2') formats.h2 = true;
          if (tagName === 'h3') formats.h3 = true;
          
          currentNode = currentNode.parentNode;
        }
        
        // Obtener el tamaño de fuente actual
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseInt(computedStyle.fontSize);
        if (fontSize && !isNaN(fontSize)) {
          setCurrentFontSize(fontSize);
        }
      }
      
      setActiveFormats(formats);
    } catch (e) {
      console.error('Error checking active formats:', e);
    }
  };

  // Apply formatting commands
  const applyFormat = (format, value) => {
    // Si el formato es un enlace, manejarlo de forma especial
    if (format === 'link') {
      const selection = window.getSelection();
      if (selection.toString().trim() !== '') {
        const url = prompt('Ingresa la URL del enlace:', 'https://');
        if (url && url !== 'https://') {
          document.execCommand('createLink', false, url);
        }
      } else {
        const linkText = prompt('Ingresa el texto del enlace:', 'Enlace');
        const url = prompt('Ingresa la URL del enlace:', 'https://');
        if (linkText && url && url !== 'https://') {
          document.execCommand('insertHTML', false, `<a href="${url}">${linkText}</a>`);
        }
      }
      return;
    }
    
    // Si el formato es color de texto, manejarlo de forma especial
    if (format === 'textColor') {
      // Usar un color predeterminado por ahora
      // En una versión más avanzada podríamos mostrar un selector de color
      document.execCommand('foreColor', false, '#2B579A');
      return;
    }
    
    // Para el tamaño de fuente
    if (format === 'fontSize') {
      document.execCommand('fontSize', false, '7');
      
      // Obtener todos los elementos con el tamaño de fuente 7 (valor predeterminado)
      // y cambiar su tamaño de fuente al valor proporcionado
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const elements = document.querySelectorAll('font[size="7"]');
        elements.forEach(el => {
          el.removeAttribute('size');
          el.style.fontSize = value;
        });
        
        // Actualizar el estado del tamaño de fuente
        setCurrentFontSize(parseInt(value, 10));
        checkActiveFormats();
      }
      return;
    }
    
    // Resto de formatos usando execCommand
    const commandMap = {
      'bold': 'bold',
      'italic': 'italic',
      'underline': 'underline',
      'h1': () => document.execCommand('formatBlock', false, '<h1>'),
      'h2': () => document.execCommand('formatBlock', false, '<h2>'),
      'h3': () => document.execCommand('formatBlock', false, '<h3>'),
      'normal': () => document.execCommand('formatBlock', false, '<p>'),
      'unorderedList': 'insertUnorderedList',
      'orderedList': 'insertOrderedList',
      'alignLeft': () => document.execCommand('justifyLeft'),
      'alignCenter': () => document.execCommand('justifyCenter'),
      'alignRight': () => document.execCommand('justifyRight'),
      'alignJustify': () => document.execCommand('justifyFull')
    };
    
    const command = commandMap[format];
    
    if (typeof command === 'function') {
      command();
    } else if (command) {
      document.execCommand(command, false, null);
    }
    
    // Verificar los formatos activos después de aplicar el formato
    setTimeout(checkActiveFormats, 10);
    
    // Actualizar el contenido
    handleContentChange();
  };

  // Special handling for heading formats
  const applyHeadingFormat = (headingType) => {
    // Guardar la selección antes de aplicar formato
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Obtener el nodo contenedor
    let container = range.commonAncestorContainer;
    if (container.nodeType === 3) {
      container = container.parentNode;
    }
    
    // Si ya estamos en un heading, cambiarlo
    if (container.tagName && container.tagName.match(/^H[1-6]$/)) {
      document.execCommand('formatBlock', false, `<${headingType}>`);
    } else {
      // Si no, aplicar formato de heading
      document.execCommand('formatBlock', false, `<${headingType}>`);
    }
    
    // Forzar actualización del contenido
    handleContentChange();
    
    // Verificar estados activos después de un pequeño delay
    setTimeout(() => {
      checkActiveFormats();
    }, 10);
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Prevenir el pegado por defecto
    
    // Obtener los datos del portapapeles
    const clipboardData = e.clipboardData || window.clipboardData;
    
    // Intentar obtener el contenido como HTML primero
    let htmlContent = clipboardData.getData('text/html');
    let textContent = clipboardData.getData('text/plain');
    
    if (htmlContent) {
      // Filtrar todas las imágenes del HTML
      // Crear un elemento temporal para manipular el HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Eliminar todas las imágenes
      const images = tempDiv.querySelectorAll('img');
      images.forEach(img => img.remove());
      
      // Eliminar cualquier atributo style que contenga background-image
      const elementsWithBg = tempDiv.querySelectorAll('[style*="background-image"]');
      elementsWithBg.forEach(el => {
        const style = el.getAttribute('style');
        if (style) {
          // Eliminar propiedades background-image del style
          const newStyle = style.replace(/background-image[^;]*;?/gi, '');
          if (newStyle.trim()) {
            el.setAttribute('style', newStyle);
          } else {
            el.removeAttribute('style');
          }
        }
      });
      
      // Obtener el HTML limpio
      const cleanHTML = tempDiv.innerHTML;
      
      // Si queda contenido después de filtrar las imágenes, insertarlo
      if (cleanHTML.trim()) {
        document.execCommand('insertHTML', false, cleanHTML);
      } else if (textContent) {
        // Si no hay HTML válido, usar el texto plano
        document.execCommand('insertText', false, textContent);
      }
    } else if (textContent) {
      // Si solo hay texto plano, insertarlo
      document.execCommand('insertText', false, textContent);
    }
    
    // Actualizar el contenido después del pegado
    handleContentChange();
  };

  // Handle drag and drop - simplified without image handling
  const handleDrop = (e) => {
    e.preventDefault();
    
    // Obtener los datos del drop
    const dataTransfer = e.dataTransfer;
    
    // Verificar si hay archivos (que podrían ser imágenes)
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      // Filtrar solo archivos de texto si los hay
      const textFiles = Array.from(dataTransfer.files).filter(file => 
        file.type.startsWith('text/') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md')
      );
      
      // Si hay archivos de texto, podrían procesarse aquí
      // Por ahora, simplemente ignoramos todos los archivos
      console.log('Archivos ignorados (no se permiten imágenes):', dataTransfer.files.length);
      return;
    }
    
    // Intentar obtener contenido de texto del drop
    const htmlContent = dataTransfer.getData('text/html');
    const textContent = dataTransfer.getData('text/plain');
    
    if (htmlContent) {
      // Filtrar imágenes del HTML igual que en handlePaste
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Eliminar todas las imágenes
      const images = tempDiv.querySelectorAll('img');
      images.forEach(img => img.remove());
      
      // Eliminar background-images
      const elementsWithBg = tempDiv.querySelectorAll('[style*="background-image"]');
      elementsWithBg.forEach(el => {
        const style = el.getAttribute('style');
        if (style) {
          const newStyle = style.replace(/background-image[^;]*;?/gi, '');
          if (newStyle.trim()) {
            el.setAttribute('style', newStyle);
          } else {
            el.removeAttribute('style');
          }
        }
      });
      
      const cleanHTML = tempDiv.innerHTML;
      
      if (cleanHTML.trim()) {
        document.execCommand('insertHTML', false, cleanHTML);
      } else if (textContent) {
        document.execCommand('insertText', false, textContent);
      }
    } else if (textContent) {
      // Solo insertar texto plano
      document.execCommand('insertText', false, textContent);
    }
    
    // Actualizar el contenido
    handleContentChange();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Ctrl+B para negrita
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      applyFormat('bold');
    }
    // Ctrl+I para cursiva
    else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      applyFormat('italic');
    }
    // Ctrl+U para subrayado
    else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      applyFormat('underline');
    }
  };

  // Mostrar la barra flotante al hacer clic en el editor
  const handleEditorClick = (e) => {
    // Solo posicionar el cursor si no hay texto seleccionado actualmente
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      // Aseguramos que el clic directo en el editor (no en elementos dentro) posicione el cursor
      if (e.target === editorRef.current) {
        const clickX = e.clientX;
        const clickY = e.clientY;
        const editorRect = editorRef.current.getBoundingClientRect();
        
        // Calculamos la posición relativa dentro del editor
        const relativeX = clickX - editorRect.left;
        const relativeY = clickY - editorRect.top;
        
        // Intentamos encontrar el punto más cercano para insertar el cursor
        const range = document.createRange();
        
        // Crear un nodo de texto invisible si el editor está vacío
        if (!editorRef.current.childNodes.length) {
          const textNode = document.createTextNode('\u00A0'); // Espacio no rompible
          editorRef.current.appendChild(textNode);
        }
        
        // Encontrar la posición para el cursor usando el API de caretPositionFromPoint (o sus equivalentes)
        let position;
        if (document.caretPositionFromPoint) {
          position = document.caretPositionFromPoint(clickX, clickY);
          if (position) {
            range.setStart(position.offsetNode, position.offset);
          }
        } else if (document.caretRangeFromPoint) {
          // Para navegadores WebKit
          position = document.caretRangeFromPoint(clickX, clickY);
          if (position) {
            range.setStart(position.startContainer, position.startOffset);
          }
        }
        
        // Si no podemos encontrar una posición específica, insertar al final del editor
        if (!position) {
          // Insertar un nodo de texto al final si no hay uno
          if (editorRef.current.lastChild && editorRef.current.lastChild.nodeType === 1) { // Es un elemento
            const textNode = document.createTextNode('\u00A0');
            editorRef.current.appendChild(textNode);
            range.setStart(textNode, 0);
          } else if (editorRef.current.lastChild) {
            range.setStart(editorRef.current.lastChild, editorRef.current.lastChild.length || 0);
          } else {
            const textNode = document.createTextNode('\u00A0');
            editorRef.current.appendChild(textNode);
            range.setStart(textNode, 0);
          }
        }
        
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Enfocar el editor
        editorRef.current.focus();
      }
    }
    
    // Este evento será capturado por FloatingToolbar 
    // pero añadimos la función aquí para dar feedback visual si es necesario
    checkActiveFormats();
  };

  // Estilos para el editor - siempre usando colores claros
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
      borderRadius: borderRadius.md
    },
    editor: {
      width: '100%',
      height: '100%',
      padding: spacing.xl,
      outline: 'none',
      overflow: 'auto',
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.md,
      lineHeight: 1.6,
      transition: 'box-shadow 0.2s ease',
      cursor: 'text',
      minHeight: '600px',
      position: 'relative',
      userSelect: 'text',
      // Forzamos colores claros
      backgroundColor: lightColors.white,
      color: lightColors.textPrimary,
    },
    placeholder: {
      position: 'absolute',
      top: spacing.xl,
      left: spacing.xl,
      color: colors.gray300,
      pointerEvents: 'none'
    }
  };

  // Initialize content with default font size
  useEffect(() => {
    if (editorRef.current && !content) {
      // Si el contenido está vacío, establecer el tamaño de fuente predeterminado
      editorRef.current.style.fontSize = '12px';
    }
  }, [content]);

  return (
    <div style={styles.container}>
      {/* Barra de herramientas flotante */}
      <FloatingToolbar 
        onFormatText={applyFormat}
        activeFormats={activeFormats}
        editorRef={editorRef}
        fontSize={currentFontSize}
        setFontSize={(size) => applyFormat('fontSize', `${size}px`)}
        // Pasamos los colores claros forzados
        forceLightMode={true}
      />
      
      {/* Placeholder text when editor is empty */}
      {(!internalContent || internalContent === '<p><br></p>' || internalContent === '<br>') && (
        <div style={styles.placeholder}>
          Comienza a escribir...
        </div>
      )}
      
      {/* Editable content area */}
      <div
        ref={editorRef}
        id="editorContent"
        style={{
          ...styles.editor, 
          fontSize: '12px',
          position: 'relative',
          // Forzamos el fondo blanco y texto oscuro
          backgroundColor: lightColors.white,
          color: lightColors.textPrimary
        }}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        onKeyDown={handleKeyDown}
        onClick={handleEditorClick}
        onKeyUp={checkActiveFormats}
        onMouseUp={checkActiveFormats}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Initial content will be set from the content prop */}
      </div>

      {/* Estilos para imágenes redimensionables */}
      <style>
        {`
          /* Aplicar estilos de modo claro forzados al editor y todos sus elementos */
          #editorContent {
            background-color: ${lightColors.white} !important;
            color: ${lightColors.textPrimary} !important;
          }
          
          #editorContent h1, 
          #editorContent h2, 
          #editorContent h3, 
          #editorContent p,
          #editorContent div:not(.image-container),
          #editorContent span,
          #editorContent li {
            color: ${lightColors.textPrimary} !important;
          }
          
          /* Resto de los estilos sin cambios */
          .image-container img {
            transition: box-shadow 0.2s ease;
            vertical-align: middle;
            max-width: 100%;
          }
          
          /* Menús y controles en modo claro */
          .text-wrap-controls {
            background-color: ${lightColors.white} !important;
            border: 1px solid #ddd !important;
            color: ${lightColors.textPrimary} !important;
          }
          
          .wrap-control-button {
            background-color: ${lightColors.white} !important;
            border: 1px solid #ddd !important;
          }
          
          /* ... resto de los estilos ... */
        `}
      </style>
    </div>
  );
};

export default SimpleEditor;