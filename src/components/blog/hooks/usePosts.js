import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllPublicaciones } from '../../../services/publicacionesService';
import { searchPublicaciones, searchByTags } from '../../../services/searchService';
import { getAllCategorias } from '../../../services/categoriasServices';

const DEFAULT_POSTS_PER_PAGE = 6;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const MAX_POSTS_INITIAL_LOAD = 20; // Reducir carga inicial

// Cache simple para evitar llamadas innecesarias
const postsCache = new Map();
const getCacheKey = (searchTerm, categoryFilter, sortOrder) => 
  `${searchTerm || 'all'}-${categoryFilter || 'all'}-${sortOrder}`;

/**
 * Hook optimizado para manejar la lógica de carga y gestión de posts
 * @param {Object} options - Opciones de configuración
 * @param {number} options.limit - Límite de posts a cargar
 * @param {string} options.categoryFilter - Filtro de categoría
 * @param {string} options.searchTerm - Término de búsqueda
 * @param {string} options.sortOrder - Orden de clasificación
 * @param {number} options.initialDisplayCount - Cantidad inicial de posts a mostrar
 * @returns {Object} Estado y funciones para manejar posts
 */
export const usePosts = ({ 
  limit = MAX_POSTS_INITIAL_LOAD, 
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
  const [totalLoaded, setTotalLoaded] = useState(0);
  
  // Determinar el número de posts por página
  const POSTS_PER_PAGE = initialDisplayCount || DEFAULT_POSTS_PER_PAGE;

  /**
   * Función optimizada para ordenar posts - memoizada
   */
  const sortPosts = useCallback((postsToSort, order) => {
    if (!postsToSort || postsToSort.length === 0) return [];
    
    const sortedPosts = [...postsToSort];
    
    switch (order) {
      case 'recientes':
        return sortedPosts.sort((a, b) => {
          const dateA = new Date(a.Fecha_creacion || a.fecha_creacion || 0);
          const dateB = new Date(b.Fecha_creacion || b.fecha_creacion || 0);
          return dateB - dateA;
        });
      case 'antiguos':
        return sortedPosts.sort((a, b) => {
          const dateA = new Date(a.Fecha_creacion || a.fecha_creacion || 0);
          const dateB = new Date(b.Fecha_creacion || b.fecha_creacion || 0);
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
   * Función optimizada para cargar posts con cache
   */
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setPage(1);
      setTotalLoaded(0);
      
      const cacheKey = getCacheKey(searchTerm, categoryFilter, sortOrder);
      const now = Date.now();
      
      // Verificar cache
      const cached = postsCache.get(cacheKey);
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log('📦 Usando posts desde cache');
        const sortedData = sortPosts(cached.data, sortOrder);
        setPosts(sortedData);
        setDisplayPosts(sortedData.slice(0, POSTS_PER_PAGE));
        setHasMore(sortedData.length > POSTS_PER_PAGE);
        setTotalLoaded(sortedData.length);
        setLoading(false);
        return;
      }
      
      let data = [];
      const pageName = window.location.pathname.includes('/blog') ? 'BlogPage' : 'HomePage';
      console.log(`🚀 [${pageName}] Cargando posts optimizado...`);

      // Lógica de carga optimizada
      if (searchTerm && searchTerm.trim() !== '') {
        console.log(`🔍 Buscando: "${searchTerm}"`);
        data = await searchPublicaciones(searchTerm, limit, 0);
      } else if (categoryFilter && categoryFilter !== '') {
        console.log(`📁 Filtrando por categoría: "${categoryFilter}"`);
        data = await searchByTags(categoryFilter, limit, 0);
      } else {
        console.log(`📚 Cargando posts generales`);
        // Usar método directo más eficiente
        data = await getAllPublicaciones(limit, 0, 'publicado');
      }

      // Filtrar posts válidos y optimizar datos
      const validPosts = data
        .filter(post => post && post.ID_publicaciones)
        .map(post => ({
          ...post,
          // Pre-procesar datos para evitar cálculos en render
          _displayTitle: post.Titulo || post.titulo || 'Sin título',
          _displayDate: post.Fecha_creacion || post.fecha_creacion,
          _categoryName: post.categorias?.[0]?.Nombre_categoria || 'Sin categoría',
          _hasImage: !!(post.Imagen_portada)
        }));

      // Ordenar posts
      const sortedData = sortPosts(validPosts, sortOrder);
      
      // Guardar en cache
      postsCache.set(cacheKey, {
        data: sortedData,
        timestamp: now
      });
      
      console.log(`✅ Posts cargados: ${sortedData.length}`);
      
      setPosts(sortedData);
      setDisplayPosts(sortedData.slice(0, POSTS_PER_PAGE));
      setHasMore(sortedData.length > POSTS_PER_PAGE);
      setTotalLoaded(sortedData.length);
      
    } catch (error) {
      console.error('❌ Error al cargar publicaciones:', error);
      setError('No se pudieron cargar las publicaciones. Por favor, intenta de nuevo más tarde.');
      setPosts([]);
      setDisplayPosts([]);
      setHasMore(false);
      setTotalLoaded(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, sortOrder, limit, sortPosts, POSTS_PER_PAGE]);

  /**
   * Función optimizada para cargar más posts (paginación virtual)
   */
  const loadMorePosts = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * POSTS_PER_PAGE;
    const endIndex = nextPage * POSTS_PER_PAGE;
    
    // Usar requestAnimationFrame para mejor rendimiento
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
   * Función para limpiar cache cuando sea necesario
   */
  const clearCache = useCallback(() => {
    postsCache.clear();
    console.log('🧹 Cache de posts limpiado');
  }, []);

  /**
   * Función para recargar posts
   */
  const refreshPosts = useCallback(() => {
    const cacheKey = getCacheKey(searchTerm, categoryFilter, sortOrder);
    postsCache.delete(cacheKey);
    fetchPosts();
  }, [fetchPosts, searchTerm, categoryFilter, sortOrder]);

  // Efecto optimizado para cargar posts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Estadísticas memoizadas para debugging
  const stats = useMemo(() => ({
    totalPosts: posts.length,
    displayedPosts: displayPosts.length,
    loadingProgress: totalLoaded > 0 ? ((displayPosts.length / totalLoaded) * 100).toFixed(1) : 0,
    cacheSize: postsCache.size
  }), [posts.length, displayPosts.length, totalLoaded]);

  return {
    // Estados optimizados
    posts,
    displayPosts,
    loading,
    loadingMore,
    error,
    page,
    hasMore,
    totalLoaded,
    
    // Funciones optimizadas
    loadMorePosts,
    refreshPosts,
    clearCache,
    
    // Estadísticas
    stats,
    
    // Constantes útiles
    POSTS_PER_PAGE
  };
}; 