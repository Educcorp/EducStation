// src/components/utils/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que se encarga de hacer scroll hacia arriba cuando cambia la ruta
 * No renderiza nada en la UI, solo ejecuta el efecto
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Subir al principio de la página cuando cambia la ruta
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default ScrollToTop;