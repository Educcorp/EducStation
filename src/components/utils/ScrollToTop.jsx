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
    // Usar setTimeout para asegurar que el DOM se haya actualizado
    const scrollToTop = () => {
      try {
        // Intentar scroll suave primero
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });

        // Fallback para navegadores que no soportan scroll suave
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);

        // También hacer scroll en el elemento body si existe
        if (document.body) {
          document.body.scrollTop = 0;
        }

        // Y en el elemento documentElement
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
      } catch (error) {
        console.warn('Error al hacer scroll hacia arriba:', error);
        // Fallback básico
        window.scrollTo(0, 0);
      }
    };

    // Ejecutar inmediatamente
    scrollToTop();

    // También ejecutar después de un pequeño delay para asegurar que funcione
    const timeoutId = setTimeout(scrollToTop, 50);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null; // Este componente no renderiza nada
};

export default ScrollToTop;