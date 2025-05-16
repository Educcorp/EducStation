const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Obtener todas las publicaciones
export const getAllPublicaciones = async (limite = 10, offset = 0, estado = null) => {
    try {
        let url = `${API_URL}/api/publicaciones?limite=${limite}&offset=${offset}`;
        if (estado) {
            url += `&estado=${estado}`;
        }
        
        console.log("Solicitando todas las publicaciones:", url);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Error al obtener publicaciones: ${response.status} ${response.statusText}`);
                throw new Error(`Error al obtener las publicaciones: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`Obtenidas ${data.length} publicaciones correctamente`);
            return data;
        } catch (fetchError) {
            console.error("Error en la petición principal:", fetchError);
            
            // Si falla la petición principal, intentamos un enfoque alternativo
            console.log("Intentando método alternativo para cargar publicaciones...");
            
            // Podemos intentar cargar las últimas publicaciones sin parámetros de estado
            const fallbackUrl = `${API_URL}/api/publicaciones/latest?limite=${limite}`;
            console.log("URL alternativa:", fallbackUrl);
            
            const fallbackResponse = await fetch(fallbackUrl);
            if (!fallbackResponse.ok) {
                // Si también falla el fallback, lanzamos el error original
                throw fetchError;
            }
            
            const fallbackData = await fallbackResponse.json();
            console.log(`Obtenidas ${fallbackData.length} publicaciones mediante método alternativo`);
            return fallbackData;
        }
    } catch (error) {
        console.error('Error final en getAllPublicaciones:', error);
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
        console.log("Datos enviados al backend:", JSON.stringify(publicacionData, null, 2));
        console.log("URL de la API:", `${API_URL}/api/publicaciones`);
        
        const token = localStorage.getItem('userToken');
        console.log("Token de autenticación disponible:", !!token);
        
        const response = await fetch(`${API_URL}/api/publicaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(publicacionData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(e => ({ detail: 'Error al procesar la respuesta' }));
            console.error("Respuesta del servidor:", response.status, errorData);
            throw new Error(errorData.detail || `Error del servidor: ${response.status}`);
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
        console.log("=== createPublicacionFromHTML ===");
        console.log("Datos a enviar:", JSON.stringify(publicacionData, null, 2));
        console.log("htmlContent largo:", publicacionData.htmlContent ? publicacionData.htmlContent.length : 0);
        console.log("htmlContent muestra:", publicacionData.htmlContent ? publicacionData.htmlContent.substring(0, 100) + "..." : "vacío");
        console.log("URL API:", `${API_URL}/api/publicaciones/from-html`);
        
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
            console.error("Error respuesta:", errorData);
            throw new Error(errorData.detail || 'Error al crear la publicación desde HTML');
        }
        
        const responseData = await response.json();
        console.log("Respuesta del servidor:", responseData);
        return responseData;
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