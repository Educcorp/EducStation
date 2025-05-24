import { useState, useEffect, useCallback } from 'react';
import { getAllPublicaciones } from '../../../services/publicacionesService';
import { searchPublicaciones, searchByTags } from '../../../services/searchService';
import { getAllCategorias } from '../../../services/categoriasServices';

const POSTS_PER_PAGE = 10;

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
   * Función para filtrar posts según criterios
   */
  const filterPosts = useCallback((allPosts, term, statusFilter) => {
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
   * Función principal para cargar posts
   */
  const fetchPosts = useCallback(async () => {
    if (!adminId) {
      console.log('No hay ID de administrador disponible');
      setError('No se pudo identificar tu cuenta de administrador');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setPage(1);
      console.log(`Cargando publicaciones para administrador ID: ${adminId}`);
      
      let data = [];

      // Lógica de carga según los filtros
      if (searchTerm && searchTerm.trim() !== '') {
        console.log('Buscando posts con término:', searchTerm);
        data = await searchPublicaciones(searchTerm, 100, 0);
      } else {
        console.log('Cargando todas las categorías');
        // Cargar por categorías de manera independiente
        try {
          const categorias = await getAllCategorias();
          console.log(`Obtenidas ${categorias.length} categorías`);
          
          if (categorias && categorias.length > 0) {
            const promesas = categorias.map(categoria => 
              searchByTags(categoria.ID_categoria, 100, 0)
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
            data = await getAllPublicaciones(100, 0, null);
          }
        } catch (categoryError) {
          console.error("Error al cargar por categorías:", categoryError);
          
          // Intentar con getAllPublicaciones
          try {
            data = await getAllPublicaciones(100, 0, null);
            console.log(`Obtenidas ${data.length} publicaciones totales`);
          } catch (error) {
            console.error('Error al cargar todas las publicaciones:', error);
            
            // Intentar con endpoint alternativo
            try {
              const response = await fetch('https://educstation-backend-production.up.railway.app/api/publicaciones/all?limite=100');
              if (response.ok) {
                data = await response.json();
                console.log(`Obtenidas ${data.length} publicaciones desde endpoint alternativo`);
              } else {
                throw new Error(`Error en endpoint alternativo: ${response.status}`);
              }
            } catch (fallbackError) {
              console.error('Error en endpoint alternativo:', fallbackError);
              
              // Último intento con latest
              const fallbackResponse = await fetch('https://educstation-backend-production.up.railway.app/api/publicaciones/latest?limite=100');
              if (!fallbackResponse.ok) {
                throw new Error("No se pudieron cargar las publicaciones después de múltiples intentos");
              }
              
              data = await fallbackResponse.json();
              console.log(`Obtenidas ${data.length} publicaciones mediante método alternativo`);
            }
          }
        }
      }

      // Filtrar por ID de administrador si es necesario
      const adminPosts = adminId ? data.filter(post => {
        const isAdmin = post.ID_administrador == adminId; // Comparación no estricta para manejar strings/numbers
        return isAdmin;
      }) : data;
      
      console.log(`Filtradas ${adminPosts.length} publicaciones para el administrador ${adminId}`);
      
      // Ordenar posts
      const sortedData = sortPosts(adminPosts, sortOrder);
      
      setPosts(sortedData);
      setDisplayPosts(sortedData.slice(0, POSTS_PER_PAGE));
      setHasMore(sortedData.length > POSTS_PER_PAGE);
      
    } catch (error) {
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
   * Cargar posts cuando cambia el ID de administrador o los criterios de búsqueda
   */
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /**
   * Función para cargar más posts (paginación)
   */
  const loadMorePosts = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * POSTS_PER_PAGE;
    const endIndex = nextPage * POSTS_PER_PAGE;
    
    // Aplicar filtros a todos los posts
    const filtered = filterPosts(posts, searchTerm, filter);
    const sortedFiltered = sortPosts(filtered, sortOrder);
    
    setTimeout(() => {
      setDisplayPosts(sortedFiltered.slice(0, endIndex));
      setPage(nextPage);
      setHasMore(endIndex < sortedFiltered.length);
      setLoadingMore(false);
    }, 500);
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