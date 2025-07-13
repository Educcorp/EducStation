import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllPublicaciones } from '../../../services/publicacionesService';
import { searchPublicaciones, searchByTags } from '../../../services/searchService';
import { getAllCategorias } from '../../../services/categoriasServices';

const POSTS_PER_PAGE = 10;
const MAX_POSTS_LIMIT = 50; // Reduce from 100 to 50 to save memory

/**
 * Hook personalizado para manejar la lógica de carga y gestión de posts del administrador
 * @param {Object} options - Opciones de configuración
 * @param {number} options.adminId - ID del administrador
 * @param {string} options.searchTerm - Término de búsqueda
 * @param {string} options.filter - Filtro de estado (all, published, draft)
 * @param {string} options.sortOrder - Orden de clasificación
 * @returns {Object} Estado y funciones para manejar posts
 */
export const useAdminPosts = ({ 
  adminId,
  searchTerm = '',
  filter = 'all',
  sortOrder = 'recientes'
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
   * Función para filtrar posts según criterios
   */
  const filterPosts = useCallback((allPosts, term, statusFilter) => {
    if (!allPosts || allPosts.length === 0) return [];
    
    // Primero filtramos por término de búsqueda
    let result = allPosts;
    
    if (term && term.trim() !== '') {
      const searchTermLower = term.toLowerCase();
      result = result.filter(post => 
        post.Titulo?.toLowerCase().includes(searchTermLower) || 
        post.Resumen?.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Luego filtramos por estado
    if (statusFilter !== 'all') {
      const estado = statusFilter === 'published' ? 'publicado' : 'borrador';
      result = result.filter(post => post.Estado === estado);
    }
    
    return result;
  }, []);

  /**
   * Función optimizada para cargar posts
   */
  const fetchPosts = useCallback(async () => {
    if (!adminId) {
      console.log('No hay ID de administrador disponible');
      setError('No se pudo identificar tu cuenta de administrador');
      setLoading(false);
      return;
    }
    
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
      console.log(`Cargando publicaciones para administrador ID: ${adminId} (límite: ${MAX_POSTS_LIMIT})`);
      
      let data = [];

      // Optimizar lógica de carga
      if (searchTerm && searchTerm.trim() !== '') {
        console.log('Buscando posts con término:', searchTerm);
        data = await searchPublicaciones(searchTerm, MAX_POSTS_LIMIT, 0);
      } else {
        console.log('Cargando posts del administrador');
        // Usar método directo en lugar de cargar por categorías para evitar múltiples requests
        try {
          data = await getAllPublicaciones(MAX_POSTS_LIMIT, 0, null);
          console.log(`Obtenidas ${data.length} publicaciones totales`);
        } catch (directError) {
          console.error("Error en carga directa:", directError);
          
          // Solo como último recurso, usar método de categorías pero con límite reducido
          try {
            const categorias = await getAllCategorias();
            if (categorias && categorias.length > 0) {
              // Limitar a las primeras 5 categorías para evitar sobrecarga
              const limitedCategorias = categorias.slice(0, 5);
              const promesas = limitedCategorias.map(categoria => 
                searchByTags(categoria.ID_categoria, Math.floor(MAX_POSTS_LIMIT / limitedCategorias.length), 0)
                  .catch(error => {
                    console.error(`Error al cargar categoría ${categoria.Nombre_categoria}:`, error);
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
              console.log(`Combinadas ${data.length} publicaciones desde categorías limitadas`);
            } else {
              throw new Error('No se pudieron cargar publicaciones');
            }
          } catch (categoryError) {
            console.error("Error al cargar por categorías:", categoryError);
            
            // Último intento con endpoint alternativo limitado
            try {
              const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app/api';
              const response = await fetch(`${API_URL}/publicaciones/latest?limite=${MAX_POSTS_LIMIT}`);
              if (!response.ok) {
                throw new Error(`Error en endpoint alternativo: ${response.status}`);
              }
              
              data = await response.json();
              console.log(`Obtenidas ${data.length} publicaciones mediante método alternativo`);
            } catch (fallbackError) {
              console.error('Error en endpoint alternativo:', fallbackError);
              throw new Error("No se pudieron cargar las publicaciones después de múltiples intentos");
            }
          }
        }
      }

      // Verificar si el request fue cancelado
      if (abortControllerRef.current && abortControllerRef.current.signal.aborted) {
        console.log('Request cancelado');
        return;
      }

      // Filtrar por ID de administrador de manera más eficiente
      const adminPosts = adminId ? data.filter(post => {
        const isAdmin = post.ID_administrador == adminId; // Comparación no estricta para manejar strings/numbers
        return isAdmin;
      }) : data;
      
      console.log(`Filtradas ${adminPosts.length} publicaciones para el administrador ${adminId}`);
      
      // Limitar datos en memoria
      const limitedData = adminPosts.slice(0, MAX_POSTS_LIMIT);
      
      // Ordenar posts
      const sortedData = sortPosts(limitedData, sortOrder);
      
      setPosts(sortedData);
      setDisplayPosts(sortedData.slice(0, POSTS_PER_PAGE));
      setHasMore(sortedData.length > POSTS_PER_PAGE);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelado');
        return;
      }
      console.error('Error al cargar publicaciones del administrador:', error);
      setError('No se pudieron cargar tus publicaciones. Por favor, intenta de nuevo más tarde.');
      setPosts([]);
      setDisplayPosts([]);
    } finally {
      setLoading(false);
    }
  }, [adminId, searchTerm, sortPosts]);

  /**
   * Aplicar filtros cuando cambian los criterios
   */
  useEffect(() => {
    if (posts.length > 0) {
      const filtered = filterPosts(posts, searchTerm, filter);
      const sortedFiltered = sortPosts(filtered, sortOrder);
      setDisplayPosts(sortedFiltered.slice(0, page * POSTS_PER_PAGE));
      setHasMore(sortedFiltered.length > page * POSTS_PER_PAGE);
    }
  }, [posts, searchTerm, filter, sortOrder, filterPosts, sortPosts, page]);

  /**
   * Cargar posts cuando cambia el ID de administrador
   */
  useEffect(() => {
    if (adminId) {
      fetchPosts();
    }
  }, [adminId, fetchPosts]);

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
      // Aplicar filtros a todos los posts
      const filtered = filterPosts(posts, searchTerm, filter);
      const sortedFiltered = sortPosts(filtered, sortOrder);
      
      setDisplayPosts(sortedFiltered.slice(0, endIndex));
      setPage(nextPage);
      setHasMore(endIndex < sortedFiltered.length);
      setLoadingMore(false);
    }, 300); // Reducir delay de 500ms a 300ms
  }, [page, posts, loadingMore, hasMore, searchTerm, filter, sortOrder, filterPosts, sortPosts]);

  /**
   * Función para recargar posts
   */
  const refreshPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  /**
   * Función para eliminar un post de la lista
   */
  const removePost = useCallback((postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.ID_publicaciones !== postId));
    setDisplayPosts(prevPosts => prevPosts.filter(post => post.ID_publicaciones !== postId));
  }, []);

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

  return {
    // Estados
    posts: displayPosts,
    allPosts: posts,
    loading,
    loadingMore,
    error,
    page,
    hasMore,
    
    // Funciones
    loadMorePosts,
    refreshPosts,
    removePost,
    
    // Constantes útiles
    POSTS_PER_PAGE
  };
}; 