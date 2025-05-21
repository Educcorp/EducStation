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
        
        // Si no se proporcionó una imagen en Base64, intentar extraerla del contenido HTML
        if (!publicacionData.imagen_portada_html) {
            // Extraer la primera imagen del contenido HTML para la portada si existe
            const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/i;
            const match = publicacionData.contenido.match(imgRegex);
            
            if (match && match.length > 0) {
                publicacionData.imagen_portada_html = match[0]; // Guardar la etiqueta img completa
                console.log("Imagen portada detectada del contenido HTML:", publicacionData.imagen_portada_html);
            }
        } else {
            console.log("Usando imagen portada proporcionada en Base64");
        }
        
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

// Crear una publicación desde HTML (método específico para el editor HTML)
export const createPublicacionFromHTML = async (publicacionData) => {
    try {
        // Validación básica del contenido HTML
        if (!publicacionData.htmlContent || publicacionData.htmlContent.trim() === '') {
            throw new Error('El contenido HTML no puede estar vacío');
        }

        // Verificar que el contenido tenga etiquetas HTML válidas
        if (!publicacionData.htmlContent.includes("<") || !publicacionData.htmlContent.includes(">")) {
            console.warn("El contenido no parece contener etiquetas HTML válidas");
        }

        // Asegurar que existe un resumen o usar los primeros caracteres del título
        if (!publicacionData.resumen) {
            publicacionData.resumen = publicacionData.titulo.substring(0, Math.min(150, publicacionData.titulo.length));
        }
        
        // Si no se proporcionó una imagen en Base64, intentar extraerla del contenido HTML
        if (!publicacionData.imagen_portada_html) {
            // Extraer la primera imagen del contenido HTML para la portada si existe
            const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/i;
            const match = publicacionData.htmlContent.match(imgRegex);
            
            if (match && match.length > 0) {
                publicacionData.imagen_portada_html = match[0]; // Guardar la etiqueta img completa
                console.log("Imagen portada detectada desde HTML:", publicacionData.imagen_portada_html);
            }
        } else {
            console.log("Usando imagen portada proporcionada en Base64");
        }

        // Enviamos los datos al backend
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
            console.error('Error response:', errorData);
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