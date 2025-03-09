// src/components/admin/EditorToolbar.jsx
import React, { useState, useEffect } from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';
import Tooltip from '../ui/Tooltip';

const EditorToolbar = ({ onInsertMarkdown, mode = 'markdown' }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [currentMode, setCurrentMode] = useState(mode);

  // Detectar cambios en el modo y actualizarse
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  // Mostrar tooltip
  const showTooltip = (id) => {
    setActiveTooltip(id);
  };

  // Ocultar tooltip
  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  const styles = {
    toolbarContainer: {
      display: "flex",
      gap: spacing.xs,
      flexWrap: "wrap",
      padding: spacing.sm,
      backgroundColor: colors.gray100,
      borderRadius: `${borderRadius.md} ${borderRadius.md} 0 0`,
      marginBottom: "-1px",
      boxShadow: "0 -1px 3px rgba(0,0,0,0.05)",
      position: "sticky",
      top: 0,
      zIndex: 2
    },
    toolbarButton: {
      padding: spacing.sm,
      border: "none",
      backgroundColor: "transparent",
      color: colors.primary,
      borderRadius: borderRadius.sm,
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: typography.fontSize.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "36px",
      height: "36px",
      position: "relative"
    },
    toolbarButtonGroup: {
      display: "flex",
      borderRight: `1px solid ${colors.gray200}`,
      paddingRight: spacing.sm,
      marginRight: spacing.sm
    },
    modeIndicator: {
      position: "absolute",
      top: "5px",
      right: "5px",
      backgroundColor: colors.primary,
      color: colors.white,
      fontSize: typography.fontSize.xs,
      padding: "2px 4px",
      borderRadius: borderRadius.round,
      opacity: 0.7
    }
  };

  // Grupos de botones para modo Markdown
  const markdownGroups = [
    {
      id: 'headings',
      buttons: [
        { id: 'h1', label: 'Encabezado H1', text: 'H1', action: () => onInsertMarkdown('heading', 'Título principal') },
        { id: 'h2', label: 'Encabezado H2', text: 'H2', action: () => onInsertMarkdown('subheading', 'Subtítulo') }
      ]
    },
    {
      id: 'formatting',
      buttons: [
        { id: 'bold', label: 'Negrita', text: <strong>B</strong>, action: () => onInsertMarkdown('bold', 'texto en negrita') },
        { id: 'italic', label: 'Cursiva', text: <em>I</em>, action: () => onInsertMarkdown('italic', 'texto en cursiva') }
      ]
    },
    {
      id: 'media',
      buttons: [
        { id: 'link', label: 'Enlace', text: '🔗', action: () => onInsertMarkdown('link', 'texto del enlace') },
        { id: 'image', label: 'Imagen', text: '🖼️', action: () => onInsertMarkdown('image') }
      ]
    },
    {
      id: 'lists',
      buttons: [
        { id: 'list', label: 'Lista', text: '•', action: () => onInsertMarkdown('list') },
        { id: 'ordered', label: 'Lista numerada', text: '1.', action: () => onInsertMarkdown('ordered-list') }
      ]
    },
    {
      id: 'blocks',
      buttons: [
        { id: 'code', label: 'Bloque de código', text: '{ }', action: () => onInsertMarkdown('code', 'código aquí') },
        { id: 'quote', label: 'Cita', text: '""', action: () => onInsertMarkdown('quote', 'texto de la cita') },
        { id: 'table', label: 'Tabla', text: '⊞', action: () => onInsertMarkdown('table') }
      ]
    },
    {
      id: 'misc',
      buttons: [
        { id: 'divider', label: 'Separador', text: '―', action: () => onInsertMarkdown('divider') }
      ]
    }
  ];

  // Grupos de botones para modo HTML
  const htmlGroups = [
    {
      id: 'document',
      buttons: [
        { id: 'html-skeleton', label: 'Estructura HTML', text: '</>', action: () => onInsertMarkdown('html-skeleton') }
      ]
    },
    {
      id: 'headings',
      buttons: [
        { id: 'h1-html', label: 'H1', text: 'H1', action: () => onInsertMarkdown('heading', 'Título principal') },
        { id: 'h2-html', label: 'H2', text: 'H2', action: () => onInsertMarkdown('subheading', 'Subtítulo') },
        { id: 'h3-html', label: 'H3', text: 'H3', action: () => onInsertMarkdown('h3', 'Encabezado 3') }
      ]
    },
    {
      id: 'formatting',
      buttons: [
        { id: 'bold-html', label: 'Negrita', text: <strong>B</strong>, action: () => onInsertMarkdown('bold', 'texto en negrita') },
        { id: 'italic-html', label: 'Cursiva', text: <em>I</em>, action: () => onInsertMarkdown('italic', 'texto en cursiva') },
        { id: 'p-html', label: 'Párrafo', text: 'P', action: () => onInsertMarkdown('paragraph', 'Contenido del párrafo') }
      ]
    },
    {
      id: 'elements',
      buttons: [
        { id: 'div-html', label: 'Div', text: 'div', action: () => onInsertMarkdown('div') },
        { id: 'section-html', label: 'Sección', text: 'sec', action: () => onInsertMarkdown('section') }
      ]
    },
    {
      id: 'media',
      buttons: [
        { id: 'link-html', label: 'Enlace', text: '🔗', action: () => onInsertMarkdown('link', 'texto del enlace') },
        { id: 'image-html', label: 'Imagen', text: '🖼️', action: () => onInsertMarkdown('image') }
      ]
    },
    {
      id: 'lists',
      buttons: [
        { id: 'list-html', label: 'Lista', text: '•', action: () => onInsertMarkdown('list') },
        { id: 'ordered-html', label: 'Lista numerada', text: '1.', action: () => onInsertMarkdown('ordered-list') }
      ]
    },
    {
      id: 'blocks',
      buttons: [
        { id: 'code-html', label: 'Código', text: '{ }', action: () => onInsertMarkdown('code', 'código aquí') },
        { id: 'quote-html', label: 'Cita', text: '""', action: () => onInsertMarkdown('quote', 'texto de la cita') },
        { id: 'table-html', label: 'Tabla', text: '⊞', action: () => onInsertMarkdown('table') }
      ]
    },
    {
      id: 'scripting',
      buttons: [
        { id: 'style-html', label: 'Estilos CSS', text: 'CSS', action: () => onInsertMarkdown('style') },
        { id: 'script-html', label: 'Script JS', text: 'JS', action: () => onInsertMarkdown('script') }
      ]
    },
    {
      id: 'misc',
      buttons: [
        { id: 'divider-html', label: 'Separador', text: '―', action: () => onInsertMarkdown('divider') }
      ]
    }
  ];

  // Seleccionar los grupos según el modo
  const toolbarGroups = currentMode === 'markdown' ? markdownGroups : htmlGroups;

  return (
    <div style={styles.toolbarContainer}>
      <div style={styles.modeIndicator}>
        {currentMode === 'markdown' ? 'MD' : 'HTML'}
      </div>
      {toolbarGroups.map((group) => (
        <div key={group.id} style={styles.toolbarButtonGroup}>
          {group.buttons.map((button) => (
            <button
              key={button.id}
              style={styles.toolbarButton}
              onClick={button.action}
              onMouseEnter={() => showTooltip(button.id)}
              onMouseLeave={hideTooltip}
            >
              {button.text}
              <Tooltip
                isVisible={activeTooltip === button.id}
                text={button.label}
              />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EditorToolbar;