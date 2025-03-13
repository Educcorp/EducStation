// src/components/admin/EditorModeSelector.jsx
import React from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';

const EditorModeSelector = ({ currentMode, onModeChange }) => {
  // Estilos simples para el selector
  const styles = {
    container: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      border: '1px solid #eee'
    },
    title: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: colors ? colors.primary : '#0b4444',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    modesContainer: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    modeButton: (isActive) => ({
      padding: '10px 15px',
      borderRadius: '4px',
      border: isActive ? '2px solid #4c7977' : '1px solid #ccc',
      backgroundColor: isActive ? '#f0f8f7' : '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: isActive ? 'bold' : 'normal'
    }),
    modeIcon: {
      marginRight: '8px',
      fontSize: '16px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <span style={{ fontSize: '18px' }}>🎮</span> Modo de Edición
      </div>
      
      <div style={styles.modesContainer}>
        <button
          style={styles.modeButton(currentMode === 'easy')}
          onClick={() => onModeChange('easy')}
        >
          <span style={styles.modeIcon}>✨</span>
          Modo Fácil
        </button>
        
        <button
          style={styles.modeButton(currentMode === 'markdown')}
          onClick={() => onModeChange('markdown')}
        >
          <span style={styles.modeIcon}>📝</span>
          Markdown
        </button>
        
        <button
          style={styles.modeButton(currentMode === 'html')}
          onClick={() => onModeChange('html')}
        >
          <span style={styles.modeIcon}>&lt;/&gt;</span>
          HTML
        </button>
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '10px',
        fontStyle: 'italic'
      }}>
        <strong>Sugerencia:</strong> El modo fácil es ideal para principiantes. Usa Markdown o HTML para más control.
      </div>
    </div>
  );
};

export default EditorModeSelector;