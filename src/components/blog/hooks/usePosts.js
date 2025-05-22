import { useState, useEffect, useCallback } from 'react';
import { getAllPublicaciones } from '../../../services/publicacionesService';
import { searchPublicaciones, searchByTags } from '../../../services/searchService';
import { getAllCategorias } from '../../../services/categoriasServices';

const POSTS_PER_PAGE = 6;

/**
 * Hook personalizado para manejar la lógica de carga y gestión de posts
 * @param {Object} options - Opciones de configuración
 * @param {number} options.limit - Límite de posts a cargar
 * @param {string} options.categoryFilter - Filtro de categoría
 * @param {string} options.searchTerm - Término de búsqueda
 * @param {string} options.sortOrder - Orden de clasificación
 * @returns {Object} Estado y funciones para manejar posts
 */
export const usePosts = ({ 
  limit, 
  categoryFilter, 
  searchTerm, 
  sortOrder = 'recientes' 
} = {}) => {
  const [posts, setPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Función para ordenar posts según el criterio seleccionado
   */
  const sortPosts = useCallback((postsToSort, order) => {
    const sortedPosts = [...postsToSort];
    
    switch (order) {
      case 'recientes':
        return sortedPosts.sort((a, b) => new Date(b.Fecha_creacion) - new Date(a.Fecha_creacion));
      case 'antiguos':
        return sortedPosts.sort((a, b) => new Date(a.Fecha_creacion) - new Date(b.Fecha_creacion));
      case 'alfabetico':
        return sortedPosts.sort((a, b) => a.Titulo.localeCompare(b.Titulo));
      default:
        return sortedPosts;
    }
  }, []);

  /**
   * Función principal para cargar posts
   */
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setPage(1);
      
      let data = [];

      // Lógica de carga según los filtros
      if (searchTerm && searchTerm.trim() !== '') {
        console.log('Buscando posts con término:', searchTerm);
        data = await searchPublicaciones(searchTerm, limit || 30, 0);
      } else if (categoryFilter && categoryFilter !== '') {
        console.log('Filtrando por categoría:', categoryFilter);
        data = await searchByTags(categoryFilter, limit || 30, 0);
      } else {
        console.log('Cargando todas las categorías');
        // Cargar por categorías de manera independiente
        try {
          const categorias = await getAllCategorias();
          console.log(`Obtenidas ${categorias.length} categorías`);
          
          if (categorias && categorias.length > 0) {
            const promesas = categorias.map(categoria => 
              searchByTags(categoria.ID_categoria, limit || 30, 0)
                .catch(error => {
                  console.error(`Error al cargar categoría ${categoria.Nombre_categoria}:`, error);
                  return [];
                })
            );
            
            const resultados = await Promise.all(promesas);
            
            // Combinar resultados y eliminar duplicados
            const postMap = new Map();
            resultados.forEach(publicacionesCategoria => {
              publicacionesCategoria.forEach(post => {
                if (!postMap.has(post.ID_publicaciones)) {
                  postMap.set(post.ID_publicaciones, post);
                }
              });
            });
            
            data = Array.from(postMap.values());
            console.log(`Combinadas ${data.length} publicaciones únicas`);
          } else {
            // Fallback al método general
            data = await getAllPublicaciones(limit || 30, 0, 'publicado');
          }
        } catch (categoryError) {
          console.error("Error al cargar por categorías:", categoryError);
          data = await getAllPublicaciones(limit || 30, 0, 'publicado');
        }
      }

      // Ordenar posts
      const sortedData = sortPosts(data, sortOrder);
      
      console.log(`Posts cargados y ordenados: ${sortedData.length}`);
      
      setPosts(sortedData);
      setDisplayPosts(sortedData.slice(0, POSTS_PER_PAGE));
      setHasMore(sortedData.length > POSTS_PER_PAGE);
      
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      setError('No se pudieron cargar las publicaciones. Por favor, intenta de nuevo más tarde.');
      setPosts([]);
      setDisplayPosts([]);
    } finally {
      setLoading(false);
    }
  }, [limit, categoryFilter, searchTerm, sortOrder, sortPosts]);

  /**
   * Función para cargar más posts (paginación)
   */
  const loadMorePosts = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * POSTS_PER_PAGE;
    const endIndex = nextPage * POSTS_PER_PAGE;
    
    setTimeout(() => {
      setDisplayPosts(prevPosts => [
        ...prevPosts, 
        ...posts.slice(startIndex, endIndex)
      ]);
      setPage(nextPage);
      setHasMore(endIndex < posts.length);
      setLoadingMore(false);
    }, 500);
  }, [page, posts, loadingMore, hasMore]);

  /**
   * Función para recargar posts
   */
  const refreshPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Efecto para cargar posts cuando cambian los filtros
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    // Estados
    posts,
    displayPosts,
    loading,
    loadingMore,
    error,
    page,
    hasMore,
    
    // Funciones
    loadMorePosts,
    refreshPosts,
    
    // Constantes útiles
    POSTS_PER_PAGE
  };
}; 