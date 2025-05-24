// src/pages/CategoryPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostCard from '../components/blog/PostCard';
import { spacing, typography, shadows, borderRadius, transitions } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import { searchByTags, searchPublicaciones } from '../services/searchService';
import { getAllCategorias } from '../services/categoriasServices';
import '../styles/animations.css';
import { FaArrowLeft, FaSearch, FaFilter, FaNewspaper, FaBook, FaPenNib, FaAward, FaCog, FaChalkboardTeacher, FaUsers, FaTag, FaTags, FaSort } from 'react-icons/fa';

const CategoryPage = () => {
  const { colors, isDarkMode } = useTheme();
  const [animate, setAnimate] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [categoryColor, setCategoryColor] = useState('#0b4444');
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtenemos el parámetro de categoría de la URL
  const { id } = useParams();

  // Estados para los datos
  const [posts, setPosts] = useState([]);
  const [allCategoryPosts, setAllCategoryPosts] = useState([]); // Posts originales de la categoría
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Estado para los filtros
  const [selectedFilter, setSelectedFilter] = useState('reciente');
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Estado para el número de página
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Referencias para animaciones
  const heroRef = useRef(null);

  // Estado para los dropdowns
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  // Category colors for better visual identification
  const categoryColors = {
    1: '#FF6B6B', // Noticias
    2: '#4ECDC4', // Técnicas de Estudio
    3: '#FFD166', // Problemáticas en el Estudio
    4: '#6A0572', // Educación de Calidad
    5: '#1A936F', // Herramientas Tecnológicas
    6: '#3D5A80', // Desarrollo Profesional Docente
    7: '#F18F01'  // Comunidad y Colaboración
  };

  // Get current category color
  const getCurrentCategoryColor = () => {
    if (currentCategory && currentCategory.ID_categoria) {
      return categoryColors[currentCategory.ID_categoria] || categoryColor;
    }
    return categoryColor;
  };

  // Recarga forzada al entrar (solo una vez por sesión)
  useEffect(() => {
    if (location.state && location.state.forceReload) {
      // Verificar si ya se realizó la recarga en esta sesión de navegación
      if (!sessionStorage.getItem('categorypage-reloaded')) {
        // Marcar que se va a realizar la recarga
        sessionStorage.setItem('categorypage-reloaded', 'true');
        // Limpiar el estado para evitar bucles infinitos
        window.history.replaceState(null, '', window.location.pathname);
        // Realizar la recarga
        window.location.reload();
      }
    } else {
      // Limpiar la marca de recarga si no hay forceReload
      sessionStorage.removeItem('categorypage-reloaded');
    }
  }, [location]);

  // Activar animación al montar el componente
  useEffect(() => {
    const timeoutHeader = setTimeout(() => setHeaderVisible(true), 300);
    const timeoutContent = setTimeout(() => setContentVisible(true), 600);
    const timeout = setTimeout(() => setAnimate(true), 0);

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeoutHeader);
      clearTimeout(timeoutContent);
    };
  }, []);

  // Cargar categorías y posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Cargar todas las categorías
        const categoriesData = await getAllCategorias();
        setCategories(categoriesData);

        // Encontrar la categoría actual
        const category = categoriesData.find(cat => cat.ID_categoria === parseInt(id));
        setCurrentCategory(category);

        // Establecer el color de la categoría
        if (category) {
          // Obtener color de la categoría basado en el ID
          const categoryColors = {
            1: '#FF6B6B', // Noticias
            2: '#4ECDC4', // Técnicas de Estudio
            3: '#FFD166', // Problemáticas en el Estudio
            4: '#6A0572', // Educación de Calidad
            5: '#1A936F', // Herramientas Tecnológicas
            6: '#3D5A80', // Desarrollo Profesional Docente
            7: '#F18F01'  // Comunidad y Colaboración
          };

          setCategoryColor(categoryColors[category.ID_categoria] || '#0b4444');
        }

        // Cargar posts de esta categoría
        const postsData = await searchByTags(id, 12, 0);
        setAllCategoryPosts(Array.isArray(postsData) ? postsData : []);
        
        // Calcular total de páginas
        const totalPosts = Array.isArray(postsData) ? postsData.length : 0;
        setTotalPages(Math.ceil(totalPosts / 9));

        setError(null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
        // Set default values even on error to prevent rendering issues
        setAllCategoryPosts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      // Handle case when ID is not available
      setLoading(false);
      setError('Categoría no encontrada.');
      setAllCategoryPosts([]);
      setTotalPages(1);
    }
  }, [id]);
  
  // Efecto para manejar la búsqueda con debounce
  useEffect(() => {
    const searchPosts = async () => {
      if (searchQuery.trim() === '') {
        // Si no hay término de búsqueda, mostrar todos los posts de la categoría
        setPosts(allCategoryPosts);
        setSearchLoading(false);
        return;
      }

      try {
        setSearchLoading(true);
        console.log(`Buscando en categoría ${id} con término: "${searchQuery}"`);
        
        // Buscar en todas las publicaciones usando el servicio general
        const searchResults = await searchPublicaciones(searchQuery, 50, 0);
        
        // Filtrar los resultados para que solo incluyan posts de la categoría actual
        const categorySearchResults = searchResults.filter(post => {
          return post.categorias && post.categorias.some(cat => 
            cat.ID_categoria === parseInt(id)
          );
        });
        
        console.log(`Encontrados ${categorySearchResults.length} posts en la categoría ${id} para "${searchQuery}"`);
        setPosts(categorySearchResults);
        
      } catch (error) {
        console.error('Error al buscar posts:', error);
        // En caso de error, usar filtrado local como fallback
        const localFilteredPosts = allCategoryPosts.filter(post => 
          post.Titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.Contenido && post.Contenido.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (post.Resumen && post.Resumen.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setPosts(localFilteredPosts);
      } finally {
        setSearchLoading(false);
      }
    };

    // Debounce la búsqueda para evitar demasiadas llamadas al API
    const timeoutId = setTimeout(searchPosts, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, allCategoryPosts, id]);

  // Efecto para establecer los posts iniciales cuando se cargan los posts de la categoría
  useEffect(() => {
    if (allCategoryPosts.length > 0 && searchQuery.trim() === '') {
      setPosts(allCategoryPosts);
    }
  }, [allCategoryPosts, searchQuery]);
  
  // Efecto para limpiar la búsqueda cuando cambie de categoría
  useEffect(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, [id]);
  
  // Ordenar posts según el filtro seleccionado
  const sortedPosts = [...posts].sort((a, b) => {
    switch (selectedFilter) {
      case 'reciente':
        return new Date(b.Fecha_creacion) - new Date(a.Fecha_creacion);
      case 'antiguo':
        return new Date(a.Fecha_creacion) - new Date(b.Fecha_creacion);
      case 'alfabetico':
        return a.Titulo.localeCompare(b.Titulo);
      default:
        return 0;
    }
  });
  
  // Efecto para recalcular paginación cuando cambien los posts filtrados
  useEffect(() => {
    const postsPerPage = 9;
    const newTotalPages = Math.ceil(sortedPosts.length / postsPerPage);
    setTotalPages(newTotalPages);
    
    // Si la página actual es mayor que el total de páginas, resetear a la primera página
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [sortedPosts.length, currentPage]);

  // Efecto para resetear la página cuando se haga una nueva búsqueda
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      setCurrentPage(1);
    }
  }, [searchQuery]);
  
  // Paginación
  const postsPerPage = 9;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Cambiar página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll suave hacia arriba
    window.scrollTo({
      top: heroRef.current.offsetTop,
      behavior: 'smooth'
    });
  };

  // Ir a la página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll suave hacia arriba
      window.scrollTo({
        top: heroRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Ir a la página siguiente
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll suave hacia arriba
      window.scrollTo({
        top: heroRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Volver a la lista de categorías
  const goBackToCategories = () => {
    navigate('/categorias');
  };

  // Estado para el newsletter
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState(null);

  // Manejar suscripción al newsletter
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);

    // Simulación de suscripción exitosa
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscribeMessage({
        type: 'success',
        text: '¡Gracias por suscribirte! Recibirás nuestros artículos en tu correo.'
      });
      setEmail('');

      // Limpiar el mensaje después de unos segundos
      setTimeout(() => {
        setSubscribeMessage(null);
      }, 4000);
    }, 1500);
  };

  // Función para crear sombra con el color de la categoría
  const getCategoryShadow = (opacity = 0.3) => {
    return `0 10px 25px ${categoryColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  // Función para generar variaciones de color
  const getLighterColor = (color, factor = 0.2) => {
    // Convertir hex a rgb
    let hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Aclarar
    r = Math.min(255, r + (255 - r) * factor);
    g = Math.min(255, g + (255 - g) * factor);
    b = Math.min(255, b + (255 - b) * factor);

    // Convertir de vuelta a hex
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };

  const getDarkerColor = (color, factor = 0.2) => {
    // Convertir hex a rgb
    let hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Oscurecer
    r = Math.max(0, r * (1 - factor));
    g = Math.max(0, g * (1 - factor));
    b = Math.max(0, b * (1 - factor));

    // Convertir de vuelta a hex
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Estilos CSS
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `0 ${spacing.md}`
    },
    hero: {
      padding: `${spacing.xxl} 0`,
      background: `linear-gradient(120deg, ${getDarkerColor(categoryColor, 0.2)} 0%, ${categoryColor} 100%)`,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.xxl,
      marginTop: spacing.xl,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: getCategoryShadow(0.5),
      transform: headerVisible ? 'translateY(0)' : 'translateY(-20px)',
      opacity: headerVisible ? 1 : 0,
      transition: 'transform 0.6s ease, opacity 0.6s ease'
    },
    heroContent: {
      maxWidth: "800px",
      position: 'relative',
      zIndex: 5
    },
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `
        radial-gradient(circle at 20% 30%, ${getLighterColor(categoryColor, 0.4)}40 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, ${getLighterColor(categoryColor, 0.3)}40 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, ${getLighterColor(categoryColor, 0.2)}20 0%, transparent 40%)
      `,
      opacity: 0.6,
      zIndex: 2
    },
    heroPattern: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '30%',
      backgroundImage: `
        linear-gradient(45deg, ${getLighterColor(categoryColor, 0.3)} 25%, transparent 25%), 
        linear-gradient(-45deg, ${getLighterColor(categoryColor, 0.3)} 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, ${getLighterColor(categoryColor, 0.3)} 75%), 
        linear-gradient(-45deg, transparent 75%, ${getLighterColor(categoryColor, 0.3)} 75%)
      `,
      backgroundSize: '20px 20px',
      opacity: 0.1,
      zIndex: 3
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      marginBottom: spacing.md,
      cursor: 'pointer',
      background: 'rgba(255,255,255,0.25)',
      padding: `${spacing.sm} ${spacing.lg}`,
      borderRadius: borderRadius.round,
      backdropFilter: 'blur(5px)',
      transition: 'all 0.3s ease',
      border: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      width: 'fit-content',
      transform: isHovering ? 'translateX(-5px)' : 'translateX(0)',
    },
    breadcrumb: {
      marginBottom: spacing.md,
      color: '#ffffff',
      fontSize: typography.fontSize.sm,
      display: "flex",
      alignItems: "center",
      gap: spacing.sm
    },
    breadcrumbLink: {
      color: 'rgba(255,255,255,0.8)',
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        color: '#ffffff',
        textDecoration: 'underline'
      }
    },
    title: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.md,
      color: '#ffffff',
      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
      position: 'relative',
      display: 'inline-block',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-10px',
        left: '0',
        width: '60px',
        height: '4px',
        background: '#ffffff',
        borderRadius: '2px'
      }
    },
    subtitle: {
      fontSize: typography.fontSize.lg,
      color: 'rgba(255,255,255,0.9)',
      marginBottom: spacing.lg,
      lineHeight: 1.6,
      textShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    categoryTag: {
      display: "inline-flex",
      alignItems: "center",
      gap: spacing.xs,
      backgroundColor: 'rgba(255,255,255,0.25)',
      backdropFilter: 'blur(5px)',
      color: '#ffffff',
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    categoryCount: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      color: categoryColor,
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      fontSize: "12px",
      fontWeight: typography.fontWeight.bold
    },
    contentWrapper: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: spacing.xl,
      marginBottom: spacing.xxl,
      '@media (max-width: 768px)': {
        gridTemplateColumns: "1fr"
      },
      transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
      opacity: contentVisible ? 1 : 0,
      transition: 'transform 0.6s ease, opacity 0.6s ease',
      position: 'relative',
      zIndex: 10
    },
    mainContent: {
      width: '100%'
    },
    filterBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
      flexWrap: "wrap",
      gap: spacing.md,
      padding: spacing.md,
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderRadius: borderRadius.md,
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      border: `1px solid rgba(0,0,0,0.05)`,
      backdropFilter: 'blur(8px)'
    },
    searchBox: {
      flex: "1",
      maxWidth: "350px",
      position: "relative"
    },
    searchInput: {
      width: "100%",
      padding: `${spacing.sm} ${spacing.md} ${spacing.sm} ${spacing.xxl}`,
      borderRadius: borderRadius.md,
      border: `2px solid ${isSearchFocused ? categoryColor : 'rgba(0,0,0,0.1)'}`,
      fontSize: typography.fontSize.sm,
      transition: transitions.default,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      color: colors.textPrimary,
      outline: 'none',
      boxShadow: isSearchFocused ? `0 0 0 3px ${categoryColor}33` : 'none'
    },
    searchIcon: {
      position: "absolute",
      left: spacing.md,
      top: "50%",
      transform: "translateY(-50%)",
      color: isSearchFocused ? categoryColor : 'rgba(0,0,0,0.5)',
      transition: transitions.default,
      fontSize: "16px"
    },
    filterWrapper: {
      position: 'relative'
    },
    filterButton: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      padding: `${spacing.md} ${spacing.lg}`,
      borderRadius: borderRadius.lg,
      border: 'none',
      fontSize: typography.fontSize.md,
      backgroundColor: 'rgba(255,255,255,0.95)',
      color: colors.textPrimary,
      cursor: 'pointer',
      transition: transitions.default,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      '&:hover': {
        backgroundColor: categoryColor,
        color: '#ffffff'
      }
    },
    filterDropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: spacing.xs,
      width: '220px',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderRadius: borderRadius.md,
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      padding: spacing.sm,
      zIndex: 100,
      border: `1px solid rgba(0,0,0,0.05)`,
      animation: 'fadeIn 0.2s ease-out'
    },
    filterOption: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.sm,
      cursor: 'pointer',
      transition: transitions.fast,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.05)'
      }
    },
    activeFilterOption: {
      backgroundColor: `${categoryColor}20`,
      color: categoryColor,
      fontWeight: typography.fontWeight.medium
    },
    postsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: spacing.lg,
      marginBottom: spacing.xl
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.xl,
      marginBottom: spacing.xl
    },
    pageButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      borderRadius: borderRadius.md,
      border: `1px solid rgba(0,0,0,0.1)`,
      backgroundColor: '#ffffff',
      color: colors.textPrimary,
      transition: transitions.default,
      cursor: "pointer",
      fontSize: typography.fontSize.sm,
      '&:hover': {
        backgroundColor: `${categoryColor}20`,
        borderColor: categoryColor,
        transform: 'translateY(-2px)',
        boxShadow: `0 3px 8px ${categoryColor}30`
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: "not-allowed",
        transform: 'none',
        boxShadow: 'none'
      }
    },
    activePageButton: {
      backgroundColor: categoryColor,
      color: '#ffffff',
      borderColor: categoryColor,
      boxShadow: `0 3px 8px ${categoryColor}50`,
      '&:hover': {
        backgroundColor: getDarkerColor(categoryColor, 0.1)
      }
    },
    newsletterBox: {
      backgroundColor: 'rgba(255,255,255,0.8)',
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      marginBottom: spacing.xl,
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      border: `1px solid rgba(0,0,0,0.05)`,
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '800px',
      margin: '0 auto'
    },
    newsletterPattern: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '150px',
      height: '150px',
      backgroundImage: `
        linear-gradient(45deg, ${categoryColor}15 25%, transparent 25%), 
        linear-gradient(-45deg, ${categoryColor}15 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, ${categoryColor}15 75%), 
        linear-gradient(-45deg, transparent 75%, ${categoryColor}15 75%)
      `,
      backgroundSize: '20px 20px',
      opacity: 0.7,
      zIndex: 0
    },
    newsletterTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.sm,
      color: colors.textPrimary,
      position: 'relative',
      zIndex: 1,
      display: 'inline-block',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-5px',
        left: '0',
        width: '40px',
        height: '3px',
        backgroundColor: categoryColor,
        borderRadius: '2px'
      }
    },
    newsletterText: {
      fontSize: typography.fontSize.sm,
      marginBottom: spacing.md,
      color: colors.textSecondary,
      position: 'relative',
      zIndex: 1
    },
    newsletterForm: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.sm,
      position: 'relative',
      zIndex: 1
    },
    newsletterInput: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      border: `2px solid rgba(0,0,0,0.1)`,
      fontSize: typography.fontSize.sm,
      backgroundColor: 'rgba(255,255,255,0.9)',
      color: colors.textPrimary,
      outline: 'none',
      transition: transitions.default,
      '&:focus': {
        borderColor: categoryColor,
        boxShadow: `0 0 0 3px ${categoryColor}40`
      }
    },
    newsletterButton: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      backgroundColor: categoryColor,
      color: '#ffffff',
      border: "none",
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: getDarkerColor(categoryColor, 0.1),
        transform: 'translateY(-2px)',
        boxShadow: `0 3px 8px ${categoryColor}50`
      },
      '&:disabled': {
        opacity: 0.7,
        cursor: "not-allowed",
        transform: 'none',
        boxShadow: 'none'
      }
    },
    messageBox: {
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      marginTop: spacing.sm,
      animation: 'fadeIn 0.3s ease'
    },
    successMessage: {
      backgroundColor: "#d1e7dd",
      color: "#0f5132",
      borderLeft: `4px solid #0f5132`
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#842029",
      borderLeft: `4px solid #842029`
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "300px"
    },
    loadingSpinner: {
      width: "40px",
      height: "40px",
      border: `4px solid ${colors.gray200}`,
      borderTop: `4px solid ${categoryColor}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    errorContainer: {
      padding: spacing.lg,
      backgroundColor: "#f8d7da",
      color: "#842029",
      borderRadius: borderRadius.md,
      textAlign: "center",
      margin: `${spacing.xl} 0`,
      border: `1px solid rgba(132, 32, 41, 0.2)`
    },
    noPostsMessage: {
      textAlign: "center",
      padding: spacing.xl,
      color: colors.textSecondary
    },
    heroIcon: {
      position: 'absolute',
      top: '50%',
      right: '10%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 255, 255, 0.3)',
      zIndex: 4
    },
    dropdownButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      color: colors.primary,
      border: `2px solid rgba(31, 78, 78, 0.1)`,
      borderRadius: borderRadius.lg,
      padding: `${spacing.md} ${spacing.xl}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      fontSize: typography.fontSize.md,
      position: 'relative'
    },
    dropdownMenu: {
      position: 'absolute',
      top: 'calc(100% + 5px)',
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderRadius: borderRadius.lg,
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      zIndex: 100,
      maxHeight: '300px',
      overflowY: 'auto',
      border: `1px solid rgba(31, 78, 78, 0.1)`,
      padding: spacing.md
    },
    dropdownItem: {
      padding: `${spacing.sm} ${spacing.md}`,
      cursor: 'pointer',
      borderRadius: borderRadius.md,
      margin: spacing.xs,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm
    },
    dropdownIcon: {
      marginRight: spacing.sm,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  // Category dropdown component
  const CategoryDropdown = () => {
    // Map of category icons by ID (or type)
    const categoryIcons = {
      1: <FaNewspaper size={16} />, // Noticias
      2: <FaBook size={16} />, // Técnicas de Estudio
      3: <FaPenNib size={16} />, // Problemáticas en el Estudio
      4: <FaAward size={16} />, // Educación de Calidad
      5: <FaCog size={16} />, // Herramientas Tecnológicas
      6: <FaChalkboardTeacher size={16} />, // Desarrollo Profesional Docente
      7: <FaUsers size={16} />, // Comunidad y Colaboración
    };

    const handleCategorySelect = (categoryId) => {
      if (categoryId === 'explore') {
        navigate('/categorias');
      } else if (categoryId === '') {
        navigate('/blog');
      } else if (categoryId !== '') {
        navigate(`/categoria/${categoryId}`);
      }
      setCategoryDropdownOpen(false);
    };

    return (
      <div ref={categoryDropdownRef} style={{ position: 'relative', width: '100%' }}>
        <button
          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
          style={{
            ...styles.dropdownButton,
            borderColor: 'rgba(31, 78, 78, 0.2)',
            background: `linear-gradient(to right, ${getLighterColor(getCurrentCategoryColor(), 0.8)}, ${getLighterColor(getCurrentCategoryColor(), 0.9)})`,
            boxShadow: `0 4px 8px ${getCurrentCategoryColor()}33`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaFilter style={{
              marginRight: spacing.md,
              color: getCurrentCategoryColor(),
              fontSize: '1rem'
            }} />
            <span style={{
              color: getCurrentCategoryColor(),
              fontWeight: 600
            }}>
              {currentCategory?.Nombre_categoria || currentCategory?.Nombre || 'Todas las categorías'}
            </span>
          </div>
          <div style={{
            color: getCurrentCategoryColor(),
            transition: 'transform 0.3s ease',
            transform: categoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            ▼
          </div>
        </button>

        {categoryDropdownOpen && (
          <div style={{
            ...styles.dropdownMenu,
            boxShadow: `0 8px 20px ${getCurrentCategoryColor()}33`,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            animation: 'fadeIn 0.3s ease forwards',
          }}>
            <div
              style={{
                ...styles.dropdownItem,
                backgroundColor: !id ? getLighterColor(getCurrentCategoryColor(), 0.1) : 'transparent',
                color: !id ? getCurrentCategoryColor() : colors.primary,
                fontWeight: !id ? 600 : 400,
                borderLeft: `3px solid ${!id ? getCurrentCategoryColor() : 'transparent'}`,
              }}
              onClick={() => handleCategorySelect('')}
              onMouseEnter={(e) => {
                if (id) {
                  e.currentTarget.style.backgroundColor = `${getCurrentCategoryColor()}15`;
                  e.currentTarget.style.color = getCurrentCategoryColor();
                }
              }}
              onMouseLeave={(e) => {
                if (id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.primary;
                }
              }}
            >
              <span style={{
                ...styles.dropdownIcon,
                backgroundColor: 'rgba(31, 78, 78, 0.2)',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.primary,
              }}>
                <FaFilter size={14} />
              </span>
              Todas las categorías
            </div>

            {categories.map(category => (
              <div
                key={category.ID_categoria}
                style={{
                  ...styles.dropdownItem,
                  backgroundColor: parseInt(id) === category.ID_categoria
                    ? getLighterColor(getCurrentCategoryColor(), 0.1)
                    : 'transparent',
                  color: parseInt(id) === category.ID_categoria
                    ? categoryColors[category.ID_categoria]
                    : colors.primary,
                  fontWeight: parseInt(id) === category.ID_categoria ? 600 : 400,
                  borderLeft: `3px solid ${parseInt(id) === category.ID_categoria ? getCurrentCategoryColor() : 'transparent'}`,
                }}
                onClick={() => handleCategorySelect(category.ID_categoria.toString())}
                onMouseEnter={(e) => {
                  if (parseInt(id) !== category.ID_categoria) {
                    e.currentTarget.style.backgroundColor = `${categoryColors[category.ID_categoria]}15`;
                    e.currentTarget.style.color = categoryColors[category.ID_categoria];
                  }
                }}
                onMouseLeave={(e) => {
                  if (parseInt(id) !== category.ID_categoria) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.primary;
                  }
                }}
              >
                <span style={{
                  ...styles.dropdownIcon,
                  backgroundColor: `${categoryColors[category.ID_categoria]}33`,
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: categoryColors[category.ID_categoria],
                }}>
                  {categoryIcons[category.ID_categoria] || <FaTag size={14} />}
                </span>
                {category.Nombre_categoria || category.Nombre}
              </div>
            ))}

            <div
              style={{
                ...styles.dropdownItem,
                backgroundColor: 'rgba(31, 147, 111, 0.1)',
                marginTop: spacing.sm,
                borderTop: `1px solid rgba(31, 78, 78, 0.1)`,
                paddingTop: spacing.md,
                color: colors.primary,
                fontWeight: 600,
              }}
              onClick={() => handleCategorySelect('explore')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(31, 147, 111, 0.2)';
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(31, 147, 111, 0.1)';
                e.currentTarget.style.color = colors.primary;
              }}
            >
              <span style={{
                ...styles.dropdownIcon,
                backgroundColor: 'rgba(31, 147, 111, 0.2)',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.primary,
              }}>
                <FaTags size={14} />
              </span>
              Explorar todas las categorías
            </div>
          </div>
        )}
      </div>
    );
  };

  // Sort dropdown component
  const SortDropdown = () => {
    const sortOptions = [
      { value: 'reciente', label: 'Más recientes', icon: <FaSort /> },
      { value: 'antiguo', label: 'Más antiguos', icon: <FaSort /> },
      { value: 'alfabetico', label: 'Alfabéticamente', icon: <FaSort /> }
    ];

    const handleSortSelect = (value) => {
      setSelectedFilter(value);
      setSortDropdownOpen(false);
    };

    return (
      <div ref={sortDropdownRef} style={{ position: 'relative', width: '100%' }}>
        <button
          onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          style={{
            ...styles.dropdownButton,
            borderColor: 'rgba(31, 78, 78, 0.2)',
            background: `linear-gradient(to right, ${getLighterColor(getCurrentCategoryColor(), 0.8)}, ${getLighterColor(getCurrentCategoryColor(), 0.9)})`,
            boxShadow: `0 4px 8px ${getCurrentCategoryColor()}33`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaSort style={{
              marginRight: spacing.md,
              color: getCurrentCategoryColor(),
              fontSize: '1rem'
            }} />
            <span style={{
              color: getCurrentCategoryColor(),
              fontWeight: 600
            }}>
              {sortOptions.find(option => option.value === selectedFilter)?.label || 'Ordenar por'}
            </span>
          </div>
          <div style={{
            color: getCurrentCategoryColor(),
            transition: 'transform 0.3s ease',
            transform: sortDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            ▼
          </div>
        </button>

        {sortDropdownOpen && (
          <div style={{
            ...styles.dropdownMenu,
            boxShadow: `0 8px 20px ${getCurrentCategoryColor()}33`,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            animation: 'fadeIn 0.3s ease forwards',
          }}>
            {sortOptions.map(option => (
              <div
                key={option.value}
                style={{
                  ...styles.dropdownItem,
                  backgroundColor: selectedFilter === option.value
                    ? getLighterColor(getCurrentCategoryColor(), 0.1)
                    : 'transparent',
                  color: selectedFilter === option.value
                    ? getCurrentCategoryColor()
                    : colors.primary,
                  fontWeight: selectedFilter === option.value ? 600 : 400,
                  borderLeft: `3px solid ${selectedFilter === option.value
                    ? getCurrentCategoryColor()
                    : 'transparent'}`,
                }}
                onClick={() => handleSortSelect(option.value)}
                onMouseEnter={(e) => {
                  if (selectedFilter !== option.value) {
                    e.currentTarget.style.backgroundColor = `${getCurrentCategoryColor()}15`;
                    e.currentTarget.style.color = getCurrentCategoryColor();
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFilter !== option.value) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.primary;
                  }
                }}
              >
                <span style={{
                  ...styles.dropdownIcon,
                  backgroundColor: `${getCurrentCategoryColor()}33`,
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getCurrentCategoryColor(),
                }}>
                  {option.icon}
                </span>
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: getLighterColor(categoryColor, 0.8),
      color: colors.textPrimary,
      minHeight: "100vh",
      backgroundImage: `radial-gradient(circle at 15% 50%, ${getLighterColor(categoryColor, 0.9)}90 0%, transparent 25%),
         radial-gradient(circle at 85% 30%, ${getLighterColor(categoryColor, 0.9)}80 0%, transparent 25%)`,
      transition: 'background-color 0.5s ease'
    }}>
      <Header />

      <div style={styles.container}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
              }
              .hover-scale {
                transition: transform 0.3s ease;
              }
              .hover-scale:hover {
                transform: scale(1.03);
              }
            `}</style>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <h3>Error al cargar la categoría</h3>
            <p>{error}</p>
            <button
              onClick={() => navigate('/categorias')}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                backgroundColor: colors.primary,
                color: '#ffffff',
                border: 'none',
                borderRadius: borderRadius.md,
                cursor: 'pointer',
                marginTop: spacing.lg,
                fontWeight: typography.fontWeight.medium
              }}
            >
              Volver a categorías
            </button>
          </div>
        ) : (
          <>
            <section ref={heroRef} style={styles.hero} className={animate ? "fade-in" : ""}>
              <div style={styles.heroBackground}></div>
              <div style={styles.heroPattern}></div>

              <div style={styles.container}>
                <div style={styles.heroContent}>
                  <button
                    style={{
                      ...styles.backButton,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: typography.fontSize.md,
                      fontWeight: typography.fontWeight.medium,
                      marginBottom: spacing.md,
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.25)',
                      padding: `${spacing.sm} ${spacing.lg}`,
                      borderRadius: borderRadius.round,
                      backdropFilter: 'blur(5px)',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      width: 'fit-content',
                      transform: isHovering ? 'translateX(-5px)' : 'translateX(0)',
                    }}
                    onClick={goBackToCategories}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <FaArrowLeft size={18} />
                    Volver a categorías
                  </button>

                  <h1 style={styles.title}>{currentCategory?.Nombre_categoria || currentCategory?.Nombre || 'Categoría'}</h1>

                  <p style={styles.subtitle}>
                    {currentCategory?.Descripcion || 'Artículos relacionados con esta categoría'}
                  </p>

                  <div style={{
                    ...styles.categoryTag,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    padding: `${spacing.sm} ${spacing.lg}`,
                    borderRadius: borderRadius.round,
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.medium,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}>
                    Número de posts
                    <span style={{
                      ...styles.categoryCount,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#ffffff",
                      color: getCurrentCategoryColor(),
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      fontSize: "14px",
                      fontWeight: typography.fontWeight.bold,
                      marginLeft: spacing.sm
                    }}>{allCategoryPosts.length}</span>
                  </div>
                </div>

                <div style={{
                  ...styles.heroIcon,
                  position: 'absolute',
                  top: '50%',
                  right: '10%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  zIndex: 4
                }} className="float-animation">
                  {currentCategory?.ID_categoria === 1 ? <FaNewspaper size={150} /> :
                    currentCategory?.ID_categoria === 2 ? <FaBook size={150} /> :
                      currentCategory?.ID_categoria === 3 ? <FaPenNib size={150} /> :
                        currentCategory?.ID_categoria === 4 ? <FaAward size={150} /> :
                          currentCategory?.ID_categoria === 5 ? <FaCog size={150} /> :
                            currentCategory?.ID_categoria === 6 ? <FaChalkboardTeacher size={150} /> :
                              currentCategory?.ID_categoria === 7 ? <FaUsers size={150} /> :
                                <FaNewspaper size={150} />}
                </div>
              </div>
            </section>

            <div style={styles.contentWrapper}>
              <main style={{
                ...styles.mainContent,
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: '12px',
                    padding: spacing.lg,
                    marginBottom: spacing.xl,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: spacing.md,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    border: `1px solid rgba(0,0,0,0.05)`,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    zIndex: 50,
                  }}
                >
                  <div style={{ flex: '1 1 300px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', 
                      left: spacing.md, 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: colors.gray600,
                      pointerEvents: 'none',
                      transition: 'all 0.3s'
                    }}>
                      {searchLoading ? (
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid transparent',
                          borderTop: '2px solid currentColor',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                      ) : (
                        <FaSearch size={16} />
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder={searchLoading ? "Buscando..." : "Buscar en esta categoría..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      style={{
                        width: '100%',
                        padding: `${spacing.md} ${spacing.md} ${spacing.md} ${spacing.xxl}`,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        border: `2px solid ${isSearchFocused
                          ? getCurrentCategoryColor()
                          : 'rgba(0, 0, 0, 0.1)'}`,
                        borderRadius: '10px',
                        outline: 'none',
                        fontSize: typography.fontSize.md,
                        color: colors.textPrimary,
                        transition: 'all 0.3s',
                        boxShadow: isSearchFocused ? `0 0 0 3px ${getCurrentCategoryColor()}33` : 'none',
                        opacity: searchLoading ? 0.7 : 1
                      }}
                    />
                  </div>

                  <div style={{ flex: '0 1 300px' }}>
                    <CategoryDropdown />
                  </div>

                  <div style={{ flex: '0 1 250px' }}>
                    <SortDropdown />
                  </div>
                </div>

                {currentPosts.length > 0 ? (
                  <div style={{
                    ...styles.postsGrid,
                    marginTop: spacing.xl,
                    position: 'relative',
                    zIndex: 20
                  }}>
                    {currentPosts.map((post, index) => (
                      <div
                        className="post-card-animation"
                        key={post.ID_publicaciones}
                        style={{
                          "--animation-order": index,
                          background: "transparent"
                        }}
                      >
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    ...styles.noPostsMessage,
                    marginTop: spacing.xl,
                    padding: spacing.xl,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: borderRadius.lg,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                  }}>
                    <h3 style={{
                      fontSize: typography.fontSize.xl,
                      marginBottom: spacing.md,
                      color: colors.primary
                    }}>No hay publicaciones disponibles</h3>
                    <p style={{ marginBottom: spacing.lg }}>
                      No se encontraron artículos en esta categoría{searchQuery ? ` que coincidan con "${searchQuery}"` : ''}.
                    </p>
                    <button
                      onClick={() => navigate('/categorias')}
                      style={{
                        padding: `${spacing.sm} ${spacing.lg}`,
                        backgroundColor: colors.primary,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: borderRadius.md,
                        cursor: 'pointer',
                        fontWeight: typography.fontWeight.medium
                      }}
                    >
                      Explorar otras categorías
                    </button>
                  </div>
                )}

                {totalPages > 1 && (
                  <div style={styles.pagination}>
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      style={styles.pageButton}
                      aria-label="Página anterior"
                    >
                      &lt;
                    </button>

                    {[...Array(totalPages).keys()].map(number => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        style={{
                          ...styles.pageButton,
                          ...(currentPage === number + 1 ? styles.activePageButton : {})
                        }}
                        aria-label={`Página ${number + 1}`}
                        aria-current={currentPage === number + 1 ? "page" : undefined}
                      >
                        {number + 1}
                      </button>
                    ))}

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      style={styles.pageButton}
                      aria-label="Página siguiente"
                    >
                      &gt;
                    </button>
                  </div>
                )}

                <div style={{
                  ...styles.newsletterBox,
                  marginTop: spacing.xxl,
                  marginBottom: spacing.xl,
                }}>
                  <div style={styles.newsletterPattern}></div>
                  <h3 style={styles.newsletterTitle}>Suscríbete al newsletter</h3>
                  <p style={styles.newsletterText}>
                    Recibe las últimas publicaciones y novedades directamente en tu correo.
                  </p>

                  <form style={styles.newsletterForm} onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      placeholder="Tu correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.newsletterInput}
                      required
                    />

                    <button
                      type="submit"
                      style={styles.newsletterButton}
                      disabled={isSubscribing}
                      className={isSubscribing ? "" : "hover-scale"}
                    >
                      {isSubscribing ? 'Suscribiendo...' : 'Suscribirse'}
                    </button>

                    {subscribeMessage && (
                      <div
                        style={{
                          ...styles.messageBox,
                          ...(subscribeMessage.type === 'success' ? styles.successMessage : styles.errorMessage)
                        }}
                      >
                        {subscribeMessage.text}
                      </div>
                    )}
                  </form>
                </div>
              </main>
            </div>
          </>
        )}
      </div>

      <Footer />

      <style>
        {`
          @keyframes fadeUpIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .post-card-animation {
            animation: fadeUpIn 0.6s ease forwards;
            animation-delay: calc(0.1s * var(--animation-order, 0));
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background-color: transparent;
          }
          
          .post-card-animation:hover {
            transform: translateY(-5px);
          }
          
          .post-card-animation > a > div {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes float {
            0% {
              transform: translateY(-50%) translateX(0);
            }
            50% {
              transform: translateY(-50%) translateX(-10px);
            }
            100% {
              transform: translateY(-50%) translateX(0);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default CategoryPage;