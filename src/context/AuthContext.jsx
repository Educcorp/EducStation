// src/context/AuthContext.jsx - Optimizado para prevenir problemas de memoria
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
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
  const [isSuperUser, setIsSuperUser] = useState(false);

  // Refs para cleanup y control de requests
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);
  const isCheckingAuth = useRef(false);

  // Para compatibilidad con los componentes existentes
  const isAuthenticated = isAuth;

  // Función para limpiar estado y localStorage
  const handleLogout = React.useCallback(() => {
    try {
      logoutService();
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
    setUser(null);
    setIsAuth(false);
    setIsSuperUser(false);
    console.log('Estado de autenticación limpiado');
  }, []);

  // Función optimizada para verificar autenticación
  const checkAuth = React.useCallback(async () => {
    if (isCheckingAuth.current) {
      console.log('AuthContext - Ya se está verificando autenticación, evitando duplicado');
      return;
    }

    isCheckingAuth.current = true;
    
    try {
      // Cancelar request previo si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Crear nuevo AbortController
      abortControllerRef.current = new AbortController();
      
      const token = localStorage.getItem('userToken');
      console.log('AuthContext - Verificando autenticación, token existe:', !!token);
      
      if (!token) {
        console.log('No hay token, usuario no autenticado');
        handleLogout();
        return;
      }

      const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';
      
      // Primer intento con token existente
      try {
        const response = await fetch(`${API_URL}/api/auth/user/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: abortControllerRef.current.signal
        });
        
        if (response.ok) {
          const userData = await response.json();
          
          // Verificar si el request fue cancelado
          if (abortControllerRef.current && abortControllerRef.current.signal.aborted) {
            console.log('Request cancelado');
            return;
          }
          
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
            userId: userData.id || userData.ID_usuario 
          });
          return;
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          console.log('Request cancelado');
          return;
        }
        console.warn('Error en verificación inicial:', fetchError.message);
      }
      
      // Segundo intento: refrescar token
      console.warn('El token es inválido o ha expirado. Intentando refrescar...');
      try {
        await refreshToken();
        
        // Verificar si el request fue cancelado
        if (abortControllerRef.current && abortControllerRef.current.signal.aborted) {
          console.log('Request cancelado');
          return;
        }
        
        // Intentar obtener datos del usuario con el nuevo token
        const newToken = localStorage.getItem('userToken');
        if (newToken) {
          const newResponse = await fetch(`${API_URL}/api/auth/user/`, {
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
            signal: abortControllerRef.current.signal
          });
          
          if (newResponse.ok) {
            const userData = await newResponse.json();
            
            // Verificar si el request fue cancelado
            if (abortControllerRef.current && abortControllerRef.current.signal.aborted) {
              console.log('Request cancelado');
              return;
            }
            
            setUser(userData);
            setIsAuth(true);
            
            // Actualizar estado de superusuario
            const userIsSuperUser = userData.is_superuser === true;
            setIsSuperUser(userIsSuperUser);
            localStorage.setItem('isSuperUser', userIsSuperUser ? 'true' : 'false');
            
            console.log('Auth check después de refresh:', { 
              isAuth: true, 
              isSuperUser: userIsSuperUser,
              userId: userData.id || userData.ID_usuario 
            });
            return;
          }
        }
      } catch (refreshError) {
        if (refreshError.name === 'AbortError') {
          console.log('Request cancelado');
          return;
        }
        console.error('Error al refrescar token:', refreshError);
      }
      
      // Si llegamos aquí, todos los intentos fallaron
      console.error('No se pudo renovar la autenticación, sesión expirada.');
      handleLogout();
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelado');
        return;
      }
      console.error('Error al verificar autenticación:', error);
      handleLogout();
    } finally {
      isCheckingAuth.current = false;
    }
  }, [handleLogout]);

  // useEffect optimizado para verificar autenticación al cargar
  useEffect(() => {
    // Agregar debounce para evitar múltiples llamadas
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      checkAuth().finally(() => {
        setLoading(false);
      });
    }, 100); // Pequeño delay para evitar múltiples llamadas
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [checkAuth]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Limpiar AbortController
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Limpiar timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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

  const logoutUser = React.useCallback(() => {
    handleLogout();
  }, [handleLogout]);

  const updateAuthState = React.useCallback((userData) => {
    setUser(userData);
    setIsAuth(true);
    
    // Actualizar estado de superusuario
    const userIsSuperUser = userData.is_superuser === true;
    setIsSuperUser(userIsSuperUser);
    localStorage.setItem('isSuperUser', userIsSuperUser ? 'true' : 'false');
  }, []);

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