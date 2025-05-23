import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app/api';

// Check if API_URL already ends with '/api', if not, add it
const getApiUrl = () => {
  if (API_URL.endsWith('/api')) {
    return API_URL;
  }
  return `${API_URL}/api`;
};

export const comentarioService = {
    // Obtener todos los comentarios de un post
    getComentariosByPost: async (publicacionId) => {
        try {
            if (!publicacionId) {
                console.error('Error: ID de publicación no proporcionado para obtener comentarios');
                return [];
            }
            
            console.log('Obteniendo comentarios para la publicación:', publicacionId);
            const endpoint = `${getApiUrl()}/comentarios/publicacion/${publicacionId}`;
            console.log('Endpoint de comentarios:', endpoint);
            
            const response = await axios.get(endpoint);
            console.log('Respuesta de comentarios recibida:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener comentarios:', error);
            console.error('Detalles del error:', {
                mensaje: error.message,
                respuesta: error.response?.data,
                estatus: error.response?.status
            });
            throw error.response?.data || error.message;
        }
    },
    
    // Crear un nuevo comentario
    createComentario: async (comentarioData) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }
            
            const { publicacionId, postId, contenido } = comentarioData;
            
            // Usar publicacionId o postId, dependiendo de cuál esté disponible
            const idToUse = publicacionId || postId;
            if (!idToUse) {
                throw new Error('ID de publicación no válido');
            }
            
            if (!contenido || !contenido.trim()) {
                throw new Error('El contenido del comentario no puede estar vacío');
            }
            
            console.log('Datos del comentario a enviar:', {
                id: idToUse,
                contenido,
                token: token ? `${token.substring(0, 10)}...` : null
            });
            
            const endpoint = `${getApiUrl()}/comentarios/publicacion/${idToUse}`;
            console.log('Endpoint para crear comentario:', endpoint);
            
            const response = await axios.post(
                endpoint, 
                { contenido },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Respuesta del servidor al crear comentario:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al crear comentario:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Actualizar un comentario existente
    updateComentario: async (id, comentarioData) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }
            
            const response = await axios.put(`${getApiUrl()}/comentarios/${id}`, comentarioData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Error al actualizar comentario:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Eliminar un comentario
    deleteComentario: async (id) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }
            
            const response = await axios.delete(`${getApiUrl()}/comentarios/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            throw error.response?.data || error.message;
        }
    }
}; 