// src/services/userService.js
// Servicio para operaciones relacionadas con usuarios y perfiles

const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';
const IMGBB_API_KEY = 'c8fec0db471da0775e1f19c9a7baa8b0'; // Clave API gratuita para pruebas, cambiar por vuestra propia clave en producción

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

    // Obtener datos del perfil
    const userData = await response.json();
    
    // Verificar si hay un avatar almacenado localmente
    const localAvatarInfo = localStorage.getItem('userAvatarInfo');
    
    if (localAvatarInfo) {
      try {
        const avatarInfo = JSON.parse(localAvatarInfo);
        // Combinar datos del servidor con avatar local
        return {
          ...userData,
          avatar: avatarInfo.url
        };
      } catch (e) {
        console.error('Error al parsear información del avatar local:', e);
      }
    }
    
    return userData;
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    throw error;
  }
};

// Subir imagen a ImgBB
const uploadImageToImgBB = async (base64Image) => {
  // Limpiar la cadena base64 si incluye el prefijo data:image
  const base64Data = base64Image.includes('base64,') 
    ? base64Image.split('base64,')[1] 
    : base64Image;
    
  try {
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Data);
    
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Error al subir imagen: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Imagen subida exitosamente a ImgBB:', data.data.url);
      return {
        url: data.data.url,
        delete_url: data.data.delete_url,
        thumb_url: data.data.thumb.url
      };
    } else {
      throw new Error('Error en respuesta de ImgBB');
    }
  } catch (error) {
    console.error('Error al subir imagen a ImgBB:', error);
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
    // 1. Primero subimos la imagen a ImgBB
    console.log('Subiendo imagen a servicio externo...');
    const imageInfo = await uploadImageToImgBB(avatarData);
    
    // 2. Almacenamos la información del avatar en localStorage
    localStorage.setItem('userAvatarInfo', JSON.stringify(imageInfo));
    
    // 3. Intentamos actualizar en el backend como respaldo (pero no bloqueamos si falla)
    try {
      console.log('Intentando sincronizar con el backend como respaldo...');
      const avatarUrl = `${API_URL}/api/users/avatar`;
      
      await fetch(avatarUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatarData: imageInfo.url }),
      });
    } catch (backendError) {
      console.warn('No se pudo sincronizar con backend, usando solo servicio externo:', backendError.message);
    }
    
    return {
      success: true,
      avatarUrl: imageInfo.url,
      message: 'Avatar actualizado correctamente mediante servicio externo'
    };
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