import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  // Exponer propiedades adicionales para compatibilidad con los componentes existentes
  return {
    ...context,
    isAuthenticated: context.isAuth, // Alias para compatibilidad
    user: context.user
  };
};

export default useAuth; 