import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const comentarioService = {
    // Obtener todos los comentarios de un post
    getComentariosByPost: async (postId) => {
        try {
            const response = await axios.get(`${API_URL}/comentarios/post/${postId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Crear un nuevo comentario
    createComentario: async (comentarioData) => {
        try {
            const response = await axios.post(`${API_URL}/comentarios`, comentarioData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Actualizar un comentario
    updateComentario: async (id, comentarioData) => {
        try {
            const response = await axios.put(`${API_URL}/comentarios/${id}`, comentarioData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Eliminar un comentario
    deleteComentario: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/comentarios/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 