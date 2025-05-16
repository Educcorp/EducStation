// src/context/AuthContext.jsx - Actualizado
import React, { createContext, useState, useEffect } from 'react';
import { login, logout, refreshToken, register as registerService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              } else {
                // Si aún no funciona, limpiar tokens
                logout();
                setUser(null);
                setIsAuth(false);
              }
            } catch (error) {
              // Error al refrescar token
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
      const result = await login(credentials);
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

  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerService(userData);
      return result;
    } catch (error) {
      setError(error.message);
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
      error,
      login: loginUser,
      logout: logoutUser,
      register: registerUser,
      updateAuthState
    }}>
      {children}
    </AuthContext.Provider>
  );
};