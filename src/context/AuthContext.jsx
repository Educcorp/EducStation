// src/context/AuthContext.jsx - Actualizado
import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, refreshToken } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Nuevo estado para el superusuario
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    // Verificar si hay un token en localStorage cuando la aplicación se carga
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      
      if (token) {
        try {
          // Intentar obtener información del usuario usando el token
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
            
            // Actualizar el estado de superusuario
            const userIsSuperUser = userData.is_superuser === true;
            setIsSuperUser(userIsSuperUser);
            
            // Guardar en localStorage para mantener consistencia
            localStorage.setItem('isSuperUser', userIsSuperUser ? 'true' : 'false');
            
            console.log('Auth check completo:', { 
              isAuth: true, 
              isSuperUser: userIsSuperUser,
              userData 
            });
          } else {
            // El token puede estar expirado, intentar refrescarlo
            try {
              await refreshToken();
              // Si el refresco es exitoso, intentar obtener datos del usuario nuevamente
              const newResponse = await fetch(`${API_URL}/api/auth/user/`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                },
              });
              
              if (newResponse.ok) {
                const userData = await newResponse.json();
                setUser(userData);
                setIsAuth(true);
                
                // Actualizar estado de superusuario
                const userIsSuperUser = userData.is_superuser === true;
                setIsSuperUser(userIsSuperUser);
                localStorage.setItem('isSuperUser', userIsSuperUser ? 'true' : 'false');
              } else {
                // Si aún no funciona, limpiar tokens
                logoutService();
                setUser(null);
                setIsAuth(false);
                setIsSuperUser(false);
              }
            } catch (error) {
              // Error al refrescar token
              logoutService();
              setUser(null);
              setIsAuth(false);
              setIsSuperUser(false);
            }
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          logoutService();
          setUser(null);
          setIsAuth(false);
          setIsSuperUser(false);
        }
      } else {
        setIsAuth(false);
        setUser(null);
        setIsSuperUser(false);
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
      
      // Actualizar el estado de superusuario
      const userIsSuperUser = result.user.is_superuser === true;
      setIsSuperUser(userIsSuperUser);
      
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
    setIsSuperUser(false);
  };

  const updateAuthState = (userData) => {
    setUser(userData);
    setIsAuth(true);
    
    // Actualizar estado de superusuario
    const userIsSuperUser = userData.is_superuser === true;
    setIsSuperUser(userIsSuperUser);
    localStorage.setItem('isSuperUser', userIsSuperUser ? 'true' : 'false');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuth, 
      loading, 
      error,
      isSuperUser,
      login: loginUser, 
      logout: logoutUser, 
      updateAuthState 
    }}>
      {children}
    </AuthContext.Provider>
  );
};