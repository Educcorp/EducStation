import { useState, useEffect, useCallback } from 'react';
import { getAllPublicaciones } from '../../../services/publicacionesService';
import { searchPublicaciones } from '../../../services/searchService';

const POSTS_PER_PAGE = 10;

/**
 * Hook personalizado para manejar la lógica de carga y gestión de posts del administrador
 * @param {Object} options - Opciones de configuración
 * @param {number} options.adminId - ID del administrador
 * @param {string} options.searchTerm - Término de búsqueda
 * @param {string} options.filter - Filtro de estado (all, published, draft)
 * @returns {Object} Estado y funciones para manejar posts
 */
export const useAdminPosts = ({ 
  adminId,
  searchTerm = '',
  filter = 'all'
} = {}) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.log(`Cargando publicaciones para administrador ID: ${adminId}`);
      
      // Intentar primero con getAllPublicaciones
      let allPosts = [];
      try {
        allPosts = await getAllPublicaciones(100, 0, null);
        console.log(`Obtenidas ${allPosts.length} publicaciones totales`);
      } catch (error) {
        console.error('Error al cargar todas las publicaciones:', error);
        
        // Intentar con endpoint alternativo
        try {
          const response = await fetch('https://educstation-backend-production.up.railway.app/api/publicaciones/all?limite=100');
          if (response.ok) {
            allPosts = await response.json();
            console.log(`Obtenidas ${allPosts.length} publicaciones desde endpoint alternativo`);
          }
        } catch (fallbackError) {
          console.error('Error en endpoint alternativo:', fallbackError);
          throw new Error('No se pudieron cargar las publicaciones después de múltiples intentos');
        }
      }
      
      // Filtrar por ID de administrador
      const adminPosts = allPosts.filter(post => {
        const isAdmin = post.ID_administrador == adminId; // Comparación no estricta para manejar strings/numbers
        if (isAdmin) {
          console.log(`Post ID ${post.ID_publicaciones} pertenece al administrador ${adminId}`);
        }
        return isAdmin;
      });
      
      console.log(`Filtradas ${adminPosts.length} publicaciones para el administrador ${adminId}`);
      
      // Ordenar por fecha de modificación o creación (más reciente primero)
      adminPosts.sort((a, b) => {
        const dateA = a.Fecha_modificacion ? new Date(a.Fecha_modificacion) : new Date(a.Fecha_creacion);
        const dateB = b.Fecha_modificacion ? new Date(b.Fecha_modificacion) : new Date(b.Fecha_creacion);
        return dateB - dateA;
      });
      
      setPosts(adminPosts);
      
      // Aplicar filtros iniciales
      const initialFiltered = filterPosts(adminPosts, searchTerm, filter);
      setFilteredPosts(initialFiltered);
      
    } catch (error) {
      console.error('Error al cargar publicaciones del administrador:', error);
      setError('No se pudieron cargar tus publicaciones. Por favor, intenta de nuevo más tarde.');
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  }, [adminId, filterPosts]);

  /**
   * Aplicar filtros cuando cambian los criterios
   */
  useEffect(() => {
    if (posts.length > 0) {
      const filtered = filterPosts(posts, searchTerm, filter);
      setFilteredPosts(filtered);
    }
  }, [posts, searchTerm, filter, filterPosts]);

  /**
   * Cargar posts cuando cambia el ID de administrador
   */
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
  }, []);

  return {
    // Estados
    posts: filteredPosts,
    loading,
    error,
    
    // Funciones
    refreshPosts,
    removePost
  };
}; 