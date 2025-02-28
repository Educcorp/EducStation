// src/components/common/Logo.jsx
import React from 'react';
import { colors } from '../../styles/theme';

const Logo = ({ size = 40, style = {} }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...style }}
    >
      {/* Documento beige */}
      <path d="M 150 250 L 220 320 L 150 390 L 80 320 L 150 250 Z" fill="#d2b99a" />
      
      {/* Sección verde oscura */}
      <path d="M 350 250 L 280 320 L 350 390 L 420 320 L 350 250 Z" fill="#0b4444" />
      
      {/* Cabeza del mapache */}
      <path d="M 256 150 C 290 150 320 180 320 230 C 320 280 290 310 256 310 C 222 310 192 280 192 230 C 192 180 222 150 256 150 Z" fill="#91a8a4" />
      
      {/* Antifaz blanco */}
      <path d="M 256 160 C 290 160 310 190 310 230 C 310 270 290 300 256 300 C 222 300 202 270 202 230 C 202 190 222 160 256 160 Z" fill="white" />
      
      {/* Ojos */}
      <circle cx="230" cy="215" r="25" fill="#0b4444" />
      <circle cx="282" cy="215" r="25" fill="#0b4444" />
      
      {/* Brillos en los ojos */}
      <circle cx="220" cy="205" r="8" fill="white" />
      <circle cx="272" cy="205" r="8" fill="white" />
      
      {/* Nariz */}
      <circle cx="256" cy="240" r="10" fill="#0b4444" />
      
      {/* Orejas */}
      <path d="M 220 150 C 210 130 200 100 220 80 C 240 100 230 130 220 150 Z" fill="#0b4444" />
      <path d="M 292 150 C 302 130 312 100 292 80 C 272 100 282 130 292 150 Z" fill="#0b4444" />
      
      {/* Bordes blancos de las orejas */}
      <path d="M 216 146 C 208 130 200 106 216 90 C 232 106 224 130 216 146 Z" fill="white" stroke="white" strokeWidth="2" />
      <path d="M 296 146 C 304 130 312 106 296 90 C 280 106 288 130 296 146 Z" fill="white" stroke="white" strokeWidth="2" />
      
      {/* Contorno blanco alrededor del mapache para mejor contraste con fondos oscuros */}
      <path d="M 256 150 C 290 150 320 180 320 230 C 320 280 290 310 256 310 C 222 310 192 280 192 230 C 192 180 222 150 256 150 Z" 
        fill="none" 
        stroke="white" 
        strokeWidth="3" 
      />
    </svg>
  );
};

export default Logo;