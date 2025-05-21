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
    // Probamos con método POST en lugar de PUT y con varias rutas posibles
    const methodsToTry = ['POST', 'PUT'];
    const routesToTry = [
      '/api/users/avatar',
      '/api/auth/user/avatar',
      '/api/users/profile',
      '/api/auth/user/profile',
      '/api/auth/user',
      '/api/users'
    ];
    
    let lastError = null;
    
    // Probamos cada combinación de método y ruta
    for (const method of methodsToTry) {
      for (const route of routesToTry) {
        try {
          const avatarUrl = `${API_URL}${route}`;
          console.log(`Intentando con ${method} a ${avatarUrl}`);
          
          // Diferentes formatos de datos para probar
          const payloads = [
            { avatarData },
            { avatar: avatarData },
            { avatarUrl: avatarData },
            { image: avatarData },
            { user: { avatar: avatarData } },
            { profile: { avatar: avatarData } }
          ];
          
          // Probamos cada formato de datos
          for (const payload of payloads) {
            try {
              console.log(`Probando con formato:`, Object.keys(payload)[0]);
              
              const response = await fetch(avatarUrl, {
                method,
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              });
              
              console.log(`Respuesta para ${method} ${avatarUrl}:`, response.status);
              
              if (response.ok) {
                console.log('¡ÉXITO! Imagen actualizada correctamente');
                return await response.json();
              }
            } catch (e) {
              console.warn(`Error con formato ${Object.keys(payload)[0]}:`, e.message);
            }
          }
        } catch (e) {
          lastError = e;
          console.warn(`Error general con ${method} ${route}:`, e.message);
        }
      }
    }
    
    // Si llegamos aquí, todas las combinaciones fallaron
    throw lastError || new Error('No se pudo actualizar el avatar después de probar múltiples opciones');
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