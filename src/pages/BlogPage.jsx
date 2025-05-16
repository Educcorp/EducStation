import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostList from '../components/blog/PostList';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../styles/theme';
import { getAllCategorias } from '../services/categoriasServices';
import { FaTags, FaArrowRight } from 'react-icons/fa';

const BlogPage = () => {
  const { colors, isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [hoveredPromo, setHoveredPromo] = useState(false);

  // Cargar categorías al montar el componente
  React.useEffect(() => {
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
      backgroundColor: colors.primary,
      color: colors.white,
      padding: `${spacing.xxl} ${spacing.lg}`,
      textAlign: 'center',
    },
    heroTitle: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.md,
    },
    heroSubtitle: {
      fontSize: typography.fontSize.lg,
      maxWidth: '800px',
      margin: '0 auto',
      opacity: 0.9,
    },
    filters: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: spacing.lg,
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing.md,
      alignItems: 'center',
    },
    searchInput: {
      flex: '1 1 300px',
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray300}`,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
    },
    categorySelect: {
      flex: '0 1 200px',
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray300}`,
      fontSize: typography.fontSize.md,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
    },
    createButton: {
      display: 'inline-block',
      padding: `${spacing.sm} ${spacing.lg}`,
      backgroundColor: colors.secondary,
      color: colors.white,
      borderRadius: borderRadius.md,
      textDecoration: 'none',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      transition: 'background-color 0.3s',
      '&:hover': {
        backgroundColor: colors.secondaryDark,
      },
    },
    categoriesPromo: {
      maxWidth: '1200px',
      margin: '20px auto 30px',
      padding: `${spacing.lg} ${spacing.xl}`,
      backgroundColor: isDarkMode ? '#1f3d38' : '#e7f5f3',
      borderRadius: borderRadius.lg,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: shadows.md,
      position: 'relative',
      overflow: 'hidden'
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
      color: colors.secondary
    },
    promoTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.xs,
      color: isDarkMode ? colors.white : colors.primary
    },
    promoText: {
      color: isDarkMode ? colors.gray200 : colors.textSecondary,
      maxWidth: '700px'
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
      boxShadow: hoveredPromo ? shadows.lg : shadows.sm
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>Blog EducStation</h1>
          <p style={styles.heroSubtitle}>
            Descubre artículos, tutoriales y recursos sobre educación y tecnología
          </p>
        </section>

        <div style={styles.categoriesPromo}>
          <div style={styles.promoPattern}></div>
          <div style={styles.promoContent}>
            <div style={styles.promoIcon}>
              <FaTags />
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

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Buscar publicaciones..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
          
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
          
          <Link to="/admin/post/new" style={styles.createButton}>
            Crear publicación
          </Link>
        </div>

        <PostList 
          limit={12} 
          categoryFilter={selectedCategory}
          searchTerm={searchTerm}
        />
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage; 