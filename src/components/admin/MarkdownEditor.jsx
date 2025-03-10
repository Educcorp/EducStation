import React, { useRef } from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';
import EditorToolbar from './EditorToolbar';
import { insertMarkdown } from './utils/markdownUtils';

const MarkdownEditor = ({ content, onChange }) => {
  const textAreaRef = useRef(null);

  const handleInsertMarkdown = (markdownType, placeholder) => {
    const newContent = insertMarkdown(
      content,
      markdownType,
      placeholder,
      textAreaRef.current
    );
    
    // Simulamos un evento de cambio para actualizar el estado en el componente padre
    const event = {
      target: {
        name: 'content',
        value: newContent
      }
    };
    
    onChange(event);
  };

  const styles = {
    editorContainer: {
      position: 'relative'
    },
    textarea: {
      width: "100%",
      height: "500px",
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.md,
      fontFamily: "monospace",
      resize: "vertical",
      lineHeight: 1.5,
      maxWidth: "100%", // Asegura que el texto no sobrepase el ancho
      overflowWrap: "break-word", // Asegura que el texto salte de línea
      whiteSpace: "pre-wrap" // Mantiene los saltos de línea pero permite el ajuste automático
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
    }
  };

  return (
    <div style={styles.editorContainer}>
      <EditorToolbar onInsertMarkdown={handleInsertMarkdown} />
      
      <textarea
        ref={textAreaRef}
        id="content-editor"
        name="content"
        value={content}
        onChange={onChange}
        style={styles.textarea}
        placeholder="Escribe tu post en formato Markdown..."
      ></textarea>

      {/* Indicador de autoguardado */}
      {content.length > 0 && (
        <div style={styles.autoSaveIndicator}>
          Guardado automático...
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;