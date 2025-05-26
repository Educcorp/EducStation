import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllPublicaciones } from '../../../services/publicacionesService';
import { searchPublicaciones, searchByTags } from '../../../services/searchService';
import { getAllCategorias } from '../../../services/categoriasServices';

const DEFAULT_POSTS_PER_PAGE = 6;

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
  
  // Referencia para cancelar peticiones previas
  const abortControllerRef = useRef(null);
  
  // Determinar el número de posts por página
  const POSTS_PER_PAGE = initialDisplayCount || DEFAULT_POSTS_PER_PAGE;

  /**
   * Función para ordenar posts según el criterio seleccionado
   * Optimizada para mejor rendimiento
   */
  const sortPosts = useCallback((postsToSort, order) => {
    if (!postsToSort || postsToSort.length === 0) return [];
    
    // Crear una copia superficial para no mutar el original
    const sortedPosts = [...postsToSort];
    
    switch (order) {
      case 'recientes':
        return sortedPosts.sort((a, b) => {
          const dateA = new Date(a.Fecha_creacion || a.fecha_creacion || a.created_at || 0);
          const dateB = new Date(b.Fecha_creacion || b.fecha_creacion || b.created_at || 0);
          return dateB - dateA;
        });
      case 'antiguos':
        return sortedPosts.sort((a, b) => {
          const dateA = new Date(a.Fecha_creacion || a.fecha_creacion || a.created_at || 0);
          const dateB = new Date(b.Fecha_creacion || b.fecha_creacion || b.created_at || 0);
          return dateA - dateB;
        });
      case 'alfabetico':
        return sortedPosts.sort((a, b) => {
          const titleA = (a.Titulo || a.titulo || '').toLowerCase();
          const titleB = (b.Titulo || b.titulo || '').toLowerCase();
          return titleA.localeCompare(titleB);
        });
      default:
        return sortedPosts;
    }
  }, []);

  /**
   * Función principal para cargar posts - Optimizada con AbortController
   */
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setPage(1);
      
      // Cancelar peticiones previas si existen
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Crear nuevo AbortController para esta petición
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      let data = [];
      const pageName = window.location.pathname.includes('/blog') ? 'BlogPage' : 'HomePage';
      
      // Lógica de carga según los filtros
      if (searchTerm && searchTerm.trim() !== '') {
        data = await searchPublicaciones(searchTerm, limit || 30, 0, signal);
      } else if (categoryFilter && categoryFilter !== '') {
        data = await searchByTags(categoryFilter, limit || 30, 0, signal);
      } else {
        // Optimización: Usar Promise.allSettled en lugar de Promise.all para manejar errores individuales
        try {
          const categorias = await getAllCategorias(signal);
          
          if (categorias && categorias.length > 0) {
            const promesas = categorias.map(categoria => 
              searchByTags(categoria.ID_categoria, Math.min(limit || 10, 10), 0, signal)
                .catch(() => [])
            );
            
            const resultados = await Promise.allSettled(promesas);
            
            // Optimización: Usar Map para eliminar duplicados más eficientemente
            const postMap = new Map();
            
            resultados.forEach(result => {
              if (result.status === 'fulfilled') {
                result.value.forEach(post => {
                  if (!postMap.has(post.ID_publicaciones)) {
                    // Optimización: Almacenar solo los campos necesarios para mejorar rendimiento
                    const { ID_publicaciones, Titulo, Fecha_creacion, Imagen_portada, Resumen } = post;
                    postMap.set(post.ID_publicaciones, { 
                      ID_publicaciones, 
                      Titulo, 
                      Fecha_creacion, 
                      Imagen_portada,
                      Resumen,
                      categorias: post.categorias
                    });
                  }
                });
              }
            });
            
            data = Array.from(postMap.values());
          } else {
            data = await getAllPublicaciones(limit || 30, 0, 'publicado', signal);
          }
        } catch (categoryError) {
          if (!signal.aborted) {
            data = await getAllPublicaciones(limit || 30, 0, 'publicado', signal);
          }
        }
      }

      // Solo continuar si la petición no fue cancelada
      if (!signal.aborted) {
        // Ordenar posts
        const sortedData = sortPosts(data, sortOrder);
        
        setPosts(sortedData);
        setDisplayPosts(sortedData.slice(0, POSTS_PER_PAGE));
        setHasMore(sortedData.length > POSTS_PER_PAGE);
      }
      
    } catch (error) {
      // Solo mostrar error si no fue por cancelación
      if (error.name !== 'AbortError') {
        console.error('Error al cargar publicaciones:', error);
        setError('No se pudieron cargar las publicaciones. Por favor, intenta de nuevo más tarde.');
        setPosts([]);
        setDisplayPosts([]);
      }
    } finally {
      if (abortControllerRef.current?.signal?.aborted === false) {
        setLoading(false);
      }
    }
  }, [limit, categoryFilter, searchTerm, sortOrder, sortPosts, POSTS_PER_PAGE]);

  /**
   * Función para cargar más posts (paginación) - Optimizada
   */
  const loadMorePosts = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * POSTS_PER_PAGE;
    const endIndex = nextPage * POSTS_PER_PAGE;
    
    // Usar requestAnimationFrame para mejorar el rendimiento visual
    requestAnimationFrame(() => {
      setDisplayPosts(prevPosts => [
        ...prevPosts, 
        ...posts.slice(startIndex, endIndex)
      ]);
      setPage(nextPage);
      setHasMore(endIndex < posts.length);
      setLoadingMore(false);
    });
  }, [page, posts, loadingMore, hasMore, POSTS_PER_PAGE]);

  /**
   * Función para recargar posts
   */
  const refreshPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Efecto para cargar posts cuando cambian los filtros
  useEffect(() => {
    fetchPosts();
    
    // Limpiar al desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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