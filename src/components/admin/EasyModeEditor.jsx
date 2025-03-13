// src/components/admin/EasyModeEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import EditorToolbar from './EasyModeToolbar';
import { convertToMarkdown, convertFromMarkdown, sanitizeHtml } from '../../utils/easyModeUtils';
import '../../styles/admin/easyModeStyles.css';

const EasyModeEditor = ({ content, onChange }) => {
  const editorRef = useRef(null);
  const [internalContent, setInternalContent] = useState('');
  const [selection, setSelection] = useState(null);

  // Convertir markdown a HTML enriquecido al iniciar o cuando cambia el contenido
  useEffect(() => {
    const htmlContent = convertFromMarkdown(content);
    setInternalContent(htmlContent);
  }, [content]);

  // Guardar selección actual
  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        setSelection(sel.getRangeAt(0));
      }
    }
  };

  // Restaurar selección guardada
  const restoreSelection = () => {
    if (selection && window.getSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(selection);
    }
  };

  // Manejar cambios en el contenido editable
  const handleContentChange = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      setInternalContent(htmlContent);
      
      // Convertir HTML a markdown para almacenar
      const markdownContent = convertToMarkdown(htmlContent);
      
      // Notificar al componente padre
      const event = {
        target: {
          name: 'content',
          value: markdownContent
        }
      };
      onChange(event);
    }
  };

  // Aplicar formato al texto seleccionado
  const applyFormat = (format) => {
    // Asegurar que tenemos el foco y restaurar selección
    editorRef.current.focus();
    if (selection) restoreSelection();

    // Ejecutar el comando de formato
    document.execCommand(format, false, null);
    
    // Actualizar el contenido
    handleContentChange();
    
    // Guardar la nueva selección
    saveSelection();
  };

  // Insertar elemento con datos adicionales
  const insertElement = (element, data = null) => {
    // Asegurar que tenemos el foco y restaurar selección
    editorRef.current.focus();
    if (selection) restoreSelection();

    switch (element) {
      case 'h1':
        document.execCommand('formatBlock', false, 'h1');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, 'h2');
        break;
      case 'h3':
        document.execCommand('formatBlock', false, 'h3');
        break;
      case 'paragraph':
        document.execCommand('formatBlock', false, 'p');
        break;
      case 'quote':
        document.execCommand('formatBlock', false, 'blockquote');
        break;
      case 'code':
        document.execCommand('formatBlock', false, 'pre');
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const codeElement = document.createElement('code');
          range.surroundContents(codeElement);
        }
        break;
      case 'link':
        const url = prompt('Introduce la URL del enlace:', 'https://');
        if (url) document.execCommand('createLink', false, url);
        break;
      case 'image':
        const imgUrl = data?.url || prompt('Introduce la URL de la imagen:', 'https://');
        if (imgUrl) {
          const imgHtml = `<img src="${imgUrl}" alt="${data?.alt || 'Imagen'}" style="max-width: 100%;">`;
          document.execCommand('insertHTML', false, imgHtml);
        }
        break;
      case 'color':
        const color = data || '#0b4444';
        document.execCommand('foreColor', false, color);
        break;
      case 'background':
        const bgColor = data || '#f0f8f7';
        document.execCommand('hiliteColor', false, bgColor);
        break;
      case 'emoji':
        if (data) document.execCommand('insertText', false, data);
        break;
      case 'divider':
        document.execCommand('insertHTML', false, '<hr style="border: none; height: 1px; background-color: #e1e4e8; margin: 1.5em 0;">');
        break;
      case 'table':
        const tableHtml = `
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
              <tr>
                <th style="border: 1px solid #d2b99a; padding: 8px; text-align: left; background-color: #f0f8f7;">Encabezado 1</th>
                <th style="border: 1px solid #d2b99a; padding: 8px; text-align: left; background-color: #f0f8f7;">Encabezado 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #d2b99a; padding: 8px;">Celda 1</td>
                <td style="border: 1px solid #d2b99a; padding: 8px;">Celda 2</td>
              </tr>
              <tr>
                <td style="border: 1px solid #d2b99a; padding: 8px;">Celda 3</td>
                <td style="border: 1px solid #d2b99a; padding: 8px;">Celda 4</td>
              </tr>
            </tbody>
          </table>
        `;
        document.execCommand('insertHTML', false, tableHtml);
        break;
      default:
        break;
    }
    
    // Actualizar el contenido
    handleContentChange();
    
    // Guardar la nueva selección
    saveSelection();
  };

  // Lista de acciones para la barra de herramientas
  const toolbarActions = {
    applyFormat,
    insertElement
  };

  // Estilos para el editor
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      border: `1px solid ${colors.gray200}`,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      boxShadow: shadows.sm,
      maxWidth: '960px',
      margin: '0 auto',
    },
    editor: {
      padding: spacing.md,
      height: '600px',
      width: '100%',
      outline: 'none',
      overflow: 'auto',
      fontSize: typography.fontSize.md,
      lineHeight: 1.6,
      color: colors.textPrimary,
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: colors.white,
      borderRadius: `0 0 ${borderRadius.md} ${borderRadius.md}`,
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
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
    <div style={styles.container}>
      <EditorToolbar 
        actions={toolbarActions} 
        onSelectionChange={saveSelection}
      />
      
      <div
        ref={editorRef}
        contentEditable={true}
        className="easy-mode-editor"
        style={styles.editor}
        onInput={handleContentChange}
        onBlur={() => saveSelection()}
        onMouseUp={() => saveSelection()}
        onKeyUp={() => saveSelection()}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(internalContent) }}
        data-placeholder="Comienza a escribir aquí... Usa la barra de herramientas para formatear tu texto"
      />

      {internalContent && (
        <div style={styles.autoSaveIndicator}>
          Guardado automático...
        </div>
      )}
    </div>
  );
};

export default EasyModeEditor;