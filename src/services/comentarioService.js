import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app/api';

export const comentarioService = {
    // Obtener todos los comentarios de un post
    getComentariosByPost: async (postId) => {
        try {
            const response = await axios.get(`${API_URL}/comentarios/post/${postId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener comentarios:', error);
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
            
            const response = await axios.post(`${API_URL}/comentarios`, comentarioData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear comentario:', error);
            throw error.response?.data || error.message;
        }
    },

    // Actualizar un comentario
    updateComentario: async (id, comentarioData) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }
            
            const response = await axios.put(`${API_URL}/comentarios/${id}`, comentarioData, {
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
            
            const response = await axios.delete(`${API_URL}/comentarios/${id}`, {
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