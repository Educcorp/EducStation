import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography, shadows, borderRadius } from '../styles/theme';
import { FaBook, FaChartBar, FaAward, FaUsers, FaCog, FaNewspaper, FaPenNib, FaChalkboardTeacher, FaArrowRight, FaSearch, FaHome } from 'react-icons/fa';
import '../styles/animations.css';

const CategoriesListPage = () => {
  const { isDarkMode, colors } = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [featuredVisible, setFeaturedVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const navigate = useNavigate();
  
  const featuredSectionRef = useRef(null);
  const gridRef = useRef(null);
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'Noticias', description: 'Últimas noticias y novedades sobre educación y tecnología', icon: <FaNewspaper size={38} />, color: '#FF6B6B' },
    { id: 2, name: 'Técnicas de Estudio', description: 'Estrategias y métodos para mejorar el aprendizaje', icon: <FaBook size={38} />, color: '#4ECDC4' },
    { id: 3, name: 'Problemáticas en el Estudio', description: 'Dificultades y retos comunes en el aprendizaje', icon: <FaPenNib size={38} />, color: '#FFD166' },
    { id: 4, name: 'Educación de Calidad', description: 'Mejores prácticas y estándares para una educación eficaz', icon: <FaAward size={38} />, color: '#6A0572' },
    { id: 5, name: 'Herramientas Tecnológicas', description: 'Tecnología y recursos para mejorar la enseñanza', icon: <FaCog size={38} />, color: '#1A936F' },
    { id: 6, name: 'Desarrollo Profesional Docente', description: 'Capacitación y crecimiento profesional para docentes', icon: <FaChalkboardTeacher size={38} />, color: '#3D5A80' },
    { id: 7, name: 'Comunidad y Colaboración', description: 'Interacción y trabajo en equipo en el ámbito educativo', icon: <FaUsers size={38} />, color: '#F18F01' }
  ]);

  // Animación de entrada para el título y subtítulo
  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100);
    const timeoutCards = setTimeout(() => setCardsVisible(true), 500);
    return () => {
      clearTimeout(timeout);
      clearTimeout(timeoutCards);
    };
  }, []);

  // Animación de entrada para las tarjetas
  useEffect(() => {
    if (cardsVisible) {
      const cards = document.querySelectorAll('.category-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 80 * index);
      });
    }
  }, [cardsVisible]);

  // Animación para la sección "Lo que encontrarás"
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setFeaturedVisible(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    
    if (featuredSectionRef.current) {
      observer.observe(featuredSectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Filtrar categorías según la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
      return;
    }
    
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);
  
  // Búsqueda inteligente
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };
  
  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };
  
  // Navegar a una categoría
  const navigateToCategory = (categoryId) => {
    navigate(`/categoria/${categoryId}`);
  };
  
  // Efectos para tarjetas
  const getCardTransform = (id) => {
    if (hoveredCard === id) {
      return 'translateY(-10px)';
    } 
    return 'translateY(0)';
  };
  
  const getCardBoxShadow = (id, color) => {
    if (hoveredCard === id) {
      return `0 15px 30px ${color}70`;
    }
    return `0 10px 30px rgba(0, 0, 0, 0.08)`;
  };
  
  const getCardBorder = (id, color) => {
    if (hoveredCard === id) {
      return `1px solid ${color}40`;
    }
    return '1px solid rgba(0,0,0,0.05)';
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${spacing.lg} ${spacing.md}`,
      paddingBottom: spacing.xxl
    },
    pageTitle: {
      fontSize: '3.5rem',
      fontWeight: typography.fontWeight.bold,
      textAlign: 'center',
      marginBottom: spacing.xl,
      color: '#ffffff',
      position: 'relative',
      display: 'inline-block',
      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
      paddingBottom: spacing.md,
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease'
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
    titleContainer: {
      textAlign: 'center',
      marginBottom: spacing.lg
    },
    subtitle: {
      fontSize: typography.fontSize.lg,
      textAlign: 'center',
      marginTop: spacing.md,
      maxWidth: '800px',
      margin: '20px auto 0',
      color: 'rgba(255,255,255,0.9)',
      lineHeight: '1.6',
      textShadow: '0 1px 3px rgba(0,0,0,0.2)',
      opacity: animate ? 0.9 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s'
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.xxl,
      position: 'relative',
      maxWidth: '600px',
      margin: '0 auto',
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s'
    },
    searchInput: {
      width: '100%',
      padding: `${spacing.md} ${spacing.xl}`,
      paddingLeft: '50px',
      borderRadius: '50px',
      fontSize: typography.fontSize.md,
      border: 'none',
      boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
      color: isDarkMode ? '#ffffff' : '#333',
      transition: 'all 0.3s ease',
      '&:focus': {
        outline: 'none',
        boxShadow: '0 5px 25px rgba(0,0,0,0.2)'
      },
      backdropFilter: 'blur(10px)'
    },
    searchIcon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#555',
      fontSize: '20px'
    },
    clearButton: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#555',
      fontSize: '16px',
      padding: '5px',
      borderRadius: '50%',
      display: isSearching ? 'block' : 'none',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
      }
    },
    noResults: {
      textAlign: 'center',
      padding: spacing.xl,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
      borderRadius: borderRadius.md,
      marginTop: spacing.xl,
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
      color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#555'
    },
    grid: {
      marginTop: spacing.xxl,
      width: '100%',
      opacity: cardsVisible ? 1 : 0,
      transition: 'opacity 0.5s ease'
    },
    card: {
      backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      height: '400px',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer',
      border: '1px solid rgba(0,0,0,0.05)',
      opacity: 0,
      transform: 'translateY(10px)',
      backdropFilter: 'blur(5px)'
    },
    cardBg: (color) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: isDarkMode 
        ? `linear-gradient(135deg, ${color}20, ${color}10)`
        : `linear-gradient(135deg, ${color}15, ${color}05)`,
      opacity: 0.8,
      zIndex: 0
    }),
    cardPattern: (color) => ({
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '40%',
      backgroundImage: `
        radial-gradient(circle at 50% 80%, ${color}15 0%, transparent 20%),
        radial-gradient(circle at 20% 50%, ${color}10 0%, transparent 30%),
        radial-gradient(circle at 80% 20%, ${color}10 0%, transparent 30%)
      `,
      opacity: 0.5,
      zIndex: 1
    }),
    iconContainer: (color) => ({
      width: '100px',
      height: '100px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
      color: color,
      transition: 'all 0.3s ease',
      transform: 'rotate(0deg)',
      boxShadow: `0 8px 20px ${color}50`,
      position: 'relative',
      zIndex: 2
    }),
    categoryName: {
      fontSize: '1.5rem',
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
      color: isDarkMode ? colors.white : colors.primary,
      position: 'relative',
      display: 'inline-block',
      zIndex: 2
    },
    nameDecoration: (isHovered, color) => ({
      position: 'absolute',
      bottom: '-6px',
      left: isHovered ? '0%' : '50%',
      width: isHovered ? '100%' : '0%',
      height: '3px',
      backgroundColor: color,
      transition: 'all 0.25s ease',
      borderRadius: '3px'
    }),
    categoryDescription: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.gray200 : colors.textSecondary,
      marginBottom: spacing.lg,
      lineHeight: '1.6',
      position: 'relative',
      zIndex: 2
    },
    link: {
      textDecoration: 'none',
      display: 'block',
      width: '100%',
      height: '100%'
    },
    button: (isHovered, color) => ({
      backgroundColor: isHovered ? color : (isDarkMode ? colors.primaryDark : colors.primary),
      color: '#FFFFFF',
      padding: `${spacing.sm} ${spacing.lg}`,
      borderRadius: borderRadius.md,
      border: 'none',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      cursor: 'pointer',
      marginTop: 'auto',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      boxShadow: isHovered ? `0 10px 20px ${color}70` : 'none',
      position: 'relative',
      zIndex: 2
    }),
    header: {
      backgroundColor: isDarkMode ? '#0b2b26' : '#0b4444',
      padding: `${spacing.xxl} 0`,
      marginBottom: spacing.xxl,
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: isDarkMode 
        ? 'linear-gradient(135deg, #08322c 0%, #0b4444 50%, #1a5c5c 100%)'
        : 'linear-gradient(135deg, #0b4444 0%, #1a936f 70%, #2a9d8f 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    },
    headerContent: {
      position: 'relative',
      zIndex: 2,
      padding: `${spacing.xl} 0`
    },
    headerBackground: {
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
    headerDecoration: {
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
    backToTop: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: colors.primary,
      color: colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      zIndex: 999,
      opacity: 0,
      transform: 'translateY(10px)',
      pointerEvents: 'none'
    },
    featuredSection: {
      marginBottom: spacing.xxl,
      textAlign: 'center',
      padding: `${spacing.xl} ${spacing.md}`,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.8)',
      borderRadius: borderRadius.lg,
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden',
      opacity: featuredVisible ? 1 : 0,
      transform: featuredVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease'
    },
    featuredTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      marginBottom: spacing.xl,
      position: 'relative',
      display: 'inline-block'
    },
    featuredCards: {
      display: 'flex',
      justifyContent: 'center',
      gap: spacing.xl,
      flexWrap: 'wrap',
      marginTop: spacing.xl
    },
    featuredCard: {
      width: '280px',
      textAlign: 'center',
      padding: spacing.xl,
      borderRadius: borderRadius.md,
      backgroundColor: isDarkMode ? '#2a2a2a' : 'rgba(255,255,255,0.9)',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.05)',
      transform: 'translateY(0)',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.12)'
      }
    },
    featuredIcon: {
      fontSize: '3rem',
      color: colors.secondary,
      marginBottom: spacing.md,
      display: 'inline-block',
      padding: spacing.md,
      borderRadius: '50%',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)'
    },
    featuredText: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.gray200 : colors.textSecondary,
      lineHeight: '1.6',
      marginTop: spacing.sm
    },
    cardIconRight: (color) => ({
      // Eliminar toda esta sección ya que no se usa
    })
  };

  // Control del scroll para mostrar/ocultar el botón de "Volver arriba"
  useEffect(() => {
    const handleScroll = () => {
      const backToTopButton = document.querySelector('.back-to-top');
      if (!backToTopButton) return;
      
      if (window.scrollY > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.transform = 'translateY(0)';
        backToTopButton.style.pointerEvents = 'auto';
      } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.transform = 'translateY(10px)';
        backToTopButton.style.pointerEvents = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Header />
      <div style={styles.header}>
        <div style={styles.headerBackground}></div>
        <div style={styles.headerDecoration}></div>
        <div 
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 1,
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s'
          }}
        ></div>
        <div 
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '8%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 1,
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.8s ease 0.5s'
          }}
        ></div>
        <div 
          style={{
            position: 'absolute',
            top: '40%',
            right: '15%',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,209,102,0.15) 0%, rgba(255,209,102,0) 70%)',
            zIndex: 1,
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.8s ease 0.7s'
          }}
        ></div>
        <div style={styles.headerContent}>
          <div style={styles.container}>
            <div style={styles.titleContainer}>
              <h1 style={styles.pageTitle}>
                Explora Nuestras Categorías
                <div style={styles.titleUnderline}></div>
              </h1>
              <p style={styles.subtitle}>
                Descubre contenido especializado organizado en categorías diseñadas para potenciar 
                tu desarrollo educativo y profesional. Cada categoría ofrece recursos, artículos 
                y herramientas adaptados a tus necesidades.
              </p>
            </div>
            
            <div style={styles.searchContainer}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar categorías..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={styles.searchInput}
              />
              {isSearching && (
                <button 
                  style={styles.clearButton}
                  onClick={clearSearch}
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <div ref={gridRef} style={{...styles.grid, marginTop: spacing.xxl}} className="category-grid">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <Link 
                key={category.id} 
                to={`/categoria/${category.id}`} 
                style={styles.link}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToCategory(category.id);
                }}
              >
                <div 
                  className="category-card hover-transform"
                  style={{
                    ...styles.card,
                    transform: getCardTransform(category.id),
                    boxShadow: getCardBoxShadow(category.id, category.color),
                    border: getCardBorder(category.id, category.color)
                  }}
                  onMouseEnter={() => setHoveredCard(category.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={styles.cardBg(category.color)}></div>
                  <div style={styles.cardPattern(category.color)}></div>
                  
                  <div 
                    style={styles.iconContainer(category.color)}
                    className={`icon-container-${category.id}`}
                  >
                    {category.icon}
                  </div>
                  
                  <h2 style={styles.categoryName}>
                    {category.name}
                    <div style={styles.nameDecoration(hoveredCard === category.id, category.color)}></div>
                  </h2>
                  <p style={styles.categoryDescription}>{category.description}</p>
                  <button 
                    style={styles.button(hoveredCard === category.id, category.color)}
                  >
                    Ver artículos
                    <FaArrowRight size={14} />
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div style={{...styles.noResults, gridColumn: '1 / -1'}}>
              <h3>No se encontraron categorías</h3>
              <p>No hay categorías que coincidan con "{searchQuery}".</p>
              <button 
                onClick={clearSearch}
                style={{
                  backgroundColor: colors.primary,
                  color: '#fff',
                  border: 'none',
                  padding: `${spacing.xs} ${spacing.lg}`,
                  borderRadius: borderRadius.md,
                  marginTop: spacing.md,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: colors.primaryDark
                  }
                }}
              >
                Mostrar todas las categorías
              </button>
            </div>
          )}
        </div>
        
        <div 
          ref={featuredSectionRef}
          style={{...styles.featuredSection, marginTop: spacing.xxl}}
        >
          <h2 style={styles.featuredTitle}>
            Lo que encontrarás
            <div style={styles.titleUnderline}></div>
          </h2>
          <div style={styles.featuredCards}>
            <div 
              style={styles.featuredCard}
              className="hover-transform"
            >
              <div style={{...styles.featuredIcon, color: '#FF6B6B'}}>📚</div>
              <h3 style={{fontSize: '1.3rem', marginBottom: spacing.sm, color: isDarkMode ? colors.white : colors.primary}}>
                Artículos de Calidad
              </h3>
              <p style={styles.featuredText}>Contenido redactado por expertos en educación y tecnología.</p>
            </div>
            <div 
              style={styles.featuredCard}
              className="hover-transform"
            >
              <div style={{...styles.featuredIcon, color: '#4ECDC4'}}>🔍</div>
              <h3 style={{fontSize: '1.3rem', marginBottom: spacing.sm, color: isDarkMode ? colors.white : colors.primary}}>
                Recursos Filtrados
              </h3>
              <p style={styles.featuredText}>Navega por categorías para encontrar justo lo que necesitas.</p>
            </div>
            <div 
              style={styles.featuredCard}
              className="hover-transform"
            >
              <div style={{...styles.featuredIcon, color: '#FFD166'}}>💡</div>
              <h3 style={{fontSize: '1.3rem', marginBottom: spacing.sm, color: isDarkMode ? colors.white : colors.primary}}>
                Ideas Innovadoras
              </h3>
              <p style={styles.featuredText}>Descubre nuevas tendencias en educación y tecnología.</p>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="back-to-top" 
        style={styles.backToTop}
        onClick={scrollToTop}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2.5V17.5M10 2.5L5 7.5M10 2.5L15 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <Footer />

      <style>
        {`
          .category-card {
            transition: all 0.3s ease;
          }
          
          .category-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 24px;
          }
          
          /* Estilo específico para la última fila con solo un elemento */
          .category-grid > *:nth-last-child(-n+1):first-child,
          .category-grid > *:nth-last-child(-n+1):first-child ~ * {
            margin: 0 auto;
          }
          
          /* Estilo específico para la última fila incompleta (con 7 elementos) */
          .category-grid > *:nth-child(7) {
            grid-column-start: 2;
          }
          
          @media (max-width: 992px) {
            .category-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .category-grid::after {
              grid-column: span 2;
            }
            
            /* Ajuste para pantallas medianas */
            .category-grid > *:nth-child(7) {
              grid-column-start: auto;
            }
          }
          
          @media (max-width: 576px) {
            .category-grid {
              grid-template-columns: 1fr !important;
            }
            
            .category-grid::after {
              grid-column: span 1;
            }
          }
        `}
      </style>
    </>
  );
};

export default CategoriesListPage; 