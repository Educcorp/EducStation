// src/components/admin/ColorPicker.jsx
import React, { useState, useEffect } from 'react';
import Tooltip from '../ui/Tooltip';

const ColorPicker = ({ onSelectColor, onCloseColorPicker }) => {
  // Estado para colores guardados y el color actual
  const [savedColors, setSavedColors] = useState([
    '#91a8a4', '#0b4444', '#4c7977', '#f0f8f7', '#d2b99a'
  ]);
  const [currentColor, setCurrentColor] = useState('#0b4444');
  const [showSavedColors, setShowSavedColors] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Mostrar tooltip
  const showTooltip = (id) => {
    setActiveTooltip(id);
  };

  // Ocultar tooltip
  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  // Ya no necesitamos el efecto para rotar el ícono

  // Función para guardar un nuevo color
  const saveColor = () => {
    if (!savedColors.includes(currentColor)) {
      // Crear una copia del array actual sin mutar el estado original
      const newColors = [...savedColors];
      // Eliminar el color más antiguo si ya tenemos 5
      if (newColors.length >= 5) {
        newColors.shift();
      }
      // Añadir el nuevo color
      newColors.push(currentColor);
      setSavedColors(newColors);
      
      // Guardar en localStorage para persistencia
      try {
        localStorage.setItem('savedTextColors', JSON.stringify(newColors));
      } catch (e) {
        console.warn('No se pudo guardar colores en localStorage:', e);
      }
    }
  };

  // Función para seleccionar un color guardado
  const selectColor = (color) => {
    setCurrentColor(color);
    setShowSavedColors(false);
    // Aplicar el color al texto seleccionado
    onSelectColor(color);
  };

  // Cargar colores guardados desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedColors = localStorage.getItem('savedTextColors');
      // Si hay colores guardados, usarlos; de lo contrario, mantener los predeterminados
      if (storedColors) {
        const parsedColors = JSON.parse(storedColors);
        // Verificar que tengamos un array válido de colores
        if (Array.isArray(parsedColors) && parsedColors.length > 0) {
          setSavedColors(parsedColors);
        }
      }
    } catch (e) {
      console.warn('Error al cargar colores desde localStorage:', e);
      // En caso de error, asegurémonos de usar los colores predeterminados
      setSavedColors(['#91a8a4', '#0b4444', '#4c7977', '#f0f8f7', '#d2b99a']);
    }
  }, []);

  // Estilos para el componente
  const styles = {
    colorPickerContainer: {
      position: 'absolute',
      top: '100%',
      left: '0',
      marginTop: '5px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      padding: '10px',
      width: '220px',
      zIndex: 1002,
    },
    inputContainer: {
      marginBottom: '10px',
    },
    colorPreview: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '5px',
    },
    colorBox: {
      width: '30px',
      height: '30px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    hexValue: {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#555',
    },
    savedColorsContainer: {
      marginTop: '10px',
      display: showSavedColors ? 'block' : 'none',
    },
    savedColorsGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '5px',
      marginTop: '5px',
    },
    savedColorItem: {
      width: '25px',
      height: '25px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      cursor: 'pointer',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
    },
    button: {
      padding: '5px 10px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#2B579A',
      color: 'white',
      fontSize: '12px',
      cursor: 'pointer',
    },
    toggleButton: {
      padding: '5px 10px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#555',
      color: 'white',
      fontSize: '12px',
      cursor: 'pointer',
    },
    closeButton: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      color: '#777',
    },
  };

  return (
    <div style={styles.colorPickerContainer} onClick={(e) => e.stopPropagation()}>
      <button 
        style={styles.closeButton} 
        onClick={onCloseColorPicker}
        onMouseEnter={() => showTooltip('closeColorPicker')}
        onMouseLeave={hideTooltip}
      >
        ✕
        <Tooltip
          isVisible={activeTooltip === 'closeColorPicker'}
          text="Cerrar selector de color"
        />
      </button>
      
      <div style={styles.inputContainer}>
        <input 
          type="color" 
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          style={{ width: '100%', height: '30px', cursor: 'pointer' }}
        />
        <div style={styles.colorPreview}>
          <div 
            style={{
              ...styles.colorBox,
              backgroundColor: currentColor
            }}
          ></div>
          <span style={styles.hexValue}>{currentColor.toUpperCase()}</span>
        </div>
      </div>
      
      <div style={styles.buttonContainer}>
        <button 
          style={styles.button} 
          onClick={() => selectColor(currentColor)}
          onMouseEnter={() => showTooltip('applyColor')}
          onMouseLeave={hideTooltip}
        >
          Aplicar
          <Tooltip
            isVisible={activeTooltip === 'applyColor'}
            text="Aplicar este color"
          />
        </button>
        <button 
          style={styles.button} 
          onClick={saveColor}
          onMouseEnter={() => showTooltip('saveColor')}
          onMouseLeave={hideTooltip}
        >
          Guardar
          <Tooltip
            isVisible={activeTooltip === 'saveColor'}
            text="Guardar en memoria"
          />
        </button>
        <button 
          style={styles.toggleButton}
          onClick={() => setShowSavedColors(!showSavedColors)}
          onMouseEnter={() => showTooltip('toggleSaved')}
          onMouseLeave={hideTooltip}
        >
          Memoria
          <Tooltip
            isVisible={activeTooltip === 'toggleSaved'}
            text="Mostrar colores guardados"
          />
        </button>
      </div>
      
      <div style={styles.savedColorsContainer}>
        <div style={{ fontSize: '12px', color: '#555', marginBottom: '5px' }}>
          Colores guardados:
        </div>
        <div style={styles.savedColorsGrid}>
          {savedColors.map((color, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.savedColorItem,
                backgroundColor: color
              }}
              onClick={() => selectColor(color)}
              title={color}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;