// src/context/AuthContext.jsx - Actualizado
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, logout, refreshToken } from '../services/authService';

export const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);

  useEffect(() => {
    // Verificar si hay un token en localStorage cuando la aplicación se carga
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('userToken');
      
      if (storedToken) {
        try {
          // Intentar obtener información del usuario usando el token
          const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';
          const response = await fetch(`${API_URL}/api/auth/user/`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuth(true);
            setToken(storedToken);
          } else {
            // El token puede estar expirado, intentar refrescarlo
            try {
              const newToken = await refreshToken();
              setToken(newToken);
              // Si el refresco es exitoso, intentar obtener datos del usuario nuevamente
              const newResponse = await fetch(`${API_URL}/api/auth/user/`, {
                headers: {
                  'Authorization': `Bearer ${newToken}`,
                },
              });
              
              if (newResponse.ok) {
                const userData = await newResponse.json();
                setUser(userData);
                setIsAuth(true);
              } else {
                // Si aún no funciona, limpiar tokens
                handleLogout();
              }
            } catch (error) {
              // Error al refrescar token
              handleLogout();
            }
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          handleLogout();
        }
      } else {
        handleLogout();
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = await login(credentials);
      setUser(result.user);
      setIsAuth(true);
      setToken(result.token);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuth(false);
    setToken(null);
  };

  const updateAuthState = (userData, newToken) => {
    setUser(userData);
    setIsAuth(true);
    if (newToken) {
      setToken(newToken);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: isAuth, 
      loading, 
      error,
      token,
      login: loginUser, 
      logout: handleLogout, 
      updateAuthState 
    }}>
      {children}
    </AuthContext.Provider>
  );
};