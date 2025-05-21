// src/context/AuthContext.jsx - Actualizado
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      console.log('Estado de autenticación al iniciar:', !!token);
      
      if (token) {
        try {
          // Verificar si el token es válido y no ha expirado
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp && decoded.exp < currentTime) {
            console.log('Token expirado, cerrando sesión');
            logout();
          } else {
            // Token válido, establecer estado de autenticación
            setUser(decoded);
            setIsAuth(true);
            console.log('Usuario autenticado:', decoded);
          }
        } catch (error) {
          console.error('Error al decodificar token:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = (token, userData) => {
    localStorage.setItem('userToken', token);
    setUser(userData);
    setIsAuth(true);
    console.log('Sesión iniciada correctamente');
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
    setIsAuth(false);
    console.log('Sesión cerrada');
  };

  // Función para actualizar datos del usuario
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    console.log('Datos de usuario actualizados:', userData);
  };

  // Verificar si el token sigue siendo válido
  const checkTokenValidity = () => {
    const token = localStorage.getItem('userToken');
    console.log('Verificando validez del token');
    
    if (!token) {
      console.log('No hay token almacenado');
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp && decoded.exp < currentTime) {
        console.log('Token expirado');
        logout();
        return false;
      }
      
      console.log('Token válido');
      return true;
    } catch (error) {
      console.error('Error al verificar token:', error);
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isLoading,
        login,
        logout,
        updateUser,
        checkTokenValidity
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};