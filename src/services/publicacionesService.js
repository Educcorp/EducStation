const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Obtener todas las publicaciones
export const getAllPublicaciones = async (limite = 10, offset = 0, estado = null) => {
    try {
        let url = `${API_URL}/api/publicaciones?limite=${limite}&offset=${offset}`;
        if (estado) {
            url += `&estado=${estado}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener las publicaciones');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getAllPublicaciones:', error);
        throw error;
    }
};

// Obtener una publicación por ID
export const getPublicacionById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener la publicación');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getPublicacionById:', error);
        throw error;
    }
};

// Crear una nueva publicación
export const createPublicacion = async (publicacionData) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify(publicacionData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al crear la publicación');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en createPublicacion:', error);
        throw error;
    }
};

// Crear una publicación a partir de HTML
export const createPublicacionFromHTML = async (publicacionData) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/from-html`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify(publicacionData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al crear la publicación desde HTML');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en createPublicacionFromHTML:', error);
        throw error;
    }
};

// Actualizar una publicación existente
export const updatePublicacion = async (id, publicacionData) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify(publicacionData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al actualizar la publicación');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en updatePublicacion:', error);
        throw error;
    }
};

// Eliminar una publicación
export const deletePublicacion = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al eliminar la publicación');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en deletePublicacion:', error);
        throw error;
    }
};

export default {
    getAllPublicaciones,
    getPublicacionById,
    createPublicacion,
    createPublicacionFromHTML,
    updatePublicacion,
    deletePublicacion
}; 