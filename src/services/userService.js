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
    // Intentamos con ambas posibles rutas
    const avatarUrl = `${API_URL}/api/users/avatar`;
    console.log('Enviando petición a:', avatarUrl);
    
    const response = await fetch(avatarUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Enviamos el campo que espera el controlador (avatarData)
      body: JSON.stringify({ avatarData: avatarData }),
    });

    // Log detallado de la respuesta
    console.log('Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      // Si falla la primera ruta, intentamos con la segunda
      if (response.status === 404) {
        console.log('Ruta no encontrada, intentando ruta alternativa...');
        
        const alternativeUrl = `${API_URL}/api/auth/user/avatar`;
        console.log('Intentando con:', alternativeUrl);
        
        const alternativeResponse = await fetch(alternativeUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            // Probamos con ambos formatos para mayor compatibilidad
            avatarData: avatarData,
            avatarUrl: avatarData 
          }),
        });
        
        console.log('Respuesta alternativa:', alternativeResponse.status, alternativeResponse.statusText);
        
        if (!alternativeResponse.ok) {
          let errorMsg = 'Error al actualizar avatar';
          try {
            const errorText = await alternativeResponse.text();
            console.error('Detalles del error (alternativa):', errorText);
            errorMsg = `Error ${alternativeResponse.status}: ${errorText || alternativeResponse.statusText}`;
          } catch (e) {
            console.error('No se pudo obtener detalle del error');
          }
          throw new Error(errorMsg);
        }
        
        return await alternativeResponse.json();
      }
      
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