// src/services/categoriasService.js
const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Obtener todas las categorías
export const getAllCategorias = async () => {
    try {
        const response = await fetch(`${API_URL}/api/categorias`);
        if (!response.ok) {
            throw new Error('Error al obtener categorías');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getAllCategorias:', error);
        throw error;
    }
};

// Obtener una categoría por ID
export const getCategoriaById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/categorias/${id}`);
        if (!response.ok) {
            throw new Error('Categoría no encontrada');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getCategoriaById:', error);
        throw error;
    }
};

// Obtener publicaciones por categoría
export const getPublicacionesByCategoria = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/categorias/${id}/publicaciones`);
        if (!response.ok) {
            throw new Error('Error al obtener publicaciones de la categoría');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getPublicacionesByCategoria:', error);
        throw error;
    }
};

export default {
    getAllCategorias,
    getCategoriaById,
    getPublicacionesByCategoria
};