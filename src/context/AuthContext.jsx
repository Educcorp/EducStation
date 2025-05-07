// src/context/AuthContext.jsx (updated)
import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, refreshToken as refreshTokenService } from '../services/authService';

// Creamos el contexto
export const AuthContext = createContext();

// Componente proveedor
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      
      if (token) {
        try {
          // Intentar obtener información del usuario
          const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';
          const response = await fetch(`${API_URL}/api/auth/user/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuth(true);
          } else {
            // El token puede estar vencido, intentar refrescarlo
            try {
              await refreshTokenService();
              // Si se refresca exitosamente, reintentamos obtener los datos
              const newResponse = await fetch(`${API_URL}/api/auth/user/`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                },
              });
              
              if (newResponse.ok) {
                const userData = await newResponse.json();
                setUser(userData);
                setIsAuth(true);
              } else {
                // Si aún no funciona, limpiar tokens
                logoutService();
                setUser(null);
                setIsAuth(false);
              }
            } catch (error) {
              // Error al refrescar el token
              logoutService();
              setUser(null);
              setIsAuth(false);
            }
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          logoutService();
          setUser(null);
          setIsAuth(false);
        }
      } else {
        setIsAuth(false);
        setUser(null);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginService(credentials);
      setUser(result.user);
      setIsAuth(true);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    logoutService();
    setUser(null);
    setIsAuth(false);
  };

  const updateAuthState = (userData) => {
    setUser(userData);
    setIsAuth(true);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuth, 
      loading, 
      error,
      login: loginUser, 
      logout: logoutUser, 
      updateAuthState 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportar el contexto como default export para compatibilidad
export default AuthContext;