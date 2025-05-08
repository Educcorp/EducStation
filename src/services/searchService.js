// src/services/searchService.js

// Puedes usar process.env.REACT_APP_API_URL que ya tienes configurado en .env
const API_URL = process.env.REACT_APP_API_URL;

// Búsqueda simple
export const simpleSearch = async (term) => {
    try {
        const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(term)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en búsqueda simple:', error);
        throw error;
    }
};

// Búsqueda avanzada
export const advancedSearch = async (searchParams) => {
    try {
        const response = await fetch(`${API_URL}/search/advanced`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchParams)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en búsqueda avanzada:', error);
        throw error;
    }
};

// Búsqueda por categoría/etiqueta
export const searchByTag = async (tagId) => {
    try {
        const response = await fetch(`${API_URL}/search/tag/${tagId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en búsqueda por etiqueta:', error);
        throw error;
    }
};

// Obtener etiquetas populares
export const getTrendingTags = async () => {
    try {
        const response = await fetch(`${API_URL}/search/trending-tags`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener etiquetas populares:', error);
        throw error;
    }
};