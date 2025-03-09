import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';
import Tooltip from '../ui/Tooltip';

const EditorToolbar = ({ onInsertMarkdown }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

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
    }
  };

  const toolbarGroups = [
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
        { id: 'image', label: 'Imagen local', text: '🖼️', action: () => onInsertMarkdown('image') },
        { id: 'extImg', label: 'Imagen externa', text: '🌐', action: () => onInsertMarkdown('externalImage') },
        { id: 'gif', label: 'Insertar GIF', text: '🎬', action: () => onInsertMarkdown('gif') }
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
        { id: 'html', label: 'HTML', text: '</>', action: () => onInsertMarkdown('html', 'Contenido HTML') },
        { id: 'divider', label: 'Separador', text: '―', action: () => onInsertMarkdown('divider') }
      ]
    }
  ];

  return (
    <div style={styles.toolbarContainer}>
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