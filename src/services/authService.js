// src/services/authService.js - Actualizado

// Obtener la URL base de la API desde variables de entorno o usar una predeterminada
const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Verificar disponibilidad del nombre de usuario
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/check-username/${username}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al verificar el nombre de usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al verificar nombre de usuario:', error);
    throw error;
  }
};

// Registro de usuario - Actualizado para incluir username
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        username: userData.username.toLowerCase(), // Aseguramos que el username esté en minúsculas
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error en el registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
};

// Inicio de sesión de usuario - Actualizado para aceptar username o email
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username || credentials.email, // Acepta username o email
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error en el inicio de sesión');
    }

    const data = await response.json();

    // Guardar tokens en localStorage
    localStorage.setItem('userToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);

    // Obtener información del usuario
    const userResponse = await fetch(`${API_URL}/api/auth/user/`, {
      headers: {
        'Authorization': `Bearer ${data.access}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Error al obtener información del usuario');
    }

    const userData = await userResponse.json();
    localStorage.setItem('userName', `${userData.first_name} ${userData.last_name}`);

    return {
      user: userData,
      token: data.access,
      refresh: data.refresh,
    };
  } catch (error) {
    console.error('Error en el login:', error);
    throw error;
  }
};

// Cerrar sesión - limpiar datos de usuario del almacenamiento local
export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userName');
};

// Refrescar el token de acceso
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No hay token de refresco');
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Token de refresco inválido');
    }

    const data = await response.json();
    localStorage.setItem('userToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);

    return data.access;
  } catch (error) {
    console.error('Error al refrescar token:', error);
    logout();
    throw error;
  }
};

// Exportación predeterminada para compatibilidad con versiones anteriores
export default {
  register,
  login,
  logout,
  refreshToken
};