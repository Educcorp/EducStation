// src/services/userService.js
// Servicio para operaciones relacionadas con usuarios y perfiles

const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Obtener perfil del usuario actual
export const getUserProfile = async () => {
  // Obtener el token JWT almacenado
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    console.error('No se encontró token de autenticación');
    throw new Error('No hay sesión activa');
  }
  
  try {
    console.log('Obteniendo perfil de usuario con token:', !!token);
    const response = await fetch(`${API_URL}/api/users/current`, {
      headers: {
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el perfil de usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    throw error;
  }
};

// Actualizar avatar del usuario
export const updateUserAvatar = async (avatarData) => {
  // Obtener el token JWT almacenado
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    console.error('No se encontró token de autenticación');
    throw new Error('No hay sesión activa');
  }
  
  try {
    // Ahora que la ruta está habilitada en el backend
    const avatarUrl = `${API_URL}/api/users/avatar`;
    console.log('Enviando petición a:', avatarUrl);
    console.log('Token disponible:', !!token, 'primeros caracteres:', token.substring(0, 10) + '...');
    
    const response = await fetch(avatarUrl, {
      method: 'PUT',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
      // Enviamos el avatarData directamente como lo espera el controlador
      body: JSON.stringify({ avatarData }),
    });

    // Log detallado de la respuesta
    console.log('Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      let errorMsg = 'Error al actualizar avatar';
      try {
        const errorText = await response.text();
        console.error('Detalles del error:', errorText);
        errorMsg = `Error ${response.status}: ${errorText || response.statusText}`;
      } catch (e) {
        console.error('No se pudo obtener detalle del error');
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar avatar:', error);
    throw error;
  }
};

// Actualizar datos del perfil
export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    throw new Error('No hay sesión activa');
  }
  
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el perfil');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};

export default {
  getUserProfile,
  updateUserAvatar,
  updateUserProfile
}; 