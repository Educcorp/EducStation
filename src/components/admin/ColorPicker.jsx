// src/components/admin/ColorPicker.jsx
import React, { useState, useEffect } from 'react';
import Tooltip from '../ui/Tooltip';
import { borderRadius } from '../../styles/theme';

const ColorPicker = ({ onSelectColor, onCloseColorPicker }) => {
// Estado para colores guardados y el color actual
const [savedColors, setSavedColors] = useState([
'#91a8a4', '#0b4444', '#4c7977', '#f0f8f7', '#d2b99a'
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
  // Eliminar el color más antiguo si ya tenemos 5
  if (newColors.length >= 5) {
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
setCurrentColor(color);
// Aplicar el color al texto seleccionado
onSelectColor(color);
// Guardar el color actual en localStorage para recordarlo
try {
  localStorage.setItem('lastUsedTextColor', color);
} catch (e) {
  console.warn('No se pudo guardar el último color usado:', e);
}
// Guardar automáticamente el color (excepto los predeterminados)
const defaultColors = ['#91a8a4', '#0b4444', '#4c7977', '#f0f8f7', '#d2b99a'];
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
    // Ocultar después de 3 segundos
    setTimeout(() => {
      setShowCopiedTooltip(false);
    }, 3000);
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
  borderRadius: '20px',
},
colorPreview: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '5px',
  borderRadius: '20px',
},
colorBox: {
  width: '30px',
  height: '30px',
  borderRadius: '4px',
  borderRadius: '20px',
},  
hexValue: {
  fontFamily: 'monospace',
  fontSize: '12px',
  color: '#555',
},
colorLabel: {
  fontSize: '12px',
  color: '#555',
  marginRight: '8px',
},
copyTooltip: {
  position: 'absolute',
  top: '-30px',
  right: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  pointerEvents: 'none',
  zIndex: 1005,
  opacity: 1,
  transform: 'translateY(0)',
  transition: 'opacity 0.3s, transform 0.3s',
},
savedColorsContainer: {
  marginTop: '1px',
  marginBottom: '10px',
  padding: '5px',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
},
savedColorsLabel: {
  fontSize: '12px', 
  color: '#555', 
  marginBottom: '5px',
  borderRadius: '20px',
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
  border: 'none', // Quitar el borde gris aquí también
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
  backgroundColor: '#1b4fd9',
  color: 'white',
  fontSize: '12px',
  cursor: 'pointer',
  width: '48%',
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
      onKeyPress={handleKeyPress}
      style={{ 
        width: '95%', 
        height: '28px', 
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: '10px',
        borderRadius: '2px',
        border: '10px',
        outline: '1px',
        padding: '0px'
      }} 
    />
    <div style={styles.colorPreview}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={styles.colorLabel}>Color actual:</span>
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
        >
          ❏
          {showCopiedTooltip && (
            <div style={styles.copyTooltip}>
              ¡Copiado!
            </div>
          )}
        </button>
      </div>
    </div>
  </div>
  
  {/* Colores guardados siempre visibles, arriba de los botones */}
  <div style={styles.savedColorsContainer}>
    <div style={styles.savedColorsLabel}>
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
      onClick={() => saveColor(currentColor)}
      onMouseEnter={() => showTooltip('saveColor')}
      onMouseLeave={hideTooltip}
    >
      Guardar
      <Tooltip
        isVisible={activeTooltip === 'saveColor'}
        text="Guardar en memoria"
      />
    </button>
  </div>
</div>
);
};

export default ColorPicker;