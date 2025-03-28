import React, { useRef, useState, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import EditorToolbar from './EditorToolbar';
import { insertHTML } from './utils/editorUtils';
import HTMLPreview from './HTMLPreview';
import SyntaxHighlighter from './SyntaxHighlighter';
import SimpleEditor from './SimpleEditor';

const DualModeEditor = ({ content, onChange, initialMode = 'simple' }) => {
  const textAreaRef = useRef(null);
  const [mode, setMode] = useState('simple'); // Siempre comenzar con modo simple
  const [activeTab, setActiveTab] = useState('code'); // Para el modo desarrollador
  const [internalContent, setInternalContent] = useState(content || '');
  const [isHighlightingEnabled, setIsHighlightingEnabled] = useState(true);
  const [simpleContent, setSimpleContent] = useState(content || '');
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);

  // Actualizar contenido cuando cambia externamente
  useEffect(() => {
    setInternalContent(content || '');
    setSimpleContent(content || '');
  }, [content]);

  // Manejar acciones de la barra de herramientas para el modo desarrollador
  const handleToolbarAction = (actionType, placeholder) => {
    if (mode === 'simple') {
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
    onChange(event);
  };

  // Manejar cambio de modo entre simple y desarrollador
  const handleModeToggle = (newMode) => {
    if (newMode === 'developer' && mode === 'simple') {
      setShowDeveloperModal(true);
      return;
    }
    
    setMode(newMode);
    
    // Resetear pestañas a vista de código al cambiar a modo desarrollador
    if (newMode === 'developer') {
      setActiveTab('code');
    }
    
    // Notificar al componente padre sobre el cambio de modo
    const event = {
      target: {
        name: 'editorMode',
        value: newMode === 'developer' ? 'html' : 'simple'
      }
    };
    onChange(event);
  };

  // Confirmar cambio al modo desarrollador
  const confirmDeveloperMode = () => {
    setShowDeveloperModal(false);
    setMode('developer');
    
    // Notificar al componente padre sobre el cambio de modo
    const event = {
      target: {
        name: 'editorMode',
        value: 'html'
      }
    };
    onChange(event);
  };

  // Cancelar cambio al modo desarrollador
  const cancelDeveloperMode = () => {
    setShowDeveloperModal(false);
  };

  // Manejar cambios en el área de texto
  const handleTextAreaChange = (e) => {
    setInternalContent(e.target.value);
    onChange(e);
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
      top: '100%',
      right: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: colors.white,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.xs,
      whiteSpace: 'nowrap',
      visibility: hoveredElement === 'codeButton' ? 'visible' : 'hidden',
      opacity: hoveredElement === 'codeButton' ? 1 : 0,
      transition: 'all 0.3s ease',
      zIndex: 10,
      marginTop: spacing.xs
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
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
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
              <>
                <EditorToolbar 
                  onInsertMarkdown={handleToolbarAction} 
                  mode="html"
                />
                
                {isHighlightingEnabled ? (
                  <SyntaxHighlighter
                    content={internalContent}
                    onChange={handleTextAreaChange}
                    textAreaRef={textAreaRef}
                  />
                ) : (
                  <textarea
                    ref={textAreaRef}
                    value={internalContent}
                    onChange={handleTextAreaChange}
                    style={{
                      width: '100%',
                      height: '600px',
                      padding: spacing.md,
                      backgroundColor: '#272822',
                      color: '#F8F8F2',
                      fontFamily: "'Cascadia Code', 'Consolas', 'Monaco', 'Courier New', monospace",
                      fontSize: '14px',
                      lineHeight: 1.5,
                      border: `1px solid ${colors.gray200}`,
                      borderRadius: borderRadius.md,
                      resize: 'vertical',
                      outline: 'none',
                      overflowWrap: 'normal',
                      whiteSpace: 'pre',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                    }}
                    placeholder="Escribe o pega tu código HTML aquí..."
                    spellCheck="false"
                  />
                )}
              </>
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

        {/* Indicador de autoguardado */}
        {internalContent.length > 0 && (
          <div style={styles.autoSaveIndicator}>
            Guardado automático...
          </div>
        )}
      </div>

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
    </div>
  );
};

export default DualModeEditor;