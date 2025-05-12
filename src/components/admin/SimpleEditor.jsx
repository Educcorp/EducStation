// src/components/admin/SimpleEditor.jsx

import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
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

  // Handle image insertion with resizable and movable features
  const handleImageInsert = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            // Guardamos la posición actual del cursor
            const selection = window.getSelection();
            const range = selection.getRangeAt(0).cloneRange();
            
            // En lugar de insertar la imagen directamente, creamos un contenedor manipulable
            const imgSrc = event.target.result;
            
            // Creamos HTML personalizado para la imagen con atributos para resize y estilos
            const imgHtml = `<div class="image-container wrap-inline" style="position: relative; display: inline-block; margin: 10px; cursor: move; z-index: 0; overflow: visible;">
              <img src="${imgSrc}" alt="Imagen insertada" style="max-width: 100%; height: auto; border: 1px solid #ddd; display: block; resize: both; overflow: auto;" />
              <div class="resize-handle" style="position: absolute; right: -10px; bottom: -10px; width: 20px; height: 20px; background-color: #007BFF; border-radius: 50%; cursor: nwse-resize; z-index: 10;"></div>
            </div>`;
            
            // Insertamos el HTML personalizado
            document.execCommand('insertHTML', false, imgHtml);
            
            // Después de insertar, agregamos event listeners para manipulación
            setTimeout(() => {
              addImageEventListeners();
              handleContentChange();
              
              // Posicionar el cursor después de la imagen insertada
              const imageContainers = editorRef.current.querySelectorAll('.image-container');
              if (imageContainers.length > 0) {
                const lastImageContainer = imageContainers[imageContainers.length - 1];
                
                // Crear un espacio después de la imagen para facilitar la escritura
                const spaceElement = document.createElement('span');
                spaceElement.innerHTML = '&nbsp;';
                lastImageContainer.parentNode.insertBefore(spaceElement, lastImageContainer.nextSibling);
                
                // Posicionar el cursor después del espacio
                const newRange = document.createRange();
                newRange.setStartAfter(spaceElement);
                newRange.collapse(true);
                
                const newSelection = window.getSelection();
                newSelection.removeAllRanges();
                newSelection.addRange(newRange);
                
                // Enfocar el editor
                editorRef.current.focus();
              }
            }, 10);
          } catch (error) {
            console.error("Error al insertar imagen:", error);
            // Notificar al usuario del error de forma amistosa
            alert("No se pudo insertar la imagen. Por favor, inténtelo de nuevo.");
            
            // Intentar restaurar el estado del editor
            if (editorRef.current) {
              editorRef.current.focus();
            }
          }
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const addImageEventListeners = () => {
    if (!editorRef.current) return;
    
    // Seleccionamos todos los contenedores de imagen
    const imageContainers = editorRef.current.querySelectorAll('.image-container');
    
    imageContainers.forEach(container => {
      if (container.getAttribute('data-handlers-added')) return;
      
      const img = container.querySelector('img');
      const resizeHandle = container.querySelector('.resize-handle');
      
      // Detectar y establecer el tamaño real de la imagen
      if (img) {
        // Crear una imagen temporal para obtener las dimensiones reales
        const tempImg = new Image();
        tempImg.onload = function() {
          // Establecer dimensiones basadas en la imagen real
          const aspectRatio = tempImg.width / tempImg.height;
          
          // Establecer un ancho inicial razonable basado en el contenedor
          const initialWidth = Math.min(tempImg.width, 300);
          const initialHeight = initialWidth / aspectRatio;
          
          img.style.width = `${initialWidth}px`;
          img.style.height = `${initialHeight}px`;
          
          // Guardar el aspect ratio para futuras operaciones de redimensionamiento
          img.setAttribute('data-aspect-ratio', aspectRatio);
          
          handleContentChange();
        };
        tempImg.src = img.src;
      }
      
      // Asegurar que se añadan los controles de text-wrap si no existen
      if (!container.querySelector('.text-wrap-controls')) {
        // Crear el botón para abrir el menú de opciones de wrapping
        const wrapControlButton = document.createElement('div');
        wrapControlButton.className = 'wrap-control-button';
        wrapControlButton.innerHTML = '≡'; // Icono simple para representar opciones de texto
        wrapControlButton.title = 'Opciones de texto';
        wrapControlButton.style.cssText = 'position: absolute; top: -30px; right: 0; background-color: white; border: 1px solid #ddd; border-radius: 4px; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 2; user-select: none; pointer-events: auto;';
        
        // Crear el menú de opciones para el wrapping de texto
        const wrapControls = document.createElement('div');
        wrapControls.className = 'text-wrap-controls';
        wrapControls.style.cssText = 'position: absolute; top: -30px; right: 30px; background-color: white; border: 1px solid #ddd; border-radius: 4px; padding: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: none; z-index: 2; user-select: none; pointer-events: auto;';
        
        // Opciones de wrapping
        const wrapOptions = [
          { class: 'wrap-inline', title: 'En línea con el texto', icon: '─' },
          { class: 'wrap-square', title: 'Cuadrado', icon: '□' },
          { class: 'wrap-tight', title: 'Ajustado', icon: '▢' }
        ];
        
        wrapOptions.forEach(option => {
          const button = document.createElement('button');
          button.className = option.class;
          button.title = option.title;
          button.innerHTML = option.icon;
          button.style.cssText = 'margin-right: 4px; cursor: pointer; background: none; border: 1px solid #ddd; border-radius: 2px; padding: 2px 5px; width: 28px; text-align: center; user-select: none;';
          
          button.addEventListener('click', (e) => {
            // Remover todas las clases de wrapping previas
            wrapOptions.forEach(opt => container.classList.remove(opt.class));
            
            // Añadir la clase seleccionada
            container.classList.add(option.class);
            
            // Aplicar estilos específicos para cada tipo de wrapping
            switch(option.class) {
              case 'wrap-inline':
                container.style.float = 'none';
                container.style.display = 'inline-block';
                container.style.verticalAlign = 'middle';
                container.style.margin = '0 10px';
                container.style.position = 'relative';
                container.style.zIndex = '0'; // Aseguramos que no esté encima del texto
                // Eliminar cualquier propiedad shape-outside que pudiera estar establecida
                container.style.shapeOutside = 'none';
                // Preservar tamaño de la imagen
                const inlineWidth = img.style.width;
                const inlineHeight = img.style.height;
                if (inlineWidth && inlineHeight) {
                  // Asegurar que no se pierda la dimensión al cambiar el estilo
                  setTimeout(() => {
                    img.style.width = inlineWidth;
                    img.style.height = inlineHeight;
                  }, 0);
                }
                break;
              case 'wrap-square':
                // Guardar dimensiones actuales antes de cambiar estilos
                const squareWidth = img.style.width;
                const squareHeight = img.style.height;
                
                container.style.float = 'left';
                container.style.margin = '0 15px 10px 0';
                container.style.position = 'relative';
                container.style.zIndex = '0'; // Aseguramos que no esté encima del texto
                container.style.shapeOutside = 'content-box';
                container.style.shapeMargin = '10px'; // Añadimos margen para el texto
                // Aseguramos que el flujo de texto respete la imagen
                container.style.overflow = 'visible';
                
                // Restaurar dimensiones
                if (squareWidth && squareHeight) {
                  setTimeout(() => {
                    img.style.width = squareWidth;
                    img.style.height = squareHeight;
                  }, 0);
                }
                break;
              case 'wrap-tight':
                // Guardar dimensiones actuales
                const tightWidth = img.style.width;
                const tightHeight = img.style.height;
                
                container.style.float = 'left';
                container.style.margin = '0 15px 10px 0';
                container.style.position = 'relative';
                container.style.zIndex = '0'; // Aseguramos que no esté encima del texto
                container.style.shapeOutside = 'margin-box';
                container.style.shapeMargin = '10px'; // Aumentamos el margen para mayor espacio
                // Aseguramos que el flujo de texto respete la imagen
                container.style.overflow = 'visible';
                
                // Restaurar dimensiones
                if (tightWidth && tightHeight) {
                  setTimeout(() => {
                    img.style.width = tightWidth;
                    img.style.height = tightHeight;
                  }, 0);
                }
                break;
            }
            
            // Notificar cambios
            handleContentChange();
            e.stopPropagation();
            e.preventDefault(); // Prevenir que se posicione el cursor
            
            // Ocultar los controles después de seleccionar
            wrapControls.style.display = 'none';
            // Actualizar estado para mostrar la barra flotante nuevamente
            setIsImageMenuOpen(false);
          });
          
          wrapControls.appendChild(button);
        });
        
        // Mostrar/ocultar el menú al hacer clic en el botón
        wrapControlButton.addEventListener('click', (e) => {
          const isVisible = wrapControls.style.display === 'none';
          wrapControls.style.display = isVisible ? 'block' : 'none';
          // Actualizar el estado para ocultar la barra flotante
          setIsImageMenuOpen(isVisible);
          e.stopPropagation();
          e.preventDefault(); // Prevenir que se posicione el cursor
        });
        
        // Prevenir la interacción con el cursor en estos elementos
        wrapControlButton.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
        
        wrapControls.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
        
        // Agregar los elementos al contenedor
        container.appendChild(wrapControlButton);
        container.appendChild(wrapControls);
      }
      
      // Variables para el movimiento
      let isDragging = false;
      let startX, startY, startLeft, startTop;
      
      // Variables para el resize
      let isResizing = false;
      let startWidth, startHeight;
      
      // Indica si la imagen está seleccionada
      let isSelected = false;
      
      // Mostrar controles al hacer clic en la imagen
      container.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el evento llegue al editor
        
        // Marcar esta imagen como seleccionada
        isSelected = true;
        container.classList.add('selected-image');
        
        // Desmarcar otras imágenes como seleccionadas
        document.querySelectorAll('.image-container').forEach(otherContainer => {
          if (otherContainer !== container) {
            otherContainer.classList.remove('selected-image');
            
            // Ocultar controles de otras imágenes
            const otherWrapControls = otherContainer.querySelector('.text-wrap-controls');
            if (otherWrapControls) {
              otherWrapControls.style.display = 'none';
            }
          }
        });
        
        // Actualizar el estado de imagen seleccionada
        checkForSelectedImage();
        
        // Si no estamos arrastrando ni redimensionando, mantener el foco en el editor
        if (!isDragging && !isResizing) {
          editorRef.current.focus();
        }
      });
      
      // Ocultar controles al hacer clic fuera de la imagen
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          isSelected = false;
          container.classList.remove('selected-image');
          
          // Ocultar controles de wrapping
          const wrapControls = container.querySelector('.text-wrap-controls');
          if (wrapControls) {
            wrapControls.style.display = 'none';
            // Actualizar el estado para mostrar la barra flotante de nuevo
            setIsImageMenuOpen(false);
          }
          
          // Verificar si hay alguna otra imagen seleccionada
          checkForSelectedImage();
        }
      });
      
      // Evento para comenzar a mover
      container.addEventListener('mousedown', (e) => {
        // Verificar que no haga clic en el manejador de resize o en los controles
        const wrapControls = container.querySelector('.text-wrap-controls');
        const wrapControlButton = container.querySelector('.wrap-control-button');
        
        if (e.target !== resizeHandle && 
            !(wrapControls && wrapControls.contains(e.target)) && 
            e.target !== wrapControlButton) {
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          
          // Asegurar que el contenedor tenga posición relativa
          const computedStyle = window.getComputedStyle(container);
          if (computedStyle.position !== 'relative') {
            container.style.position = 'relative';
          }
          
          startLeft = parseInt(computedStyle.left) || 0;
          startTop = parseInt(computedStyle.top) || 0;
          
          e.preventDefault();
          e.stopPropagation(); // Evitar que el evento llegue al editor
        }
      });
      
      // Evento para comenzar resize
      if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', (e) => {
          isResizing = true;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = parseInt(window.getComputedStyle(img).width);
          startHeight = parseInt(window.getComputedStyle(img).height);
          e.preventDefault();
          e.stopPropagation();
        });
      }
      
      // Eventos para el documento (para capturar fuera del editor)
      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;
          
          // Guardar tamaño actual antes de mover
          const currentWidth = img.style.width;
          const currentHeight = img.style.height;
          
          container.style.left = `${startLeft + deltaX}px`;
          container.style.top = `${startTop + deltaY}px`;
          
          // Restaurar tamaño después de mover para evitar cambios
          if (currentWidth && currentHeight) {
            img.style.width = currentWidth;
            img.style.height = currentHeight;
          }
          
          e.preventDefault();
        } else if (isResizing && img) {
          const deltaX = e.clientX - startX;
          const aspectRatio = parseFloat(img.getAttribute('data-aspect-ratio')) || 1;
          
          // Calcular nuevo ancho manteniendo el aspect ratio
          const newWidth = Math.max(50, startWidth + deltaX);
          const newHeight = newWidth / aspectRatio;
          
          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
          e.preventDefault();
        }
      });
      
      document.addEventListener('mouseup', (e) => {
        if (isDragging || isResizing) {
          isDragging = false;
          isResizing = false;
          handleContentChange();
          
          // Restaurar el foco al editor después de manipular una imagen
          // Se hace con un pequeño retraso para permitir que el evento de clic se procese
          setTimeout(() => {
            if (!editorRef.current.contains(document.activeElement)) {
              editorRef.current.focus();
              
              // Si hay una selección guardada, intentar restaurarla
              if (window.getSelection && window.getSelection().rangeCount === 0) {
                // Crear un nuevo rango al final de la imagen
                const range = document.createRange();
                range.setStartAfter(container);
                range.collapse(true);
                
                // Aplicar la selección
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          }, 10);
        }
      });
      
      // Evento de doble clic para posicionar el cursor después de la imagen
      container.addEventListener('dblclick', (e) => {
        // Verificar que no hicimos doble clic en el manejador de resize o en los controles
        const wrapControls = container.querySelector('.text-wrap-controls');
        const wrapControlButton = container.querySelector('.wrap-control-button');
        
        if (e.target !== resizeHandle && 
            !(wrapControls && wrapControls.contains(e.target)) && 
            e.target !== wrapControlButton) {
          // Posicionar el cursor después de la imagen
          const range = document.createRange();
          range.setStartAfter(container);
          range.collapse(true);
          
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Enfocar el editor
          editorRef.current.focus();
          
          e.preventDefault();
        }
      });
      
      // Marcar que ya se agregaron los manejadores
      container.setAttribute('data-handlers-added', 'true');
    });
  };

  // Función para eliminar la imagen seleccionada
  const deleteSelectedImage = () => {
    const selectedImage = editorRef.current.querySelector('.selected-image');
    
    if (selectedImage) {
      // Guardamos la posición para posicionar el cursor después
      const parent = selectedImage.parentNode;
      const nextSibling = selectedImage.nextSibling;
      
      // Eliminamos la imagen
      selectedImage.remove();
      
      // Posicionamos el cursor donde estaba la imagen
      const range = document.createRange();
      if (nextSibling) {
        range.setStartBefore(nextSibling);
      } else {
        range.setEndOfNode(parent);
      }
      range.collapse(true);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Notificamos el cambio
      handleContentChange();
      
      return true;
    }
    
    return false;
  };

  // Handle paste events with improved image handling
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
            // Creamos el contenedor para la imagen pegada
            const imgSrc = event.target.result;
            
            // Creamos HTML personalizado para la imagen con atributos para resize y estilos
            const imgHtml = `<div class="image-container wrap-inline" style="position: relative; display: inline-block; margin: 10px; cursor: move; z-index: 0; overflow: visible;">
              <img src="${imgSrc}" alt="Imagen pegada" style="max-width: 100%; height: auto; border: 1px solid #ddd; display: block; resize: both; overflow: auto;" />
              <div class="resize-handle" style="position: absolute; right: -10px; bottom: -10px; width: 20px; height: 20px; background-color: #007BFF; border-radius: 50%; cursor: nwse-resize; z-index: 10;"></div>
            </div>`;
            
            document.execCommand('insertHTML', false, imgHtml);
            
            // Añadir event listeners
            setTimeout(() => {
              addImageEventListeners();
              handleContentChange();
              
              // Posicionar el cursor después de la imagen pegada
              const imageContainers = editorRef.current.querySelectorAll('.image-container');
              if (imageContainers.length > 0) {
                const lastImageContainer = imageContainers[imageContainers.length - 1];
                
                // Crear un espacio después de la imagen para facilitar la escritura
                const spaceElement = document.createElement('span');
                spaceElement.innerHTML = '&nbsp;';
                lastImageContainer.parentNode.insertBefore(spaceElement, lastImageContainer.nextSibling);
                
                // Posicionar el cursor después del espacio
                const newRange = document.createRange();
                newRange.setStartAfter(spaceElement);
                newRange.collapse(true);
                
                const newSelection = window.getSelection();
                newSelection.removeAllRanges();
                newSelection.addRange(newRange);
                
                // Enfocar el editor
                editorRef.current.focus();
              }
            }, 10);
          };
          
          reader.readAsDataURL(blob);
          return;
        }
      }
    }
  };

  // Handle drag and drop with improved image handling
  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          // Creamos el contenedor para la imagen arrastrada
          const imgSrc = event.target.result;
          
          // Creamos HTML personalizado para la imagen con atributos para resize y estilos
          const imgHtml = `<div class="image-container wrap-inline" style="position: relative; display: inline-block; margin: 10px; cursor: move; z-index: 0; overflow: visible;">
            <img src="${imgSrc}" alt="Imagen arrastrada" style="max-width: 100%; height: auto; border: 1px solid #ddd; display: block; resize: both; overflow: auto;" />
            <div class="resize-handle" style="position: absolute; right: -10px; bottom: -10px; width: 20px; height: 20px; background-color: #007BFF; border-radius: 50%; cursor: nwse-resize; z-index: 10;"></div>
          </div>`;
          
          document.execCommand('insertHTML', false, imgHtml);
          
          // Añadir event listeners
          setTimeout(() => {
            addImageEventListeners();
            handleContentChange();
            
            // Posicionar el cursor después de la imagen arrastrada
            const imageContainers = editorRef.current.querySelectorAll('.image-container');
            if (imageContainers.length > 0) {
              const lastImageContainer = imageContainers[imageContainers.length - 1];
              
              // Crear un espacio después de la imagen para facilitar la escritura
              const spaceElement = document.createElement('span');
              spaceElement.innerHTML = '&nbsp;';
              lastImageContainer.parentNode.insertBefore(spaceElement, lastImageContainer.nextSibling);
              
              // Posicionar el cursor después del espacio
              const newRange = document.createRange();
              newRange.setStartAfter(spaceElement);
              newRange.collapse(true);
              
              const newSelection = window.getSelection();
              newSelection.removeAllRanges();
              newSelection.addRange(newRange);
              
              // Enfocar el editor
              editorRef.current.focus();
            }
          }, 10);
        };
        
        reader.readAsDataURL(file);
      }
    }
  };

  // Verificamos si hay imágenes ya insertadas que necesiten los controladores
  useEffect(() => {
    if (editorRef.current && internalContent) {
      // Después de que el contenido esté cargado, agregamos los manejadores a las imágenes
      setTimeout(() => {
        addImageEventListeners();
      }, 100);
    }
  }, [internalContent]);

  // Handle key commands
  const handleKeyDown = (e) => {
    // Support for tab
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      return;
    }
    
    // Eliminar imagen seleccionada con Delete o Backspace
    if ((e.key === 'Delete' || e.key === 'Backspace') && editorRef.current) {
      if (deleteSelectedImage()) {
        e.preventDefault();
      }
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

  // Variable para saber si hay una imagen seleccionada
  const [hasSelectedImage, setHasSelectedImage] = useState(false);
  // Variable para saber si el menú de opciones de la imagen está abierto
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);

  // Función para verificar si hay una imagen seleccionada
  const checkForSelectedImage = () => {
    const selectedImage = editorRef.current?.querySelector('.selected-image');
    setHasSelectedImage(!!selectedImage);
    
    // Verificar si algún menú de opciones está visible
    const visibleMenu = editorRef.current?.querySelector('.text-wrap-controls[style*="display: block"]');
    setIsImageMenuOpen(!!visibleMenu);
  };

  // Agregar listener para detectar clics en el documento
  useEffect(() => {
    const handleDocumentClick = () => {
      checkForSelectedImage();
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // Estilos para el editor
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
      height: '100%', // Aprovechamos toda la altura disponible al eliminar la barra estática
      padding: spacing.xl,
      outline: 'none',
      overflow: 'auto',
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.md,
      lineHeight: 1.6,
      transition: 'box-shadow 0.2s ease',
      cursor: 'text',
      minHeight: '600px', // Garantizamos una altura mínima adecuada
      position: 'relative', // Importante para el posicionamiento absoluto dentro del editor
      userSelect: 'text' // Asegurar que el texto sea seleccionable explícitamente
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
      {/* Barra de herramientas flotante - ahora es la única barra */}
      {!hasSelectedImage && !isImageMenuOpen && (
        <FloatingToolbar 
          onFormatText={applyFormat}
          activeFormats={activeFormats}
          editorRef={editorRef}
          fontSize={currentFontSize}
          setFontSize={(size) => applyFormat('fontSize', `${size}px`)}
        />
      )}
      
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
          position: 'relative'
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
          /* Prevenir que se pierda la selección */
          #editorContent {
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
          }
          #editorContent *:not(.image-container) {
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
          }
        `}
      </style>
    </div>
  );
};

export default SimpleEditor;