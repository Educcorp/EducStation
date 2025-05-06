// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        if (isAuthenticated()) {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuth(true);
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const updateAuthState = (userData) => {
    setUser(userData);
    setIsAuth(!!userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuth, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;