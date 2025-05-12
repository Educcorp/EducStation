// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostCard from '../components/blog/PostCard';
import CategoryFilter from '../components/common/CategoryFilter';
import SearchBox from '../components/common/SearchBox';
import { spacing, typography, shadows, borderRadius, transitions } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import { getCategoriaById, getPublicacionesByCategoria, getAllCategorias } from '../services/categoriasService';
import { searchByTitle, advancedSearch } from '../services/searchService';
import '../styles/animations.css';

const CategoryPage = () => {
  // Navegación y parámetros
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // Estados para el tema y animación
  const [animate, setAnimate] = useState(false);
  const { colors } = useTheme();

  // Estados para datos
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [relatedCategories, setRelatedCategories] = useState([]);

  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('reciente');
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState(null);

  // Activar la animación al montar
  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  // Cargar categorías al iniciar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getAllCategorias();
        setCategories(allCategories);

        // Encontrar la categoría actual
        const current = allCategories.find(cat =>
          cat.ID_categoria.toString() === categoryName ||
          cat.Nombre_categoria.toLowerCase().replace(/\s+/g, '-') === categoryName.toLowerCase()
        );

        if (current) {
          setCurrentCategory(current);
          // Relacionadas: todas menos la actual
          setRelatedCategories(allCategories.filter(cat => cat.ID_categoria !== current.ID_categoria));
        } else {
          // Si no encuentra la categoría, intentar buscarla por ID
          try {
            const categoryData = await getCategoriaById(categoryName);
            setCurrentCategory(categoryData);
            setRelatedCategories(allCategories.filter(cat => cat.ID_categoria !== categoryData.ID_categoria));
          } catch (err) {
            setError('Categoría no encontrada');
            setCurrentCategory({
              ID_categoria: categoryName,
              Nombre_categoria: categoryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
              Descripcion: 'Categoría no encontrada'
            });
          }
        }
      } catch (err) {
        setError('Error al cargar categorías');
        console.error(err);
      }
    };

    fetchCategories();
  }, [categoryName]);

  // Cargar publicaciones cuando cambia la categoría
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        if (!currentCategory) return;

        let results;

        // Si hay búsqueda, usar búsqueda avanzada
        if (searchQuery) {
          results = await advancedSearch({
            titulo: searchQuery,
            categorias: [currentCategory.ID_categoria],
            ordenarPor: selectedFilter
          });
        } else {
          // Si no hay búsqueda, obtener publicaciones de la categoría
          results = await getPublicacionesByCategoria(currentCategory.ID_categoria);
        }

        setPosts(results || []);
        setFilteredPosts(results || []);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar publicaciones');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPosts();
  }, [currentCategory, searchQuery, selectedFilter]);

  // Aplicar filtros a las publicaciones
  useEffect(() => {
    if (!posts.length) {
      setFilteredPosts([]);
      return;
    }

    // Filtrar por búsqueda si es necesario
    let filtered = [...posts];
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.Titulo?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ordenar según el filtro seleccionado
    switch (selectedFilter) {
      case 'reciente':
        filtered.sort((a, b) => new Date(b.Fecha_creacion) - new Date(a.Fecha_creacion));
        break;
      case 'antiguo':
        filtered.sort((a, b) => new Date(a.Fecha_creacion) - new Date(b.Fecha_creacion));
        break;
      case 'alfabetico':
        filtered.sort((a, b) => a.Titulo.localeCompare(b.Titulo));
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
    // Resetear a la primera página cuando cambian los filtros
    setCurrentPage(1);
  }, [posts, searchQuery, selectedFilter]);

  // Paginación
  const postsPerPage = 9;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Funciones para la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Manejar búsqueda
  const handleSearch = (term) => {
    setSearchQuery(term);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Manejar cambio de filtro
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Manejar cambio de categoría
  const handleCategoryChange = (categoryId) => {
    const category = categories.find(cat => cat.ID_categoria.toString() === categoryId);
    if (category) {
      const slug = category.Nombre_categoria.toLowerCase().replace(/\s+/g, '-');
      navigate(`/category/${slug}`);
    }
  };

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

      // Limpiar mensaje después de 4 segundos
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
    filterDropdown: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.sm,
      color: colors.textPrimary,
      backgroundColor: colors.white,
      cursor: "pointer",
      transition: transitions.default,
      '&:focus': {
        outline: "none",
        borderColor: colors.primary,
        boxShadow: `0 0 0 2px ${colors.primary}30`
      }
    },
    postsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: spacing.xl,
      marginBottom: spacing.xl
    },
    noResults: {
      textAlign: "center",
      padding: `${spacing.xxl} 0`,
      color: colors.textSecondary,
      fontSize: typography.fontSize.lg
    },
    loading: {
      textAlign: "center",
      padding: `${spacing.xxl} 0`,
      color: colors.textSecondary,
      fontSize: typography.fontSize.lg
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.xl
    },
    pageButton: {
      minWidth: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `0 ${spacing.sm}`,
      borderRadius: borderRadius.md,
      backgroundColor: "transparent",
      border: `1px solid ${colors.gray200}`,
      color: colors.textPrimary,
      fontSize: typography.fontSize.sm,
      cursor: "pointer",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: colors.gray100
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: "not-allowed"
      }
    },
    activePageButton: {
      backgroundColor: colors.primary,
      color: colors.white,
      border: `1px solid ${colors.primary}`,
      '&:hover': {
        backgroundColor: colors.primaryDark
      }
    },
    sidebarSection: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      boxShadow: shadows.sm,
      marginBottom: spacing.xl
    },
    sidebarTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.lg,
      position: "relative",
      paddingBottom: spacing.sm,
      '&:after': {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "40px",
        height: "2px",
        backgroundColor: colors.primary
      }
    },
    categoriesList: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.sm
    },
    categoryItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      color: colors.textPrimary,
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: colors.gray100,
        transform: "translateX(5px)"
      }
    },
    categoryItemCount: {
      backgroundColor: colors.gray100,
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: typography.fontSize.xs,
      transition: transitions.default
    },
    newsletter: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.md
    },
    newsletterText: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.md
    },
    newsletterForm: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.md
    },
    newsletterInput: {
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.sm,
      '&:focus': {
        outline: "none",
        borderColor: colors.primary,
        boxShadow: `0 0 0 2px ${colors.primary}30`
      }
    },
    newsletterButton: {
      padding: spacing.md,
      backgroundColor: colors.primary,
      color: colors.white,
      border: "none",
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: colors.primaryDark
      },
      '&:disabled': {
        backgroundColor: colors.gray300,
        cursor: "not-allowed"
      }
    },
    successMessage: {
      marginTop: spacing.sm,
      padding: spacing.sm,
      backgroundColor: '#dff0d8',
      color: '#3c763d',
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.sm
    },
    errorMessage: {
      marginTop: spacing.sm,
      padding: spacing.sm,
      backgroundColor: '#f2dede',
      color: '#a94442',
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.sm
    },
    error: {
      padding: spacing.xl,
      backgroundColor: '#f2dede',
      color: '#a94442',
      borderRadius: borderRadius.md,
      margin: `${spacing.xl} 0`,
      textAlign: 'center'
    }
  };

  return (
    <div style={{ fontFamily: typography.fontFamily, backgroundColor: colors.background }}>
      <Header />

      <main>
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.container}>
            <div style={styles.heroContent}>
              <div style={styles.breadcrumb}>
                <a
                  href="/"
                  style={styles.breadcrumbLink}
                  onMouseEnter={(e) => e.target.style.color = colors.primary}
                  onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
                >Inicio</a>
                <span style={{ color: colors.gray300, fontSize: '10px' }}>►</span>
                <a
                  href="/category"
                  style={styles.breadcrumbLink}
                  onMouseEnter={(e) => e.target.style.color = colors.primary}
                  onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
                >Blog</a>
                <span style={{ color: colors.gray300, fontSize: '10px' }}>►</span>
                <span>{currentCategory?.Nombre_categoria || 'Categoría'}</span>
              </div>

              <h1
                className={animate ? "page-animation" : ""}
                style={styles.title}
              >
                {currentCategory?.Nombre_categoria || 'Categoría'}
              </h1>

              <p
                className={animate ? "page-animation" : ""}
                style={styles.subtitle}
              >
                {currentCategory?.Descripcion ||
                  `Explora nuestra colección de artículos sobre ${(currentCategory?.Nombre_categoria || 'esta categoría').toLowerCase()}. 
                   Aquí encontrarás consejos, estrategias y recursos para mejorar tu práctica educativa 
                   en esta área específica.`
                }
              </p>

              {currentCategory && (
                <div style={styles.categoryTag}>
                  {currentCategory.Nombre_categoria}
                  <span style={styles.categoryCount}>{filteredPosts.length || 0}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <div style={styles.container}>
          {/* Filtro de categorías */}
          <CategoryFilter
            onCategorySelect={handleCategoryChange}
            selectedCategory={currentCategory?.ID_categoria?.toString()}
          />

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <div style={styles.contentWrapper}>
            {/* Main Content */}
            <div style={styles.mainContent}>
              {/* Filter Bar */}
              <div style={styles.filterBar}>
                <SearchBox
                  onSearch={handleSearch}
                  placeholder="Buscar en esta categoría..."
                  initialValue={searchQuery}
                />

                <select
                  style={styles.filterDropdown}
                  value={selectedFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}30`}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                >
                  <option value="reciente">Más recientes</option>
                  <option value="antiguo">Más antiguos</option>
                  <option value="alfabetico">Alfabéticamente</option>
                </select>
              </div>

              {/* Loading Indicator */}
              {loading ? (
                <div style={styles.loading}>Cargando publicaciones...</div>
              ) : (
                <>
                  {/* Posts Grid */}
                  {currentPosts.length > 0 ? (
                    <div style={styles.postsGrid}>
                      {currentPosts.map((post) => (
                        <PostCard key={post.ID_publicaciones} post={{
                          id: post.ID_publicaciones,
                          title: post.Titulo,
                          image: post.Imagen_destacada_ID ? `/api/imagenes/${post.Imagen_destacada_ID}` : '/api/placeholder/350/200',
                          category: currentCategory?.Nombre_categoria?.toLowerCase() || 'categoría',
                          time: new Date(post.Fecha_creacion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }),
                          number: post.ID_publicaciones.toString().padStart(2, '0'),
                          likes: 100, // Valor simulado
                          excerpt: post.Resumen || post.Contenido.substring(0, 100) + '...'
                        }} />
                      ))}
                    </div>
                  ) : (
                    <div style={styles.noResults}>
                      No se encontraron artículos que coincidan con tu búsqueda.
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div style={styles.pagination}>
                      <button
                        style={styles.pageButton}
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        onMouseEnter={(e) => {
                          if (currentPage !== 1) {
                            e.currentTarget.style.backgroundColor = colors.gray100;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        ←
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          style={{
                            ...styles.pageButton,
                            ...(number === currentPage ? styles.activePageButton : {})
                          }}
                          onClick={() => paginate(number)}
                          onMouseEnter={(e) => {
                            if (number !== currentPage) {
                              e.currentTarget.style.backgroundColor = colors.gray100;
                            } else {
                              e.currentTarget.style.backgroundColor = colors.primaryDark;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (number !== currentPage) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            } else {
                              e.currentTarget.style.backgroundColor = colors.primary;
                            }
                          }}
                        >
                          {number}
                        </button>
                      ))}

                      <button
                        style={styles.pageButton}
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        onMouseEnter={(e) => {
                          if (currentPage !== totalPages) {
                            e.currentTarget.style.backgroundColor = colors.gray100;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div style={styles.sidebar}>
              {/* Categories Section */}
              <div style={styles.sidebarSection}>
                <h3 style={{ ...styles.sidebarTitle, '&:after': { ...styles.sidebarTitle['&:after'], content: '""' } }}>
                  Categorías
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "40px",
                    height: "2px",
                    backgroundColor: colors.primary
                  }}></span>
                </h3>
                <div style={styles.categoriesList}>
                  {categories.map((cat) => (
                    <a
                      key={cat.ID_categoria}
                      href={`/category/${cat.Nombre_categoria.toLowerCase().replace(/\s+/g, '-')}`}
                      style={styles.categoryItem}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.gray100;
                        e.currentTarget.style.transform = "translateX(5px)";
                        const countElement = e.currentTarget.querySelector('.category-count');
                        if (countElement) {
                          countElement.style.backgroundColor = colors.primary;
                          countElement.style.color = colors.white;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = "translateX(0)";
                        const countElement = e.currentTarget.querySelector('.category-count');
                        if (countElement) {
                          countElement.style.backgroundColor = colors.gray100;
                          countElement.style.color = colors.textSecondary;
                        }
                      }}
                    >
                      {cat.Nombre_categoria}
                      <span className="category-count" style={styles.categoryItemCount}>
                        0
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter Section */}
              <div style={styles.sidebarSection}>
                <h3 style={{ ...styles.sidebarTitle, '&:after': { ...styles.sidebarTitle['&:after'], content: '""' } }}>
                  Suscríbete
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "40px",
                    height: "2px",
                    backgroundColor: colors.primary
                  }}></span>
                </h3>

                <div style={styles.newsletter}>
                  <p style={styles.newsletterText}>
                    Recibe nuestros mejores artículos y novedades directamente en tu bandeja de entrada.
                  </p>

                  <form style={styles.newsletterForm} onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      placeholder="Tu email"
                      style={styles.newsletterInput}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}30`}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                      required
                    />
                    <button
                      type="submit"
                      style={styles.newsletterButton}
                      disabled={isSubscribing}
                      onMouseEnter={(e) => {
                        if (!isSubscribing) {
                          e.currentTarget.style.backgroundColor = colors.primaryDark;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubscribing) {
                          e.currentTarget.style.backgroundColor = colors.primary;
                        }
                      }}
                    >
                      {isSubscribing ? 'Procesando...' : 'Suscribirse'}
                    </button>
                  </form>

                  {subscribeMessage && (
                    <div style={subscribeMessage.type === 'success' ? styles.successMessage : styles.errorMessage}>
                      {subscribeMessage.text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;