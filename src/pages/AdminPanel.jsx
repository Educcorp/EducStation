import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter, FaSort, FaSync } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext';
import { deletePublicacion, getAllPublicaciones } from '../services/publicacionesService';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuth, isSuperUser } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Estados para las publicaciones
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft'
  const [sortOrder, setSortOrder] = useState('recientes'); // 'recientes', 'antiguos', 'alfabetico'
  
  // Estados para UI
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Verificación inmediata al montar el componente
  useEffect(() => {
    const checkForInstantReload = () => {
      if (location.state && location.state.forceReload && !sessionStorage.getItem('adminpanel-reloaded')) {
        sessionStorage.setItem('adminpanel-reloaded', 'true');
        window.history.replaceState(null, '', window.location.pathname);
        window.location.reload();
      }
    };
    checkForInstantReload();
  }, []);

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!isSuperUser) {
      navigate('/');
      toast.error('Acceso denegado. Se requieren privilegios de administrador.');
      return;
    }
  }, [isAuth, isSuperUser, navigate]);

  // Función para cargar todas las publicaciones
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Cargando todas las publicaciones para el panel de administración');
      
      // Cargar todas las publicaciones sin filtrar por administrador
      const allPosts = await getAllPublicaciones(200, 0, null);
      console.log(`Obtenidas ${allPosts.length} publicaciones totales`);
      
      if (!allPosts || allPosts.length === 0) {
        console.log('No se encontraron publicaciones');
        setPosts([]);
        setFilteredPosts([]);
        setError('No hay publicaciones disponibles en el sistema.');
        return;
      }
      
      // Ordenar por fecha de modificación o creación (más reciente primero)
      allPosts.sort((a, b) => {
        const dateA = a.Fecha_modificacion ? new Date(a.Fecha_modificacion) : new Date(a.Fecha_creacion);
        const dateB = b.Fecha_modificacion ? new Date(b.Fecha_modificacion) : new Date(b.Fecha_creacion);
        return dateB - dateA;
      });
      
      setPosts(allPosts);
      applyFilters(allPosts, searchTerm, filter, sortOrder);
      
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      setError('No se pudieron cargar las publicaciones. Por favor, intenta de nuevo más tarde.');
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Función para aplicar filtros
  const applyFilters = (postsToFilter, term, statusFilter, order) => {
    let result = [...postsToFilter];
    
    // Filtrar por término de búsqueda
    if (term && term.trim() !== '') {
      const searchTermLower = term.toLowerCase();
      result = result.filter(post => 
        post.Titulo?.toLowerCase().includes(searchTermLower) || 
        post.Resumen?.toLowerCase().includes(searchTermLower) ||
        post.Contenido?.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      const estado = statusFilter === 'published' ? 'publicado' : 'borrador';
      result = result.filter(post => post.Estado === estado);
    }
    
    // Ordenar
    switch (order) {
      case 'recientes':
        result.sort((a, b) => {
          const dateA = a.Fecha_modificacion ? new Date(a.Fecha_modificacion) : new Date(a.Fecha_creacion);
          const dateB = b.Fecha_modificacion ? new Date(b.Fecha_modificacion) : new Date(b.Fecha_creacion);
          return dateB - dateA;
        });
        break;
      case 'antiguos':
        result.sort((a, b) => {
          const dateA = a.Fecha_modificacion ? new Date(a.Fecha_modificacion) : new Date(a.Fecha_creacion);
          const dateB = b.Fecha_modificacion ? new Date(b.Fecha_modificacion) : new Date(b.Fecha_creacion);
          return dateA - dateB;
        });
        break;
      case 'alfabetico':
        result.sort((a, b) => a.Titulo.localeCompare(b.Titulo));
        break;
      default:
        break;
    }
    
    setFilteredPosts(result);
  };

  // Aplicar filtros cuando cambian los criterios
  useEffect(() => {
    if (posts.length > 0) {
      applyFilters(posts, searchTerm, filter, sortOrder);
    }
  }, [searchTerm, filter, sortOrder, posts]);

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  // Manejar eliminación de publicación
  const handleDeletePost = async (postId) => {
    try {
      await deletePublicacion(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.ID_publicaciones !== postId));
      setFilteredPosts(prevPosts => prevPosts.filter(post => post.ID_publicaciones !== postId));
      toast.success('Publicación eliminada correctamente');
      setConfirmDelete(null);
      showNotification('Publicación eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      toast.error('Error al eliminar la publicación');
      showNotification('Error al eliminar la publicación', 'error');
    }
  };

  // Manejar edición de publicación
  const handleEditPost = (postId) => {
    showNotification('Preparando publicación para editar...', 'info');
    navigate(`/admin/post/edit/${postId}`);
  };

  // Manejar visualización de publicación
  const handleViewPost = (postId) => {
    navigate(`/blog/post/${postId}`);
  };

  // Recargar publicaciones
  const refreshPosts = async () => {
    showNotification('Actualizando publicaciones...', 'info');
    await fetchAllPosts();
    showNotification('Publicaciones actualizadas correctamente');
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'publicado': 
        return { 
          bg: isDarkMode ? '#1b4d3e' : '#e6f7ef', 
          text: isDarkMode ? '#4ade80' : '#166534' 
        };
      case 'borrador': 
        return { 
          bg: isDarkMode ? '#3b3054' : '#f3e8ff', 
          text: isDarkMode ? '#c084fc' : '#7e22ce' 
        };
      default: 
        return { 
          bg: isDarkMode ? '#374151' : '#f3f4f6', 
          text: isDarkMode ? '#9ca3af' : '#4b5563' 
        };
    }
  };

  // Procesar imagen de portada
  const getImageUrl = (imageData) => {
    if (!imageData) return '/assets/images/placeholder.jpg';
    
    if (typeof imageData === 'string') {
      // Si ya es una URL completa (http/https)
      if (imageData.startsWith('http')) {
        return imageData;
      }
      // Si es una ruta de assets
      if (imageData.startsWith('/assets')) {
        return imageData;
      }
      // Si ya es una imagen base64 completa
      if (imageData.startsWith('data:image')) {
        return imageData;
      }
      // Si es solo el contenido base64 sin el prefijo
      if (imageData.length > 100 && !imageData.includes('<')) {
        return `data:image/jpeg;base64,${imageData}`;
      }
      // Si es una etiqueta HTML img, extraer el src
      if (imageData.includes('<img') && imageData.includes('src=')) {
        const srcMatch = imageData.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          return srcMatch[1];
        }
      }
    }
    
    return '/assets/images/placeholder.jpg';
  };

  // Estilos
  const styles = {
    container: {
      backgroundColor: isDarkMode ? '#1a2e2d' : colors.background,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    content: {
      flex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${spacing.xl} ${spacing.md}`,
      width: '100%'
    },
    pageTitle: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      margin: `${spacing.xl} 0`,
      textAlign: 'center',
      borderBottom: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.primary}`,
      paddingBottom: spacing.md
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
      flexWrap: 'wrap',
      gap: spacing.md
    },
    title: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      margin: 0
    },
    createButton: {
      backgroundColor: isDarkMode ? colors.primaryDark : colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: borderRadius.md,
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none'
    },
    refreshButton: {
      backgroundColor: isDarkMode ? '#4a5568' : '#718096',
      color: colors.white,
      border: 'none',
      borderRadius: borderRadius.md,
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginLeft: spacing.sm
    },
    filtersContainer: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      boxShadow: shadows.sm,
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'
    },
    filtersRow: {
      display: 'flex',
      gap: spacing.md,
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    searchContainer: {
      position: 'relative',
      flex: '1',
      minWidth: '250px'
    },
    searchInput: {
      width: '100%',
      padding: `${spacing.sm} ${spacing.md} ${spacing.sm} 40px`,
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      color: isDarkMode ? colors.white : colors.textPrimary,
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : colors.textSecondary,
      fontSize: '16px'
    },
    select: {
      padding: `${spacing.sm} ${spacing.md}`,
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      color: isDarkMode ? colors.white : colors.textPrimary,
      outline: 'none',
      cursor: 'pointer',
      minWidth: '120px'
    },
    statsContainer: {
      display: 'flex',
      gap: spacing.md,
      marginBottom: spacing.xl,
      flexWrap: 'wrap'
    },
    statCard: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      boxShadow: shadows.sm,
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
      flex: '1',
      minWidth: '150px',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      marginBottom: spacing.xs
    },
    statLabel: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    postsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: spacing.lg,
      marginBottom: spacing.xl
    },
    postCard: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      boxShadow: shadows.md,
      transition: 'all 0.3s ease',
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    postImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.backgroundLight
    },
    postContent: {
      padding: spacing.lg,
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
      color: isDarkMode ? colors.white : colors.textPrimary,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    postExcerpt: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary,
      marginBottom: spacing.md,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flex: 1
    },
    postMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      paddingTop: spacing.md,
      borderTop: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'
    },
    postDate: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : colors.textSecondary
    },
    postStatus: {
      display: 'inline-block',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium
    },
    actionsContainer: {
      display: 'flex',
      gap: spacing.sm,
      justifyContent: 'flex-end'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '14px'
    },
    viewButton: {
      backgroundColor: isDarkMode ? '#2563eb' : '#3b82f6',
      color: colors.white
    },
    editButton: {
      backgroundColor: isDarkMode ? '#d97706' : '#f59e0b',
      color: colors.white
    },
    deleteButton: {
      backgroundColor: isDarkMode ? '#dc2626' : '#ef4444',
      color: colors.white
    },
    emptyState: {
      textAlign: 'center',
      padding: `${spacing.xxl} ${spacing.lg}`,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'
    },
    emptyStateTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.textPrimary,
      marginBottom: spacing.md
    },
    emptyStateText: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary,
      marginBottom: spacing.lg,
      lineHeight: 1.6
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px',
      fontSize: typography.fontSize.lg,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary
    },
    errorMessage: {
      backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2',
      color: isDarkMode ? '#fca5a5' : '#dc2626',
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      textAlign: 'center',
      marginBottom: spacing.xl,
      border: isDarkMode ? '1px solid #991b1b' : '1px solid #fecaca'
    },
    notification: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      minWidth: '300px',
      maxWidth: '500px',
      backgroundColor: notification.type === 'success' 
        ? (isDarkMode ? '#065f46' : '#10b981') 
        : notification.type === 'error' 
        ? (isDarkMode ? '#7f1d1d' : '#ef4444')
        : (isDarkMode ? '#1e40af' : '#3b82f6'),
      color: colors.white,
      padding: `${spacing.md} ${spacing.lg}`,
      borderRadius: borderRadius.md,
      boxShadow: shadows.lg,
      zIndex: 9999,
      display: notification.show ? 'block' : 'none',
      animation: notification.show ? 'slideInRight 0.3s ease' : 'none'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000
    },
    modal: {
      backgroundColor: isDarkMode ? '#1f2937' : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      maxWidth: '400px',
      width: '90%',
      boxShadow: shadows.xl
    },
    modalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.textPrimary,
      marginBottom: spacing.md
    },
    modalText: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary,
      marginBottom: spacing.lg,
      lineHeight: 1.5
    },
    modalActions: {
      display: 'flex',
      gap: spacing.md,
      justifyContent: 'flex-end'
    },
    modalButton: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      border: 'none',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    cancelButton: {
      backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
      color: isDarkMode ? colors.white : colors.textPrimary
    },
    confirmButton: {
      backgroundColor: '#ef4444',
      color: colors.white
    }
  };

  // Calcular estadísticas
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(post => post.Estado === 'publicado').length;
  const draftPosts = posts.filter(post => post.Estado === 'borrador').length;
  const filteredCount = filteredPosts.length;

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>Panel de Administración</h1>
        
        {/* Estadísticas */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{totalPosts}</div>
            <div style={styles.statLabel}>Total</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{publishedPosts}</div>
            <div style={styles.statLabel}>Publicadas</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{draftPosts}</div>
            <div style={styles.statLabel}>Borradores</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{filteredCount}</div>
            <div style={styles.statLabel}>Filtradas</div>
          </div>
        </div>

        {/* Header con título y botón de crear */}
        <div style={styles.header}>
          <h2 style={styles.title}>Publicaciones</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              style={styles.refreshButton}
              onClick={refreshPosts}
              disabled={loading}
            >
              <FaSync />
              Actualizar
            </button>
            <Link to="/admin/post/new" style={styles.createButton}>
              <FaPlus />
              Nueva Publicación
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div style={styles.filtersContainer}>
          <div style={styles.filtersRow}>
            <div style={styles.searchContainer}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar publicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.select}
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicadas</option>
              <option value="draft">Borradores</option>
            </select>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={styles.select}
            >
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
              <option value="alfabetico">Alfabético</option>
            </select>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={styles.loadingSpinner}>
            Cargando publicaciones...
          </div>
        )}

        {/* Lista de publicaciones */}
        {!loading && !error && (
          <>
            {filteredPosts.length === 0 ? (
              <div style={styles.emptyState}>
                <h3 style={styles.emptyStateTitle}>No se encontraron publicaciones</h3>
                <p style={styles.emptyStateText}>
                  {searchTerm || filter !== 'all' 
                    ? 'No hay publicaciones que coincidan con los criterios de búsqueda. Intenta ajustar los filtros.'
                    : 'No hay publicaciones en el sistema. ¡Crea tu primera publicación!'}
                </p>
                {(!searchTerm && filter === 'all') && (
                  <Link to="/admin/post/new" style={styles.createButton}>
                    <FaPlus />
                    Crear Primera Publicación
                  </Link>
                )}
              </div>
            ) : (
              <div style={styles.postsGrid}>
                {filteredPosts.map((post) => {
                  const statusColors = getStatusColor(post.Estado);
                  return (
                    <div key={post.ID_publicaciones} style={styles.postCard}>
                      <img
                        src={getImageUrl(post.Imagen_portada)}
                        alt={post.Titulo}
                        style={styles.postImage}
                        onError={(e) => {
                          e.target.src = '/assets/images/placeholder.jpg';
                        }}
                      />
                      
                      <div style={styles.postContent}>
                        <h3 style={styles.postTitle}>{post.Titulo}</h3>
                        <p style={styles.postExcerpt}>{post.Resumen}</p>
                        
                        <div style={styles.postMeta}>
                          <span style={styles.postDate}>
                            {formatDate(post.Fecha_modificacion || post.Fecha_creacion)}
                          </span>
                          <span
                            style={{
                              ...styles.postStatus,
                              backgroundColor: statusColors.bg,
                              color: statusColors.text
                            }}
                          >
                            {post.Estado}
                          </span>
                        </div>
                        
                        <div style={styles.actionsContainer}>
                          <button
                            style={{...styles.actionButton, ...styles.viewButton}}
                            onClick={() => handleViewPost(post.ID_publicaciones)}
                            title="Ver publicación"
                          >
                            <FaEye />
                          </button>
                          <button
                            style={{...styles.actionButton, ...styles.editButton}}
                            onClick={() => handleEditPost(post.ID_publicaciones)}
                            title="Editar publicación"
                          >
                            <FaEdit />
                          </button>
                          <button
                            style={{...styles.actionButton, ...styles.deleteButton}}
                            onClick={() => setConfirmDelete(post)}
                            title="Eliminar publicación"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {confirmDelete && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Confirmar eliminación</h3>
            <p style={styles.modalText}>
              ¿Estás seguro de que deseas eliminar la publicación "{confirmDelete.Titulo}"? 
              Esta acción no se puede deshacer.
            </p>
            <div style={styles.modalActions}>
              <button
                style={{...styles.modalButton, ...styles.cancelButton}}
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
              <button
                style={{...styles.modalButton, ...styles.confirmButton}}
                onClick={() => handleDeletePost(confirmDelete.ID_publicaciones)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación */}
      {notification.show && (
        <div style={styles.notification}>
          {notification.message}
        </div>
      )}

      <Footer />
      
      {/* CSS para animaciones */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `
      }} />
    </div>
  );
};

export default AdminPanel; 