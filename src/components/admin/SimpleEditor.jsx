// src/components/admin/SimpleEditor.jsx

import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import SimpleEditorToolbar from './SimpleEditorToolbar';
import FloatingToolbar from './FloatingToolbar';

const SimpleEditor = ({ content, onChange }) => {
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
        
        // NUEVO: Obtener el tamaño de fuente actual
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
          const color = prompt('Introduzca un color (ej. #0b4444, red, etc):', '#0b4444');
          if (color) {
            document.execCommand('foreColor', false, color);
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

  // Styles for the editor
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
      height: 'calc(100% - 40px)', // Account for toolbar height
      padding: spacing.xl,
      outline: 'none',
      overflow: 'auto',
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.md,
      lineHeight: 1.6
    },
    placeholder: {
      position: 'absolute',
      top: '40px', // Below toolbar
      left: spacing.xl,
      padding: spacing.xl,
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
      {/* Barra de herramientas estática */}
      <SimpleEditorToolbar 
        onFormatText={applyFormat}
        activeFormats={activeFormats}
        fontSize={currentFontSize}
        setFontSize={(size) => applyFormat('fontSize', `${size}px`)}
      />
      
      {/* Barra de herramientas flotante */}
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
        style={{...styles.editor, fontSize: '12px' }} // Establecer tamaño predeterminado
        onInput={handleContentChange}
        onBlur={handleContentChange}
        onKeyDown={handleKeyDown}
        onClick={checkActiveFormats}
        onKeyUp={checkActiveFormats}
        onMouseUp={checkActiveFormats}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Initial content will be set from the content prop */}
      </div>
    </div>
  );
};

export default SimpleEditor;