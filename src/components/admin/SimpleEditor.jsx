// src/components/admin/SimpleEditor.jsx

import React, { useState, useRef, useEffect } from 'react';
import { spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext'; // Importar useTheme
import FloatingToolbar from './FloatingToolbar';

const SimpleEditor = ({ content, onChange }) => {
  // Obtener colores del tema actual
  const { colors, isDarkMode } = useTheme();
  
  const editorRef = useRef(null);
  const [internalContent, setInternalContent] = useState(content || '');
  // Estado compartido para el tamaño de fuente - importante para sincronización
  const [currentFontSize, setCurrentFontSize] = useState(12); // Valor predeterminado
  
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
  const applyFormat = (command, value = null) => {
    if (!editorRef.current) return;
    
    // Ensure the editor has focus
    if (document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    
    try {
      // For some commands we need special handling
      switch (command) {
        case 'h1':
        case 'h2':
        case 'h3':
          applyHeadingFormat(command);
          break;
        case 'textColor':
          // Ya no necesitamos usar el prompt porque ahora tenemos un color picker
          if (value) {
            document.execCommand('foreColor', false, value);
          }
          break;
        case 'link':
          const url = prompt('Introduzca la URL del enlace:', 'https://');
          if (url) {
            document.execCommand('createLink', false, url);
          }
          break;
        case 'image':
          handleImageInsert();
          break;
        case 'unorderedList':
          document.execCommand('insertUnorderedList', false, null);
          break;
        case 'orderedList':
          document.execCommand('insertOrderedList', false, null);
          break;
        case 'fontSize':
          // Aplicar el tamaño de fuente usando el elemento span
          if (value) {
            // Actualizar el estado compartido con el nuevo tamaño
            const size = parseFloat(value);
            setCurrentFontSize(size);
            
            // Crear un span con el estilo de tamaño de fuente
            document.execCommand('fontSize', false, '7'); // Usamos 7 como valor temporal
            
            // Después modificamos los elementos con fontSize=7 para usar el valor real
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const fontElements = document.querySelectorAll('font[size="7"]');
              
              fontElements.forEach(element => {
                element.removeAttribute('size');
                element.style.fontSize = value;
              });
            }
            
            // Notificar a las barras de herramientas sobre el cambio
            // para mantener la sincronización
            checkActiveFormats();
          }
          break;
        default:
          // For basic formatting (bold, italic, underline)
          document.execCommand(command, false, value);
      }
      
      // Update content and check for active formats
      handleContentChange();
      checkActiveFormats();
    } catch (e) {
      console.error(`Error applying format ${command}:`, e);
    }
  };

  // Special handling for heading formats
  const applyHeadingFormat = (headingType) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    // Get the current selection
    const range = selection.getRangeAt(0);
    const selectedElement = range.commonAncestorContainer;
    
    // Find the block element that contains the selection
    let blockElement = selectedElement;
    if (blockElement.nodeType === 3) { // Text node
      blockElement = blockElement.parentNode;
    }
    
    // Find the highest block-level element within the editor
    while (blockElement !== null && 
           blockElement.parentNode !== editorRef.current && 
           blockElement !== editorRef.current) {
      blockElement = blockElement.parentNode;
    }
    
    // Save the selection content
    const content = range.cloneContents();
    
    // Create the new heading element
    const newHeading = document.createElement(headingType);
    
    // If we have an empty selection, preserve the block element's content
    if (range.collapsed) {
      newHeading.innerHTML = blockElement.innerHTML;
    } else {
      // Otherwise use the selected content
      newHeading.appendChild(content);
    }
    
    // Replace the block element with our new heading
    if (blockElement !== editorRef.current) {
      blockElement.parentNode.replaceChild(newHeading, blockElement);
    } else {
      // If the blockElement is the editor itself, just insert at selection
      range.deleteContents();
      range.insertNode(newHeading);
    }
  };

  // Handle image insertion
  const handleImageInsert = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.execCommand('insertImage', false, event.target.result);
          handleContentChange();
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  // Handle paste events
  const handlePaste = (e) => {
    // Check for images in clipboard
    const items = e.clipboardData?.items;
    
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          
          // Get image from clipboard
          const blob = items[i].getAsFile();
          const reader = new FileReader();
          
          reader.onload = (event) => {
            // Insert the image
            document.execCommand('insertImage', false, event.target.result);
            handleContentChange();
          };
          
          reader.readAsDataURL(blob);
          return;
        }
      }
    }
  };

  // Handle key commands
  const handleKeyDown = (e) => {
    // Support for tab
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      return;
    }
  };

  // Handle drag and drop for images
  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          document.execCommand('insertImage', false, event.target.result);
          handleContentChange();
        };
        
        reader.readAsDataURL(file);
      }
    }
  };
  
  // Mostrar la barra flotante al hacer clic en el editor
  const handleEditorClick = (e) => {
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
      const selection = window.getSelection();
      
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
    
    // Este evento será capturado por FloatingToolbar 
    // pero añadimos la función aquí para dar feedback visual si es necesario
    editorRef.current?.focus();
  };

  // Estilos para el editor
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#f0f8f7', // Blanco hueso del modo claro
      borderRadius: borderRadius.md
    },
    editor: {
      width: '100%',
      height: '100%',
      padding: spacing.xl,
      outline: 'none',
      overflow: 'auto',
      color: '#0b4444', // Color de texto del modo claro
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.md,
      lineHeight: 1.6,
      transition: 'box-shadow 0.2s ease',
      cursor: 'text',
      minHeight: '600px', // Garantizamos una altura mínima adecuada
      position: 'relative' // Importante para el posicionamiento absoluto dentro del editor
    },
    placeholder: {
      position: 'absolute',
      top: spacing.xl,
      left: spacing.xl,
      color: '#a7b9b6', // Color de texto secundario del modo claro
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
      {/* Barra de herramientas flotante - ahora es la única barra */}
      <FloatingToolbar 
        onFormatText={applyFormat}
        activeFormats={activeFormats}
        editorRef={editorRef}
        fontSize={currentFontSize}
        setFontSize={(size) => applyFormat('fontSize', `${size}px`)}
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
        style={{
          ...styles.editor,
          fontSize: '12px',
          backgroundColor: '#f0f8f7', // Siempre blanco hueso del tema claro
          color: '#0b4444' // Siempre texto oscuro del tema claro
        }}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          handleEditorClick();
          checkActiveFormats();
        }}
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
          .image-container img {
            transition: box-shadow 0.2s ease;
            vertical-align: middle;
            max-width: 100%;
          }
          .image-container:hover img {
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
          }
          .resize-handle {
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 10;
          }
          .image-container:hover .resize-handle {
            opacity: 1;
          }
          /* Estilos para el flujo de texto alrededor de la imagen */
          .image-container.float-left {
            float: left;
            margin-right: 15px;
            margin-bottom: 10px;
            shape-outside: content-box;
            shape-margin: 10px;
            overflow: visible;
          }
          .image-container.float-right {
            float: right;
            margin-left: 15px;
            margin-bottom: 10px;
            shape-outside: content-box;
            shape-margin: 10px;
            overflow: visible;
          }
          /* Estilos para diferentes modos de wrapping como en Word */
          .image-container.wrap-inline {
            display: inline-block;
            vertical-align: middle;
            float: none;
            margin: 0 10px;
            z-index: 0;
            overflow: visible;
          }
          .image-container.wrap-square {
            float: left;
            shape-outside: content-box;
            shape-margin: 10px;
            margin: 0 15px 10px 0;
            overflow: visible;
            z-index: 0;
          }
          .image-container.wrap-tight {
            float: left;
            shape-outside: margin-box;
            shape-margin: 10px;
            margin: 0 15px 10px 0;
            overflow: visible;
            z-index: 0;
          }
          /* Eliminamos esta clase que podría causar problemas */
          .image-container.wrap-behind-text {
            display: none;
          }
          /* Aseguramos que las imágenes siempre estén detrás del texto */
          .image-container {
            z-index: 0;
            position: relative;
            overflow: visible;
          }
          /* Damos mayor prioridad al texto para que siempre esté visible */
          #editorContent p, 
          #editorContent span, 
          #editorContent div:not(.image-container), 
          #editorContent h1, 
          #editorContent h2, 
          #editorContent h3, 
          #editorContent ul, 
          #editorContent ol, 
          #editorContent li {
            position: relative;
            z-index: 1;
          }
          /* Estilos para los controles de wrapping */
          .wrap-control-button {
            opacity: 0;
            transition: opacity 0.2s ease;
            user-select: none;
            pointer-events: auto;
          }
          .image-container:hover .wrap-control-button {
            opacity: 1;
          }
          .text-wrap-controls {
            user-select: none;
            pointer-events: auto;
          }
          .text-wrap-controls button {
            user-select: none;
          }
          .text-wrap-controls button:hover {
            background-color: #f0f0f0 !important;
          }
          .text-wrap-controls button:active {
            background-color: #e0e0e0 !important;
          }
          /* Se añaden estilos para mejorar la selección y el posicionado */
          .image-container {
            user-select: none;
          }
          .image-container::after {
            content: '';
            display: inline;
            width: 1px;
            height: 1em;
          }
          /* Asegurar que el texto continúe correctamente después de imágenes */
          p:after {
            content: "";
            display: table;
            clear: both;
          }
          /* Estilos para los botones de control */
          .image-controls button:hover {
            background-color: #f0f0f0 !important;
          }
          .image-controls button:active {
            background-color: #e0e0e0 !important;
          }
          /* Estilo para imagen seleccionada */
          .selected-image img {
            box-shadow: 0 0 0 2px #007BFF, 0 0 10px rgba(0, 123, 255, 0.7) !important;
          }
          /* Nuevos estilos para indicador de arrastre */
          .image-container.dragging {
            opacity: 0.7;
            cursor: grabbing !important;
          }
          .image-container {
            cursor: grab;
          }
          .image-container.dragging::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 2px dashed #007BFF;
            pointer-events: none;
          }
          /* Indicador de guía de alineación */
          .alignment-guide {
            position: absolute;
            background-color: #007BFF;
            z-index: 1000;
            pointer-events: none;
            opacity: 0.6;
          }
          .alignment-guide.horizontal {
            height: 1px;
            left: 0;
            right: 0;
          }
          .alignment-guide.vertical {
            width: 1px;
            top: 0;
            bottom: 0;
          }
        `}
      </style>
    </div>
  );
};

export default SimpleEditor;