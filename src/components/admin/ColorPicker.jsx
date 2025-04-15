// src/components/admin/ColorPicker.jsx
import React, { useState, useEffect } from 'react';
import Tooltip from '../ui/Tooltip';
import { borderRadius } from '../../styles/theme';

const ColorPicker = ({ onSelectColor, onCloseColorPicker }) => {
// Estado para colores guardados y el color actual
const [savedColors, setSavedColors] = useState([
'#91a8a4', '#0b4444', '#4c7977', '#f0f8f7', '#d2b99a', '#3a6ea5', '#ff6b6b', '#ffe66d'
]);
// Intentar recuperar el último color usado desde localStorage
const [currentColor, setCurrentColor] = useState(() => {
try {
  const lastUsedColor = localStorage.getItem('lastUsedTextColor');
  return lastUsedColor || '#0b4444';
} catch (e) {
  return '#0b4444';
}
});
const [activeTooltip, setActiveTooltip] = useState(null);
const [animateColor, setAnimateColor] = useState(false);
const [justCopied, setJustCopied] = useState(false);

// Mostrar tooltip
const showTooltip = (id) => {
  setActiveTooltip(id);
};

// Ocultar tooltip
const hideTooltip = () => {
  setActiveTooltip(null);
};

// Función para manejar la tecla Enter en el selector de color
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    selectColor(currentColor);
  }
};

// Función para guardar automáticamente un nuevo color
const saveColor = (colorToSave) => {
  if (!savedColors.includes(colorToSave)) {
    // Crear una copia del array actual sin mutar el estado original
    const newColors = [...savedColors];
    // Eliminar el color más antiguo si ya tenemos 8
    if (newColors.length >= 8) {
      newColors.shift();
    }
    // Añadir el nuevo color
    newColors.push(colorToSave);
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
  // Animar el elemento de color actual
  setAnimateColor(true);
  setTimeout(() => setAnimateColor(false), 300);
  
  setCurrentColor(color);
  
  // Verificamos que la función onSelectColor existe antes de llamarla
  if (typeof onSelectColor === 'function') {
    // Llamar a onSelectColor directamente sin setTimeout
    onSelectColor(color);
  }
  
  // Guardar el color actual en localStorage para recordarlo
  try {
    localStorage.setItem('lastUsedTextColor', color);
  } catch (e) {
    console.warn('No se pudo guardar el último color usado:', e);
  }
  
  // Guardar automáticamente el color (excepto los predeterminados)
  const defaultColors = ['#91a8a4', '#0b4444', '#4c7977', '#f0f8f7', '#d2b99a', '#3a6ea5', '#ff6b6b', '#ffe66d'];
  if (!defaultColors.includes(color)) {
    saveColor(color);
  }
};

// Estado para mostrar el tooltip de copiado
const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

// Función para copiar el código hexadecimal al portapapeles
const copyHexColor = () => {
  navigator.clipboard.writeText(currentColor.toUpperCase())
    .then(() => {
      // Mostrar tooltip temporal
      setShowCopiedTooltip(true);
      setJustCopied(true);
      // Ocultar después de 3 segundos
      setTimeout(() => {
        setShowCopiedTooltip(false);
        setJustCopied(false);
      }, 2000);
    })
    .catch(err => {
      console.warn('Error al copiar color:', err);
    });
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
    setSavedColors(['#91a8a4', '#0b4444', '#4c7977', '#f0f8f7', '#d2b99a', '#3a6ea5', '#ff6b6b', '#ffe66d']);
  }
}, []);

// Función para obtener un color de texto contrastante para el fondo
const getContrastText = (bgColor) => {
  // Convertir hex a RGB
  const r = parseInt(bgColor.substring(1, 3), 16);
  const g = parseInt(bgColor.substring(3, 5), 16);
  const b = parseInt(bgColor.substring(5, 7), 16);
  
  // Calcular luminosidad
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Retornar blanco o negro según la luminosidad del color de fondo
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Estilos para el componente
const styles = {
  // 1. Añade este estilo al objeto styles dentro del componente ColorPicker
applyButton: {
  backgroundColor: '#4c7977',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  padding: '8px 14px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  marginTop: '16px',
  width: '100%',
  transition: 'all 0.2s ease',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
},

  colorPickerContainer: {
    position: 'absolute',
    top: '170%',
    right: '0%', // Posicionar a la izquierda del botón
    marginRight: '-130px', // Espacio entre el botón y el selector
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15), 0 2px 5px rgba(0, 0, 0, 0.1)',
    padding: '18px',
    width: '280px',
    zIndex: 1002,
    border: '1px solid rgba(200, 210, 220, 0.5)',
    backdropFilter: 'blur(10px)',
    animation: 'fadeIn 0.3s ease',
  },
  inputContainer: {
    marginBottom: '16px',
    borderRadius: '12px',
    background: '#f5f7fa',
    padding: '12px',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
  },
  colorPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    borderRadius: '10px',
    background: '#f0f8f7',
    padding: '10px 14px',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.01)',
    transition: 'all 0.3s ease',
    transform: animateColor ? 'scale(1.02)' : 'scale(1)',
  },
  colorBox: {
    position: 'absolute',
    top: '25%',
    right: '112%', // Posicionar a la izquierda del botón
    marginRight: '-130px',
    width: '28px',
    height: '28px',
    borderRadius: '20px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.49)',
    transition: 'all 0.3s ease',
    transform: animateColor ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
  }, 
  hexValue: {
    fontFamily: 'monospace',
    fontSize: '15px',
    color: '#333',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    transform: justCopied ? 'scale(1.1)' : 'scale(1)',
  },
  colorLabel: {
    fontSize: '14px',
    color: '#444',
    marginRight: '10px',
    fontWeight: '500',
  },
  colorSelectLabel: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'block',
  },
  copyTooltip: {
    position: 'absolute',
    top: '-30px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    pointerEvents: 'none',
    zIndex: 1005,
    animation: 'fadeIn 0.2s ease',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  savedColorsContainer: {
    marginTop: '8px',
    padding: '14px',
    borderRadius: '14px',
    backgroundColor: '#f5f7fa',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(200, 210, 220, 0.3)',
  },
  savedColorsLabel: {
    fontSize: '14px', 
    color: '#333', 
    marginBottom: '10px',
    fontWeight: '600',
    borderBottom: '1px solid rgba(200, 210, 220, 0.5)',
    paddingBottom: '5px',
  },
  savedColorsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '8px',
    justifyContent: 'center',
  },
  savedColorItem: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
  },
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  copyButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#555',
    padding: '3px 6px',
    marginLeft: '6px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    opacity: justCopied ? 0.5 : 1,
  },
  colorInput: {
    width: '100%', 
    height: '40px', 
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    padding: '3px',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05) inset',
    pointerEvents: 'auto', // Asegurar que los eventos del ratón funcionan
    touchAction: 'none', // Mejorar soporte táctil
  },
};

// Estilos para animaciones
const cssAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes colorPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes borderPulse {
    0% { box-shadow: 0 0 0 0 rgba(27, 79, 217, 0.5); }
    70% { box-shadow: 0 0 0 6px rgba(27, 79, 217, 0); }
    100% { box-shadow: 0 0 0 0 rgba(27, 79, 217, 0); }
  }
`;

// Manejar cambio de color en el input
const handleColorChange = (e) => {
  const newColor = e.target.value;
  setCurrentColor(newColor);
  // No aplicamos el color inmediatamente, solo actualizamos la visualización
  // Esto permite manipular el selector sin interferir con la selección de texto
};

return (
  <>
    {/* Estilos CSS para animaciones */}
    <style>{cssAnimation}</style>
    
    <div 
      style={styles.colorPickerContainer} 
      onClick={(e) => e.stopPropagation()} 
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="color-picker-container"
    >
      <button 
        style={styles.closeButton} 
        onClick={onCloseColorPicker}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e0e0e0';
          e.currentTarget.style.transform = 'scale(1.1)';
          showTooltip('closeColorPicker');
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f0f0';
          e.currentTarget.style.transform = 'scale(1)';
          hideTooltip();
        }}
      >
        ✕
        <Tooltip
          isVisible={activeTooltip === 'closeColorPicker'}
          text="Cerrar selector de color"
        />
      </button>
      
      <div style={styles.inputContainer}>
        <div style={styles.colorSelectLabel}>Seleccionar color:</div>
        <input 
          type="color" 
          value={currentColor}
          onChange={handleColorChange}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onBlur={(e) => selectColor(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.colorInput}
        />
        <div style={styles.colorPreview}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={styles.colorLabel}>‎   Color actual:</span>
            <div 
              style={{
                ...styles.colorBox,
                backgroundColor: currentColor
              }}
            ></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={styles.hexValue}>{currentColor.toUpperCase()}</span>
            <button 
              onClick={copyHexColor}
              style={styles.copyButton}
              title="Copiar código de color"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {justCopied ? '✓' : '     ❏ '}
              {showCopiedTooltip && (
                <div style={styles.copyTooltip}>
                  ¡Copiado!
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Colores guardados mejorados visualmente */}
      <div style={styles.savedColorsContainer}>
        <div style={styles.savedColorsLabel}>
          Colores guardados:
        </div>
        <div style={styles.savedColorsGrid}>
          {savedColors.map((color, idx) => {
            const contrastText = getContrastText(color);
            return (
              <div 
                key={idx} 
                style={{
                  ...styles.savedColorItem,
                  backgroundColor: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  selectColor(color);
                }}
                title={color}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.12)';
                  e.currentTarget.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.1)';
                }}
              >
                {currentColor === color && (
                  <span style={{ color: contrastText, fontSize: '20px' }}>✓</span>
                )}
              </div>

            );

            
          })}
          
          <button 
            style={styles.applyButton}
            onClick={() => selectColor(currentColor)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3a6ea5';
              e.currentTarget.style.transform = 'scale(1.02)';
              showTooltip('applyColor');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4c7977';
              e.currentTarget.style.transform = 'scale(1)';
              hideTooltip();
            }}
          >
            Aplicar color <span style={{fontSize: '16px'}}>✓</span>
            <Tooltip
              isVisible={activeTooltip === 'applyColor'}
              text="Aplicar este color"
            />
          </button>
          
        </div>
      </div>
    </div>
  </>
);
};

export default ColorPicker;