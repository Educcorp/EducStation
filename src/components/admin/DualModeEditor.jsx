// src/components/admin/DualModeEditor.jsx
import React, { useRef, useState, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import EditorToolbar from './EditorToolbar';
import { insertMarkdown, insertHTML } from './utils/editorUtils';
import MarkdownPreview from './MarkdownPreview';
import HTMLPreview from './HTMLPreview';

const DualModeEditor = ({ content, onChange, initialMode = 'markdown' }) => {
  const textAreaRef = useRef(null);
  const [mode, setMode] = useState(initialMode); // 'markdown' o 'html'
  const [activeTab, setActiveTab] = useState('code'); // 'code' o 'preview'
  const [internalContent, setInternalContent] = useState(content || '');

  // Detectar si el contenido es HTML y actualizar modo si es necesario
  useEffect(() => {
    // Detecta si el contenido parece ser HTML basado en tags comunes
    const hasHTMLStructure = /<(!DOCTYPE|html|head|body|div|p|h[1-6]|ul|ol|script|style)[^>]*>/i.test(content);
    if (hasHTMLStructure && mode !== 'html') {
      setMode('html');
    }
    
    // Actualizar contenido interno cuando cambia el contenido externo
    setInternalContent(content);
  }, [content, mode]);

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
  };

  const handleTextAreaChange = (e) => {
    setInternalContent(e.target.value);
    onChange(e);
  };

  const styles = {
    editorContainer: {
      position: 'relative',
      border: `1px solid ${colors.gray200}`,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      boxShadow: shadows.sm
    },
    editorHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${colors.gray200}`,
      backgroundColor: colors.gray100
    },
    modeToggle: {
      display: 'flex',
      alignItems: 'center',
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      gap: spacing.sm
    },
    modeButton: {
      padding: `${spacing.xs} ${spacing.md}`,
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: borderRadius.sm,
      cursor: 'pointer',
      fontSize: typography.fontSize.sm,
      transition: 'all 0.2s ease',
      color: colors.textSecondary
    },
    activeModeButton: {
      backgroundColor: colors.primary,
      color: colors.white
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
      borderBottom: '2px solid transparent'
    },
    activeTab: {
      color: colors.primary,
      borderBottom: `2px solid ${colors.primary}`
    },
    textarea: {
      width: '100%',
      height: '500px',
      padding: spacing.md,
      fontSize: typography.fontSize.md,
      fontFamily: 'monospace',
      resize: 'vertical',
      lineHeight: 1.5,
      border: 'none',
      outline: 'none',
      maxWidth: '100%',
      overflowWrap: 'break-word',
      whiteSpace: 'pre-wrap'
    },
    previewContainer: {
      height: '500px',
      padding: spacing.md,
      overflow: 'auto',
      backgroundColor: colors.white
    },
    autoSaveIndicator: {
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      backgroundColor: colors.primary,
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
      backgroundColor: mode === 'html' ? colors.secondary : colors.primaryLight,
      color: mode === 'html' ? colors.primary : colors.white,
      marginLeft: spacing.sm
    }
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
            Code
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'preview' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>
        
        <div style={styles.modeToggle}>
          <span>Modo:</span>
          <button
            style={{
              ...styles.modeButton,
              ...(mode === 'markdown' ? styles.activeModeButton : {})
            }}
            onClick={() => handleModeToggle('markdown')}
          >
            Markdown
          </button>
          <button
            style={{
              ...styles.modeButton,
              ...(mode === 'html' ? styles.activeModeButton : {})
            }}
            onClick={() => handleModeToggle('html')}
          >
            HTML
          </button>
          <span style={styles.modeBadge}>
            {mode === 'html' ? 'HTML' : 'MD'}
          </span>
        </div>
      </div>

      {activeTab === 'code' && (
        <>
          <EditorToolbar 
            onInsertMarkdown={handleToolbarAction} 
            mode={mode}
          />
          
          <textarea
            ref={textAreaRef}
            value={internalContent}
            onChange={handleTextAreaChange}
            style={styles.textarea}
            placeholder={mode === 'markdown' 
              ? "Escribe tu post en formato Markdown..." 
              : "Escribe código HTML aquí..."
            }
            spellCheck="false"
          />
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
  );
};

export default DualModeEditor;