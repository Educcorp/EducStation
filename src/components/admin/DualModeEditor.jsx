import React, { useRef, useState, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import EditorToolbar from './EditorToolbar';
import { insertHTML } from './utils/editorUtils';
import HTMLPreview from './HTMLPreview';
import SyntaxHighlighter from './SyntaxHighlighter';
import SimpleEditor from './SimpleEditor';
import ImportExportActions from './ImportExportActions';

// Constantes para el tamaño máximo de imagen
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
const ABSOLUTE_MAX_SIZE = 15 * 1024 * 1024; // 15MB

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

const DualModeEditor = ({ content, onChange, initialMode = 'simple', onExport, onImport }) => {
  const textAreaRef = useRef(null);
  const [mode, setMode] = useState(initialMode === 'html' ? 'developer' : 'simple');
  const [activeTab, setActiveTab] = useState('code'); // Para el modo desarrollador
  const [internalContent, setInternalContent] = useState(content || '');
  const [isHighlightingEnabled, setIsHighlightingEnabled] = useState(true);
  const [simpleContent, setSimpleContent] = useState(content || '');
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [imageError, setImageError] = useState(null);

  // Inicializar el modo según initialMode cuando cambie
  useEffect(() => {
    console.log('DualModeEditor - InitialMode cambiado a:', initialMode);
    if (initialMode === 'html' && mode !== 'developer') {
      console.log('DualModeEditor - Inicializando en modo HTML desde props');
      setMode('developer');
    } else if (initialMode === 'simple' && mode !== 'simple') {
      console.log('DualModeEditor - Inicializando en modo Simple desde props');
      setMode('simple');
    }
  }, [initialMode]);

  // Actualizar contenido cuando cambia externamente
  useEffect(() => {
    console.log('DualModeEditor - Contenido externo actualizado:', content ? content.substring(0, 50) + '...' : 'vacío');
    console.log('DualModeEditor - Longitud del contenido:', content ? content.length : 0);
    
    if (content !== undefined && content !== null) {
      setInternalContent(content);
      setSimpleContent(content);
      
      // Si estamos en modo desarrollador, asegurarse de que el textarea tenga el contenido
      if (mode === 'developer' && textAreaRef.current) {
        console.log('DualModeEditor - Actualizando textarea directamente');
        textAreaRef.current.value = content;
      }
      
      // Log adicional para depuración
      console.log('DualModeEditor - Contenido actualizado en modo:', mode);
    }
  }, [content, mode]);

  // Manejar acciones de la barra de herramientas para el modo desarrollador
  const handleToolbarAction = async (actionType, placeholder) => {
    if (mode === 'simple') {
      return;
    }
    
    // Para imágenes, asegurar que se guarden con el atributo data-image-type
    if (actionType === 'image') {
      // Abrir diálogo de selección de archivo
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          
          // Verificar tamaño antes de procesar
          if (file.size > ABSOLUTE_MAX_SIZE) {
            setImageError(`La imagen es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). El tamaño máximo permitido es ${ABSOLUTE_MAX_SIZE / 1024 / 1024}MB.`);
            setTimeout(() => setImageError(null), 5000);
            return;
          }
          
          try {
            // Leer la imagen como Data URL
            const readFileAsDataURL = () => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
              });
            };
            
            // Mostrar mensaje de procesamiento
            const selectionStart = textAreaRef.current.selectionStart;
            const selectionEnd = textAreaRef.current.selectionEnd;
            const processingMsg = "<!-- Procesando imagen... -->";
            
            const newContent = internalContent.substring(0, selectionStart) +
              processingMsg +
              internalContent.substring(selectionEnd);
            
            updateContent(newContent);
            
            // Obtener y comprimir la imagen
            const imgSrc = await readFileAsDataURL();
            const processedImgSrc = await compressImage(file, imgSrc);
            
            // Verificar tamaño después de compresión
            const base64Length = processedImgSrc.length - processedImgSrc.indexOf('base64,') - 7;
            const base64Size = (base64Length * 0.75);
            
            if (base64Size > 45 * 1024 * 1024) {
              setImageError(`La imagen procesada sigue siendo demasiado grande (${(base64Size / 1024 / 1024).toFixed(2)} MB). Por favor, utiliza una imagen más pequeña.`);
              
              // Eliminar mensaje de procesamiento
              const currentContent = textAreaRef.current.value;
              const processedContent = currentContent.replace(processingMsg, "");
              updateContent(processedContent);
              
              setTimeout(() => setImageError(null), 5000);
              return;
            }
            
            // Crear HTML con el atributo data-image-type para identificar en vistas de carátulas
            const imgHTML = `<img src="${processedImgSrc}" alt="Imagen" data-image-type="html-encoded" style="max-width: 100%; height: auto;" />`;
            
            // Eliminar mensaje de procesamiento y agregar la imagen
            const currentContent = textAreaRef.current.value;
            const processedContent = currentContent.replace(processingMsg, imgHTML);
            updateContent(processedContent);
            
          } catch (error) {
            console.error("Error al procesar imagen:", error);
            setImageError(error.message || "Error al procesar la imagen");
            
            // Eliminar mensaje de procesamiento si existe
            const currentContent = textAreaRef.current.value;
            if (currentContent.includes(processingMsg)) {
              const processedContent = currentContent.replace(processingMsg, "");
              updateContent(processedContent);
            }
            
            setTimeout(() => setImageError(null), 5000);
          }
        }
      };
      input.click();
      return;
    }
    
    const newContent = insertHTML(
      internalContent,
      actionType,
      placeholder,
      textAreaRef.current
    );
    updateContent(newContent);
  };

  // Actualizar contenido según el modo actual
  const updateContent = (newContent) => {
    setInternalContent(newContent);
    
    // Notificar al componente padre sobre el cambio
    const event = {
      target: {
        name: 'content',
        value: newContent
      }
    };
    console.log('DualModeEditor - updateContent: Actualizando contenido del editor', newContent.substring(0, 50) + '...');
    onChange(event);
  };

  // Manejar cambio de modo entre simple y desarrollador
  const handleModeToggle = (newMode) => {
    console.log('DualModeEditor - handleModeToggle: Cambiando modo de', mode, 'a', newMode);
    
    if (newMode === 'developer' && mode === 'simple') {
      setShowDeveloperModal(true);
      return;
    }
    
    setMode(newMode);
    
    // Actualizar el contenido interno al cambiar de modo
    if (newMode === 'developer') {
      setActiveTab('code');
      // Asegurar que el contenido esté sincronizado
      setInternalContent(content || '');
      
      // Asegurarse de que el textarea tenga el contenido
      if (textAreaRef.current) {
        console.log('DualModeEditor - Sincronizando contenido en textarea al cambiar a modo developer');
        console.log('DualModeEditor - Contenido a sincronizar:', content ? content.substring(0, 50) + '...' : 'vacío');
        
        setTimeout(() => {
          if (textAreaRef.current) {
            textAreaRef.current.value = content || '';
            console.log('DualModeEditor - Contenido sincronizado en textarea');
          }
        }, 50);
      }
    } else {
      // Si pasamos a modo simple, sincronizamos el contenido
      setSimpleContent(internalContent || '');
    }
    
    // Notificar al componente padre sobre el cambio de modo
    const event = {
      target: {
        name: 'editorMode',
        value: newMode === 'developer' ? 'html' : 'simple'
      }
    };
    console.log('DualModeEditor - handleModeToggle: Notificando cambio de modo al padre:', event.target.value);
    onChange(event);
  };

  // Confirmar cambio al modo desarrollador
  const confirmDeveloperMode = () => {
    console.log('DualModeEditor - confirmDeveloperMode: Confirmando cambio a modo HTML');
    console.log('DualModeEditor - confirmDeveloperMode: Contenido actual:', content ? content.substring(0, 50) + '...' : 'vacío');
    console.log('DualModeEditor - confirmDeveloperMode: Longitud del contenido:', content ? content.length : 0);
    
    setShowDeveloperModal(false);
    setMode('developer');
    
    // Asegurar que el contenido esté sincronizado
    const contentToUse = content || '';
    setInternalContent(contentToUse);
    
    // Asegurarse de que el textarea tenga el contenido actualizado
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.value = contentToUse;
        console.log('DualModeEditor - confirmDeveloperMode: Contenido sincronizado en textarea');
        
        // Verificación adicional
        if (textAreaRef.current.value !== contentToUse) {
          console.warn('DualModeEditor - confirmDeveloperMode: El contenido no se sincronizó correctamente');
          textAreaRef.current.value = contentToUse;
        }
      }
    }, 50);
    
    // Notificar al componente padre sobre el cambio de modo
    const event = {
      target: {
        name: 'editorMode',
        value: 'html'
      }
    };
    console.log('DualModeEditor - confirmDeveloperMode: Notificando cambio de modo al padre:', event.target.value);
    onChange(event);
    
    // Verificación adicional después de un tiempo
    setTimeout(() => {
      if (textAreaRef.current && textAreaRef.current.value !== contentToUse) {
        console.log('DualModeEditor - confirmDeveloperMode: Corrección tardía de contenido');
        textAreaRef.current.value = contentToUse;
      }
    }, 500);
  };

  // Cancelar cambio al modo desarrollador
  const cancelDeveloperMode = () => {
    setShowDeveloperModal(false);
  };

  // Manejar cambios en el área de texto
  const handleTextAreaChange = (e) => {
    console.log('DualModeEditor - handleTextAreaChange llamado con valor:', 
      e.target.value ? `"${e.target.value.substring(0, 50)}..."` : 'vacío');
    console.log('DualModeEditor - handleTextAreaChange longitud del contenido:', e.target.value ? e.target.value.length : 0);
    
    // Asegurar que no estamos estableciendo a null o undefined
    const newContent = e.target.value || '';
    setInternalContent(newContent);
    
    // Crear un evento limpio con el contenido adecuado
    const cleanEvent = {
      target: {
        name: 'content',
        value: newContent
      }
    };
    
    console.log('DualModeEditor - notificando al padre con contenido de longitud:', newContent.length);
    onChange(cleanEvent);
    
    // Verificación adicional para asegurar que el textarea tenga el contenido actualizado
    setTimeout(() => {
      if (textAreaRef.current && textAreaRef.current.value !== newContent) {
        console.log('DualModeEditor - Corrigiendo desincronización en textarea');
        textAreaRef.current.value = newContent;
      }
    }, 0);
  };

  // Manejar cambios en el contenido del editor simple
  const handleSimpleContentChange = (newContent) => {
    setSimpleContent(newContent);
    
    // Notificar al componente padre sobre el cambio
    const event = {
      target: {
        name: 'content',
        value: newContent
      }
    };
    onChange(event);
  };

  // Alternar resaltado de sintaxis
  const toggleSyntaxHighlighting = () => {
    setIsHighlightingEnabled(!isHighlightingEnabled);
  };

  // Manejar el pegado de contenido en el textarea
  const handlePaste = (e) => {
    if (mode !== 'developer') return;
    
    console.log('DualModeEditor - Contenido pegado detectado');
    
    // En caso de que algo salga mal, guardamos el evento original
    const originalEvent = e;
    
    try {
      // Obtener el contenido pegado del portapapeles
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData('text');
      
      console.log('DualModeEditor - Contenido pegado longitud:', pastedData.length);
      console.log('DualModeEditor - Muestra del contenido pegado:', 
        pastedData.substring(0, 100) + (pastedData.length > 100 ? '...' : ''));
      
      // Actualizar el estado interno con el contenido pegado
      if (pastedData) {
        // No prevenimos el comportamiento por defecto para que el textarea maneje el pegado
        // normalmente, pero luego aseguramos que nuestro estado se actualice correctamente
        setTimeout(() => {
          if (textAreaRef.current) {
            const newContent = textAreaRef.current.value;
            updateContent(newContent);
          }
        }, 0);
      }
    } catch (error) {
      console.error('Error al manejar el pegado:', error);
      // Si hay un error, dejamos que el comportamiento por defecto maneje el pegado
    }
  };
  
  // Actualizar la referencia al componente del textarea para acceder al 
  // contenido directamente
  useEffect(() => {
    if (mode === 'developer' && !isHighlightingEnabled && textAreaRef.current) {
      // Añadir el manejador de eventos de pegado
      textAreaRef.current.addEventListener('paste', handlePaste);
      
      return () => {
        if (textAreaRef.current) {
          textAreaRef.current.removeEventListener('paste', handlePaste);
        }
      };
    }
  }, [mode, isHighlightingEnabled]);

  // Estilos para el editor
  const styles = {
    editorContainer: {
      position: 'relative',
      border: `1px solid ${colors.gray200}`,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      boxShadow: shadows.sm,
      maxWidth: '960px',
      margin: '0 auto',
    },
    editorHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${colors.gray200}`,
      backgroundColor: '#F8F9FA',
      height: '44px',
      alignItems: 'center'
    },
    modeToggle: {
      display: 'flex',
      alignItems: 'center',
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      gap: spacing.sm,
      marginLeft: spacing.md
    },
    iconButton: {
      width: '42px',
      height: '42px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: mode === 'developer' ? '#E34C26' : 'transparent',
      border: 'none',
      borderRadius: borderRadius.circle,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: mode === 'developer' ? '#FFFFFF' : colors.textSecondary,
      marginRight: spacing.md
    },
    tabsContainer: {
      display: 'flex'
    },
    tab: {
      padding: `${spacing.sm} ${spacing.xl}`,
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      fontWeight: typography.fontWeight.medium,
      fontSize: typography.fontSize.md,
      color: colors.textSecondary,
      borderBottom: '2px solid transparent',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs
    },
    activeTab: {
      color: '#E34C26', // Color HTML
      borderBottom: `2px solid #E34C26` // Color HTML
    },
    editorContent: {
      backgroundColor: '#f9fafb',
      borderRadius: `0 0 ${borderRadius.md} ${borderRadius.md}`,
      padding: spacing.sm,
      border: 'none'
    },
    autoSaveIndicator: {
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      backgroundColor: mode === 'developer' ? '#E34C26' : '#4CAF50',
      color: colors.white,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.xs,
      opacity: 0.7
    },
    modeBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      borderRadius: borderRadius.circle,
      fontSize: typography.fontSize.xs,
      backgroundColor: mode === 'developer' ? '#E34C26' : '#4CAF50',
      color: '#FFFFFF',
      marginLeft: spacing.sm,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginRight: spacing.lg
    },
    highlighterToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      marginRight: spacing.md
    },
    switchContainer: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    switchLabel: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginRight: spacing.xs,
    },
    switch: {
      position: 'relative',
      display: 'inline-block',
      width: '40px',
      height: '20px',
    },
    switchInput: {
      opacity: 0,
      width: 0,
      height: 0,
    },
    switchSlider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.gray200,
      transition: '0.4s',
      borderRadius: '20px',
    },
    switchThumb: (isActive) => ({
      position: 'absolute',
      cursor: 'pointer',
      content: '""',
      height: '16px',
      width: '16px',
      left: isActive ? '22px' : '2px',
      bottom: '2px',
      backgroundColor: colors.white,
      transition: '0.4s',
      borderRadius: '50%',
    }),
    // Para el editor simple
    simpleEditorContainer: {
      height: '600px',
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
      padding: 0,
      overflow: 'auto'
    },
    tabIcon: {
      width: '18px',
      height: '18px',
      marginRight: spacing.xs
    },
    // Modal de confirmación para modo desarrollador
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      width: '90%',
      maxWidth: '500px',
      boxShadow: shadows.lg,
      position: 'relative',
      animation: 'fadeIn 0.3s ease-out'
    },
    modalTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.lg,
      color: colors.primary,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm
    },
    modalText: {
      marginBottom: spacing.lg,
      lineHeight: 1.6,
      color: colors.textPrimary
    },
    modalButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: spacing.md,
      marginTop: spacing.xl
    },
    modalButton: (isPrimary) => ({
      padding: `${spacing.sm} ${spacing.xl}`,
      backgroundColor: isPrimary ? '#E34C26' : colors.gray200,
      color: isPrimary ? colors.white : colors.textPrimary,
      border: 'none',
      borderRadius: borderRadius.md,
      cursor: 'pointer',
      fontWeight: typography.fontWeight.medium,
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: isPrimary ? '#d13a1e' : colors.gray300,
        transform: 'translateY(-2px)'
      }
    }),
    warningIcon: {
      fontSize: '24px',
      color: '#E34C26'
    },
    codeIcon: {
      fontSize: '20px',
      color: mode === 'developer' ? '#FFFFFF' : colors.textSecondary,
    },
    tooltip: {
      position: 'absolute',
      top: '-15%',
      left: '50%', // Centra horizontalmente
      transform: 'translateX(-50%)', // Ajusta el tooltip al centro del botón
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: colors.white,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.xs,
      whiteSpace: 'nowrap',
      visibility: hoveredElement === 'codeButton' ? 'visible' : 'hidden',
      opacity: hoveredElement === 'codeButton' ? 1 : 0,
      transition: 'all 0.3s ease',
      zIndex: 9999, // Asegura que el tooltip esté al frente
      marginTop: spacing.xs,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Añade un efecto de sombra para mayor visibilidad
    }
  };

  return (
    <div style={styles.editorContainer}>
      {/* Estilos de animación */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes ripple {
            0% { transform: scale(0); opacity: 0.7; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `
      }} />
      
      <div style={styles.editorHeader}>
        {/* Nombre del editor a la izquierda */}
        <div style={{ 
          fontWeight: typography.fontWeight.medium,
          color: colors.textSecondary,
          fontSize: typography.fontSize.sm,
          marginLeft: spacing.md,
          display: 'flex',
          alignItems: 'center'
        }}>
          {mode === 'developer' ? 'Editor HTML' : 'Editor'}
        </div>
        
        {/* Controles de la sección derecha */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          {/* Toggle de Resaltado para modo desarrollador */}
          {mode === 'developer' && (
            <div style={styles.highlighterToggle}>
              <div 
                style={styles.switchContainer}
                onClick={toggleSyntaxHighlighting}
              >
                <span style={styles.switchLabel}>Resaltado:</span>
                <div style={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={isHighlightingEnabled}
                    style={styles.switchInput}
                    readOnly
                  />
                  <span 
                    style={{
                      ...styles.switchSlider,
                      backgroundColor: isHighlightingEnabled ? '#E34C26' : colors.gray200
                    }}
                  >
                    <span style={styles.switchThumb(isHighlightingEnabled)} />
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Botón de modo con ícono (ahora a la derecha) */}
          <div style={{...styles.modeToggle, marginLeft: 'auto', marginRight: spacing.md}}>
            <button
              style={{
                ...styles.iconButton,
                ...(hoveredElement === 'codeButton' ? {
                  backgroundColor: mode === 'developer' ? '#d13a1e' : 'rgba(227, 76, 38, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 3px 8px rgba(227, 76, 38, 0.3)'
                } : {})
              }}
              onClick={() => handleModeToggle(mode === 'simple' ? 'developer' : 'simple')}
              onMouseEnter={() => setHoveredElement('codeButton')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div style={styles.buttonRipple}></div>
              <span style={{
                ...styles.codeIcon,
                animation: hoveredElement === 'codeButton' ? 'pulse 1s infinite' : 'none'
              }}>&lt;/&gt;</span>
              <span style={styles.tooltip}>{mode === 'developer' ? 'Volver al editor simple' : 'Modo HTML (avanzado)'}</span>
            </button>
          </div>
          
          {/* Las pestañas se han movido a la sección editorContent */}
        </div>
      </div>

      <div style={styles.editorContent}>
        {/* Selector de pestañas para modo desarrollador */}
        {mode === 'developer' && (
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${colors.gray200}`,
            backgroundColor: '#f9fafb'
          }}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'code' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('code')}
            >
              <img src="/assets/images/icons/CODE_icon.png" alt="Code" style={styles.tabIcon} />
              <span>Code</span>
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'preview' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('preview')}
            >
              <img src="/assets/images/icons/PREVIEW_icon.png" alt="Preview" style={styles.tabIcon} />
              <span>Preview</span>
            </button>
          </div>
        )}

        {/* Modo Desarrollador */}
        {mode === 'developer' && (
          <>
            {activeTab === 'code' && (
              <div style={{
                position: 'relative',
                height: '600px',
                backgroundColor: '#1E1E1E',
                borderRadius: `0 0 ${borderRadius.md} ${borderRadius.md}`,
                overflow: 'hidden'
              }}>
                <textarea
                  ref={textAreaRef}
                  value={internalContent || ''}
                  onChange={handleTextAreaChange}
                  onPaste={handlePaste}
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: spacing.md,
                    backgroundColor: '#1E1E1E',
                    color: '#D4D4D4',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    tabSize: '2',
                    whiteSpace: 'pre',
                    overflowX: 'auto',
                    overflowY: 'auto'
                  }}
                  spellCheck={false}
                />
                {imageError && (
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    backgroundColor: '#E34C26',
                    color: '#FFFFFF',
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    boxShadow: shadows.md,
                    animation: 'fadeIn 0.3s ease-out'
                  }}>
                    {imageError}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preview' && (
              <div style={{
                width: '100%',
                height: '600px',
                padding: spacing.md,
                backgroundColor: '#f9fafb',
                border: `1px solid ${colors.gray200}`,
                borderRadius: borderRadius.md,
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                overflow: 'auto'
              }}>
                <HTMLPreview htmlContent={internalContent} />
              </div>
            )}
          </>
        )}
        
        {/* Modo Simple */}
        {mode === 'simple' && (
          <div style={styles.simpleEditorContainer}>
            <SimpleEditor 
              content={simpleContent}
              onChange={handleSimpleContentChange}
            />
          </div>
        )}


      </div>

      {/* Import/Export Actions moved to the bottom */}
      <ImportExportActions 
        onExport={onExport} 
        onImport={onImport} 
        isHtmlMode={mode === 'developer'} 
      />

      {/* Modal de confirmación para el modo desarrollador */}
      {showDeveloperModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>
              <span style={styles.warningIcon}>⚠️</span>
              Modo HTML (Avanzado)
            </h3>
            <p style={styles.modalText}>
              Estás a punto de entrar al modo HTML, diseñado para usuarios con conocimientos de HTML y CSS. En este modo podrás editar directamente el código HTML de tu documento.
            </p>
            <p style={styles.modalText}>
              <strong>Nota:</strong> Este modo es recomendado solo para usuarios avanzados. Si no estás familiarizado con HTML, te recomendamos continuar en el editor simple.
            </p>
            <div style={styles.modalButtons}>
              <button 
                style={{
                  ...styles.modalButton(false),
                  ...(hoveredElement === 'cancelButton' ? { 
                    backgroundColor: colors.gray300,
                    transform: 'translateY(-2px)'
                  } : {})
                }}
                onClick={cancelDeveloperMode}
                onMouseEnter={() => setHoveredElement('cancelButton')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                Cancelar
              </button>
              <button 
                style={{
                  ...styles.modalButton(true),
                  ...(hoveredElement === 'confirmButton' ? { 
                    backgroundColor: '#d13a1e',
                    transform: 'translateY(-2px)'
                  } : {})
                }}
                onClick={confirmDeveloperMode}
                onMouseEnter={() => setHoveredElement('confirmButton')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                Continuar al modo HTML
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de error de imagen */}
      {imageError && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(244, 67, 54, 0.9)',
          color: 'white',
          padding: `${spacing.sm} ${spacing.md}`,
          borderRadius: borderRadius.md,
          zIndex: 1000,
          maxWidth: '80%',
          boxShadow: shadows.md,
          textAlign: 'center',
          fontWeight: typography.fontWeight.medium
        }}>
          {imageError}
        </div>
      )}
    </div>
  );
};

export default DualModeEditor;