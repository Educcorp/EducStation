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
  
  // Almacenar localmente para respaldo (en caso de fallo del servidor)
  localStorage.setItem('userAvatar', avatarData);
  
  // Intentar sincronizar con el servidor (sin bloquear la experiencia del usuario)
  try {
    console.log('Intentando sincronizar avatar con el servidor...');
    
    // Esta es la ruta que debería funcionar según los archivos locales
    const avatarUrl = `${API_URL}/api/users/avatar`;
    console.log('Enviando petición a:', avatarUrl);
    
    const response = await fetch(avatarUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatarData: avatarData }),
    });
    
    // Si el servidor responde con error, no interrumpimos la experiencia del usuario
    if (!response.ok) {
      console.warn(`El servidor respondió con ${response.status}. El avatar se guardará solo localmente.`);
      return { success: true, synced: false, message: 'Avatar actualizado localmente' };
    }
    
    // Si llegamos aquí, la actualización en el servidor fue exitosa
    console.log('Avatar sincronizado con el servidor correctamente');
    return { success: true, synced: true, message: 'Avatar actualizado y sincronizado con el servidor' };
  } catch (error) {
    console.error('Error al sincronizar con el servidor:', error);
    // No lanzamos el error, devolvemos una respuesta de "éxito parcial"
    return { success: true, synced: false, message: 'Avatar actualizado localmente' };
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