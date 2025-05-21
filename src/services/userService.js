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
  
  // Intentaremos varias combinaciones de rutas y métodos
  const possibleEndpoints = [
    { url: `${API_URL}/api/auth/user/profile`, method: 'PUT' },
    { url: `${API_URL}/api/users/profile`, method: 'PUT' },
    { url: `${API_URL}/api/users/avatar`, method: 'POST' },
    { url: `${API_URL}/api/auth/user/`, method: 'PUT' },
    { url: `${API_URL}/api/auth/user/avatar`, method: 'POST' }
  ];
  
  let lastError = null;
  
  // Probamos cada endpoint hasta que uno funcione
  for (const endpoint of possibleEndpoints) {
    try {
      console.log(`Intentando con: ${endpoint.url} (${endpoint.method})`);
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Enviamos múltiples formatos para mayor compatibilidad
          avatar: avatarData,
          avatarData: avatarData,
          avatarUrl: avatarData,
          // Si es una actualización de perfil, incluimos este campo
          ...(endpoint.url.includes('profile') && { avatar: avatarData })
        }),
      });
      
      console.log(`Respuesta de ${endpoint.url}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        // ¡Éxito! Retornamos la respuesta
        console.log(`Éxito al actualizar avatar con: ${endpoint.url}`);
        return await response.json();
      } else {
        // Registramos el error para depuración
        const errorText = await response.text();
        console.warn(`Error con ${endpoint.url}: ${response.status}`, errorText);
        lastError = new Error(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.warn(`Excepción con ${endpoint.url}:`, error);
      lastError = error;
    }
  }
  
  // Si llegamos aquí, ningún endpoint funcionó
  console.error('Todos los intentos de actualizar el avatar fallaron');
  throw lastError || new Error('No se pudo actualizar el avatar después de intentar múltiples endpoints');
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