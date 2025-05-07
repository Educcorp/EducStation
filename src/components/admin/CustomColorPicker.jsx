// CustomColorPicker.jsx
import React, { useState, useEffect, useRef } from 'react';

const CustomColorPicker = ({ initialColor = '#0b4444', onSelectColor, onClose, keepOpenUntilSubmit = false }) => {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [hsv, setHsv] = useState({ h: 0, s: 0, v: 0 }); // Inicializar en 0 para evitar colores por defecto
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Bandera para controlar la inicialización
  
  const colorPaletteRef = useRef(null);
  const hueSelectorRef = useRef(null);
  const thumbRef = useRef(null);
  const hueThumbRef = useRef(null);
  const pickerContainerRef = useRef(null); // Referencia al contenedor principal
  
  // Efecto para inicialización única al montar
  useEffect(() => {
    const rgbColor = hexToRgb(initialColor);
    const hsvColor = rgbToHsv(rgbColor.r, rgbColor.g, rgbColor.b);
    setRgb(rgbColor);
    setHsv(hsvColor);
    setIsInitialized(true);
  }, [initialColor]); // Solo depende de initialColor

  // Actualizar RGB y hex cuando HSV cambia por interacción del usuario
  useEffect(() => {
    if (isInitialized) {
      const rgbColor = hsvToRgb(hsv.h, hsv.s, hsv.v);
      setRgb(rgbColor);
      const hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
      
      // Solo actualizar si realmente cambió para evitar ciclos
      if (hexColor !== selectedColor) {
        setSelectedColor(hexColor);
      }
    }
  }, [hsv, isInitialized]);

  // Función para convertir hex a RGB
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // RGB a Hex
  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // RGB a HSV
  const rgbToHsv = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  // HSV a RGB
  const hsvToRgb = (h, s, v) => {
    h /= 360;
    s /= 100;
    v /= 100;

    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
      default: r = v; g = t; b = p;
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // MODIFICADO: Añadir esta función para manejar los clics fuera del componente
  useEffect(() => {
    // Solo si queremos mantenerlo abierto hasta que se confirme
    if (!keepOpenUntilSubmit) return;

    const handleOutsideClick = (e) => {
      // No hacer nada si el clic fue dentro del componente
      if (pickerContainerRef.current && pickerContainerRef.current.contains(e.target)) {
        return;
      }
      
      // No cerrar automáticamente, dejar que el clic se propague
      e.stopPropagation();
    };

    // Agregar listener global
    document.addEventListener('mousedown', handleOutsideClick);
    
    // Eliminar listener al desmontar
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [keepOpenUntilSubmit]);

  // Manejar clic y arrastre en la paleta de colores
  const handleColorPaletteMouseDown = (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto
    setIsDragging(true);
    updateColorFromPosition(e);
    
    // Capturar eventos globales para permitir arrastrar fuera del componente
    document.addEventListener('mousemove', handleColorPaletteMouseMove);
    document.addEventListener('mouseup', handleColorPaletteMouseUp);
  };

  const handleColorPaletteMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault(); // Prevenir comportamiento por defecto durante el arrastre
      updateColorFromPosition(e);
      
      // Aplicar el color en tiempo real durante el arrastre
      if (onSelectColor) {
        const currentRgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
        const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
        onSelectColor(currentHex);
      }
    }
  };

  const handleColorPaletteMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleColorPaletteMouseMove);
    document.removeEventListener('mouseup', handleColorPaletteMouseUp);
  };

  // Calcular el color basado en la posición del clic
  const updateColorFromPosition = (e) => {
    if (colorPaletteRef.current) {
      const rect = colorPaletteRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      
      const saturation = (x / rect.width) * 100;
      const value = 100 - (y / rect.height) * 100;
      
      setHsv({ ...hsv, s: saturation, v: value });
    }
  };

  // Manejar cambio en el selector de tono (hue)
  const handleHueChange = (e) => {
    if (hueSelectorRef.current) {
      const rect = hueSelectorRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const hue = Math.round((x / rect.width) * 360);
      setHsv({ ...hsv, h: hue });
    }
  };

  const handleHueMouseDown = (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto
    setIsDragging(true);
    handleHueChange(e);
    
    document.addEventListener('mousemove', handleHueMouseMove);
    document.addEventListener('mouseup', handleHueMouseUp);
  };

  const handleHueMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault(); // Prevenir comportamiento por defecto
      handleHueChange(e);
      
      // Aplicar el color en tiempo real durante el arrastre
      if (onSelectColor) {
        const currentRgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
        const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
        onSelectColor(currentHex);
      }
    }
  };

  const handleHueMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleHueMouseMove);
    document.removeEventListener('mouseup', handleHueMouseUp);
  };

  // Manejar cambios en inputs RGB - Modificar para evitar ciclos
  const handleRgbChange = (channel, value) => {
    const newValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgb, [channel]: newValue };
    setRgb(newRgb);
    
    // Calcular HSV a partir de RGB para mantener sincronía
    const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
    setHsv(newHsv);
    
    // Actualizar hex directamente sin causar otro ciclo
    const hexColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setSelectedColor(hexColor);
  };

  // Manejar cambio en el input hexadecimal - También modificar
  const handleHexChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('#')) {
      value = `#${value}`;
    }
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(value)) {
      setSelectedColor(value);
      
      // Actualizar RGB y HSV directamente
      const newRgb = hexToRgb(value);
      setRgb(newRgb);
      setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
    }
  };

  // MODIFICADO: Función para aplicar el color seleccionado
  const applyColor = () => {
    if (onSelectColor) {
      onSelectColor(selectedColor);
    }
    // Solo cerrar si no estamos en modo "mantener abierto hasta confirmar"
    if (!keepOpenUntilSubmit && onClose) {
      onClose();
    }
  };

  // MODIFICADO: Función para cerrar el selector explícitamente
  const closeColorPicker = () => {
    if (onClose) {
      onClose();
    }
  };

  // Actualizar posiciones de los thumbs (selectores)
  useEffect(() => {
    if (thumbRef.current && colorPaletteRef.current) {
      const paletteWidth = colorPaletteRef.current.offsetWidth;
      const paletteHeight = colorPaletteRef.current.offsetHeight;
      
      // Posicionar el selector de la paleta de colores
      thumbRef.current.style.left = `${(hsv.s / 100) * paletteWidth}px`;
      thumbRef.current.style.top = `${(1 - hsv.v / 100) * paletteHeight}px`;
    }
    
    if (hueThumbRef.current && hueSelectorRef.current) {
      const hueWidth = hueSelectorRef.current.offsetWidth;
      // Posicionar el selector de tono
      hueThumbRef.current.style.left = `${(hsv.h / 360) * hueWidth}px`;
    }
  }, [hsv]);

  // Estilos
  const styles = {
    container: {
      width: '280px',
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15), 0 2px 5px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      fontFamily: 'Arial, sans-serif',
      zIndex: 1002,
      border: '1px solid rgba(200, 210, 220, 0.5)',
      animation: 'fadeIn 0.3s ease'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    title: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      margin: '0'
    },
    closeButton: {
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
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    colorPalette: {
      width: '100%',
      height: '150px',
      position: 'relative',
      borderRadius: '8px',
      marginBottom: '12px',
      cursor: 'crosshair',
      background: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 1) 100%), 
                  linear-gradient(to right, rgba(255, 255, 255, 1) 0%, hsl(${hsv.h}, 100%, 50%) 100%)`
    },
    thumb: {
      position: 'absolute',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)',
      transform: 'translate(-6px, -6px)',
      pointerEvents: 'none'
    },
    hueContainer: {
      width: '100%',
      height: '16px',
      position: 'relative',
      marginBottom: '16px',
      borderRadius: '8px',
      background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
      cursor: 'pointer'
    },
    hueThumb: {
      position: 'absolute',
      width: '8px',
      height: '16px',
      background: 'white',
      borderRadius: '4px',
      transform: 'translateX(-4px)',
      boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)',
      pointerEvents: 'none'
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    inputLabel: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '4px'
    },
    input: {
      width: '50px',
      padding: '4px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      textAlign: 'center',
      fontSize: '14px'
    },
    hexInput: {
      width: '80px',
      padding: '4px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      textAlign: 'center',
      fontSize: '14px',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      marginBottom: '16px'
    },
    colorPreview: {
      width: '40px',
      height: '40px',
      borderRadius: '20px',
      marginRight: '12px'
    },
    previewContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    },
    applyButton: {
      backgroundColor: '#4c7977',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '12px 14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      fontSize: '14px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div 
      ref={pickerContainerRef} 
      style={styles.container}
      onClick={(e) => e.stopPropagation()} // Evitar propagación de clics
    >
      <div style={styles.header}>
        <h3 style={styles.title}>Seleccionar color:</h3>
        <button 
          style={styles.closeButton} 
          onClick={closeColorPicker} // Usar nuestra función de cierre explícito
        >
          ✕
        </button>
      </div>
      
      {/* Paleta de colores */}
      <div 
        ref={colorPaletteRef}
        style={styles.colorPalette}
        onMouseDown={handleColorPaletteMouseDown}
        onClick={(e) => e.stopPropagation()} // Evitar propagación de clics
      >
        <div 
          ref={thumbRef}
          style={styles.thumb}
        />
      </div>
      
      {/* Selector de tono (Hue) */}
      <div 
        ref={hueSelectorRef}
        style={styles.hueContainer}
        onMouseDown={handleHueMouseDown}
        onClick={(e) => e.stopPropagation()} // Evitar propagación de clics
      >
        <div 
          ref={hueThumbRef}
          style={styles.hueThumb}
        />
      </div>
      
      {/* Controles RGB */}
      <div style={styles.controls}>
        <div style={styles.inputGroup}>
          <span style={styles.inputLabel}>R</span>
          <input
            type="number"
            min="0"
            max="255"
            style={styles.input}
            value={rgb.r}
            onChange={(e) => handleRgbChange('r', e.target.value)}
          />
        </div>
        <div style={styles.inputGroup}>
          <span style={styles.inputLabel}>G</span>
          <input
            type="number"
            min="0"
            max="255"
            style={styles.input}
            value={rgb.g}
            onChange={(e) => handleRgbChange('g', e.target.value)}
          />
        </div>
        <div style={styles.inputGroup}>
          <span style={styles.inputLabel}>B</span>
          <input
            type="number"
            min="0"
            max="255"
            style={styles.input}
            value={rgb.b}
            onChange={(e) => handleRgbChange('b', e.target.value)}
          />
        </div>
      </div>
      
      {/* Previsualización y valor hexadecimal */}
      <div style={styles.previewContainer}>
        <div 
          style={{
            ...styles.colorPreview,
            backgroundColor: selectedColor
          }}
        />
        <input
          type="text"
          style={styles.hexInput}
          value={selectedColor.toUpperCase()}
          onChange={handleHexChange}
          maxLength="7"
        />
      </div>
      
      {/* Botón para aplicar el color */}
      <button 
        style={styles.applyButton} 
        onClick={applyColor}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#3a6ea5';
          e.target.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#4c7977';
          e.target.style.transform = 'scale(1)';
        }}
      >
        Aplicar color
      </button>
    </div>
  );
};

export default CustomColorPicker;