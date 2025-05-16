// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostCard from '../components/blog/PostCard';
import { spacing, typography, shadows, borderRadius, transitions } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import { searchByTags } from '../services/searchService';
import { getAllCategorias } from '../services/categoriasServices';
import '../styles/animations.css';

const CategoryPage = () => {  
  const { colors, isDarkMode } = useTheme();
  const [animate, setAnimate] = useState(false);
  
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
  
  // Estado para los filtros
  const [selectedFilter, setSelectedFilter] = useState('reciente');
  
  // Estado para el número de página
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Activar animación al montar el componente
  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 0);
    return () => clearTimeout(timeout);
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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Ir a la página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Ir a la página siguiente
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
  
  // Estilos CSS
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `0 ${spacing.md}`
    },
    hero: {
      padding: `${spacing.xxl} 0`,
      background: `linear-gradient(100deg, ${colors.white}99 100%, ${colors.secondary}99 100%)`,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.xxl,
      marginTop: spacing.xl
    },
    heroContent: {
      maxWidth: "800px"
    },
    breadcrumb: {
      marginBottom: spacing.md,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      display: "flex",
      alignItems: "center",
      gap: spacing.sm
    },
    breadcrumbLink: {
      color: colors.textSecondary,
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        color: colors.primary
      }
    },
    title: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.md,
      color: colors.textPrimary
    },
    subtitle: {
      fontSize: typography.fontSize.lg,
      color: colors.textSecondary,
      marginBottom: spacing.lg,
      lineHeight: 1.6
    },
    categoryTag: {
      display: "inline-flex",
      alignItems: "center",
      gap: spacing.xs,
      backgroundColor: colors.primary,
      color: colors.white,
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium
    },
    categoryCount: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      fontSize: "12px"
    },
    contentWrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 300px",
      gap: spacing.xl,
      marginBottom: spacing.xxl,
      '@media (max-width: 768px)': {
        gridTemplateColumns: "1fr"
      }
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
      gap: spacing.md
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
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.sm,
      transition: transitions.default,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      '&:focus': {
        outline: "none",
        borderColor: colors.primary,
        boxShadow: `0 0 0 2px ${colors.primary}30`
      }
    },
    searchIcon: {
      position: "absolute",
      left: spacing.md,
      top: "50%",
      transform: "translateY(-50%)",
      color: colors.textSecondary,
      fontSize: "16px"
    },
    filterDropdown: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.sm,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      transition: transitions.default,
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M8 11.5l-6-6 1.5-1.5L8 8.5 12.5 4 14 5.5l-6 6z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      paddingRight: "30px"
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
      width: "36px",
      height: "36px",
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      transition: transitions.default,
      cursor: "pointer",
      '&:hover': {
        backgroundColor: colors.gray100,
        borderColor: colors.gray300
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: "not-allowed"
      }
    },
    activePageButton: {
      backgroundColor: colors.primary,
      color: colors.white,
      borderColor: colors.primary,
      '&:hover': {
        backgroundColor: colors.primaryDark
      }
    },
    relatedCategories: {
      marginBottom: spacing.xl
    },
    relatedCategoriesTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      color: isDarkMode ? colors.textLight : colors.textPrimary
    },
    categoryList: {
      display: "flex",
      flexWrap: "wrap",
      gap: spacing.sm
    },
    categoryLink: {
      display: "inline-block",
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.gray100,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      fontSize: typography.fontSize.sm,
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: colors.primary,
        color: colors.white
      }
    },
    newsletterBox: {
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.gray100,
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      marginBottom: spacing.xl
    },
    newsletterTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.sm,
      color: isDarkMode ? colors.textLight : colors.textPrimary
    },
    newsletterText: {
      fontSize: typography.fontSize.sm,
      marginBottom: spacing.md,
      color: isDarkMode ? colors.textLight : colors.textSecondary
    },
    newsletterForm: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.sm
    },
    newsletterInput: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.sm,
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary
    },
    newsletterButton: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      color: colors.white,
      border: "none",
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: colors.primaryDark
      },
      '&:disabled': {
        opacity: 0.7,
        cursor: "not-allowed"
      }
    },
    messageBox: {
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      marginTop: spacing.sm
    },
    successMessage: {
      backgroundColor: "#d1e7dd",
      color: "#0f5132"
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#842029"
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
      borderTop: `4px solid ${colors.primary}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    errorContainer: {
      padding: spacing.lg,
      backgroundColor: "#f8d7da",
      color: "#842029",
      borderRadius: borderRadius.md,
      textAlign: "center",
      margin: `${spacing.xl} 0`
    },
    noPostsMessage: {
      textAlign: "center",
      padding: spacing.xl,
      color: isDarkMode ? colors.textLight : colors.textSecondary
    }
  };

  return (
    <div style={{ 
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      minHeight: "100vh"
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
            `}</style>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <section style={styles.hero} className={animate ? "fade-in" : ""}>
              <div style={styles.container}>
                <div style={styles.heroContent}>
                  <div style={styles.breadcrumb}>
                    <Link to="/" style={styles.breadcrumbLink}>Inicio</Link>
                    <span>›</span>
                    <Link to="/blog" style={styles.breadcrumbLink}>Blog</Link>
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
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                      type="text"
                      placeholder="Buscar en esta categoría..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={styles.searchInput}
                    />
                  </div>
                  
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    style={styles.filterDropdown}
                  >
                    <option value="reciente">Más recientes</option>
                    <option value="antiguo">Más antiguos</option>
                    <option value="alfabetico">Alfabéticamente</option>
                  </select>
                </div>
                
                {currentPosts.length > 0 ? (
                  <div style={styles.postsGrid}>
                    {currentPosts.map(post => (
                      <PostCard key={post.ID_publicaciones} post={post} />
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
                      >
                        {number + 1}
                      </button>
                    ))}
                    
                    <button 
                      onClick={nextPage} 
                      disabled={currentPage === totalPages}
                      style={styles.pageButton}
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </main>
              
              <aside style={styles.sidebar}>
                <div style={styles.relatedCategories}>
                  <h3 style={styles.relatedCategoriesTitle}>Categorías relacionadas</h3>
                  <div style={styles.categoryList}>
                    {categories.filter(cat => cat.ID_categoria !== parseInt(id)).map(category => (
                      <Link 
                        key={category.ID_categoria} 
                        to={`/categoria/${category.ID_categoria}`}
                        style={styles.categoryLink}
                      >
                        {category.Nombre_categoria}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div style={styles.newsletterBox}>
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