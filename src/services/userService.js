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
  
  // Verificar que avatarData exista
  if (!avatarData) {
    throw new Error('No se proporcionaron datos para el avatar');
  }
  
  try {
    // Usamos una URL alternativa para evitar confusiones con las rutas
    // La ruta correcta según userRoutes.js del backend es /api/users/avatar
    const avatarUrl = `${API_URL}/api/users/avatar`;
    console.log('Enviando petición a:', avatarUrl);
    
    // Obtener tamaño aproximado
    const sizeInKB = Math.round((avatarData.length * 0.75) / 1024); // Estimación de tamaño en KB
    console.log(`Tamaño estimado de la imagen: ${sizeInKB} KB`);
    
    if (sizeInKB > 1000) {
      console.warn('Imagen demasiado grande, considera usar una imagen más pequeña');
    }
    
    // Verificar formato de avatarData
    let processedData = avatarData;
    
    // Asegurarnos de que sea una cadena
    if (typeof processedData !== 'string') {
      throw new Error('Formato de imagen inválido');
    }
    
    // Para mayor seguridad, si no tiene el prefijo data:image, lo añadimos
    if (!processedData.includes('data:image')) {
      processedData = `data:image/jpeg;base64,${processedData}`;
    }
    
    const response = await fetch(avatarUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        // Añadimos también el x-auth-token para mayor compatibilidad
        'x-auth-token': token
      },
      // Enviamos el avatarData en formato adecuado
      body: JSON.stringify({ 
        avatarData: processedData
      }),
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
    const response = await fetch(`${API_URL}/api/auth/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        // Añadimos también el x-auth-token para mayor compatibilidad
        'x-auth-token': token
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