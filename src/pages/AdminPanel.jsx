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
import AnimatedButton from '../components/utils/AnimatedButton';

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
  const [filter, setFilter] = useState('published');
  const [sortOrder, setSortOrder] = useState('recientes');
  
  // Estados para UI
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Estilos
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: isDarkMode ? colors.darkBackground : colors.background
    },
    content: {
      flex: 1,
      padding: spacing.xl,
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    },
    pageTitle: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.textPrimary,
      marginBottom: spacing.xl
    },
    filtersContainer: {
      marginBottom: spacing.lg,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm
    },
    filtersRow: {
      display: 'flex',
      gap: spacing.md,
      flexWrap: 'wrap'
    },
    searchContainer: {
      flex: 1,
      minWidth: '200px',
      position: 'relative'
    },
    searchIcon: {
      position: 'absolute',
      left: spacing.md,
      top: '50%',
      transform: 'translateY(-50%)',
      color: isDarkMode ? colors.white : colors.textSecondary
    },
    searchInput: {
      width: '100%',
      padding: `${spacing.sm} ${spacing.md} ${spacing.sm} ${spacing.xl}`,
      borderRadius: borderRadius.md,
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.border}`,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      color: isDarkMode ? colors.white : colors.textPrimary,
      fontSize: typography.fontSize.md
    },
    select: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.border}`,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      color: isDarkMode ? colors.white : colors.textPrimary,
      fontSize: typography.fontSize.md,
      minWidth: '150px'
    },
    statsContainer: {
      display: 'flex',
      gap: spacing.lg,
      marginBottom: spacing.xl,
      flexWrap: 'wrap'
    },
    statCard: {
      flex: 1,
      minWidth: '200px',
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
      textAlign: 'center'
    },
    statNumber: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      marginBottom: spacing.xs
    },
    statLabel: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.white : colors.textSecondary
    },
    postsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: spacing.lg
    },
    postCard: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      boxShadow: shadows.sm,
      transition: 'transform 0.2s ease'
    },
    errorMessage: {
      backgroundColor: colors.error,
      color: colors.white,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg
    },
    loadingSpinner: {
      textAlign: 'center',
      padding: spacing.xl,
      color: isDarkMode ? colors.white : colors.textPrimary
    },
    emptyState: {
      textAlign: 'center',
      padding: spacing.xl,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      borderRadius: borderRadius.lg,
      marginTop: spacing.xl
    },
    emptyStateTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.textPrimary,
      marginBottom: spacing.md
    },
    emptyStateText: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.white : colors.textSecondary,
      marginBottom: spacing.lg
    }
  };

  // Calcular estadísticas
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(post => post.Estado === 'publicado').length;

  // Función para cargar las publicaciones
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const allPosts = await getAllPublicaciones(200, 0, null);
      
      if (!allPosts || allPosts.length === 0) {
        setPosts([]);
        setFilteredPosts([]);
        setError('No hay publicaciones disponibles en el sistema.');
        return;
      }
      
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
  const applyFilters = (postsToFilter, search, filterValue, sort) => {
    let filtered = [...postsToFilter];
    
    // Aplicar búsqueda
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(post => 
        post.Titulo.toLowerCase().includes(searchLower) ||
        post.Contenido.toLowerCase().includes(searchLower)
      );
    }
    
    // Aplicar filtro de estado
    if (filterValue === 'published') {
      filtered = filtered.filter(post => post.Estado === 'publicado');
    }
    
    // Aplicar ordenamiento
    switch (sort) {
      case 'recientes':
        filtered.sort((a, b) => {
          const dateA = a.Fecha_modificacion ? new Date(a.Fecha_modificacion) : new Date(a.Fecha_creacion);
          const dateB = b.Fecha_modificacion ? new Date(b.Fecha_modificacion) : new Date(b.Fecha_creacion);
          return dateB - dateA;
        });
        break;
      case 'antiguos':
        filtered.sort((a, b) => {
          const dateA = a.Fecha_modificacion ? new Date(a.Fecha_modificacion) : new Date(a.Fecha_creacion);
          const dateB = b.Fecha_modificacion ? new Date(b.Fecha_modificacion) : new Date(b.Fecha_creacion);
          return dateA - dateB;
        });
        break;
      case 'alfabetico':
        filtered.sort((a, b) => a.Titulo.localeCompare(b.Titulo));
        break;
      default:
        break;
    }
    
    setFilteredPosts(filtered);
  };

  // Actualizar filtros cuando cambian los valores
  useEffect(() => {
    applyFilters(posts, searchTerm, filter, sortOrder);
  }, [searchTerm, filter, sortOrder, posts]);

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>Panel de Administración</h1>
        
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
              <option value="published">Publicadas</option>
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

        {/* Estadísticas */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{totalPosts}</div>
            <div style={styles.statLabel}>Total de Publicaciones</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{publishedPosts}</div>
            <div style={styles.statLabel}>Publicaciones Publicadas</div>
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
                  <AnimatedButton
                    to="/admin/post/new"
                    backgroundColor={colors.secondary}
                    hoverBackgroundColor="#0d5353"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      margin: '0 auto',
                      marginTop: spacing.md,
                      boxShadow: '0 2px 12px rgba(11, 68, 68, 0.2)'
                    }}
                  >
                    <FaPlus /> Crear Primera Publicación
                  </AnimatedButton>
                )}
              </div>
            ) : (
              <div style={styles.postsGrid}>
                {filteredPosts.map((post) => (
                  <div key={post.ID_publicaciones} style={styles.postCard}>
                    <img
                      src={getImageUrl(post.Imagen_portada)}
                      alt={post.Titulo}
                      style={styles.postImage}
                      onError={(e) => {
                        e.target.src = '/assets/images/logoBN.png';
                      }}
                    />
                    
                    <div style={styles.postContent}>
                      <h3 style={styles.postTitle}>{post.Titulo}</h3>
                      <p style={styles.postExcerpt}>{getCleanSummary(post)}</p>
                      
                      <div style={styles.postMeta}>
                        <span style={styles.postDate}>
                          {formatDate(post.Fecha_modificacion || post.Fecha_creacion)}
                        </span>
                        <span
                          style={{
                            ...styles.postStatus,
                            backgroundColor: getStatusColor(post.Estado).bg,
                            color: getStatusColor(post.Estado).text
                          }}
                        >
                          {post.Estado}
                        </span>
                      </div>
                        
                      <div style={styles.actionsContainer}>
                        <AnimatedButton
                          onClick={() => handleViewPost(post.ID_publicaciones)}
                          backgroundColor={isDarkMode ? colors.infoDark : colors.info}
                          hoverBackgroundColor={isDarkMode ? '#1a7fa1' : '#38bdf8'}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            padding: '0'
                          }}
                          title="Ver publicación"
                        >
                          <FaEye />
                        </AnimatedButton>
                        
                        <AnimatedButton
                          onClick={() => handleEditPost(post.ID_publicaciones)}
                          backgroundColor={isDarkMode ? colors.warningDark : colors.warning}
                          hoverBackgroundColor={isDarkMode ? '#996614' : '#fbbf24'}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            padding: '0',
                            marginLeft: '8px'
                          }}
                          title="Editar publicación"
                        >
                          <FaEdit />
                        </AnimatedButton>
                        
                        <AnimatedButton
                          onClick={() => setConfirmDelete(post)}
                          backgroundColor={isDarkMode ? colors.errorDark : colors.error}
                          hoverBackgroundColor={isDarkMode ? '#b91c1c' : '#f87171'}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            padding: '0',
                            marginLeft: '8px'
                          }}
                          title="Eliminar publicación"
                        >
                          <FaTrash />
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                ))}
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
              <AnimatedButton
                onClick={() => setConfirmDelete(null)}
                backgroundColor={isDarkMode ? '#374151' : '#e5e7eb'}
                hoverBackgroundColor={isDarkMode ? '#4b5563' : '#d1d5db'}
                textColor={isDarkMode ? colors.white : colors.textPrimary}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.md,
                  fontWeight: typography.fontWeight.medium,
                  marginRight: spacing.md
                }}
              >
                Cancelar
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => handleDeletePost(confirmDelete.ID_publicaciones)}
                backgroundColor='#ef4444'
                hoverBackgroundColor='#dc2626'
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.md,
                  fontWeight: typography.fontWeight.medium
                }}
              >
                Eliminar
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
      
      {/* Notificación */}
      {notification.show && (
        <div 
          style={{
            ...styles.notification,
            backgroundColor: notification.type === 'success' ? '#10b981' : 
                            notification.type === 'error' ? '#ef4444' : 
                            notification.type === 'info' ? '#3b82f6' : '#f59e0b'
          }}
        >
          {notification.message}
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default AdminPanel; 