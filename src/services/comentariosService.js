// src/services/comentariosService.js
const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Obtener comentarios de una publicación
export const getComentarios = async (publicacionId) => {
  try {
    const response = await fetch(`${API_URL}/api/comentarios/publicacion/${publicacionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener comentarios');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getComentarios:', error);
    throw error;
  }
};

// Crear un nuevo comentario
export const createComentario = async (publicacionId, contenido) => {
  try {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      throw new Error('Debes iniciar sesión para comentar');
    }
    
    const response = await fetch(`${API_URL}/api/comentarios/publicacion/${publicacionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ contenido }),
    });

    if (!response.ok) {
      const error = await response.json();
      if (error.errors && error.errors.length > 0) {
        throw new Error(error.errors[0].msg || 'Error al crear comentario');
      }
      throw new Error(error.message || 'Error al crear comentario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createComentario:', error);
    throw error;
  }
};

// Eliminar un comentario
export const deleteComentario = async (comentarioId) => {
  try {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      throw new Error('Debes iniciar sesión para eliminar un comentario');
    }
    
    const response = await fetch(`${API_URL}/api/comentarios/${comentarioId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar comentario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en deleteComentario:', error);
    throw error;
  }
}; 