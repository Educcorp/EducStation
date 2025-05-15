// src/services/publicacionesService.js
const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Obtener todas las publicaciones
export const getAllPublicaciones = async () => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones`);
        if (!response.ok) {
            throw new Error('Error al obtener publicaciones');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getAllPublicaciones:', error);
        throw error;
    }
};

// Obtener publicaciones por categoría
export const getPublicacionesByCategoria = async (categoriaId) => {
    try {
        const response = await fetch(`${API_URL}/api/categorias/${categoriaId}/publicaciones`);
        if (!response.ok) {
            throw new Error('Error al obtener publicaciones de la categoría');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getPublicacionesByCategoria:', error);
        throw error;
    }
};

// Obtener una publicación por ID
export const getPublicacionById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/${id}`);
        if (!response.ok) {
            throw new Error('Publicación no encontrada');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getPublicacionById:', error);
        throw error;
    }
};

// Crear una nueva publicación
export const createPublicacion = async (publicacionData, token) => {
    try {
        const formData = new FormData();
        
        // Añadir campos de texto al formData
        Object.keys(publicacionData).forEach(key => {
            if (key !== 'coverImage') {
                formData.append(key, publicacionData[key]);
            }
        });
        
        // Añadir imagen si existe
        if (publicacionData.coverImage) {
            formData.append('imagen', publicacionData.coverImage);
        }
        
        const response = await fetch(`${API_URL}/api/publicaciones`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear la publicación');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en createPublicacion:', error);
        throw error;
    }
};

// Actualizar una publicación existente
export const updatePublicacion = async (id, publicacionData, token) => {
    try {
        const formData = new FormData();
        
        // Añadir campos de texto al formData
        Object.keys(publicacionData).forEach(key => {
            if (key !== 'coverImage') {
                formData.append(key, publicacionData[key]);
            }
        });
        
        // Añadir imagen si existe
        if (publicacionData.coverImage) {
            formData.append('imagen', publicacionData.coverImage);
        }
        
        const response = await fetch(`${API_URL}/api/publicaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar la publicación');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en updatePublicacion:', error);
        throw error;
    }
};

// Eliminar una publicación
export const deletePublicacion = async (id, token) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar la publicación');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en deletePublicacion:', error);
        throw error;
    }
};

export default {
    getAllPublicaciones,
    getPublicacionesByCategoria,
    getPublicacionById,
    createPublicacion,
    updatePublicacion,
    deletePublicacion
}; 