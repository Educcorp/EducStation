import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllPublicaciones } from '../../../services/publicacionesService';
import { searchPublicaciones, searchByTags } from '../../../services/searchService';
import { getAllCategorias } from '../../../services/categoriasServices';

const DEFAULT_POSTS_PER_PAGE = 6;
const MAX_POSTS_LIMIT = 50; // Reduce from 100 to 50 to save memory

/**
 * Hook personalizado para manejar la lógica de carga y gestión de posts
 * @param {Object} options - Opciones de configuración
 * @param {number} options.limit - Límite de posts a cargar
 * @param {string} options.categoryFilter - Filtro de categoría
 * @param {string} options.searchTerm - Término de búsqueda
 * @param {string} options.sortOrder - Orden de clasificación
 * @param {number} options.initialDisplayCount - Cantidad inicial de posts a mostrar
 * @returns {Object} Estado y funciones para manejar posts
 */
export const usePosts = ({ 
  limit, 
  categoryFilter, 
  searchTerm, 
  sortOrder = 'recientes',
  initialDisplayCount
} = {}) => {
  const [posts, setPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Refs para cleanup
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);
  
  // Determinar el número de posts por página
  const POSTS_PER_PAGE = initialDisplayCount || DEFAULT_POSTS_PER_PAGE;
  const effectiveLimit = Math.min(limit || MAX_POSTS_LIMIT, MAX_POSTS_LIMIT);

  /**
   * Función para ordenar posts según el criterio seleccionado
   */
  const sortPosts = useCallback((postsToSort, order) => {
    if (!postsToSort || postsToSort.length === 0) return [];
    
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
   * Función optimizada para cargar posts
   */
  const fetchPosts = useCallback(async () => {
    try {
      // Cancelar request previo si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Crear nuevo AbortController para este request
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      setError(null);
      setPage(1);
      
      let data = [];
      const pageName = window.location.pathname.includes('/blog') ? 'BlogPage' : 'HomePage';
      console.log(`[${pageName}] Iniciando carga de posts (límite: ${effectiveLimit})...`);

      // Optimizar lógica de carga
      if (searchTerm && searchTerm.trim() !== '') {
        console.log(`[${pageName}] Buscando posts con término: "${searchTerm}"`);
        data = await searchPublicaciones(searchTerm, effectiveLimit, 0);
      } else if (categoryFilter && categoryFilter !== '') {
        console.log(`[${pageName}] Filtrando por categoría: "${categoryFilter}"`);
        data = await searchByTags(categoryFilter, effectiveLimit, 0);
      } else {
        console.log(`[${pageName}] Cargando posts generales`);
        // Usar método directo en lugar de cargar por categorías para evitar múltiples requests
        try {
          data = await getAllPublicaciones(effectiveLimit, 0, 'publicado');
          console.log(`[${pageName}] Cargados ${data.length} posts directamente`);
        } catch (directError) {
          console.error(`[${pageName}] Error en carga directa, intentando método alternativo:`, directError);
          
          // Solo como último recurso, usar método de categorías pero con límite reducido
          const categorias = await getAllCategorias();
          if (categorias && categorias.length > 0) {
            // Limitar a las primeras 5 categorías para evitar sobrecarga
            const limitedCategorias = categorias.slice(0, 5);
            const promesas = limitedCategorias.map(categoria => 
              searchByTags(categoria.ID_categoria, Math.floor(effectiveLimit / limitedCategorias.length), 0)
                .catch(error => {
                  console.error(`[${pageName}] Error al cargar categoría ${categoria.Nombre_categoria}:`, error);
                  return [];
                })
            );
            
            const resultados = await Promise.all(promesas);
            
            // Combinar resultados de manera más eficiente
            const postMap = new Map();
            resultados.forEach(publicacionesCategoria => {
              if (Array.isArray(publicacionesCategoria)) {
                publicacionesCategoria.forEach(post => {
                  if (post && post.ID_publicaciones && !postMap.has(post.ID_publicaciones)) {
                    postMap.set(post.ID_publicaciones, post);
                  }
                });
              }
            });
            
            data = Array.from(postMap.values());
            console.log(`[${pageName}] Combinadas ${data.length} publicaciones desde categorías limitadas`);
          } else {
            throw new Error('No se pudieron cargar publicaciones');
          }
        }
      }

      // Verificar si el request fue cancelado
      if (abortControllerRef.current && abortControllerRef.current.signal.aborted) {
        console.log('Request cancelado');
        return;
      }

      // Ordenar posts
      const sortedData = sortPosts(data, sortOrder);
      
      console.log(`[${pageName}] Posts procesados: ${sortedData.length}`);
      
      // Limitar datos en memoria
      const limitedData = sortedData.slice(0, effectiveLimit);
      
      setPosts(limitedData);
      setDisplayPosts(limitedData.slice(0, POSTS_PER_PAGE));
      setHasMore(limitedData.length > POSTS_PER_PAGE);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelado');
        return;
      }
      console.error('Error al cargar publicaciones:', error);
      setError('No se pudieron cargar las publicaciones. Por favor, intenta de nuevo más tarde.');
      setPosts([]);
      setDisplayPosts([]);
    } finally {
      setLoading(false);
    }
  }, [effectiveLimit, categoryFilter, searchTerm, sortOrder, sortPosts, POSTS_PER_PAGE]);

  /**
   * Función optimizada para cargar más posts
   */
  const loadMorePosts = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * POSTS_PER_PAGE;
    const endIndex = nextPage * POSTS_PER_PAGE;
    
    // Limpiar timeout previo
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDisplayPosts(prevPosts => [
        ...prevPosts, 
        ...posts.slice(startIndex, endIndex)
      ]);
      setPage(nextPage);
      setHasMore(endIndex < posts.length);
      setLoadingMore(false);
    }, 300); // Reducir delay de 500ms a 300ms
  }, [page, posts, loadingMore, hasMore, POSTS_PER_PAGE]);

  /**
   * Función para recargar posts
   */
  const refreshPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Limpiar AbortController
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Limpiar timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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