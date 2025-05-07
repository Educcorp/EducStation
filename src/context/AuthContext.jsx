// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { login, logout, refreshToken } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      
      if (token) {
        try {
          // Intentar obtener información del usuario
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/auth/user/`, {
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
              await refreshToken();
              // Si se refresca exitosamente, reintentamos obtener los datos
              const newResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/auth/user/`, {
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
                logout();
                setUser(null);
                setIsAuth(false);
              }
            } catch (error) {
              // Error al refrescar el token
              logout();
              setUser(null);
              setIsAuth(false);
            }
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          logout();
          setUser(null);
          setIsAuth(false);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    setLoading(true);
    try {
      const result = await login(credentials);
      setUser(result.user);
      setIsAuth(true);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    logout();
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
      login: loginUser, 
      logout: logoutUser, 
      updateAuthState 
    }}>
      {children}
    </AuthContext.Provider>
  );
};