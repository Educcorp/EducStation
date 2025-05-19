// src/services/userService.js
// Servicio para operaciones relacionadas con usuarios y perfiles

const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Obtener perfil del usuario actual
export const getUserProfile = async () => {
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    throw new Error('No hay sesión activa');
  }
  
  try {
    const response = await fetch(`${API_URL}/api/auth/user/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
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
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    throw new Error('No hay sesión activa');
  }
  
  try {
    const response = await fetch(`${API_URL}/api/auth/user/avatar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatarUrl: avatarData }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar avatar');
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
    const response = await fetch(`${API_URL}/api/auth/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
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