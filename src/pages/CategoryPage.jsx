// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostCard from '../components/blog/PostCard';
import { spacing, typography, shadows, borderRadius, transitions } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import '../styles/animations.css';

const CategoryPage = () => {  
    // Añade isDarkMode a la desestructuración del contexto
    const { colors, isDarkMode } = useTheme(); // Obtenemos los colores y el estado del modo oscuro
    
    const [animate, setAnimate] = useState(false);
  
    useEffect(() => {
      const timeout = setTimeout(() => setAnimate(true), 0); // Activa la animación al montar el componente
      return () => clearTimeout(timeout); // Limpia el timeout al desmontar
    }, []);
  // Obtenemos el parámetro de categoría de la URL
  const { categoryName } = useParams();
  
  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para los filtros
  const [selectedFilter, setSelectedFilter] = useState('reciente');
  
  // Estado para el número de página
  const [currentPage, setCurrentPage] = useState(1);
  
  // Categorías disponibles (para la navegación de categorías relacionadas)
  const categories = [
    { id: 'noticias', name: 'Noticias', count: 23 },
    { id: 'tecnicas-de-estudio', name: 'Técnicas de Estudio', count: 45 },
    { id: 'problematicas', name: 'Problemáticas', count: 18 },
    { id: 'educacion-de-calidad', name: 'Educación de Calidad', count: 32 },
    { id: 'herramientas', name: 'Herramientas', count: 37 },
    { id: 'desarrollo-docente', name: 'Desarrollo Docente', count: 29 },
    { id: 'comunidad', name: 'Comunidad', count: 16 }
  ];
  
  // Obtener información de la categoría actual
  const currentCategory = categories.find(cat => cat.id === categoryName) || {
    id: categoryName,
    name: categoryName?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    count: 0
  };
  
  // Categorías relacionadas (todas excepto la actual)
  const relatedCategories = categories.filter(cat => cat.id !== categoryName);
  
  // Lista de artículos simulada para esta categoría
  const [posts, setPosts] = useState([]);
  
  // Generar datos de posts simulados
  useEffect(() => {
    // Función para generar un array de posts aleatorios
    const generatePosts = (count, category) => {
      const postTitles = [
        'Estrategias innovadoras para el aula digital',
        'Cómo fomentar la participación activa de los estudiantes',
        'Herramientas tecnológicas esenciales para educadores',
        'El impacto de la gamificación en el aprendizaje',
        'Evaluación formativa: más allá de las calificaciones',
        'Inclusión en el aula: estrategias prácticas',
        'El papel de la inteligencia emocional en la educación',
        'Metodologías activas para el aprendizaje significativo',
        'Cómo crear contenido educativo atractivo',
        'La neurociencia aplicada a la enseñanza',
        'Gestión del tiempo en entornos educativos',
        'El futuro de la educación: tendencias y perspectivas',
        'Educación personalizada en grupos numerosos',
        'Comunicación efectiva con padres y tutores',
        'Desarrollo profesional continuo para educadores'
      ];
      
      return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: postTitles[Math.floor(Math.random() * postTitles.length)],
        image: `/api/placeholder/350/200?text=${category}`,
        category: category.toLowerCase(),
        time: Math.floor(Math.random() * 10) + 1 + ' días atrás',
        number: String(i + 1).padStart(2, '0'),
        likes: Math.floor(Math.random() * 200) + 50,
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        author: {
          name: 'María Rodríguez',
          avatar: '/api/placeholder/40/40',
          role: 'Docente'
        }
      }));
    };
    
    // Generar entre 12 y 30 posts para la categoría actual
    const numPosts = Math.floor(Math.random() * 18) + 12;
    setPosts(generatePosts(numPosts, currentCategory.name));
  }, [categoryName, currentCategory.name]); // Eliminamos colors de las dependencias
  
  // Filtrar posts por búsqueda
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Ordenar posts según el filtro seleccionado
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (selectedFilter) {
      case 'reciente':
        return parseInt(a.time) - parseInt(b.time);
      case 'antiguo':
        return parseInt(b.time) - parseInt(a.time);
      case 'popular':
        return b.likes - a.likes;
      case 'alfabetico':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  
  // Paginación
  const postsPerPage = 9;
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
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
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: spacing.xl,
      marginBottom: spacing.xl
    },
    noResults: {
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
    popularPost: {
      display: "flex",
      gap: spacing.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderRadius: borderRadius.md,
      transition: transitions.default,
      '&:hover': {
        backgroundColor: colors.gray100
      }
    },
    popularPostImage: {
      width: "80px",
      height: "80px",
      borderRadius: borderRadius.sm,
      overflow: "hidden"
    },
    popularPostImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    popularPostTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      marginBottom: spacing.xs,
      color: colors.textPrimary,
      transition: transitions.default,
      '&:hover': {
        color: colors.primary
      }
    },
    popularPostMeta: {
      display: "flex",
      alignItems: "center",
      gap: spacing.sm,
      fontSize: typography.fontSize.xs,
      color: colors.textSecondary
    },
    tagCloud: {
      display: "flex",
      flexWrap: "wrap",
      gap: spacing.sm
    },
    tag: {
      padding: `${spacing.xs} ${spacing.md}`,
      backgroundColor: colors.gray100,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.xs,
      color: colors.textSecondary,
      transition: transitions.default,
      cursor: "pointer",
      '&:hover': {
        backgroundColor: colors.primary,
        color: colors.white
      }
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
      border: `1px solid ${isDarkMode ? colors.gray300 : colors.gray200}`,
      fontSize: typography.fontSize.sm,
      backgroundColor: isDarkMode ? '#333' : colors.white,
      color: isDarkMode ? '#fff' : colors.textPrimary,
      transition: transitions.default,
      '&:focus': {
        outline: "none",
        borderColor: colors.primary,
        boxShadow: `0 0 0 2px ${colors.primary}30`
      },
      '&::placeholder': {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'
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
                <span style={{color: colors.gray300, fontSize: '10px'}}>►</span>
                <a 
                  href="/category/tecnicas-de-estudio"
                  style={styles.breadcrumbLink}
                  onMouseEnter={(e) => e.target.style.color = colors.primary} 
                  onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
                >Blog</a>
                <span style={{color: colors.gray300, fontSize: '10px'}}>►</span>
                <span>{currentCategory.name}</span>
                
              </div>
              
              <h1 
              className={animate ? "page-animation" : ""}
              style={styles.title}>{currentCategory.name}</h1>
              <p className={animate ? "page-animation" : ""} style={styles.subtitle}>
                Explora nuestra colección de artículos sobre {currentCategory.name.toLowerCase()}. 
                Aquí encontrarás consejos, estrategias y recursos para mejorar tu práctica educativa 
                en esta área específica.
              </p>
              
              <div style={styles.categoryTag}>
                {currentCategory.name} <span style={styles.categoryCount}>{currentCategory.count || posts.length}</span>
              </div>
            </div>
          </div>
        </section>
        
        <div style={styles.container}>
          <div style={styles.contentWrapper}>
            {/* Main Content */}
            <div style={styles.mainContent}>
              {/* Filter Bar */}
              <div style={styles.filterBar}>
                <div style={styles.searchBox}>
                  <span style={styles.searchIcon}>🔍</span>
                  <input 
                    type="text" 
                    placeholder="Buscar en esta categoría..." 
                    style={{
                      ...styles.searchInput,
                      backgroundColor: isDarkMode ? '#333' : colors.white,
                      color: isDarkMode ? '#fff' : colors.textPrimary,
                      border: `1px solid ${isDarkMode ? colors.gray300 : colors.gray200}`,
                      '&::placeholder': {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'
                      }
                    }}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page on new search
                    }}
                    onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}30`}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                </div>
                
                <select 
                  style={styles.filterDropdown}
                  value={selectedFilter}
                  onChange={(e) => {
                    setSelectedFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                  onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}30`}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                >
                  <option value="reciente">Más recientes</option>
                  <option value="antiguo">Más antiguos</option>
                  <option value="popular">Más populares</option>
                  <option value="alfabetico">Alfabéticamente</option>
                </select>
              </div>
              
              {/* Posts Grid */}
              {currentPosts.length > 0 ? (
                <div style={styles.postsGrid}>
                  {currentPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
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
            </div>
            
            {/* Sidebar */}
            <div style={styles.sidebar}>
              {/* Categories Section */}
              <div style={styles.sidebarSection}>
                <h3 style={{...styles.sidebarTitle, '&:after': {...styles.sidebarTitle['&:after'], content: '""'}}}>
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
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      style={styles.categoryItem}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.gray100;
                        e.currentTarget.style.transform = "translateX(5px)";
                        e.currentTarget.querySelector('.category-count').style.backgroundColor = colors.primary;
                        e.currentTarget.querySelector('.category-count').style.color = colors.white;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = "translateX(0)";
                        e.currentTarget.querySelector('.category-count').style.backgroundColor = colors.gray100;
                        e.currentTarget.querySelector('.category-count').style.color = colors.textSecondary;
                      }}
                    >
                      {cat.name}
                      <span className="category-count" style={styles.categoryItemCount}>
                        {cat.count}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Popular Posts Section */}
              <div style={styles.sidebarSection}>
                <h3 style={{...styles.sidebarTitle, '&:after': {...styles.sidebarTitle['&:after'], content: '""'}}}>
                  Artículos Populares
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "40px",
                    height: "2px",
                    backgroundColor: colors.primary
                  }}></span>
                </h3>
                
                {/* Generate some popular posts from the current category */}
                {posts.slice(0, 3).map((post) => (
                  <div 
                    key={post.id}
                    style={styles.popularPost}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.gray100;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={styles.popularPostImage}>
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        style={styles.popularPostImg} 
                      />
                    </div>
                    <div>
                      <h4 
                        style={styles.popularPostTitle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = colors.textPrimary;
                        }}
                      >
                        {post.title}
                      </h4>
                      <div style={styles.popularPostMeta}>
                        <span>{post.time}</span>
                        <span>•</span>
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Tags Section */}
              <div style={styles.sidebarSection}>
                <h3 style={{...styles.sidebarTitle, '&:after': {...styles.sidebarTitle['&:after'], content: '""'}}}>
                  Etiquetas Populares
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "40px",
                    height: "2px",
                    backgroundColor: colors.primary
                  }}></span>
                </h3>
                
                <div style={styles.tagCloud}>
                  {['Innovación', 'Tecnología', 'Metodologías', 'Evaluación', 'Inclusión', 
                    'Motivación', 'Recursos', 'Digital', 'Proyectos', 'Gamificación', 
                    'Colaboración', 'Aprendizaje', 'Didáctica'].map((tag, index) => (
                    <div 
                      key={index}
                      style={styles.tag}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.primary;
                        e.currentTarget.style.color = colors.white;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.gray100;
                        e.currentTarget.style.color = colors.textSecondary;
                      }}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Newsletter Section */}
              <div style={styles.sidebarSection}>
                <h3 style={{...styles.sidebarTitle, '&:after': {...styles.sidebarTitle['&:after'], content: '""'}}}>
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
                      style={{
                        ...styles.newsletterInput,
                        backgroundColor: isDarkMode ? '#333' : colors.white,
                        color: isDarkMode ? '#fff' : colors.textPrimary,
                        border: `1px solid ${isDarkMode ? colors.gray300 : colors.gray200}`
                      }}
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