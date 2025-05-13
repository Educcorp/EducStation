// src/services/searchService.js
const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Búsqueda general
export const searchPublicaciones = async (term, limite = 10, offset = 0) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/search?term=${term}&limite=${limite}&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en searchPublicaciones:', error);
        throw error;
    }
};

// Búsqueda por título
export const searchByTitle = async (term, limite = 10, offset = 0) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/search/title?term=${term}&limite=${limite}&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Error en la búsqueda por título');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en searchByTitle:', error);
        throw error;
    }
};

// Búsqueda por contenido
export const searchByContent = async (term, limite = 10, offset = 0) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/search/content?term=${term}&limite=${limite}&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Error en la búsqueda por contenido');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en searchByContent:', error);
        throw error;
    }
};

// Búsqueda por etiquetas/categorías
export const searchByTags = async (categorias, limite = 10, offset = 0) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/search/tags?categorias=${categorias}&limite=${limite}&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Error en la búsqueda por etiquetas');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en searchByTags:', error);
        throw error;
    }
};

// Búsqueda avanzada
export const advancedSearch = async (criteria, limite = 10, offset = 0) => {
    // Construir query string a partir de los criterios
    const params = new URLSearchParams();

    if (criteria.titulo) params.append('titulo', criteria.titulo);
    if (criteria.contenido) params.append('contenido', criteria.contenido);
    if (criteria.fechaDesde) params.append('fechaDesde', criteria.fechaDesde);
    if (criteria.fechaHasta) params.append('fechaHasta', criteria.fechaHasta);
    if (criteria.estado) params.append('estado', criteria.estado);
    if (criteria.categorias) params.append('categorias', criteria.categorias.join(','));
    if (criteria.ordenarPor) params.append('ordenarPor', criteria.ordenarPor);

    params.append('limite', limite);
    params.append('offset', offset);

    try {
        const response = await fetch(`${API_URL}/api/publicaciones/search/advanced?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Error en la búsqueda avanzada');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en advancedSearch:', error);
        throw error;
    }
};

export default {
    searchPublicaciones,
    searchByTitle,
    searchByContent,
    searchByTags,
    advancedSearch
};