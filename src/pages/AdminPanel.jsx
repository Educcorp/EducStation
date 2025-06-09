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
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrar Chart.js y el plugin de datalabels
Chart.register(...registerables, ChartDataLabels);

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
  const [filter, setFilter] = useState('published');
  const [sortOrder, setSortOrder] = useState('recientes');
  
  // Estados para UI
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Estado para categorías y gráfica
  const [categories, setCategories] = useState([]);
  const [categoryPostCounts, setCategoryPostCounts] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Ref para el canvas de la gráfica
  const chartRef = useRef(null);

  // Colores para las categorías
  const categoryColors = {
    default: isDarkMode ? '#6b7280' : '#cccccc',
    1: isDarkMode ? '#4ECDC4' : '#1A936F',
    2: isDarkMode ? '#FF6384' : '#FF6B6B',
    3: isDarkMode ? '#FFCE56' : '#FFD166',
    4: isDarkMode ? '#6A0572' : '#9966FF',
    5: isDarkMode ? '#1A936F' : '#4BC0C0',
    6: isDarkMode ? '#3D5A80' : '#3D5A80',
    7: isDarkMode ? '#F18F01' : '#FF9F40',
  };

  // Función para dibujar el gráfico de categorías
  const drawCategoryChart = () => {
    if (!chartRef.current || categories.length === 0 || loadingCategories || Object.keys(categoryPostCounts).length === 0) {
      if (chartRef.current?.chart) {
        chartRef.current.chart.destroy();
      }
      return;
    }

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    if (!container) {
      console.error("Contenedor del canvas no encontrado.");
      if (chartRef.current?.chart) {
        chartRef.current.chart.destroy();
      }
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const canvasWidth = containerRect.width > 0 ? containerRect.width : 350;
    const canvasHeight = Math.min(canvasWidth, 400);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (typeof Chart === 'undefined') {
      console.error('Chart.js no está cargado.');
      if (chartRef.current?.chart) {
        chartRef.current.chart.destroy();
      }
      return;
    }

    if (chartRef.current?.chart) {
      chartRef.current.chart.destroy();
    }

    const chartLabels = Object.values(categoryPostCounts).map(cat => cat.name);
    const chartData = Object.values(categoryPostCounts).map(cat => cat.count);
    const chartBackgroundColors = Object.keys(categoryPostCounts).map(categoryId => 
      categoryColors[categoryId] || categoryColors.default
    );

    chartRef.current.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartData,
          backgroundColor: chartBackgroundColors,
          hoverOffset: 4,
          borderWidth: 1,
          borderColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  label += context.parsed + ' publicaciones';
                }
                return label;
              }
            }
          }
        }
      }
    });
  };

  // Efecto para dibujar el gráfico cuando cambian los datos
  useEffect(() => {
    drawCategoryChart();
  }, [categories, categoryPostCounts, loadingCategories, isDarkMode]);

  // Efecto para manejar el redimensionamiento
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const canvas = chartRef.current;
        const container = canvas.parentElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const canvasWidth = containerRect.width > 0 ? containerRect.width : 350;
        const canvasHeight = Math.min(canvasWidth, 400);

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        if (chartRef.current.chart) {
          chartRef.current.chart.update();
        } else {
          drawCategoryChart();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current?.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, [categories, categoryPostCounts, isDarkMode]);

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
    const verifyAdminAccess = async () => {
      if (!isAuth) {
        navigate('/login', { state: { from: location } });
        return;
      }

      try {
        // Verificar el estado de superusuario con el servidor
        const isSuperUserFromServer = await updateSuperUserStatus();
        
        if (!isSuperUserFromServer) {
          navigate('/');
          toast.error('Acceso denegado. Se requieren privilegios de administrador.');
          return;
        }
      } catch (error) {
        console.error('Error al verificar permisos de administrador:', error);
        navigate('/');
        toast.error('Error al verificar permisos de administrador.');
      }
    };

    verifyAdminAccess();
  }, [isAuth, isSuperUser, navigate, location]);

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
    if (statusFilter === 'published') {
      result = result.filter(post => post.Estado === 'publicado');
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

  // Calcular estadísticas
  const totalPosts = posts.length;

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
      flexWrap: 'wrap',
      alignItems: 'flex-start'
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
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      height: 'auto',
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
      aspectRatio: '1/1',
      maxWidth: '400px',
      maxHeight: '400px',
      minHeight: '0',
      margin: '0 auto',
      display: 'block',
      height: 'auto !important',
      boxSizing: 'border-box !important',
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

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Panel de Administración</h1>
          <div>
            <AnimatedButton
              to="/admin/post/new"
              backgroundColor={isDarkMode ? colors.primaryDark : colors.primary}
              hoverBackgroundColor={isDarkMode ? colors.primary : colors.primaryDark}
              style={styles.createButton}
            >
              <FaPlus /> Crear Nueva Publicación
            </AnimatedButton>
            <AnimatedButton
              onClick={refreshPosts}
              backgroundColor={isDarkMode ? '#4a5568' : '#718096'}
              hoverBackgroundColor={isDarkMode ? '#2d3748' : '#a0a0a0'}
              style={styles.refreshButton}
              title="Actualizar publicaciones"
            >
              <FaSync />
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
              <option value="published">Publicadas</option>
              <option value="draft">Borradores</option>
              <option value="all">Todas</option>
            </select>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={styles.select}
            >
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
              <option value="alfabetico">Alfabético (Título)</option>
            </select>
          </div>
        </div>

        {/* Estadísticas y Gráfica */}
        <div style={styles.statsContainer}>
          {/* Estadísticas de publicaciones - Solo mantener la de Total */}
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{totalPosts}</div>
            <div style={styles.statLabel}>Total de Publicaciones</div>
          </div>
          
          {/* Gráfica de Categorías */}
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}><FaChartPie /> Distribución por Categoría</h3>

            {/* Gráfica de Categorías (Canvas) */}
            {!loadingCategories && categories.length > 0 && Object.keys(categoryPostCounts).length > 0 ? (
              <canvas ref={chartRef} style={styles.chartCanvas}></canvas>
            ) : loadingCategories ? (
              <div style={styles.loadingSpinner}>Cargando categorías...</div>
            ) : (
              <p style={{ 
                textAlign: 'center', 
                color: isDarkMode ? colors.white : colors.textSecondary,
                marginTop: spacing.md
              }}>
                No hay categorías disponibles o publicaciones en ellas para mostrar la gráfica.
              </p>
            )}

            {/* Leyenda de Categorías */}
            {!loadingCategories && categories.length > 0 && Object.keys(categoryPostCounts).length > 0 && (
                <div style={styles.categoryLegend}>
                    {categories.map(cat => (
                        categoryPostCounts[cat.ID_categoria] && categoryPostCounts[cat.ID_categoria].count > 0 && (
                            <div key={cat.ID_categoria} style={styles.legendItem}>
                                <span 
                                    style={{
                                        ...styles.legendColor,
                                        backgroundColor: categoryColors[cat.ID_categoria] || categoryColors.default
                                    }}
                                ></span>
                                {cat.Nombre_categoria} ({categoryPostCounts[cat.ID_categoria].count})
                            </div>
                        )
                    ))}
                     {/* Mostrar "Sin categoría" si hay posts sin categoría asignada (opcional, requiere verificar) */}
                     {/* Se necesita lógica backend/frontend para identificar posts sin categoría */}
                     {/* {categoryPostCounts.null && categoryPostCounts.null.count > 0 && (
                         <div style={styles.legendItem}>
                             <span 
                                 style={{
                                     ...styles.legendColor,
                                     backgroundColor: categoryColors.default
                                 }}
                             ></span>
                             Sin categoría ({categoryPostCounts.null.count})
                         </div>
                     )}*/}
                </div>
            )}
          </div>

          {/* Listado de Categorías (Opcional) */}
          {/* Puedes descomentar si quieres mostrar una lista simple de categorías */}
          {/*
          <div style={styles.categoriesContainer}>
              <h3 style={styles.categoryTitle}><FaFolder /> Listado de Categorías</h3>
              {!loadingCategories && categories.length > 0 ? (
                  <div style={styles.categoryList}>
                      {categories.map(cat => (
                          <div key={cat.ID_categoria} style={styles.categoryItem}>
                              <span>{cat.Nombre_categoria}</span>
                              <span style={styles.categoryCount}>
                                  {categoryPostCounts[cat.ID_categoria] ? categoryPostCounts[cat.ID_categoria].count : 0}
                              </span>
                          </div>
                      ))}
                  </div>
              ) : loadingCategories ? (
                  <div style={styles.loadingSpinner}>Cargando categorías...</div>
              ) : (
                   <p style={{ 
                      textAlign: 'center', 
                      color: isDarkMode ? colors.white : colors.textSecondary,
                      marginTop: spacing.md
                      }}>
                      No hay categorías disponibles.
                   </p>
              )}
          </div>
          */}
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