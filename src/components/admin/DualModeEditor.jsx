// src/components/admin/DualModeEditor.jsx
import React, { useRef, useState, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import EditorToolbar from './EditorToolbar';
import { insertMarkdown, insertHTML } from './utils/editorUtils';
import MarkdownPreview from './MarkdownPreview';
import HTMLPreview from './HTMLPreview';
import SyntaxHighlighter from './SyntaxHighlighter';
import SimpleEditor from './SimpleEditor'; // New component we'll create

const DualModeEditor = ({ content, onChange, initialMode = 'simple' }) => {
  const textAreaRef = useRef(null);
  const [mode, setMode] = useState('simple'); // Always start with 'simple' mode, regardless of initialMode
  const [devSubMode, setDevSubMode] = useState('markdown'); // 'markdown' or 'html' for developer mode
  const [activeTab, setActiveTab] = useState('code'); // Only used in developer mode
  const [internalContent, setInternalContent] = useState(content || '');
  const [isHighlightingEnabled, setIsHighlightingEnabled] = useState(true);
  const [simpleContent, setSimpleContent] = useState(content || '');

  // Detect if content is HTML and update mode if necessary
  useEffect(() => {
    // Detect if the content appears to be HTML based on common tags
    const hasHTMLStructure = /<(!DOCTYPE|html|head|body|div|p|h[1-6]|ul|ol|script|style)[^>]*>/i.test(content);
    
    if (hasHTMLStructure && mode === 'developer') {
      setDevSubMode('html');
    }
    
    // Update internal content when external content changes
    setInternalContent(content || '');
    setSimpleContent(content || '');
  }, [content]);

  // Handle toolbar actions for developer mode
  const handleToolbarAction = (actionType, placeholder) => {
    if (mode === 'simple') {
      // For simple mode, we'll handle this differently
      return;
    }
    
    if (devSubMode === 'markdown') {
      const newContent = insertMarkdown(
        internalContent,
        actionType,
        placeholder,
        textAreaRef.current
      );
      updateContent(newContent);
    } else if (devSubMode === 'html') {
      const newContent = insertHTML(
        internalContent,
        actionType,
        placeholder,
        textAreaRef.current
      );
      updateContent(newContent);
    }
  };

  // Update content based on current mode
  const updateContent = (newContent) => {
    setInternalContent(newContent);
    
    // Notify parent component about the change
    const event = {
      target: {
        name: 'content',
        value: newContent
      }
    };
    onChange(event);
  };

  // Handle mode toggle between developer and simple
  const handleModeToggle = (newMode) => {
    setMode(newMode);
    
    // Reset tabs to code view when switching to developer mode
    if (newMode === 'developer') {
      setActiveTab('code');
    }
    
    // Notify parent component about the mode change
    const event = {
      target: {
        name: 'editorMode',
        value: newMode === 'developer' ? devSubMode : 'simple'
      }
    };
    onChange(event);
  };

  // Handle submode toggle between markdown and html in developer mode
  const handleDevSubModeToggle = (newSubMode) => {
    setDevSubMode(newSubMode);
    
    // Notify parent component about the mode change
    const event = {
      target: {
        name: 'editorMode',
        value: newSubMode
      }
    };
    onChange(event);
  };

  // Handle text area changes
  const handleTextAreaChange = (e) => {
    setInternalContent(e.target.value);
    onChange(e);
  };

  // Handle simple editor content changes
  const handleSimpleContentChange = (newContent) => {
    setSimpleContent(newContent);
    
    // Notify parent component about the change
    const event = {
      target: {
        name: 'content',
        value: newContent
      }
    };
    onChange(event);
  };

  // Toggle syntax highlighting
  const toggleSyntaxHighlighting = () => {
    setIsHighlightingEnabled(!isHighlightingEnabled);
  };

  // Colors for the modes
  const modeColors = {
    developer: {
      background: '#2C3E50',
      text: '#FFFFFF',
      hoverBg: '#34495E',
      activeBg: '#0095FF',
      activeText: '#FFFFFF',
      badge: {
        background: '#0095FF',
        text: '#FFFFFF'
      }
    },
    simple: {
      background: '#2C3E50',
      text: '#FFFFFF',
      hoverBg: '#34495E',
      activeBg: '#4CAF50',
      activeText: '#FFFFFF',
      badge: {
        background: '#4CAF50',
        text: '#FFFFFF'
      }
    }
  };

  // Styles for the editor
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
      backgroundColor: '#F8F9FA'
    },
    modeToggle: {
      display: 'flex',
      alignItems: 'center',
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      gap: spacing.sm,
      marginLeft: spacing.md
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
    devSubModeToggle: {
      display: 'flex',
      alignItems: 'center',
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      gap: spacing.sm,
      marginLeft: spacing.md
    },
    devSubModeButton: (isActive, subModeType) => ({
      padding: `${spacing.xs} ${spacing.md}`,
      backgroundColor: isActive ? 
        (subModeType === 'markdown' ? '#0095FF' : '#E34C26') : 
        '#2C3E50',
      border: 'none',
      borderRadius: borderRadius.sm,
      cursor: 'pointer',
      fontSize: typography.fontSize.sm,
      transition: 'all 0.2s ease',
      color: isActive ? '#FFFFFF' : '#FFFFFF',
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
      color: devSubMode === 'markdown' ? '#0095FF' : devSubMode === 'html' ? '#E34C26' : '#4CAF50',
      borderBottom: `2px solid ${devSubMode === 'markdown' ? '#0095FF' : devSubMode === 'html' ? '#E34C26' : '#4CAF50'}`
    },
    editorContent: {
      backgroundColor: '#f9fafb',
      borderRadius: `0 0 ${borderRadius.md} ${borderRadius.md}`,
      padding: spacing.sm,
      border: 'none'
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
      backgroundColor: mode === 'developer' ? 
        (devSubMode === 'markdown' ? '#0095FF' : '#E34C26') : 
        '#4CAF50',
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
      backgroundColor: mode === 'developer' ? 
        (devSubMode === 'markdown' ? modeColors.developer.badge.background : '#E34C26') : 
        modeColors.simple.badge.background,
      color: mode === 'developer' ? 
        modeColors.developer.badge.text : 
        modeColors.simple.badge.text,
      marginLeft: spacing.sm,
      fontWeight: typography.fontWeight.medium,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginRight: spacing.lg
    },
    highlighterOptions: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      marginLeft: spacing.md
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
    // For simple mode editor
    simpleEditorContainer: {
      height: '600px',
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
      padding: 0,
      overflow: 'auto'
    }
  };

  return (
    <div style={styles.editorContainer}>
      <div style={styles.editorHeader}>
        {/* Mode selection toggle */}
        <div style={styles.modeToggle}>
          <span>Modo:</span>
          <button
            style={styles.modeButton(mode === 'simple', 'simple')}
            onClick={() => handleModeToggle('simple')}
          >
            Simple
          </button>
          <button
            style={styles.modeButton(mode === 'developer', 'developer')}
            onClick={() => handleModeToggle('developer')}
          >
            Desarrollador
          </button>
          
          {/* Developer submode toggle (only shown in developer mode) */}
          {mode === 'developer' && (
            <div style={styles.devSubModeToggle}>
              <button
                style={styles.devSubModeButton(devSubMode === 'markdown', 'markdown')}
                onClick={() => handleDevSubModeToggle('markdown')}
              >
                Markdown
              </button>
              <button
                style={styles.devSubModeButton(devSubMode === 'html', 'html')}
                onClick={() => handleDevSubModeToggle('html')}
              >
                HTML
              </button>
            </div>
          )}
          
          {/* Current mode badge */}
          <span style={styles.modeBadge}>
            {mode === 'developer' ? 
              (devSubMode === 'markdown' ? 'MD' : 'HTML') : 
              'Simple'}
          </span>
        </div>
        
        {/* Developer mode tabs (only shown in developer mode) */}
        {mode === 'developer' && (
          <div style={styles.tabsContainer}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'code' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('code')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                <span>Preview</span>
              </div>
            </button>
            
            {/* Syntax highlighting toggle (only shown in code tab) */}
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
                          ? (devSubMode === 'markdown' ? '#0095FF' : '#E34C26')
                          : colors.gray200
                      }}
                    >
                      <span style={styles.switchThumb(isHighlightingEnabled)} />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={styles.editorContent}>
        {/* Developer Mode */}
        {mode === 'developer' && (
          <>
            {activeTab === 'code' && (
              <>
                <EditorToolbar 
                  onInsertMarkdown={handleToolbarAction} 
                  mode={devSubMode}
                />
                
                {isHighlightingEnabled ? (
                  <SyntaxHighlighter
                    content={internalContent}
                    mode={devSubMode}
                    onChange={handleTextAreaChange}
                    textAreaRef={textAreaRef}
                  />
                ) : (
                  <textarea
                    ref={textAreaRef}
                    value={internalContent}
                    onChange={handleTextAreaChange}
                    style={styles.plainTextarea}
                    placeholder={devSubMode === 'markdown' 
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
                {devSubMode === 'markdown' ? (
                  <MarkdownPreview content={internalContent} />
                ) : (
                  <HTMLPreview htmlContent={internalContent} />
                )}
              </div>
            )}
          </>
        )}
        
        {/* Simple Mode */}
        {mode === 'simple' && (
          <div style={styles.simpleEditorContainer}>
            <SimpleEditor 
              content={simpleContent}
              onChange={handleSimpleContentChange}
            />
          </div>
        )}

        {/* Auto-save indicator */}
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