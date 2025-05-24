// src/components/admin/SimpleEditor.jsx

import React, { useState, useRef, useEffect } from 'react';
import { spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import FloatingToolbar from './FloatingToolbar';
import { lightColors } from '../../styles/theme'; // Importamos específicamente los colores claros

// Constantes para el tamaño máximo de imagen
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
const ABSOLUTE_MAX_SIZE = 15 * 1024 * 1024; // 15MB

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
    // Si estamos aplicando formato a una imagen seleccionada, no hacemos nada
    if (document.querySelector('.selected-image')) {
      return;
    }
    
    // Si el formato es insertar imagen, manejarlo de forma especial
    if (format === 'image') {
      handleImageInsert();
      return;
    }
    
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

  // Función para comprimir imagen
  const compressImage = (file, imgSrc) => {
    return new Promise((resolve, reject) => {
      // Verificar si la imagen es demasiado grande
      if (file.size > ABSOLUTE_MAX_SIZE) {
        reject(new Error(`La imagen es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). El tamaño máximo permitido es ${ABSOLUTE_MAX_SIZE / 1024 / 1024}MB.`));
        return;
      }
      
      // Si la imagen es suficientemente pequeña, no comprimir
      if (file.size <= MAX_IMAGE_SIZE) {
        resolve(imgSrc);
        return;
      }
      
      // Crear un objeto de imagen para obtener dimensiones
      const img = new Image();
      img.onload = () => {
        try {
          // Calcular ratio de compresión
          let compressionRatio;
          
          if (file.size > 10 * 1024 * 1024) { // Más de 10MB
            compressionRatio = Math.sqrt(MAX_IMAGE_SIZE / file.size) * 0.7;
          } else if (file.size > 5 * 1024 * 1024) { // Entre 5MB y 10MB
            compressionRatio = Math.sqrt(MAX_IMAGE_SIZE / file.size) * 0.8;
          } else {
            compressionRatio = Math.sqrt(MAX_IMAGE_SIZE / file.size);
          }
          
          // Reducir tamaño proporcionalmente
          const newWidth = Math.floor(img.width * compressionRatio);
          const newHeight = Math.floor(img.height * compressionRatio);
          
          // Crear canvas para compresión
          const canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Dibujar imagen en canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          // Calcular calidad JPEG según tamaño
          let jpegQuality = 0.7; // 70% por defecto
          
          if (file.size > 10 * 1024 * 1024) {
            jpegQuality = 0.5; // 50% para imágenes muy grandes
          } else if (file.size > 5 * 1024 * 1024) {
            jpegQuality = 0.6; // 60% para imágenes grandes
          }
          
          // Convertir a data URL con la calidad especificada
          const compressedDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
          
          // Verificar tamaño después de compresión (aproximado)
          const base64Length = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
          const compressedSize = (base64Length * 0.75); // aproximación del tamaño en bytes
          
          // Si sigue siendo demasiado grande, comprimir más agresivamente
          if (compressedSize > MAX_IMAGE_SIZE * 1.2) {
            const secondCanvas = document.createElement('canvas');
            const reducedWidth = Math.floor(newWidth * 0.8);
            const reducedHeight = Math.floor(newHeight * 0.8);
            
            secondCanvas.width = reducedWidth;
            secondCanvas.height = reducedHeight;
            
            const ctx2 = secondCanvas.getContext('2d');
            ctx2.drawImage(img, 0, 0, reducedWidth, reducedHeight);
            
            const finalDataUrl = secondCanvas.toDataURL('image/jpeg', 0.45);
            resolve(finalDataUrl);
          } else {
            resolve(compressedDataUrl);
          }
        } catch (error) {
          console.error("Error al comprimir imagen:", error);
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error("Error al cargar la imagen para compresión"));
      };
      
      img.src = imgSrc;
    });
  };

  // Actualizar handleImageInsert para usar la compresión
  const handleImageInsert = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
      input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Mostrar un indicador de carga
        const loadingIndicator = document.createElement('div');
        loadingIndicator.textContent = "Procesando imagen...";
        loadingIndicator.style.padding = "10px";
        loadingIndicator.style.margin = "5px";
        loadingIndicator.style.backgroundColor = "#f0f8ff";
        loadingIndicator.style.border = "1px solid #add8e6";
        loadingIndicator.style.borderRadius = "4px";
        
        // Guardar la posición del cursor
        const selection = window.getSelection();
        const range = selection.getRangeAt(0).cloneRange();
        
        // Insertar indicador de carga
        document.execCommand('insertHTML', false, loadingIndicator.outerHTML);
        
        // Leer el archivo como Data URL
        const readFileAsDataURL = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
        
        // Obtener la imagen como Data URL
        const imgSrc = await readFileAsDataURL;
        
        // Comprimir la imagen si es necesario
        const processedImgSrc = await compressImage(file, imgSrc);
        
        // Verificar el tamaño de la cadena base64 resultante
        const base64Length = processedImgSrc.length - processedImgSrc.indexOf('base64,') - 7;
        const base64Size = (base64Length * 0.75);
        
        if (base64Size > 45 * 1024 * 1024) { // Limitar a 45MB (por debajo del max_allowed_packet)
          throw new Error(`La imagen procesada sigue siendo demasiado grande (${(base64Size / 1024 / 1024).toFixed(2)} MB). Por favor, utiliza una imagen más pequeña.`);
        }
        
        // Eliminar el indicador de carga
        const loadingElements = editorRef.current.querySelectorAll('div');
        loadingElements.forEach(el => {
          if (el.textContent === "Procesando imagen...") {
            el.remove();
          }
        });
        
        // Creamos HTML personalizado para la imagen con atributos para resize y estilos
        const imgHtml = `<div class="image-container wrap-inline" style="position: relative; display: inline-block; margin: 10px; cursor: move; z-index: 0; overflow: visible;">
          <img src="${processedImgSrc}" alt="Imagen insertada" style="max-width: 100%; height: auto; border: 1px solid #ddd; display: block; resize: both; overflow: auto;" data-image-type="html-encoded" />
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
        
        // Limpiar cualquier indicador de carga
        const loadingElements = editorRef.current.querySelectorAll('div');
        loadingElements.forEach(el => {
          if (el.textContent === "Procesando imagen...") {
            el.remove();
          }
        });
        
        // Notificar al usuario del error de forma amistosa
        const errorNode = document.createElement('span');
        errorNode.style.color = 'red';
        errorNode.style.fontWeight = 'bold';
        errorNode.textContent = `Error: ${error.message || 'No se pudo procesar la imagen'}`;
        
        // Insertar mensaje de error en el editor
        document.execCommand('insertHTML', false, errorNode.outerHTML);
        
        // Eliminar el mensaje después de unos segundos
        setTimeout(() => {
          const errorElements = editorRef.current.querySelectorAll('span');
          errorElements.forEach(el => {
            if (el.style.color === 'red' && el.textContent.startsWith('Error:')) {
              el.remove();
            }
          });
        }, 5000);
        
        // Intentar restaurar el estado del editor
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }
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
          
          // Verificar tamaño antes de procesar
          if (blob.size > ABSOLUTE_MAX_SIZE) {
            const errorMsg = `La imagen es demasiado grande (${(blob.size / 1024 / 1024).toFixed(2)} MB). El tamaño máximo permitido es ${ABSOLUTE_MAX_SIZE / 1024 / 1024}MB.`;
            const errorNode = document.createElement('span');
            errorNode.style.color = 'red';
            errorNode.style.fontWeight = 'bold';
            errorNode.textContent = `Error: ${errorMsg}`;
            document.execCommand('insertHTML', false, errorNode.outerHTML);
            
            // Eliminar mensaje de error después de unos segundos
            setTimeout(() => {
              const errorElements = editorRef.current.querySelectorAll('span');
              errorElements.forEach(el => {
                if (el.style.color === 'red' && el.textContent.startsWith('Error:')) {
                  el.remove();
                }
              });
            }, 5000);
            
            return;
          }
          
          // Mostrar indicador de carga
          const loadingIndicator = document.createElement('div');
          loadingIndicator.textContent = "Procesando imagen pegada...";
          loadingIndicator.style.padding = "10px";
          loadingIndicator.style.margin = "5px";
          loadingIndicator.style.backgroundColor = "#f0f8ff";
          loadingIndicator.style.border = "1px solid #add8e6";
          loadingIndicator.style.borderRadius = "4px";
          document.execCommand('insertHTML', false, loadingIndicator.outerHTML);
          
          const reader = new FileReader();
          
          reader.onload = async (event) => {
            try {
              // Comprimir la imagen pegada
              const imgSrc = event.target.result;
              const processedImgSrc = await compressImage(blob, imgSrc);
              
              // Eliminar el indicador de carga
              const loadingElements = editorRef.current.querySelectorAll('div');
              loadingElements.forEach(el => {
                if (el.textContent === "Procesando imagen pegada...") {
                  el.remove();
                }
              });
              
              // Creamos HTML personalizado para la imagen
              const imgHtml = `<div class="image-container wrap-inline" style="position: relative; display: inline-block; margin: 10px; cursor: move; z-index: 0; overflow: visible;">
                <img src="${processedImgSrc}" alt="Imagen pegada" style="max-width: 100%; height: auto; border: 1px solid #ddd; display: block; resize: both; overflow: auto;" data-image-type="html-encoded" />
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
            } catch (error) {
              console.error("Error al procesar imagen pegada:", error);
              
              // Limpiar cualquier indicador de carga
              const loadingElements = editorRef.current.querySelectorAll('div');
              loadingElements.forEach(el => {
                if (el.textContent === "Procesando imagen pegada...") {
                  el.remove();
                }
              });
              
              // Notificar al usuario del error
              const errorNode = document.createElement('span');
              errorNode.style.color = 'red';
              errorNode.style.fontWeight = 'bold';
              errorNode.textContent = `Error: ${error.message || 'No se pudo procesar la imagen'}`;
              document.execCommand('insertHTML', false, errorNode.outerHTML);
              
              // Eliminar mensaje después de unos segundos
              setTimeout(() => {
                const errorElements = editorRef.current.querySelectorAll('span');
                errorElements.forEach(el => {
                  if (el.style.color === 'red' && el.textContent.startsWith('Error:')) {
                    el.remove();
                  }
                });
              }, 5000);
            }
          };
          
          reader.onerror = (error) => {
            console.error("Error al leer imagen del portapapeles:", error);
            
            // Limpiar indicador de carga
            const loadingElements = editorRef.current.querySelectorAll('div');
            loadingElements.forEach(el => {
              if (el.textContent === "Procesando imagen pegada...") {
                el.remove();
              }
            });
            
            // Mostrar error
            const errorNode = document.createElement('span');
            errorNode.style.color = 'red';
            errorNode.style.fontWeight = 'bold';
            errorNode.textContent = "Error: No se pudo leer la imagen del portapapeles";
            document.execCommand('insertHTML', false, errorNode.outerHTML);
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
        // Verificar tamaño antes de procesar
        if (file.size > ABSOLUTE_MAX_SIZE) {
          const errorMsg = `La imagen es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). El tamaño máximo permitido es ${ABSOLUTE_MAX_SIZE / 1024 / 1024}MB.`;
          const errorNode = document.createElement('span');
          errorNode.style.color = 'red';
          errorNode.style.fontWeight = 'bold';
          errorNode.textContent = `Error: ${errorMsg}`;
          document.execCommand('insertHTML', false, errorNode.outerHTML);
          
          // Eliminar mensaje de error después de unos segundos
          setTimeout(() => {
            const errorElements = editorRef.current.querySelectorAll('span');
            errorElements.forEach(el => {
              if (el.style.color === 'red' && el.textContent.startsWith('Error:')) {
                el.remove();
              }
            });
          }, 5000);
          
          return;
        }
        
        // Mostrar indicador de carga
        const loadingIndicator = document.createElement('div');
        loadingIndicator.textContent = "Procesando imagen arrastrada...";
        loadingIndicator.style.padding = "10px";
        loadingIndicator.style.margin = "5px";
        loadingIndicator.style.backgroundColor = "#f0f8ff";
        loadingIndicator.style.border = "1px solid #add8e6";
        loadingIndicator.style.borderRadius = "4px";
        document.execCommand('insertHTML', false, loadingIndicator.outerHTML);
        
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          try {
            // Comprimir la imagen arrastrada
            const imgSrc = event.target.result;
            const processedImgSrc = await compressImage(file, imgSrc);
            
            // Eliminar el indicador de carga
            const loadingElements = editorRef.current.querySelectorAll('div');
            loadingElements.forEach(el => {
              if (el.textContent === "Procesando imagen arrastrada...") {
                el.remove();
              }
            });
            
            // Creamos HTML personalizado para la imagen
            const imgHtml = `<div class="image-container wrap-inline" style="position: relative; display: inline-block; margin: 10px; cursor: move; z-index: 0; overflow: visible;">
              <img src="${processedImgSrc}" alt="Imagen arrastrada" style="max-width: 100%; height: auto; border: 1px solid #ddd; display: block; resize: both; overflow: auto;" data-image-type="html-encoded" />
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
          } catch (error) {
            console.error("Error al procesar imagen arrastrada:", error);
            
            // Limpiar cualquier indicador de carga
            const loadingElements = editorRef.current.querySelectorAll('div');
            loadingElements.forEach(el => {
              if (el.textContent === "Procesando imagen arrastrada...") {
                el.remove();
              }
            });
            
            // Notificar al usuario del error
            const errorNode = document.createElement('span');
            errorNode.style.color = 'red';
            errorNode.style.fontWeight = 'bold';
            errorNode.textContent = `Error: ${error.message || 'No se pudo procesar la imagen'}`;
            document.execCommand('insertHTML', false, errorNode.outerHTML);
            
            // Eliminar mensaje después de unos segundos
            setTimeout(() => {
              const errorElements = editorRef.current.querySelectorAll('span');
              errorElements.forEach(el => {
                if (el.style.color === 'red' && el.textContent.startsWith('Error:')) {
                  el.remove();
                }
              });
            }, 5000);
          }
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
      {!hasSelectedImage && !isImageMenuOpen && (
        <FloatingToolbar 
          onFormatText={applyFormat}
          activeFormats={activeFormats}
          editorRef={editorRef}
          fontSize={currentFontSize}
          setFontSize={(size) => applyFormat('fontSize', `${size}px`)}
          // Pasamos los colores claros forzados
          forceLightMode={true}
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