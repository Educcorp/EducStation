import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Estilo keyframes para la animación de brillo
const shineAnimation = `
  @keyframes shine {
    from {
      opacity: 0;
      left: 0%;
    }
    50% {
      opacity: 1;
    }
    to {
      opacity: 0;
      left: 100%;
    }
  }
`;

// Añadir los estilos keyframes al documento
const addKeyframeStyles = () => {
  if (typeof document !== 'undefined') {
    // Verificar si ya existe el estilo
    const existingStyle = document.getElementById('shine-animation-style');
    if (!existingStyle) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'shine-animation-style';
      styleSheet.type = "text/css";
      styleSheet.innerText = shineAnimation;
      document.head.appendChild(styleSheet);
    }
  }
};

const AnimatedButton = ({ 
  to, 
  onClick, 
  children, 
  backgroundColor = 'rgba(8, 44, 44, 0.6)', 
  hoverBackgroundColor = '#082c2c',
  textColor = '#fff',
  hoverTextColor = '#fff',
  borderRadius = '8px',
  padding = '8px 16px',
  fontSize = '14px',
  className,
  style,
  external = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    addKeyframeStyles();
  }, []);
  
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    
    // Crear y animar el elemento de brillo
    const shineElement = document.createElement('div');
    shineElement.style.cssText = `
      content: '';
      display: block;
      width: 0px;
      height: 86%;
      position: absolute;
      top: 7%;
      left: 0%;
      opacity: 0;
      background: white;
      box-shadow: 0 0 15px 3px white;
      transform: skewX(-20deg);
      animation: shine 0.5s 0s linear;
    `;
    
    e.currentTarget.appendChild(shineElement);
    
    // Eliminar el elemento de brillo después de la animación
    setTimeout(() => {
      if (e.currentTarget.contains(shineElement)) {
        e.currentTarget.removeChild(shineElement);
      }
    }, 500);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  const baseStyles = {
    display: 'inline-block',
    position: 'relative',
    backgroundColor: isHovered ? hoverBackgroundColor : backgroundColor,
    color: isHovered ? hoverTextColor : textColor,
    borderRadius,
    padding,
    fontSize,
    cursor: 'pointer',
    overflow: 'hidden',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    boxShadow: isHovered ? `0 0 30px 0 rgba(8, 44, 44, 0.5)` : '0 0 0 0 transparent',
    border: 'none',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    ...style
  };
  
  // Si es un enlace externo
  if (external && to) {
    return (
      <a 
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        style={baseStyles}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  
  // Si es un enlace interno
  if (to) {
    return (
      <Link 
        to={to}
        style={baseStyles}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }
  
  // Si es un botón
  return (
    <button 
      style={baseStyles}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default AnimatedButton; 