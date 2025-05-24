// src/context/AuthContext.jsx - Actualizado
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginService, logout as logoutService, refreshToken, register as registerService } from '../services/authService';

export const AuthContext = createContext();

// Hook personalizado para acceder al contexto de autenticación
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
  // Nuevo estado para el superusuario
  const [isSuperUser, setIsSuperUser] = useState(false);

  // Para compatibilidad con los componentes existentes
  const isAuthenticated = isAuth;

  useEffect(() => {
    // Verificar si hay un token en localStorage cuando la aplicación se carga
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      console.log('AuthContext - Verificando autenticación, token existe:', !!token);
      
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
            console.warn('El token es inválido o ha expirado. Intentando refrescar...');
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
                
                console.log('Auth check después de refresh:', { 
                  isAuth: true, 
                  isSuperUser: userIsSuperUser,
                  userData 
                });
              } else {
                console.error('No se pudo renovar la autenticación, sesión expirada.');
                handleLogout();
              }
            } catch (error) {
              // Error al refrescar token
              console.error('Error al refrescar token:', error);
              handleLogout();
            }
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          handleLogout();
        }
      } else {
        console.log('No hay token, usuario no autenticado');
        handleLogout();
      }
      
      setLoading(false);
    };
    
    // Función para limpiar estado y localStorage
    const handleLogout = () => {
      logoutService();
      setUser(null);
      setIsAuth(false);
      setIsSuperUser(false);
      console.log('Estado de autenticación limpiado');
    };
    
    checkAuth();
  }, []);

  // Función para registrar usuarios
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('AuthContext - Registrando usuario:', {
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name
      });
      const result = await registerService(userData);
      console.log('AuthContext - Registro exitoso:', result);
      return result;
    } catch (error) {
      console.error('AuthContext - Error en registro:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
      isAuthenticated, // Agregar alias para compatibilidad
      loading, 
      error,
      isSuperUser,
      register: registerUser,
      login: loginUser, 
      logout: logoutUser, 
      updateAuthState 
    }}>
      {children}
    </AuthContext.Provider>
  );
};