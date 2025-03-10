// src/components/admin/DualModeEditor.jsx
// Versión actualizada con resaltado de sintaxis

import React, { useRef, useState, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import EditorToolbar from './EditorToolbar';
import { insertMarkdown, insertHTML } from './utils/editorUtils';
import MarkdownPreview from './MarkdownPreview';
import HTMLPreview from './HTMLPreview';
import SyntaxHighlighter from './SyntaxHighlighter'; // Importamos el nuevo componente

const DualModeEditor = ({ content, onChange, initialMode = 'markdown' }) => {
  const textAreaRef = useRef(null);
  const [mode, setMode] = useState(initialMode); // 'markdown' o 'html'
  const [activeTab, setActiveTab] = useState('code'); // 'code' o 'preview'
  const [internalContent, setInternalContent] = useState(content || '');
  const [isHighlightingEnabled, setIsHighlightingEnabled] = useState(true);

  // Detectar si el contenido es HTML y actualizar modo si es necesario
  useEffect(() => {
    // Detecta si el contenido parece ser HTML basado en tags comunes
    const hasHTMLStructure = /<(!DOCTYPE|html|head|body|div|p|h[1-6]|ul|ol|script|style)[^>]*>/i.test(content);
    if (hasHTMLStructure && mode !== 'html') {
      setMode('html');
    }
    
    // Actualizar contenido interno cuando cambia el contenido externo
    setInternalContent(content || '');
  }, [content]);

  // Cuando el modo cambia, asegurarse de que el contenido interno esté actualizado
  useEffect(() => {
    // Cuando se cambia el modo, enfocar el editor para facilitar la edición inmediata
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [mode]);

  const handleToolbarAction = (actionType, placeholder) => {
    if (mode === 'markdown') {
      const newContent = insertMarkdown(
        internalContent,
        actionType,
        placeholder,
        textAreaRef.current
      );
      updateContent(newContent);
    } else {
      const newContent = insertHTML(
        internalContent,
        actionType,
        placeholder,
        textAreaRef.current
      );
      updateContent(newContent);
    }
  };

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

  const handleModeToggle = (newMode) => {
    // Al cambiar de modo, mantenemos el contenido pero cambiamos cómo se interpreta
    setMode(newMode);
    
    // También notificamos al componente padre sobre el cambio de modo
    const event = {
      target: {
        name: 'editorMode',
        value: newMode
      }
    };
    onChange(event);
  };

  const handleTextAreaChange = (e) => {
    setInternalContent(e.target.value);
    onChange(e);
  };

  // Toggle para activar/desactivar el resaltado de sintaxis
  const toggleSyntaxHighlighting = () => {
    setIsHighlightingEnabled(!isHighlightingEnabled);
  };

  // Colores oficiales para los modos
  const modeColors = {
    markdown: {
      background: '#2C3E50',
      text: '#FFFFFF',
      hoverBg: '#34495E',
      activeBg: '#0095FF', // Color azul del logo de Markdown
      activeText: '#FFFFFF',
      badge: {
        background: '#0095FF', // Color azul del logo de Markdown
        text: '#FFFFFF'
      }
    },
    html: {
      background: '#2C3E50',
      text: '#FFFFFF',
      hoverBg: '#34495E',
      activeBg: '#E34C26',
      activeText: '#FFFFFF',
      badge: {
        background: '#E34C26',
        text: '#FFFFFF'
      }
    }
  };

  // Estilos para el editor
  const styles = {
    editorContainer: {
      position: 'relative',
      border: `1px solid ${colors.gray200}`,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      boxShadow: shadows.sm,
      maxWidth: '960px', // Ancho máximo más generoso
      margin: '0 auto', // Centrado horizontal
    },
    editorHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${colors.gray200}`,
      backgroundColor: '#F8F9FA'
    },
    modeToggle: {
      display: 'flex',
      alignItems: 'center',
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      gap: spacing.sm
    },
    modeButton: (isActive, modeType) => ({
      padding: `${spacing.xs} ${spacing.md}`,
      backgroundColor: isActive ? 
        modeColors[modeType].activeBg : 
        modeColors[modeType].background,
      border: 'none',
      borderRadius: borderRadius.sm,
      cursor: 'pointer',
      fontSize: typography.fontSize.sm,
      transition: 'all 0.2s ease',
      color: isActive ? 
        modeColors[modeType].activeText : 
        modeColors[modeType].text,
      fontWeight: isActive ? typography.fontWeight.medium : typography.fontWeight.regular,
      boxShadow: isActive ? `0 2px 4px rgba(0,0,0,0.1)` : 'none',
      transform: isActive ? 'translateY(-2px)' : 'translateY(0)'
    }),
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
      transition: 'all 0.2s ease'
    },
    activeTab: {
      color: mode === 'markdown' ? '#0095FF' : '#E34C26',
      borderBottom: `2px solid ${mode === 'markdown' ? '#0095FF' : '#E34C26'}`
    },
    plainTextarea: {
      width: '100%',
      height: '600px',
      padding: spacing.md,
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
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
    },
    previewContainer: {
      width: '100%',
      height: '600px',
      padding: spacing.md,
      backgroundColor: '#f9fafb',
      border: `1px solid ${colors.gray200}`,
      borderRadius: borderRadius.md,
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'auto'
    },
    autoSaveIndicator: {
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      backgroundColor: mode === 'markdown' ? '#0095FF' : '#E34C26',
      color: colors.white,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.xs,
      opacity: 0.7
    },
    modeBadge: {
      display: 'inline-block',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.xs,
      backgroundColor: mode === 'html' ? 
        modeColors.html.badge.background : 
        modeColors.markdown.badge.background,
      color: mode === 'html' ? 
        modeColors.html.badge.text : 
        modeColors.markdown.badge.text,
      marginLeft: spacing.sm,
      fontWeight: typography.fontWeight.medium,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    editorContent: {
      backgroundColor: '#f9fafb',
      borderRadius: `0 0 ${borderRadius.md} ${borderRadius.md}`,
      padding: spacing.sm,
      border: 'none'
    },
    highlighterOptions: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      marginLeft: spacing.xl,
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
    })
  };

  return (
    <div style={styles.editorContainer}>
      <div style={styles.editorHeader}>
        <div style={styles.tabsContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'code' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('code')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img 
                src="/assets/images/icons/CODE_icon.png" 
                alt="Code" 
                style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} 
              />
              <span>Code</span>
            </div>
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'preview' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('preview')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img 
                src="/assets/images/icons/PREVIEW_icon.png" 
                alt="Preview" 
                style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} 
              />
              <span>Preview</span>
            </div>
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Opción para resaltado de sintaxis */}
          {activeTab === 'code' && (
            <div style={styles.highlighterOptions}>
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
                      backgroundColor: isHighlightingEnabled 
                        ? (mode === 'markdown' ? '#0095FF' : '#E34C26')
                        : colors.gray200
                    }}
                  >
                    <span style={styles.switchThumb(isHighlightingEnabled)} />
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div style={styles.modeToggle}>
            <span>Modo:</span>
            <button
              style={styles.modeButton(mode === 'markdown', 'markdown')}
              onClick={() => handleModeToggle('markdown')}
              onMouseEnter={(e) => {
                if (mode !== 'markdown') {
                  e.target.style.backgroundColor = modeColors.markdown.hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (mode !== 'markdown') {
                  e.target.style.backgroundColor = modeColors.markdown.background;
                }
              }}
            >
              Markdown
            </button>
            <button
              style={styles.modeButton(mode === 'html', 'html')}
              onClick={() => handleModeToggle('html')}
              onMouseEnter={(e) => {
                if (mode !== 'html') {
                  e.target.style.backgroundColor = modeColors.html.hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (mode !== 'html') {
                  e.target.style.backgroundColor = modeColors.html.background;
                }
              }}
            >
              HTML
            </button>
            <span style={styles.modeBadge}>
              {mode === 'html' ? 'HTML' : 'MD'}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.editorContent}>
        {activeTab === 'code' && (
          <>
            <EditorToolbar 
              onInsertMarkdown={handleToolbarAction} 
              mode={mode}
            />
            
            {/* Usar el componente de resaltado si está habilitado, o el textarea normal si no */}
            {isHighlightingEnabled ? (
              <SyntaxHighlighter
                content={internalContent}
                mode={mode}
                onChange={handleTextAreaChange}
                textAreaRef={textAreaRef}
              />
            ) : (
              <textarea
                ref={textAreaRef}
                value={internalContent}
                onChange={handleTextAreaChange}
                style={styles.plainTextarea}
                placeholder={mode === 'markdown' 
                  ? "Escribe tu post en formato Markdown..." 
                  : "Escribe código HTML aquí..."
                }
                spellCheck="false"
              />
            )}
          </>
        )}

        {activeTab === 'preview' && (
          <div style={styles.previewContainer}>
            {mode === 'markdown' ? (
              <MarkdownPreview content={internalContent} />
            ) : (
              <HTMLPreview htmlContent={internalContent} />
            )}
          </div>
        )}

        {internalContent.length > 0 && (
          <div style={styles.autoSaveIndicator}>
            Guardado automático...
          </div>
        )}
      </div>
    </div>
  );
};

export default DualModeEditor;