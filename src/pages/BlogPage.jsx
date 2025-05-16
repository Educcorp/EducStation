import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostList from '../components/blog/PostList';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../styles/theme';
import { getAllCategorias } from '../services/categoriasServices';
import { FaTags, FaArrowRight, FaSearch, FaFilter, FaPen, FaBookOpen } from 'react-icons/fa';

const BlogPage = () => {
  const { colors, isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [hoveredPromo, setHoveredPromo] = useState(false);
  const [animate, setAnimate] = useState(false);
  const postListRef = useRef(null);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

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
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.8)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginTop: '-30px',
      position: 'relative',
      zIndex: 10,
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing.md,
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xl
    },
    searchInputContainer: {
      flex: '1 1 300px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    searchIcon: {
      position: 'absolute',
      left: spacing.sm,
      color: isDarkMode ? colors.gray400 : colors.gray500,
      fontSize: '1rem'
    },
    searchInput: {
      width: '100%',
      padding: `${spacing.sm} ${spacing.sm} ${spacing.sm} ${spacing.xl}`,
      borderRadius: borderRadius.md,
      border: `1px solid ${isDarkMode ? colors.gray700 : colors.gray300}`,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      transition: 'all 0.3s ease',
      '&:focus': {
        outline: 'none',
        borderColor: colors.secondary,
        boxShadow: `0 0 0 3px ${colors.secondary}33`
      }
    },
    categorySelectContainer: {
      flex: '0 1 200px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    filterIcon: {
      position: 'absolute',
      left: spacing.sm,
      color: isDarkMode ? colors.gray400 : colors.gray500,
      fontSize: '0.9rem'
    },
    categorySelect: {
      width: '100%',
      padding: `${spacing.sm} ${spacing.sm} ${spacing.sm} ${spacing.xl}`,
      borderRadius: borderRadius.md,
      border: `1px solid ${isDarkMode ? colors.gray700 : colors.gray300}`,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      appearance: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:focus': {
        outline: 'none',
        borderColor: colors.secondary,
        boxShadow: `0 0 0 3px ${colors.secondary}33`
      }
    },
    createButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: `${spacing.sm} ${spacing.lg}`,
      backgroundColor: colors.secondary,
      color: colors.white,
      borderRadius: borderRadius.md,
      border: 'none',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      '&:hover': {
        backgroundColor: colors.secondaryDark,
        transform: 'translateY(-3px)',
        boxShadow: shadows.md
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

  return (
    <div style={styles.container}>
      <Header />
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
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar publicaciones..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={styles.searchInput}
              />
            </div>
            
            <div style={styles.categorySelectContainer}>
              <FaFilter style={styles.filterIcon} />
              <select 
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={styles.categorySelect}
              >
                <option value="">Todas las categorías</option>
                {!loadingCategories && categories.map(category => (
                  <option key={category.ID_categoria} value={category.ID_categoria}>
                    {category.Nombre_categoria}
                  </option>
                ))}
              </select>
            </div>
            
            <Link 
              to="/admin/post/new" 
              style={styles.createButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = shadows.md;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FaPen size={14} /> Crear publicación
            </Link>
          </div>

          <div ref={postListRef}>
            <PostList 
              limit={12} 
              categoryFilter={selectedCategory}
              searchTerm={searchTerm}
              className="blog-post-cards"
            />
          </div>

          <div style={styles.categoriesPromo}>
            <div style={styles.promoPattern}></div>
            <div style={styles.promoContent}>
              <div style={styles.promoIcon}>
                <FaTags size={28} />
              </div>
              <h2 style={styles.promoTitle}>Descubre nuestras categorías</h2>
              <p style={styles.promoText}>
                Explora contenido organizado por temas. Tenemos categorías especializadas 
                que abarcan desde técnicas de estudio hasta desarrollo profesional docente.
                ¡Encuentra exactamente lo que estás buscando!
              </p>
            </div>
            <div style={styles.promoAction}>
              <Link 
                to="/categorias" 
                style={styles.promoButton}
                onMouseEnter={() => setHoveredPromo(true)}
                onMouseLeave={() => setHoveredPromo(false)}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/categorias';
                }}
              >
                Explorar categorías <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage; 