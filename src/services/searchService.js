// src/services/searchService.js
const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Búsqueda general
export const searchPublicaciones = async (term, limite = 10, offset = 0) => {
    try {
        console.log(`Buscando publicaciones con término "${term}"`);
        const response = await fetch(`${API_URL}/api/publicaciones/search?term=${term}&limite=${limite}&offset=${offset}`);
        if (!response.ok) {
            throw new Error(`Error en la búsqueda: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`Encontradas ${data.length} publicaciones para el término "${term}"`);
        return data;
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
            throw new Error(`Error en la búsqueda por título: ${response.status} ${response.statusText}`);
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
            throw new Error(`Error en la búsqueda por contenido: ${response.status} ${response.statusText}`);
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
        // Aseguramos que categorias siempre sea un string, aunque venga como número o array
        let categoriasParam;
        
        if (Array.isArray(categorias)) {
            categoriasParam = categorias.join(',');
        } else {
            categoriasParam = String(categorias);
        }
        
        console.log(`Buscando publicaciones para categoría(s): ${categoriasParam}`);
        
        const url = `${API_URL}/api/publicaciones/search/tags?categorias=${categoriasParam}&limite=${limite}&offset=${offset}`;
        console.log(`URL de búsqueda por categorías: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`Error en respuesta: ${response.status} ${response.statusText}`);
            throw new Error(`Error en la búsqueda por etiquetas: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Encontradas ${data.length} publicaciones para categoría(s) ${categoriasParam}`);
        return data;
    } catch (error) {
        console.error(`Error en searchByTags para categoría(s) ${categorias}:`, error);
        // En caso de error, retornamos un array vacío para no detener el flujo de la aplicación
        // cuando se están cargando múltiples categorías en paralelo
        return [];
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
        const url = `${API_URL}/api/publicaciones/search/advanced?${params.toString()}`;
        console.log(`URL de búsqueda avanzada: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la búsqueda avanzada: ${response.status} ${response.statusText}`);
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