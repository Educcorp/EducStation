import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const comentariosService = {
  // Obtener comentarios de una publicación
  getComentariosByPublicacion: async (publicacionId) => {
    try {
      const response = await axios.get(`${API_URL}/comentarios/publicacion/${publicacionId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      throw error;
    }
  },

  // Crear un nuevo comentario
  createComentario: async (publicacionId, contenido) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/comentarios/publicacion/${publicacionId}`,
        { contenido },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear comentario:', error);
      throw error;
    }
  },

  // Eliminar un comentario
  deleteComentario: async (comentarioId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_URL}/comentarios/${comentarioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      throw error;
    }
  }
}; 