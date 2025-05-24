import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostList from '../components/blog/PostList';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography, borderRadius, shadows, transitions } from '../styles/theme';
import { getAllCategorias } from '../services/categoriasServices';
import { FaTags, FaArrowRight, FaSearch, FaFilter, FaSort, FaBookOpen, FaTag, FaNewspaper, FaBook, FaPenNib, FaAward, FaCog, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

const BlogPage = () => {
  const { colors, isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [hoveredPromo, setHoveredPromo] = useState(false);
  const [animate, setAnimate] = useState(false);
  const postListRef = useRef(null);
  const [sortOrder, setSortOrder] = useState('recientes');
  const navigate = useNavigate();
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const location = useLocation();

  // Recarga forzada al entrar (solo una vez por sesión) - OPTIMIZADA
  useEffect(() => {
    const shouldForceReload = () => {
      // 1. Si viene con forceReload explícito
      if (location.state && location.state.forceReload) {
        return true;
      }
      
      // 2. Detectar si viene de un post usando sessionStorage (MÉTODO PRINCIPAL)
      const leftPost = sessionStorage.getItem('left-post');
      const cameFromBlog = sessionStorage.getItem('came-from-blog');
      
      if (leftPost && cameFromBlog) {
        return true;
      }
      
      // 3. Detectar navegación hacia atrás usando performance.navigation (INMEDIATO)
      const isBackNavigation = window.performance?.navigation?.type === 2; // TYPE_BACK_FORWARD
      
      // 4. Detectar si viene de un post individual usando referrer (INMEDIATO)
      const previousUrl = document.referrer;
      const currentUrl = window.location.href;
      
      const comesFromPost = previousUrl && 
        previousUrl.includes('/blog/') && 
        /\/blog\/\d+/.test(previousUrl) &&
        currentUrl.includes('/blog') &&
        !currentUrl.includes('/blog/');
      
      return isBackNavigation || comesFromPost;
    };

    if (shouldForceReload()) {
      const reloadKey = 'blogpage-reloaded';
      if (!sessionStorage.getItem(reloadKey)) {
        // Limpiar marcadores INMEDIATAMENTE
        sessionStorage.removeItem('left-post');
        sessionStorage.removeItem('came-from-blog');
        // Marcar recarga
        sessionStorage.setItem(reloadKey, 'true');
        // Limpiar estado y recargar INMEDIATAMENTE
        window.history.replaceState(null, '', window.location.pathname);
        window.location.reload();
      }
    } else {
      // Limpiar la marca de recarga si no hay forceReload
      sessionStorage.removeItem('blogpage-reloaded');
    }
  }, [location]);

  // Detectar navegación hacia atrás desde posts - OPTIMIZADO PARA INSTANTANEIDAD
  useEffect(() => {
    const handlePopState = (event) => {
      const currentPath = window.location.pathname;
      const isOnBlog = currentPath === '/blog';
      
      if (isOnBlog) {
        // SIN DELAY - Verificación inmediata
        const leftPost = sessionStorage.getItem('left-post');
        const cameFromBlog = sessionStorage.getItem('came-from-blog');
        
        if (leftPost && cameFromBlog && !sessionStorage.getItem('blogpage-reloaded')) {
          // Limpiar marcadores inmediatamente
          sessionStorage.removeItem('left-post');
          sessionStorage.removeItem('came-from-blog');
          sessionStorage.setItem('blogpage-reloaded', 'true');
          // Recarga inmediata sin delay
          window.location.reload();
        }
      }
    };

    // Agregar listener para navegación hacia atrás
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Animación de entrada
  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // Animación para las tarjetas de blog
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = document.querySelectorAll('.blog-post-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 80 * index);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    if (postListRef.current) {
      observer.observe(postListRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getAllCategorias();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'explore') {
      // Navigate to categories page with force reload
      navigate('/categorias', { state: { forceReload: true } });
    } else if (selectedValue !== '') {
      // Navigate to specific category page with force reload
      navigate(`/categoria/${selectedValue}`, { state: { forceReload: true } });
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Verificación inmediata al montar el componente - DETECCIÓN INSTANTÁNEA
  useEffect(() => {
    // Verificación inmediata al cargar la página
    const checkForInstantReload = () => {
      const leftPost = sessionStorage.getItem('left-post');
      const cameFromBlog = sessionStorage.getItem('came-from-blog');
      
      if (leftPost && cameFromBlog && !sessionStorage.getItem('blogpage-reloaded')) {
        // Limpiar marcadores y recargar inmediatamente
        sessionStorage.removeItem('left-post');
        sessionStorage.removeItem('came-from-blog');
        sessionStorage.setItem('blogpage-reloaded', 'true');
        window.location.reload();
      }
    };

    // Ejecutar inmediatamente
    checkForInstantReload();
  }, []); // Solo al montar

  // Estilos para la página del blog
  const styles = {
    container: {
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    main: {
      flex: 1,
    },
    hero: {
      backgroundImage: 'linear-gradient(135deg, #0b4444 0%, #1a936f 100%)',
      color: colors.white,
      padding: `${spacing.xxl} 0`,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    },
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url(/assets/images/pattern-bg.png)',
      backgroundSize: 'cover',
      opacity: 0.15,
      zIndex: 1
    },
    heroDecoration: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '60px',
      backgroundImage: `linear-gradient(135deg, ${colors.primaryLight} 25%, transparent 25%), 
                        linear-gradient(225deg, ${colors.primaryLight} 25%, transparent 25%), 
                        linear-gradient(45deg, ${colors.primaryLight} 25%, transparent 25%), 
                        linear-gradient(315deg, ${colors.primaryLight} 25%, transparent 25%)`,
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 20px 0, 0 20px, 20px 20px',
      opacity: 0.2
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      padding: `${spacing.xl} 0`
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.xl,
      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      position: 'relative',
      display: 'inline-block',
      paddingBottom: spacing.md
    },
    titleUnderline: {
      position: 'absolute',
      bottom: '-10px',
      left: '10%',
      width: '80%',
      height: '4px',
      background: `linear-gradient(90deg, transparent, #FFD166, transparent)`,
      borderRadius: '2px',
      opacity: animate ? 1 : 0,
      transform: animate ? 'scaleX(1)' : 'scaleX(0)',
      transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s',
      transformOrigin: 'center'
    },
    heroSubtitle: {
      fontSize: typography.fontSize.lg,
      maxWidth: '800px',
      margin: '0 auto',
      opacity: animate ? 0.9 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
      textShadow: '0 1px 3px rgba(0,0,0,0.2)'
    },
    contentContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${spacing.lg} ${spacing.md}`,
    },
    filtersContainer: {
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.9)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginTop: '-30px',
      position: 'relative',
      zIndex: 10,
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing.md,
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
    },
    searchInputContainer: {
      flex: '1 1 300px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    searchIcon: {
      position: 'absolute',
      left: spacing.md,
      color: isDarkMode ? colors.gray400 : colors.gray500,
      fontSize: '1.2rem'
    },
    searchInput: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md} ${spacing.md} ${spacing.xxl}`,
      borderRadius: borderRadius.lg,
      border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.95)',
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      transition: 'all 0.3s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#1a936f',
        boxShadow: `0 0 0 3px rgba(26, 147, 111, 0.3)`
      }
    },
    categorySelectContainer: {
      flex: '0 1 300px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    sortSelectContainer: {
      flex: '0 1 250px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    filterIcon: {
      position: 'absolute',
      left: spacing.md,
      color: isDarkMode ? colors.gray400 : colors.gray500,
      fontSize: '1.2rem',
      zIndex: 1
    },
    filterSelect: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md} ${spacing.md} ${spacing.xxl}`,
      borderRadius: borderRadius.lg,
      border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.95)',
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      appearance: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#1a936f',
        boxShadow: `0 0 0 3px rgba(26, 147, 111, 0.3)`
      }
    },
    dropdownButton: {
      backgroundColor: isDarkMode ? 'rgba(31, 78, 78, 0.2)' : 'rgba(255, 255, 255, 0.95)',
      color: isDarkMode ? colors.textLight : colors.primary,
      border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(31, 78, 78, 0.1)'}`,
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
    },
    createButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: `${spacing.md} ${spacing.lg}`,
      backgroundColor: colors.secondary,
      color: colors.white,
      borderRadius: borderRadius.lg,
      border: 'none',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        backgroundColor: colors.secondaryDark,
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
      }
    },
    categoriesPromo: {
      margin: `${spacing.xxl} auto`,
      padding: `${spacing.xl} ${spacing.xl}`,
      backgroundColor: isDarkMode ? 'rgba(26, 147, 111, 0.1)' : 'rgba(26, 147, 111, 0.05)',
      borderRadius: borderRadius.lg,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: shadows.md,
      position: 'relative',
      overflow: 'hidden',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      opacity: animate ? 1 : 0,
      transition: 'transform 0.5s ease 0.3s, opacity 0.5s ease 0.3s'
    },
    promoPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      opacity: 0.5,
      zIndex: 1
    },
    promoContent: {
      flex: 1,
      zIndex: 2
    },
    promoAction: {
      marginLeft: spacing.lg,
      zIndex: 2
    },
    promoIcon: {
      fontSize: '42px',
      marginBottom: spacing.sm,
      color: colors.secondary,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      boxShadow: `0 8px 16px ${colors.secondary}33`
    },
    promoTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.xs,
      color: isDarkMode ? colors.white : colors.primary
    },
    promoText: {
      color: isDarkMode ? colors.gray200 : colors.textSecondary,
      maxWidth: '700px',
      lineHeight: '1.6'
    },
    promoButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: `${spacing.sm} ${spacing.lg}`,
      backgroundColor: hoveredPromo ? colors.primary : colors.secondary,
      color: colors.white,
      borderRadius: borderRadius.md,
      border: 'none',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      transform: hoveredPromo ? 'translateY(-3px)' : 'translateY(0)',
      boxShadow: hoveredPromo ? `0 10px 20px ${colors.secondary}40` : shadows.sm
    },
    decorativeDot1: {
      position: 'absolute',
      top: '10%',
      left: '5%',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
      zIndex: 1
    },
    decorativeDot2: {
      position: 'absolute',
      bottom: '15%',
      right: '8%',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
      zIndex: 1
    },
    decorativeDot3: {
      position: 'absolute',
      top: '40%',
      right: '15%',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,209,102,0.15) 0%, rgba(255,209,102,0) 70%)',
      zIndex: 1
    },
  };

  const CategoryPromo = () => {
    return (
      <div
        style={{
          backgroundColor: isDarkMode ? 'rgba(31, 147, 111, 0.1)' : 'rgba(31, 147, 111, 0.05)',
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: spacing.xl,
          border: `1px solid ${isDarkMode ? 'rgba(31, 147, 111, 0.2)' : 'rgba(31, 147, 111, 0.1)'}`,
          boxShadow: shadows.md,
          transition: transitions.default,
          cursor: 'pointer',
          transform: hoveredPromo ? 'scale(1.02)' : 'scale(1)',
          willChange: 'transform',
        }}
        onMouseEnter={() => setHoveredPromo(true)}
        onMouseLeave={() => setHoveredPromo(false)}
        onClick={() => {
          // Navigate to categories page with force reload
          navigate('/categorias', { state: { forceReload: true } });
        }}
      >
        <div>
          <h3
            style={{
              color: isDarkMode ? colors.secondary : colors.primary,
              fontSize: typography.fontSize.xl,
              marginBottom: spacing.sm,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm
            }}
          >
            <FaTags /> Explora Nuestras Categorías
          </h3>
          <p
            style={{
              color: isDarkMode ? colors.gray300 : colors.textSecondary,
              fontSize: typography.fontSize.md,
              maxWidth: '600px'
            }}
          >
            Descubre contenido educativo diverso y de calidad. Navega por nuestras categorías especializadas y encuentra recursos que impulsen tu desarrollo profesional.
          </p>
        </div>
        <div
          style={{
            backgroundColor: isDarkMode ? 'rgba(31, 147, 111, 0.2)' : 'rgba(31, 147, 111, 0.1)',
            borderRadius: borderRadius.circle,
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: transitions.default,
            transform: hoveredPromo ? 'rotate(15deg)' : 'rotate(0deg)'
          }}
        >
          <FaArrowRight
            size={32}
            color={isDarkMode ? colors.secondary : colors.primary}
          />
        </div>
      </div>
    );
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

    // Function to get lighter color variation
    const getLighterColor = (color, factor = 0.2) => {
      // Convert hex to rgb
      let hex = color.replace('#', '');
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);

      // Lighten
      r = Math.min(255, r + (255 - r) * factor);
      g = Math.min(255, g + (255 - g) * factor);
      b = Math.min(255, b + (255 - b) * factor);

      // Convert back to hex
      return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    };

    // Function to get current category color
    const getCurrentCategoryColor = () => {
      if (selectedCategory) {
        const categoryId = parseInt(selectedCategory);
        return categoryColors[categoryId] || '#1A936F';
      }
      return '#1A936F'; // Default color
    };

    const handleCategorySelect = (categoryId) => {
      if (categoryId === 'explore') {
        // Navigate to categories page with force reload
        navigate('/categorias', { state: { forceReload: true } });
      } else if (categoryId === '') {
        // Just reload current page since we're already on blog
        window.location.reload();
      } else if (categoryId !== '') {
        // Navigate to specific category page with force reload
        navigate(`/categoria/${categoryId}`, { state: { forceReload: true } });
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
              {selectedCategory
                ? (() => {
                  const categoryNames = {
                    1: 'Noticias',
                    2: 'Técnicas de Estudio',
                    3: 'Problemáticas en el Estudio',
                    4: 'Educación de Calidad',
                    5: 'Herramientas Tecnológicas',
                    6: 'Desarrollo Profesional Docente',
                    7: 'Comunidad y Colaboración'
                  };
                  return categoryNames[parseInt(selectedCategory)] || 'Categoría';
                })()
                : 'Todas las categorías'}
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
                backgroundColor: !selectedCategory ? getLighterColor(getCurrentCategoryColor(), 0.1) : 'transparent',
                color: !selectedCategory ? getCurrentCategoryColor() : colors.primary,
                fontWeight: !selectedCategory ? 600 : 400,
                borderLeft: `3px solid ${!selectedCategory ? getCurrentCategoryColor() : 'transparent'}`,
              }}
              onClick={() => handleCategorySelect('')}
              onMouseEnter={(e) => {
                if (selectedCategory) {
                  e.currentTarget.style.backgroundColor = `${getCurrentCategoryColor()}15`;
                  e.currentTarget.style.color = getCurrentCategoryColor();
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory) {
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
                  backgroundColor: parseInt(selectedCategory) === category.ID_categoria
                    ? getLighterColor(getCurrentCategoryColor(), 0.1)
                    : 'transparent',
                  color: parseInt(selectedCategory) === category.ID_categoria
                    ? categoryColors[category.ID_categoria]
                    : colors.primary,
                  fontWeight: parseInt(selectedCategory) === category.ID_categoria ? 600 : 400,
                  borderLeft: `3px solid ${parseInt(selectedCategory) === category.ID_categoria ? getCurrentCategoryColor() : 'transparent'}`,
                }}
                onClick={() => handleCategorySelect(category.ID_categoria.toString())}
                onMouseEnter={(e) => {
                  if (parseInt(selectedCategory) !== category.ID_categoria) {
                    e.currentTarget.style.backgroundColor = `${categoryColors[category.ID_categoria]}15`;
                    e.currentTarget.style.color = categoryColors[category.ID_categoria];
                  }
                }}
                onMouseLeave={(e) => {
                  if (parseInt(selectedCategory) !== category.ID_categoria) {
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
                {(() => {
                  const categoryNames = {
                    1: 'Noticias',
                    2: 'Técnicas de Estudio',
                    3: 'Problemáticas en el Estudio',
                    4: 'Educación de Calidad',
                    5: 'Herramientas Tecnológicas',
                    6: 'Desarrollo Profesional Docente',
                    7: 'Comunidad y Colaboración'
                  };
                  return categoryNames[category.ID_categoria] || category.Nombre || category.nombre || `Categoría ${category.ID_categoria}`;
                })()}
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
      { value: 'recientes', label: 'Más recientes', icon: <FaSort /> },
      { value: 'antiguos', label: 'Más antiguos', icon: <FaSort /> },
      { value: 'alfabetico', label: 'Alfabéticamente', icon: <FaSort /> }
    ];

    // Function to get current category color
    const getCurrentCategoryColor = () => {
      if (selectedCategory) {
        const categoryId = parseInt(selectedCategory);
        const categoryColors = {
          1: '#FF6B6B', // Noticias
          2: '#4ECDC4', // Técnicas de Estudio
          3: '#FFD166', // Problemáticas en el Estudio
          4: '#6A0572', // Educación de Calidad
          5: '#1A936F', // Herramientas Tecnológicas
          6: '#3D5A80', // Desarrollo Profesional Docente
          7: '#F18F01'  // Comunidad y Colaboración
        };
        return categoryColors[categoryId] || '#1A936F';
      }
      return '#1A936F'; // Default color
    };

    // Function to get lighter color variation
    const getLighterColor = (color, factor = 0.2) => {
      // Convert hex to rgb
      let hex = color.replace('#', '');
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);

      // Lighten
      r = Math.min(255, r + (255 - r) * factor);
      g = Math.min(255, g + (255 - g) * factor);
      b = Math.min(255, b + (255 - b) * factor);

      // Convert back to hex
      return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    };

    const handleSortSelect = (value) => {
      setSortOrder(value);
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
              {sortOptions.find(option => option.value === sortOrder)?.label || 'Ordenar por'}
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
            {sortOptions.map(option => {
              const isSelected = sortOrder === option.value;

              return (
                <div
                  key={option.value}
                  style={{
                    ...styles.dropdownItem,
                    backgroundColor: isSelected
                      ? getLighterColor(getCurrentCategoryColor(), 0.1)
                      : 'transparent',
                    color: isSelected
                      ? getCurrentCategoryColor()
                      : colors.primary,
                    fontWeight: isSelected ? 600 : 400,
                    borderLeft: `3px solid ${isSelected ? getCurrentCategoryColor() : 'transparent'}`,
                  }}
                  onClick={() => handleSortSelect(option.value)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = `${getCurrentCategoryColor()}15`;
                      e.currentTarget.style.color = getCurrentCategoryColor();
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
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
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (<div style={styles.container}>        <style>{`          @keyframes fadeIn {            from { opacity: 0; transform: translateY(10px); }            to { opacity: 1; transform: translateY(0); }          }        `}</style>        <Header />
    <main style={styles.main}>
      <section style={styles.hero}>
        <div style={styles.heroBackground}></div>
        <div style={styles.heroDecoration}></div>
        <div style={styles.decorativeDot1}></div>
        <div style={styles.decorativeDot2}></div>
        <div style={styles.decorativeDot3}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Blog EducStation
            <div style={styles.titleUnderline}></div>
          </h1>
          <p style={styles.heroSubtitle}>
            Descubre artículos, tutoriales y recursos sobre educación y tecnología
          </p>
        </div>
      </section>

      <div style={styles.contentContainer}>
        <div style={styles.filtersContainer}>
          <div style={styles.searchInputContainer}>
            <FaSearch style={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.categorySelectContainer}>
            <CategoryDropdown />
          </div>

          <div style={styles.sortSelectContainer}>
            <SortDropdown />
          </div>
        </div>

        <div ref={postListRef}>
          <PostList
            limit={12}
            categoryFilter={selectedCategory}
            searchTerm={searchTerm}
            className="blog-post-cards"
            sortOrder={sortOrder}
          />
        </div>

        <CategoryPromo />
      </div>
    </main>
    <Footer />
    <style>
      {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
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
          
          .blog-post-card {
            animation: fadeUpIn 0.6s ease forwards;
            animation-delay: calc(0.1s * var(--animation-order, 0));
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background-color: transparent;
          }
          
          .blog-post-card:hover {
            transform: translateY(-5px) !important;
          }
        `}
    </style>
  </div>
  );
};

export default BlogPage;