// src/components/utils/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que se encarga de hacer scroll a la parte superior
 * de la página cuando cambia la ruta.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente no renderiza nada
};

export default ScrollToTop;