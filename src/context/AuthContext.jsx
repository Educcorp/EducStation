// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

// Actualización para AuthContext.jsx
useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Verificar la validez del token con el servidor
          const isValid = await validateToken(token);
          
          if (isValid) {
            const userData = await getCurrentUser();
            setUser(userData);
            setIsAuth(true);
          } else {
            // Token inválido o expirado
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsAuth(false);
          }
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
  
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuth, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;