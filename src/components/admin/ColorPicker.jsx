// src/components/admin/ColorPicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import Tooltip from '../ui/Tooltip';
import { borderRadius } from '../../styles/theme';
import CustomColorPicker from './CustomColorPicker';

const ColorPicker = ({ onSelectColor, onCloseColorPicker }) => {
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

// Estado para manejar el color pendiente de aplicar
const [pendingColor, setPendingColor] = useState(currentColor);

// Estado para mostrar u ocultar el botón flotante
const [showApplyButton, setShowApplyButton] = useState(false);

// Añadir estos estados para controlar mejor el selector de color
const [isColorPickerOpen, setIsColorPickerOpen] = useState(true);

// Añade esta referencia para el input de color
const colorInputRef = useRef(null);

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
    marginRight: '-10px', // Espacio entre el botón y el selector
    backgroundColor: 'none',
    borderRadius: '16px',
    boxShadow: 'none',
    padding: '0',
    width: '280px',
    zIndex: 1002,
    border: 'none',
    animation: 'fadeIn 0.3s ease',
  },
  inputContainer: {
    marginBottom: '16px',
    borderRadius: '12px',
    background: '#f5f7fa',
    padding: '18px 12px', // Aumentar el padding vertical
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Añadir justificación vertical
    width: '100%', // Asegurar que ocupa todo el ancho disponible
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
    width: '90%',
    textAlign: 'center',
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
    width: '100%', // Aumentar de 90% a 100% para aprovechar todo el ancho disponible
    height: '40px', 
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    padding: '0', // Eliminar padding para evitar desplazamientos
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05) inset',
    pointerEvents: 'auto', // Asegurar que los eventos del ratón funcionan
    touchAction: 'none', // Mejorar soporte táctil
    margin: '0 auto', // Centrar el elemento
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
    0% { box-shadow: 0 0 0 0 rgba(25, 68, 186, 0.5); }
    70% { box-shadow: 0 0 0 6px rgba(27, 79, 217, 0); }
    100% { box-shadow: 0 0 0 0 rgba(27, 79, 217, 0); }
  }
`;

// Manejar cambio de color en el input
const handleColorChange = (e) => {
  const newColor = e.target.value;
  setPendingColor(newColor); // Actualizar el color pendiente
};

// Manejar la apertura del botón flotante al hacer clic en la barra de selección de colores
const handleColorBarClick = () => {
  setIsColorPickerOpen(true);
  setShowApplyButton(true);
};

// Manejar el cierre del botón flotante
const handleCloseApplyButton = () => {
  setShowApplyButton(false);
};

// MODIFICADO: Eliminar la función handleColorPickerBlur que cerraba automáticamente el selector
// Ya no necesitamos esta función que cierra el selector al perder el foco

// Función para aplicar el color pendiente
const applyColor = () => {
  selectColor(pendingColor); // Aplicar el color pendiente
};

// MODIFICADO: Este useEffect ya no sincroniza el cierre del picker
useEffect(() => {
  if (!isColorPickerOpen) {
    // Si el selector se cierra externamente (por el botón de cerrar),
    // cerrar también el botón flotante
    setShowApplyButton(false);
  }
}, [isColorPickerOpen]);

// MODIFICADO: Eliminar el efecto que detectaba clics fuera del selector
// Esta función era la que cerraba el selector al hacer clic fuera

// Añade este efecto para abrir automáticamente el selector
useEffect(() => {
  // Pequeña espera para asegurar que todo está renderizado
  const timer = setTimeout(() => {
    if (colorInputRef.current) {
      colorInputRef.current.focus();
      colorInputRef.current.click(); // Esto intenta abrir el selector de color
      setIsColorPickerOpen(true);
      setShowApplyButton(true);
    }
  }, 300);
  
  return () => clearTimeout(timer);
}, []);

// MODIFICADO: Este efecto ahora solo controla la apertura, no el cierre
useEffect(() => {
  // Función que abre el selector de color
  const openColorPicker = () => {
    if (colorInputRef.current) {
      colorInputRef.current.focus();
      colorInputRef.current.click(); // Intenta abrir el selector de color nativo
      setIsColorPickerOpen(true);
      setShowApplyButton(true);
    }
  };

  // Abrir el selector cuando se monte el componente
  const timer = setTimeout(openColorPicker, 300);
  
  // Suscribirse al evento de visibilidad para detectar cuando la pestaña se activa
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      openColorPicker();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // También reabrir cuando el componente recibe foco
  window.addEventListener('focus', openColorPicker);
  
  return () => {
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', openColorPicker);
  };
}, []);

// Añadir este nuevo método al componente para poder reabrirlo manualmente si es necesario
const reopenColorPicker = () => {
  if (colorInputRef.current) {
    colorInputRef.current.focus();
    colorInputRef.current.click();
    setIsColorPickerOpen(true);
    setShowApplyButton(true);
  }
};

// Función específica para abrir el selector al hacer clic en cualquier parte
const handleContainerClick = () => {
  reopenColorPicker();
};

// NUEVO: Función para manejar el cierre explícito del selector
const handleCloseColorPicker = () => {
  // Solo cerramos cuando el usuario lo indica explícitamente
  setIsColorPickerOpen(false);
  
  // Si hay una función de cierre proporcionada, la llamamos
  if (typeof onCloseColorPicker === 'function') {
    onCloseColorPicker();
  }
};

return (
  <>
    {/* Estilos CSS para animaciones */}
    <style>{cssAnimation}</style>
    
    <div 
      style={styles.colorPickerContainer} 
      onClick={(e) => {
        // Evitar que los clics se propaguen fuera del contenedor
        e.stopPropagation();
        handleContainerClick();
      }} 
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="color-picker-container"
    >
      <CustomColorPicker 
        initialColor={pendingColor}
        onSelectColor={(color) => {
          setPendingColor(color);
          // Aplicar el color inmediatamente al texto
          if (typeof onSelectColor === 'function') {
            onSelectColor(color);
          }
          // Guardar en localStorage
          try {
            localStorage.setItem('lastUsedTextColor', color);
          } catch (e) {
            console.warn('No se pudo guardar el último color usado:', e);
          }
        }}
        onClose={handleCloseColorPicker} // Usar nuestra función de cierre explícito
        keepOpenUntilSubmit={true} // NUEVO: Propiedad para indicar que se mantenga abierto
      />
    </div>
  </>
);
};

export default ColorPicker;