import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter, FaSort, FaSync, FaFolder, FaChartPie } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext';
import { deletePublicacion, getAllPublicaciones } from '../services/publicacionesService';
import { getAllCategorias, getPublicacionesByCategoria } from '../services/categoriasServices';
import { toast } from 'react-toastify';
import AnimatedButton from '../components/utils/AnimatedButton';

// Estilo keyframes para la animación de brillo
const shineAnimation = `
  @keyframes shine {
    from {
      opacity: 0;
      left: 0%;
    }
    50% {
      opacity: 1;
    }
    to {
      opacity: 0;
      left: 100%;
    }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

// Añadir los estilos keyframes al documento
const addKeyframeStyles = () => {
  const existingStyle = document.getElementById('admin-animation-style');
  if (!existingStyle) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'admin-animation-style';
    styleSheet.type = "text/css";
    styleSheet.innerText = shineAnimation;
    document.head.appendChild(styleSheet);
  }
};

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
  
  // Estado para categorías
  const [categories, setCategories] = useState([]);
  const [categoryPostCounts, setCategoryPostCounts] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(true);
  const chartRef = useRef(null);

  // Colores de categorías
  const categoryColors = {
    1: '#FF6B6B', // Noticias
    2: '#4ECDC4', // Técnicas de Estudio
    3: '#FFD166', // Problemáticas en el Estudio
    4: '#6A0572', // Educación de Calidad
    5: '#1A936F', // Herramientas Tecnológicas
    6: '#3D5A80', // Desarrollo Profesional Docente
    7: '#F18F01', // Comunidad y Colaboración
    'default': '#6b7280'
  };

  // Añadir los keyframes al montar el componente
  useEffect(() => {
    addKeyframeStyles();
  }, []);

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

  // Cargar publicaciones y categorías al montar el componente
  useEffect(() => {
    fetchAllPosts();
    fetchCategories();
  }, []);

  // Función para cargar categorías y contar posts por categoría
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const categoriesData = await getAllCategorias();
      
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
        
        // Obtener el recuento de posts por categoría
        const countPromises = categoriesData.map(async (category) => {
          try {
            const posts = await getPublicacionesByCategoria(category.ID_categoria);
            return { 
              id: category.ID_categoria, 
              name: category.Nombre_categoria, 
              count: posts ? posts.length : 0 
            };
          } catch (error) {
            console.error(`Error al obtener posts para categoría ${category.Nombre_categoria}:`, error);
            return { id: category.ID_categoria, name: category.Nombre_categoria, count: 0 };
          }
        });
        
        const categoryCounts = await Promise.all(countPromises);
        
        // Convertir a objeto para fácil acceso
        const countsObj = {};
        categoryCounts.forEach(item => {
          countsObj[item.id] = {
            name: item.name,
            count: item.count
          };
        });
        
        setCategoryPostCounts(countsObj);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

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
    if (!postId) {
      console.error('Error: No se proporcionó un ID de publicación válido para editar');
      showNotification('Error al preparar la publicación para editar', 'error');
      return;
    }

    console.log(`Redirigiendo al editor para editar publicación con ID: ${postId}`);
    showNotification('Preparando publicación para editar...', 'info');
    navigate(`/admin/post/edit/${postId}`);
  };

  // Manejar visualización de publicación
  const handleViewPost = (postId) => {
    navigate(`/blog/${postId}`);
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
    if (!imageData) return '/assets/images/logoBN.png';
    
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
    
    return '/assets/images/logoBN.png';
  };

  // Procesar resumen para mostrar texto limpio
  const getCleanSummary = (post) => {
    // Prioridad 1: Usar el campo Resumen si existe y no está vacío
    if (post.Resumen && post.Resumen.trim() !== '') {
      // Si el resumen contiene HTML, extraer solo el texto
      if (post.Resumen.includes('<') && post.Resumen.includes('>')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.Resumen;
        const cleanText = tempDiv.textContent || tempDiv.innerText || '';
        return cleanText.trim() || 'Sin resumen disponible';
      }
      return post.Resumen;
    }
    
    // Prioridad 2: Si no hay resumen, extraer del contenido
    if (post.Contenido && post.Contenido.trim() !== '') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post.Contenido;
      const cleanText = tempDiv.textContent || tempDiv.innerText || '';
      
      // Truncar a 150 caracteres máximo
      if (cleanText.length > 150) {
        return cleanText.substring(0, 150).trim() + '...';
      }
      return cleanText.trim() || 'Sin contenido disponible';
    }
    
    return 'Sin resumen disponible';
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
      gap: spacing.xl,
      marginBottom: spacing.xl,
      flexWrap: 'wrap'
    },
    statCard: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      boxShadow: shadows.sm,
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
      flex: '1',
      minWidth: '200px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statNumber: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      marginBottom: spacing.xs
    },
    statLabel: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    chartContainer: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      boxShadow: shadows.sm,
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
      flex: '2',
      minWidth: '350px',
      display: 'flex',
      flexDirection: 'column'
    },
    chartTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      marginBottom: spacing.md,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs
    },
    chartCanvas: {
      width: '100%',
      aspectRatio: '1/1', // Asegurar relación de aspecto 1:1
      maxWidth: '400px',
      margin: '0 auto',
      display: 'block'
    },
    categoryLegend: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.md,
      justifyContent: 'center'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? colors.white : colors.textPrimary,
      margin: `${spacing.xs} ${spacing.sm}`,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.md,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      transition: 'all 0.2s ease'
    },
    legendColor: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    categoriesContainer: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      boxShadow: shadows.sm,
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
      flex: '1',
      minWidth: '300px',
      position: 'relative',
      overflow: 'hidden'
    },
    categoryTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      marginBottom: spacing.md,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs
    },
    categoryList: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xs,
      maxHeight: '150px',
      overflowY: 'auto'
    },
    categoryItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.sm,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.03)',
      color: isDarkMode ? colors.white : colors.textPrimary
    },
    categoryCount: {
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.secondary : colors.secondary
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
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-3px) scale(1.1)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
      }
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
        : notification.type === 'info' ? '#3b82f6' : '#f59e0b',
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

  // Obtener la categoría con más posts
  const getMostPopularCategory = () => {
    if (!categories || categories.length === 0) return { name: 'Ninguna', count: 0 };
    
    let maxCount = 0;
    let popularCategory = { name: 'Ninguna', count: 0 };
    
    Object.values(categoryPostCounts).forEach(category => {
      if (category.count > maxCount) {
        maxCount = category.count;
        popularCategory = category;
      }
    });
    
    return popularCategory;
  };

  const popularCategory = getMostPopularCategory();

  // Función para dibujar el gráfico de categorías
  const drawCategoryChart = () => {
    if (!chartRef.current || categories.length === 0 || loadingCategories) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    
    // Mejora la calidad para pantallas de alta resolución
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Ajustar el tamaño del canvas para mantener aspecto cuadrado
    canvas.width = rect.width * dpr;
    canvas.height = rect.width * dpr; // Usar width para ambos para hacerlo cuadrado
    
    // Escalar el contexto según el DPR para mejor calidad
    ctx.scale(dpr, dpr);
    
    // Asegurar que el canvas mantiene su aspecto visual correcto
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.width + 'px';
    
    const size = Math.min(rect.width, rect.width);
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * 0.8; // Reducir ligeramente para dejar margen
    
    // Calcular el total de posts en todas las categorías
    let totalCategoryPosts = 0;
    categories.forEach(category => {
      totalCategoryPosts += categoryPostCounts[category.ID_categoria]?.count || 0;
    });
    
    // Si no hay posts, mostrar un círculo gris
    if (totalCategoryPosts === 0) {
      ctx.clearRect(0, 0, size, size);
      
      // Fondo circular con gradiente
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      bgGradient.addColorStop(0, isDarkMode ? '#2d3748' : '#f7fafc');
      bgGradient.addColorStop(1, isDarkMode ? '#1a202c' : '#e2e8f0');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = bgGradient;
      ctx.fill();
      
      // Sombra sutil
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      
      // Texto de "No hay datos" con mejor estilo
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillStyle = isDarkMode ? '#a0aec0' : '#4a5568';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No hay datos', centerX, centerY);
      
      // Resetear sombra
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      return;
    }
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, size, size);
    
    // Dibujar el gráfico de pastel con sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    
    let startAngle = 0;
    categories.forEach(category => {
      const count = categoryPostCounts[category.ID_categoria]?.count || 0;
      if (count > 0) {
        const sliceAngle = (count / totalCategoryPosts) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        
        // Usar el color correspondiente a la categoría
        const color = categoryColors[category.ID_categoria] || categoryColors.default;
        ctx.fillStyle = color;
        ctx.fill();
        
        // Dibujar un borde sutil entre secciones
        ctx.lineWidth = 1;
        ctx.strokeStyle = isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();
        
        startAngle += sliceAngle;
      }
    });
    
    // Resetear sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Círculo blanco en el centro para efecto donut con gradiente
    const innerRadius = radius * 0.6;
    const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius * 0.7, centerX, centerY, innerRadius);
    
    if (isDarkMode) {
      gradient.addColorStop(0, '#1a2e2d');
      gradient.addColorStop(1, '#1a2e2d');
    } else {
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#f8fafc');
    }
    
    // Sombra interna para profundidad
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Borde sutil para el círculo interno
    ctx.lineWidth = 1;
    ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    ctx.stroke();
    
    // Resetear sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  };
  
  // Dibujar el gráfico cuando cambian las categorías o los conteos
  useEffect(() => {
    drawCategoryChart();
  }, [categories, categoryPostCounts, loadingCategories, isDarkMode]);
  
  // Redimensionar el canvas cuando cambie el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        drawCategoryChart();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [categories, categoryPostCounts]);

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>Panel de Administración</h1>
        
        {/* Estadísticas simplificadas */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{totalPosts}</div>
            <div style={styles.statLabel}>Total de Publicaciones</div>
          </div>
          
          {/* Gráfico de categorías */}
          <div style={styles.chartContainer}>
            <div style={styles.chartTitle}>
              <FaChartPie style={{ color: colors.secondary }} /> Distribución por Categoría
            </div>
            
            {loadingCategories ? (
              <div style={{ textAlign: 'center', padding: spacing.lg }}>Cargando datos...</div>
            ) : (
              <>
                <canvas 
                  ref={chartRef} 
                  style={styles.chartCanvas}
                  width="400"
                  height="400"
                ></canvas>
                
                <div style={styles.categoryLegend}>
                  {categories.map(category => (
                    <div key={category.ID_categoria} style={styles.legendItem}>
                      <div 
                        style={{
                          ...styles.legendColor, 
                          backgroundColor: categoryColors[category.ID_categoria] || categoryColors.default
                        }}
                      ></div>
                      <span>{category.Nombre_categoria} ({categoryPostCounts[category.ID_categoria]?.count || 0})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Header con título y botón de crear */}
        <div style={styles.header}>
          <h2 style={styles.title}>Publicaciones</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AnimatedButton
              onClick={refreshPosts}
              backgroundColor={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f8f9fa'}
              hoverBackgroundColor={isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#e9ecef'}
              textColor={isDarkMode ? '#fff' : colors.primary}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginRight: '10px',
                padding: '8px 16px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <FaSync /> Actualizar
            </AnimatedButton>
            
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
                boxShadow: '0 2px 12px rgba(11, 68, 68, 0.2)'
              }}
            >
              <FaPlus /> Nueva Publicación
            </AnimatedButton>
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
                {filteredPosts.map((post) => {
                  const statusColors = getStatusColor(post.Estado);
                  return (
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
                              backgroundColor: statusColors.bg,
                              color: statusColors.text
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