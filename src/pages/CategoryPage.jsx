// src/pages/CategoryPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostCard from '../components/blog/PostCard';
import { spacing, typography, shadows, borderRadius, transitions } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import { searchByTags } from '../services/searchService';
import { getAllCategorias } from '../services/categoriasServices';
import '../styles/animations.css';
import { FaArrowLeft, FaSearch, FaFilter, FaNewspaper } from 'react-icons/fa';

const CategoryPage = () => {  
  const { colors, isDarkMode } = useTheme();
  const [animate, setAnimate] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [categoryColor, setCategoryColor] = useState('#0b4444');
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  
  // Obtenemos el parámetro de categoría de la URL
  const { id } = useParams();
  
  // Estados para los datos
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Estado para los filtros
  const [selectedFilter, setSelectedFilter] = useState('reciente');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  // Estado para el número de página
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Referencias para animaciones
  const heroRef = useRef(null);
  
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
        setPosts(postsData);
        
        // Calcular total de páginas
        const totalPosts = postsData.length;
        setTotalPages(Math.ceil(totalPosts / 9));
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);
  
  // Filtrar posts por búsqueda
  const filteredPosts = posts.filter(post => 
    post.Titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Ordenar posts según el filtro seleccionado
  const sortedPosts = [...filteredPosts].sort((a, b) => {
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
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      marginBottom: spacing.md,
      cursor: 'pointer',
      background: 'rgba(255,255,255,0.2)',
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      backdropFilter: 'blur(5px)',
      transition: 'all 0.3s ease',
      border: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      width: 'fit-content',
      transform: isHovering ? 'translateX(-5px)' : 'translateX(0)',
      '&:hover': {
        background: 'rgba(255,255,255,0.3)',
      }
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
      gridTemplateColumns: "1fr 300px",
      gap: spacing.xl,
      marginBottom: spacing.xxl,
      '@media (max-width: 768px)': {
        gridTemplateColumns: "1fr"
      },
      transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
      opacity: contentVisible ? 1 : 0,
      transition: 'transform 0.6s ease, opacity 0.6s ease'
    },
    mainContent: {},
    sidebar: {
      '@media (max-width: 768px)': {
        order: -1
      }
    },
    filterBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
      flexWrap: "wrap",
      gap: spacing.md,
      padding: spacing.md,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
      borderRadius: borderRadius.md,
      boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.05)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
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
      border: `2px solid ${isSearchFocused ? categoryColor : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      fontSize: typography.fontSize.sm,
      transition: transitions.default,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.9)',
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      outline: 'none',
      boxShadow: isSearchFocused ? `0 0 0 3px ${categoryColor}40` : 'none'
    },
    searchIcon: {
      position: "absolute",
      left: spacing.md,
      top: "50%",
      transform: "translateY(-50%)",
      color: isSearchFocused ? categoryColor : isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
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
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      border: 'none',
      fontSize: typography.fontSize.sm,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      cursor: 'pointer',
      transition: transitions.default,
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      '&:hover': {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : categoryColor,
        color: isDarkMode ? colors.textLight : '#ffffff'
      }
    },
    filterDropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: spacing.xs,
      width: '180px',
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : '#ffffff',
      borderRadius: borderRadius.md,
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      padding: spacing.sm,
      zIndex: 10,
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
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
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
      }
    },
    activeFilterOption: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : `${categoryColor}20`,
      color: isDarkMode ? '#ffffff' : categoryColor,
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
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#ffffff',
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      transition: transitions.default,
      cursor: "pointer",
      fontSize: typography.fontSize.sm,
      '&:hover': {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : `${categoryColor}20`,
        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : categoryColor,
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
    relatedCategories: {
      marginBottom: spacing.xl,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.05)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      position: 'relative',
      overflow: 'hidden'
    },
    categoriesPattern: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '150px',
      height: '150px',
      backgroundImage: `
        radial-gradient(circle, ${categoryColor}20 10%, transparent 10%),
        radial-gradient(circle, ${categoryColor}15 15%, transparent 15%)
      `,
      backgroundSize: '30px 30px',
      backgroundPosition: '0 0, 15px 15px',
      opacity: 0.5,
      zIndex: 0,
      transform: 'rotate(15deg)'
    },
    relatedCategoriesTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
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
    categoryList: {
      display: "flex",
      flexWrap: "wrap",
      gap: spacing.sm,
      position: 'relative',
      zIndex: 1
    },
    categoryLink: {
      display: "inline-block",
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.9)',
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      fontSize: typography.fontSize.sm,
      textDecoration: "none",
      transition: transitions.default,
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      '&:hover': {
        backgroundColor: categoryColor,
        color: '#ffffff',
        boxShadow: `0 3px 8px ${categoryColor}40`,
        transform: 'translateY(-2px)'
      }
    },
    newsletterBox: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      marginBottom: spacing.xl,
      boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.05)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      position: 'relative',
      overflow: 'hidden'
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
      color: isDarkMode ? colors.textLight : colors.textPrimary,
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
      color: isDarkMode ? colors.textLight : colors.textSecondary,
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
      border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      fontSize: typography.fontSize.sm,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.9)',
      color: isDarkMode ? colors.textLight : colors.textPrimary,
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
      color: isDarkMode ? colors.textLight : colors.textSecondary
    }
  };

  return (
    <div style={{ 
      backgroundColor: isDarkMode 
        ? getDarkerColor(categoryColor, 0.8) // Fondo muy oscuro basado en el color de la categoría
        : getLighterColor(categoryColor, 0.8), // Fondo muy claro basado en el color de la categoría
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      minHeight: "100vh",
      backgroundImage: isDarkMode
        ? `radial-gradient(circle at 15% 50%, ${getDarkerColor(categoryColor, 0.7)}90 0%, transparent 25%),
           radial-gradient(circle at 85% 30%, ${getDarkerColor(categoryColor, 0.7)}80 0%, transparent 25%)`
        : `radial-gradient(circle at 15% 50%, ${getLighterColor(categoryColor, 0.9)}90 0%, transparent 25%),
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
            <p>{error}</p>
          </div>
        ) : (
          <>
            <section ref={heroRef} style={styles.hero} className={animate ? "fade-in" : ""}>
              <div style={styles.heroBackground}></div>
              <div style={styles.heroPattern}></div>
              
              <div style={styles.container}>
                <div style={styles.heroContent}>
                  <button 
                    style={styles.backButton}
                    onClick={goBackToCategories}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <FaArrowLeft size={14} />
                    Volver a categorías
                  </button>
                  
                  <div style={styles.breadcrumb}>
                    <Link to="/" style={styles.breadcrumbLink}>Inicio</Link>
                    <span>›</span>
                    <Link to="/categorias" style={styles.breadcrumbLink}>Categorías</Link>
                    <span>›</span>
                    <span>{currentCategory?.Nombre_categoria || 'Categoría'}</span>
                  </div>
                  
                  <h1 style={styles.title}>{currentCategory?.Nombre_categoria || 'Categoría'}</h1>
                  
                  <p style={styles.subtitle}>
                    {currentCategory?.Descripcion || 'Artículos relacionados con esta categoría'}
                  </p>
                  
                  <div style={styles.categoryTag}>
                    {currentCategory?.Nombre_categoria || 'Categoría'}
                    <span style={styles.categoryCount}>{posts.length}</span>
                  </div>
                </div>
              </div>
            </section>
            
            <div style={styles.contentWrapper}>
              <main style={styles.mainContent}>
                <div style={styles.filterBar}>
                  <div style={styles.searchBox}>
                    <span style={styles.searchIcon}>
                      <FaSearch size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Buscar en esta categoría..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={styles.searchInput}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                  </div>
                  
                  <div style={styles.filterWrapper}>
                    <button 
                      style={styles.filterButton}
                      onClick={() => setShowFilterOptions(!showFilterOptions)}
                    >
                      <FaFilter size={14} />
                      Ordenar por: {selectedFilter === 'reciente' ? 'Más recientes' : 
                        selectedFilter === 'antiguo' ? 'Más antiguos' : 'Alfabéticamente'}
                    </button>
                    
                    {showFilterOptions && (
                      <div style={styles.filterDropdown}>
                        <div 
                          style={{
                            ...styles.filterOption,
                            ...(selectedFilter === 'reciente' ? styles.activeFilterOption : {})
                          }}
                          onClick={() => {
                            setSelectedFilter('reciente');
                            setShowFilterOptions(false);
                          }}
                        >
                          Más recientes
                          {selectedFilter === 'reciente' && <span>✓</span>}
                        </div>
                        <div 
                          style={{
                            ...styles.filterOption,
                            ...(selectedFilter === 'antiguo' ? styles.activeFilterOption : {})
                          }}
                          onClick={() => {
                            setSelectedFilter('antiguo');
                            setShowFilterOptions(false);
                          }}
                        >
                          Más antiguos
                          {selectedFilter === 'antiguo' && <span>✓</span>}
                        </div>
                        <div 
                          style={{
                            ...styles.filterOption,
                            ...(selectedFilter === 'alfabetico' ? styles.activeFilterOption : {})
                          }}
                          onClick={() => {
                            setSelectedFilter('alfabetico');
                            setShowFilterOptions(false);
                          }}
                        >
                          Alfabéticamente
                          {selectedFilter === 'alfabetico' && <span>✓</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {currentPosts.length > 0 ? (
                  <div style={styles.postsGrid}>
                    {currentPosts.map(post => (
                      <div className="hover-scale" key={post.ID_publicaciones}>
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.noPostsMessage}>
                    <h3>No hay publicaciones disponibles</h3>
                    <p>No se encontraron artículos en esta categoría{searchQuery ? ` que coincidan con "${searchQuery}"` : ''}.</p>
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
              </main>
              
              <aside style={styles.sidebar}>
                <div style={styles.relatedCategories}>
                  <div style={styles.categoriesPattern}></div>
                  <h3 style={styles.relatedCategoriesTitle}>Categorías relacionadas</h3>
                  <div style={styles.categoryList}>
                    {categories.filter(cat => cat.ID_categoria !== parseInt(id)).map(category => (
                      <Link 
                        key={category.ID_categoria} 
                        to={`/categoria/${category.ID_categoria}`}
                        style={styles.categoryLink}
                        className="hover-scale"
                      >
                        {category.Nombre_categoria}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div style={styles.newsletterBox}>
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
              </aside>
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;