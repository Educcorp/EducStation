import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FeaturedPost from '../components/blog/FeaturedPost';
import PostCard from '../components/blog/PostCard';
// Elimina la importación de colors y solo importa lo que necesitas
import { spacing, typography, transitions, applyHoverStyles } from '../styles/theme';
// Importamos el hook useTheme
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';
import { getAllCategorias } from '../services/categoriasServices';
// Importamos el hook usePosts
import { usePosts } from '../components/blog/hooks/usePosts';
// Añadimos íconos
import { FaBookmark, FaLightbulb, FaGraduationCap, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa';

// Componente para el carrusel
const NewsCarousel = ({ notes }) => {
  // Usamos useTheme para obtener los colores según el tema actual
  const { lightColors, colors } = useTheme(); // Importamos los colores del modo claro
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null); 
  const autoPlayRef = useRef(null);

  // Efecto para el carrusel automático
  useEffect(() => {
    const playCarousel = () => {
      if (!isPaused) {
        setCurrentSlide((prevSlide) =>
          prevSlide === notes.length - 1 ? 0 : prevSlide + 1
        );
      }
    };
    autoPlayRef.current = playCarousel;
  }, [notes.length, isPaused]);

  // Efecto para controlar el intervalo del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoPlayRef.current) {
        autoPlayRef.current();
      }
    }, 5000); // Cambiar slide cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  // Función para cambiar manualmente al slide anterior
  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? notes.length - 1 : prevSlide - 1
    );
  };

  // Función para cambiar manualmente al siguiente slide
  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === notes.length - 1 ? 0 : prevSlide + 1
    );
  };

  // Seleccionar un slide específico
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Estilos para el carrusel
  const styles = {
    carousel: {
      position: "relative",
      width: "100%",
      height: "500px",
      overflow: "hidden",
      borderRadius: "20px",
      marginTop: spacing.xl,
      marginBottom: spacing.xxl,
      boxShadow: `0 15px 40px ${lightColors.primary}40`, 
      cursor: "pointer",
      transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: `0 20px 50px ${lightColors.primary}60`,
      }
    },
    carouselInner: {
      whiteSpace: "nowrap",
      transition: "transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)",
      height: "100%",
      transform: `translateX(-${currentSlide * 100}%)`,
    },
    carouselItem: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      position: "relative",
    },
    carouselImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 8s ease",
      "&:hover": {
        transform: "scale(1.05)",
      }
    },
    carouselContent: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      padding: spacing.xl,
      background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7) 50%, transparent)",
      color: "#fff", 
      whiteSpace: "normal",
      transform: "translateY(0)",
      transition: "transform 0.5s ease, opacity 0.5s ease",
      opacity: 1,
    },
    carouselTitle: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
      color: "#fff", 
      transition: "transform 0.5s ease",
      transform: "translateY(0)",
      "&:hover": {
        transform: "translateY(-5px)",
      }
    },
    carouselExcerpt: {
      fontSize: typography.fontSize.md,
      marginBottom: 0,
      opacity: "0.9",
      color: "#f0f8f7", 
      maxWidth: "80%",
      lineHeight: "1.6",
    },
    carouselCategory: {
      backgroundColor: lightColors.primary, 
      color: "#fff", 
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: "16px",
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
      textTransform: "uppercase",
      display: "inline-block",
      marginBottom: spacing.md,
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      animation: "slideInUp 0.5s ease forwards",
    },
    carouselControls: {
      position: "absolute",
      top: "50%",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      transform: "translateY(-50%)",
      zIndex: 2,
      padding: `0 ${spacing.lg}`,
    },
    carouselButton: {
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "none",
      fontSize: "24px",
      color: "#fff", 
      backdropFilter: "blur(5px)",
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      opacity: 0.7,
      '&:hover': {
        backgroundColor: "rgba(255,255,255,0.3)",
        transform: "scale(1.15)",
        opacity: 1,
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      }
    },
    carouselDots: {
      position: "absolute",
      bottom: spacing.lg,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      gap: spacing.xs,
      zIndex: 2,
    },
    carouselDot: (isActive) => ({
      width: isActive ? "30px" : "12px",
      height: "12px",
      borderRadius: isActive ? "6px" : "50%",
      backgroundColor: isActive ? lightColors.primary : "rgba(255,255,255,0.5)", 
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      '&:hover': {
        backgroundColor: isActive ? lightColors.primary : "rgba(255,255,255,0.8)", 
        transform: "scale(1.2)",
      }
    }),
    pausePlayButton: {
      position: "absolute",
      bottom: spacing.lg,
      right: spacing.lg,
      zIndex: 3,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "none",
      color: "#fff",
      backdropFilter: "blur(5px)",
      transition: "all 0.3s ease",
      '&:hover': {
        backgroundColor: "rgba(255,255,255,0.3)",
        transform: "scale(1.1)",
      }
    }
  };

  return (
    <div 
      style={styles.carousel} 
      ref={carouselRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={styles.carouselInner}>
        {notes.map((slide, index) => (
          <div key={slide.id} style={styles.carouselItem}>
            <img
              src={slide.image}
              alt={slide.title}
              style={styles.carouselImage}
            />
            <div style={{
              ...styles.carouselContent,
              opacity: currentSlide === index ? 1 : 0,
              transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)'
            }}>
              <div style={styles.carouselCategory}>{slide.category}</div>
              <h2 style={styles.carouselTitle}>{slide.title}</h2>
              <p style={styles.carouselExcerpt}>{slide.excerpt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controles del carrusel */}
      <div style={styles.carouselControls}>
        <button
          style={hoveredElement === 'prev-btn'
            ? { ...styles.carouselButton, ...styles.carouselButton['&:hover'] }
            : styles.carouselButton}
          onClick={prevSlide}
          onMouseEnter={() => setHoveredElement('prev-btn')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          &#10094;
        </button>
        <button
          style={hoveredElement === 'next-btn'
            ? { ...styles.carouselButton, ...styles.carouselButton['&:hover'] }
            : styles.carouselButton}
          onClick={nextSlide}
          onMouseEnter={() => setHoveredElement('next-btn')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          &#10095;
        </button>
      </div>

      {/* Indicadores de posición */}
      <div style={styles.carouselDots}>
        {notes.map((_, index) => (
          <span
            key={index}
            style={hoveredElement === `dot-${index}`
              ? { ...styles.carouselDot(currentSlide === index), ...styles.carouselDot(currentSlide === index)['&:hover'] }
              : styles.carouselDot(currentSlide === index)}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setHoveredElement(`dot-${index}`)}
            onMouseLeave={() => setHoveredElement(null)}
          ></span>
        ))}
      </div>
      
      {/* Botón de pausa/reproducción */}
      <button
        style={hoveredElement === 'pause-play'
          ? { ...styles.pausePlayButton, ...styles.pausePlayButton['&:hover'] }
          : styles.pausePlayButton}
        onClick={() => setIsPaused(!isPaused)}
        onMouseEnter={() => setHoveredElement('pause-play')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        {isPaused ? '▶' : '❚❚'}
      </button>
    </div>
  );
};

const HomePage = () => {
  const { isDarkMode, colors, lightColors } = useTheme();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [categories, setCategories] = useState(['Todos']);
  const [notes, setNotes] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [activeFact, setActiveFact] = useState(0);
  const factsRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  
  // Utilizamos el hook usePosts para cargar los posts
  const {
    posts: blogPosts,
    loading: postsLoading,
    error: postsError
  } = usePosts({ 
    limit: 20, 
    categoryFilter: '', 
    searchTerm: '', 
    sortOrder: 'recientes',
    initialDisplayCount: 6
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Utilizamos los posts cargados desde el hook usePosts
        if (blogPosts && blogPosts.length > 0) {
          // Establecer publicación destacada específica (ID 63)
          const featuredPostData = blogPosts.find(post => post.ID_publicaciones === 63);
          
          if (featuredPostData) {
            // Formatear el post destacado según el formato requerido
            const formattedFeatured = {
              id: featuredPostData.ID_publicaciones,
              title: "El pequeño tomate que revolucionó mi forma de estudiar (y puede transformar la tuya también)",
              image: featuredPostData.Imagen_portada || '/assets/images/tecnologia.jpg',
              category: featuredPostData.categorias && featuredPostData.categorias.length > 0 
                ? featuredPostData.categorias[0].Nombre_categoria 
                : 'Sin categoría',
              time: '2 horas atrás',
              excerpt: "Cuando mi compañero de universidad Gregorio llegó a mi cuarto de estudio el semestre pasado, me dijo algo que me resonó profundamente: \"Damian, tengo mil ideas rondando en mi cabeza, pero cuando me siento a estudiar, no consigo concentrarme ni cinco minutos seguidos\"..."
            };
            setFeaturedPost(formattedFeatured);
          } else {
            // Si no se encuentra el post con ID 63, usar el primero disponible
            const featured = blogPosts[0];
            const formattedFeatured = {
              id: featured.ID_publicaciones,
              title: featured.Titulo,
              image: featured.Imagen_portada || '/assets/images/tecnologia.jpg',
              category: featured.categorias && featured.categorias.length > 0 
                ? featured.categorias[0].Nombre_categoria 
                : 'Sin categoría',
              time: '2 horas atrás',
              excerpt: featured.Resumen || 'Sin resumen disponible'
            };
            setFeaturedPost(formattedFeatured);
          }
          
          // Crear una copia y mezclarla aleatoriamente para los 6 posts
          const shuffledPosts = [...blogPosts]
            .filter(post => post.ID_publicaciones !== (featuredPostData ? featuredPostData.ID_publicaciones : null))
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);
          
          // Formatear los posts
          const formattedPosts = shuffledPosts.map(post => ({
            id: post.ID_publicaciones,
            title: post.Titulo,
            image: post.Imagen_portada || '/assets/images/tecnologia.jpg',
            category: post.categorias && post.categorias.length > 0 
              ? post.categorias[0].Nombre_categoria.toLowerCase() 
              : 'sin categoría',
            time: '4 horas atrás',
            likes: Math.floor(Math.random() * 200)
          }));
          
          setPosts(formattedPosts);
        } else {
          // Si no hay publicaciones, usar los datos de ejemplo
          setFeaturedPost({
            id: 63,
            title: 'El pequeño tomate que revolucionó mi forma de estudiar (y puede transformar la tuya también)',
            image: '/assets/images/tecnologia.jpg',
            category: 'técnicas de estudio',
            time: '2 horas atrás',
            excerpt: 'Cuando mi compañero de universidad Gregorio llegó a mi cuarto de estudio el semestre pasado, me dijo algo que me resonó profundamente: "Damian, tengo mil ideas rondando en mi cabeza, pero cuando me siento a estudiar, no consigo concentrarme ni cinco minutos seguidos"...'
          });
          
          setPosts([
            {
              id: 1,
              title: 'Herramientas Tecnológicas para la Educación',
              image: '/assets/images/tecnologia.jpg',
              category: 'herramientas',
              time: '4 horas atrás',
              likes: 124
            },
            {
              id: 2,
              title: 'Comunidad y Colaboración en la Educación',
              image: '/assets/images/humanos.jpg',
              category: 'técnicas de estudio',
              time: '4 horas atrás',
              likes: 89
            },
            {
              id: 3,
              title: 'Problemas a enfrentar en la actualidad',
              image: '/assets/images/desafio.jpg',
              category: 'problemáticas',
              time: '4 horas atrás',
              likes: 76
            },
            {
              id: 4,
              title: 'La gamificación en el aula moderna',
              image: '/assets/images/tecnologia.jpg',
              category: 'innovación',
              time: '5 horas atrás',
              likes: 105
            },
            {
              id: 5,
              title: 'Educación inclusiva: Estrategias prácticas',
              image: '/assets/images/humanos.jpg',
              category: 'inclusión',
              time: '6 horas atrás',
              likes: 92
            },
            {
              id: 6,
              title: 'Evaluación formativa vs sumativa',
              image: '/assets/images/maestro.jpg',
              category: 'evaluación',
              time: '8 horas atrás',
              likes: 67
            }
          ]);
        }
        
        // Obtener categorías
        const categoriasData = await getAllCategorias();
        if (categoriasData && categoriasData.length > 0) {
          // Añadir 'Todos' al principio
          const formattedCategories = ['Todos', ...categoriasData.map(cat => cat.Nombre_categoria)];
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [blogPosts]);

  // Filtrar posts por categoría activa
  const filteredPosts = activeCategory === 'Todos'
    ? posts
    : posts.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase());

  // Estilos CSS 
  const styles = {
    app: {
      fontFamily: typography.fontFamily,
      margin: 0,
      padding: 0,
      backgroundColor: colors.background,
      color: colors.textPrimary,
      overflowX: "hidden"
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `0 ${spacing.md}`
    },
    breadcrumb: {
      margin: `${spacing.lg} 0`,
      color: colors.primary,
      fontSize: typography.fontSize.sm,
      display: "flex",
      alignItems: "center",
      gap: spacing.sm
    },
    breadcrumbLink: {
      color: colors.primaryLight,
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        color: colors.primary
      }
    },
    hero: {
      margin: `${spacing.xl} 0 ${spacing.xxl}`,
      position: "relative",
      background: `linear-gradient(120deg, ${colors.white}99 0%, ${colors.secondary}40 100%)`,
      padding: `${spacing.xxl} ${spacing.xl}`,
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(11, 68, 68, 0.1)',
      overflow: 'hidden',
      transition: 'transform 0.5s ease, box-shadow 0.5s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 25px 60px rgba(11, 68, 68, 0.15)'
      }
    },
    heroDecoration: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${colors.secondary}30, ${colors.primary}30)`,
      transform: 'translate(30%, -30%)',
      zIndex: 0
    },
    heroTitle: {
      fontSize: typography.fontSize.xxxl,
      color: colors.primary,
      marginBottom: spacing.md,
      lineHeight: "1.2",
      position: 'relative',
      zIndex: 1,
      animation: "fadeInUp 0.8s ease-out"
    },
    heroText: {
      fontSize: typography.fontSize.lg,
      color: colors.textSecondary,
      marginBottom: spacing.xl,
      maxWidth: "700px",
      lineHeight: "1.6",
      position: 'relative',
      zIndex: 1,
      animation: "fadeInUp 1s ease-out"
    },
    heroIconsContainer: {
      display: 'flex',
      gap: spacing.lg,
      marginBottom: spacing.xl,
      animation: "fadeInUp 1.2s ease-out"
    },
    heroIcon: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      '&:hover': {
        color: colors.primary,
        transform: 'translateY(-3px)'
      },
      transition: 'all 0.3s ease'
    },
    circleLink: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "90px",
      height: "90px",
      background: `linear-gradient(135deg, ${colors.primary} 60%, ${colors.secondary} 40%)`,
      borderRadius: "50%",
      color: colors.white,
      textDecoration: "none",
      marginLeft: "auto",
      marginTop: "-40px",
      boxShadow: "0 6px 20px rgba(11, 68, 68, 0.3)",
      cursor: "pointer",
      transition: transitions.default,
      zIndex: 2,
      '&:hover': {
        transform: "scale(1.05) rotate(5deg)",
        boxShadow: "0 8px 25px rgba(11, 68, 68, 0.4)"
      }
    },
    circleText: {
      position: "absolute",
      width: "100%",
      height: "100%",
      fontSize: "10px",
      color: "rgba(240, 248, 247, 0.9)"
    },
    circleIcon: {
      fontSize: "28px",
      animation: "pulse 2s infinite"
    },
    sectionTitle: {
      fontSize: typography.fontSize.xxl,
      color: colors.primary,
      marginBottom: spacing.lg,
      position: 'relative',
      display: 'inline-block',
      paddingBottom: spacing.sm,
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '60px',
        height: '4px',
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
        borderRadius: '2px'
      }
    },
    featuredSection: {
      marginBottom: spacing.xxl
    },
    categories: {
      display: "flex",
      flexWrap: "wrap",
      gap: spacing.sm,
      background: colors.white,
      padding: `${spacing.md} ${spacing.xl}`,
      borderRadius: "50px",
      boxShadow: "0 4px 20px rgba(11, 68, 68, 0.1)",
      marginBottom: spacing.xxl,
      position: "relative",
      zIndex: 1,
      animation: "slideInUp 0.6s ease-out"
    },
    category: (isActive, isHovered) => ({
      padding: `${spacing.sm} ${spacing.lg}`,
      background: isActive
        ? `linear-gradient(135deg, ${colors.primary} 60%, ${colors.primaryLight} 100%)`
        : isHovered ? "rgba(11, 68, 68, 0.05)" : "none",
      border: "none",
      borderRadius: "24px",
      cursor: "pointer",
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: isActive ? colors.white : isHovered ? colors.primary : colors.textPrimary,
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: isActive ? "0 4px 12px rgba(11, 68, 68, 0.15)" : "none",
      transform: isHovered && !isActive ? "translateY(-2px)" : "translateY(0)"
    }),
    contentWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.xl,
      marginBottom: spacing.xxl,
      animation: "fadeIn 1s ease-out",
      position: "relative",
      width: "100%",
      '@media (max-width: 768px)': {
        gridTemplateColumns: "1fr",
      }
    },
    featuredPostWrapper: {
      width: "100%",
      position: "relative",
      marginBottom: spacing.xl,
      maxWidth: "900px",
      margin: "0 auto",
      transform: "translateY(0)",
      transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      "&:hover": {
        transform: "translateY(-10px)",
      }
    },
    postsGridWrapper: {
      width: "100%",
      minWidth: "300px",
    },
    postsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: spacing.xl,
    },
    exploreBanner: {
      marginTop: spacing.xxl,
      marginBottom: spacing.xxl,
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      padding: `${spacing.xxl} ${spacing.xl}`,
      background: `linear-gradient(120deg, ${colors.primary}99, ${colors.secondary}99)`,
      color: colors.white,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      boxShadow: '0 15px 40px rgba(11, 68, 68, 0.2)',
      transition: 'transform 0.5s ease, box-shadow 0.5s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 50px rgba(11, 68, 68, 0.3)'
      }
    },
    exploreBannerTitle: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.md,
      position: 'relative',
      zIndex: 1
    },
    exploreBannerText: {
      fontSize: typography.fontSize.lg,
      marginBottom: spacing.xl,
      maxWidth: '600px',
      lineHeight: '1.8',
      position: 'relative',
      zIndex: 1
    },
    exploreBannerBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      padding: `${spacing.md} ${spacing.xl}`,
      backgroundColor: colors.white,
      color: colors.primary,
      borderRadius: '50px',
      textDecoration: 'none',
      fontWeight: typography.fontWeight.medium,
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.3s ease',
      position: 'relative',
      zIndex: 1,
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 12px 25px rgba(0, 0, 0, 0.2)'
      }
    },
    exploreBannerDecoration1: {
      position: 'absolute',
      top: '20%',
      left: '10%',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      zIndex: 0
    },
    exploreBannerDecoration2: {
      position: 'absolute',
      bottom: '10%',
      right: '15%',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.15)',
      zIndex: 0
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: typography.fontSize.lg,
      color: colors.primary
    },
    animationStyles: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes floatingAnimation {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      
      @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
    // Nueva propiedad para mostrar inmediatamente el contenido sin minimizarlo
    noOverflow: {
      overflow: "visible"
    }
  };

  useEffect(() => {
    if (location.state && location.state.forceReload) {
      // Verificar si ya se realizó la recarga en esta sesión de navegación
      if (!sessionStorage.getItem('homepage-reloaded')) {
        // Marcar que se va a realizar la recarga
        sessionStorage.setItem('homepage-reloaded', 'true');
        // Limpiar el estado para evitar bucles infinitos
        window.history.replaceState(null, '', window.location.pathname);
        // Realizar la recarga
        window.location.reload();
      }
    } else {
      // Limpiar la marca de recarga si no hay forceReload
      sessionStorage.removeItem('homepage-reloaded');
    }
  }, [location]);

  return (
    <div style={styles.app}>
      {/* Añadir estilos de animación */}
      <style dangerouslySetInnerHTML={{ __html: styles.animationStyles }} />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main style={{ ...styles.container, ...styles.noOverflow }}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <a
            href="#"
            style={styles.breadcrumbLink}
            onMouseEnter={(e) => e.target.style.color = colors.primary}
            onMouseLeave={(e) => e.target.style.color = colors.primaryLight}
          >Inicio</a>
          <span style={{ color: colors.secondary, fontSize: '10px' }}>►</span>
          <span>Blogs y Artículos</span>
        </div>

        {/* Hero Section */}
        <div 
          style={hoveredElement === 'hero' ? 
            { ...styles.hero, ...styles.hero['&:hover'] } : 
            styles.hero
          }
          onMouseEnter={() => setHoveredElement('hero')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          <div style={styles.heroDecoration}></div>
          <h1 style={styles.heroTitle}>Tu Destino para Educación, Innovación y Crecimiento</h1>
          <p style={styles.heroText}>Descubre consejos, tendencias y técnicas para mejorar tu experiencia educativa y desarrollo profesional. Únete a nuestra comunidad de aprendices y educadores comprometidos.</p>
          
          <div style={styles.heroIconsContainer}>
            <div style={styles.heroIcon}>
              <FaBookmark size={16} color={colors.primary} />
              <span>Artículos de calidad</span>
            </div>
            <div style={styles.heroIcon}>
              <FaLightbulb size={16} color={colors.primary} />
              <span>Ideas innovadoras</span>
            </div>
            <div style={styles.heroIcon}>
              <FaGraduationCap size={16} color={colors.primary} />
              <span>Recursos educativos</span>
            </div>
            <div style={styles.heroIcon}>
              <FaChalkboardTeacher size={16} color={colors.primary} />
              
            </div>
          </div>

          <div
            style={hoveredElement === 'circle' ? 
              { ...styles.circleLink, ...styles.circleLink['&:hover'] } : 
              styles.circleLink
            }
            onMouseEnter={() => setHoveredElement('circle')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <div style={{
              ...styles.circleText,
              animation: 'spin 20s linear infinite',
              transform: hoveredElement === 'circle' ? 'rotate(-5deg)' : 'rotate(0deg)',
            }}>
              <img
                src="/assets/images/educstation-logo.png"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            </div>
          </div>
        </div>

        {/* NUEVO: Carrusel de Noticias */}
        <NewsCarousel notes={notes} />

        {/* Sección de categorías destacadas */}
        <div style={{
          marginTop: spacing.xxl,
          marginBottom: spacing.xxl,
          textAlign: 'center',
          position: 'relative',
          padding: `${spacing.xl} 0`,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '-5%',
            width: '200px',
            height: '200px',
            background: `radial-gradient(circle, ${colors.primary}15, ${colors.primary}05)`,
            borderRadius: '50%',
            zIndex: 0,
            animation: 'floatingAnimation 8s ease-in-out infinite'
          }}></div>
          
          <div style={{
            position: 'absolute',
            bottom: '15%',
            right: '-3%',
            width: '150px',
            height: '150px',
            background: `radial-gradient(circle, ${colors.secondary}20, ${colors.secondary}05)`,
            borderRadius: '50%',
            zIndex: 0,
            animation: 'floatingAnimation 6s ease-in-out infinite reverse'
          }}></div>
          
          <h2 style={{
            ...styles.sectionTitle,
            textAlign: 'center',
            fontSize: typography.fontSize.xxl,
            marginBottom: spacing.xl,
            position: 'relative',
            display: 'inline-block',
            paddingBottom: spacing.md,
            '&:after': {
              ...styles.sectionTitle['&:after'],
              left: '50%',
              transform: 'translateX(-50%)'
            },
            animation: 'fadeInUp 0.6s ease-out'
          }}>Categorías Destacadas</h2>
          
          <p style={{
            color: colors.textSecondary,
            maxWidth: '700px',
            margin: '0 auto',
            marginBottom: spacing.xl,
            fontSize: typography.fontSize.md,
            lineHeight: '1.6',
            animation: 'fadeInUp 0.8s ease-out',
            position: 'relative',
            zIndex: 1
          }}>
            Explora nuestras áreas temáticas principales y encuentra contenido que te inspire, motive y ayude en tu desarrollo educativo.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing.xl,
            marginTop: spacing.xl,
            position: 'relative',
            zIndex: 1
          }}>
            {/* Categoría 1 */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff, #f7f9fa)',
              borderRadius: '20px',
              padding: spacing.xl,
              boxShadow: hoveredElement === 'cat-1' 
                ? '0 20px 40px rgba(11, 68, 68, 0.15)' 
                : '0 10px 30px rgba(11, 68, 68, 0.08)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: hoveredElement === 'cat-1' ? 'translateY(-15px)' : 'translateY(0)',
              cursor: 'pointer',
              border: hoveredElement === 'cat-1' ? `2px solid ${colors.primary}15` : '2px solid transparent',
              animation: 'fadeInUp 0.6s ease-out'
            }}
              onMouseEnter={() => setHoveredElement('cat-1')}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => setActiveCategory('Técnicas de Estudio')}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: hoveredElement === 'cat-1'
                  ? `linear-gradient(135deg, ${colors.primary}, ${colors.primary}90)`
                  : `linear-gradient(135deg, ${colors.primary}80, ${colors.primary}60)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing.lg,
                boxShadow: hoveredElement === 'cat-1' 
                  ? '0 10px 25px rgba(11, 68, 68, 0.2)' 
                  : '0 8px 15px rgba(11, 68, 68, 0.1)',
                transition: 'all 0.3s ease',
                transform: hoveredElement === 'cat-1' ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
              }}>
                <FaLightbulb size={36} color="#fff" style={{
                  animation: hoveredElement === 'cat-1' ? 'pulse 1.5s infinite' : 'none'
                }} />
              </div>
              <h3 style={{
                fontSize: typography.fontSize.xl,
                color: hoveredElement === 'cat-1' ? colors.primary : colors.textPrimary,
                marginBottom: spacing.md,
                transition: 'color 0.3s ease',
                fontWeight: typography.fontWeight.semiBold
              }}>
                Técnicas de Estudio
              </h3>
              <div style={{
                width: '60px',
                height: '4px',
                background: hoveredElement === 'cat-1'
                  ? `linear-gradient(90deg, ${colors.primary}, ${colors.primary}60)`
                  : `linear-gradient(90deg, ${colors.primary}60, ${colors.primary}30)`,
                borderRadius: '2px',
                margin: '0 auto',
                marginBottom: spacing.md,
                transition: 'all 0.3s ease',
                transform: hoveredElement === 'cat-1' ? 'scaleX(1.5)' : 'scaleX(1)',
              }}></div>
              <p style={{
                fontSize: typography.fontSize.md,
                color: colors.textSecondary,
                lineHeight: '1.8',
                transition: 'color 0.3s ease'
              }}>
                Metodologías y estrategias efectivas para optimizar el aprendizaje y mejorar el rendimiento académico.
              </p>
            </div>

            {/* Categoría 2 */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff, #f7f9fa)',
              borderRadius: '20px',
              padding: spacing.xl,
              boxShadow: hoveredElement === 'cat-2' 
                ? '0 20px 40px rgba(11, 68, 68, 0.15)' 
                : '0 10px 30px rgba(11, 68, 68, 0.08)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: hoveredElement === 'cat-2' ? 'translateY(-15px)' : 'translateY(0)',
              cursor: 'pointer',
              border: hoveredElement === 'cat-2' ? `2px solid ${colors.secondary}15` : '2px solid transparent',
              animation: 'fadeInUp 0.8s ease-out'
            }}
              onMouseEnter={() => setHoveredElement('cat-2')}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => setActiveCategory('Herramientas')}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: hoveredElement === 'cat-2'
                  ? `linear-gradient(135deg, ${colors.secondary}, ${colors.secondary}90)`
                  : `linear-gradient(135deg, ${colors.secondary}80, ${colors.secondary}60)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing.lg,
                boxShadow: hoveredElement === 'cat-2' 
                  ? '0 10px 25px rgba(11, 68, 68, 0.2)' 
                  : '0 8px 15px rgba(11, 68, 68, 0.1)',
                transition: 'all 0.3s ease',
                transform: hoveredElement === 'cat-2' ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
              }}>
                <FaGraduationCap size={36} color="#fff" style={{
                  animation: hoveredElement === 'cat-2' ? 'pulse 1.5s infinite' : 'none'
                }} />
              </div>
              <h3 style={{
                fontSize: typography.fontSize.xl,
                color: hoveredElement === 'cat-2' ? colors.secondary : colors.textPrimary,
                marginBottom: spacing.md,
                transition: 'color 0.3s ease',
                fontWeight: typography.fontWeight.semiBold
              }}>
                Herramientas Educativas
              </h3>
              <div style={{
                width: '60px',
                height: '4px',
                background: hoveredElement === 'cat-2'
                  ? `linear-gradient(90deg, ${colors.secondary}, ${colors.secondary}60)`
                  : `linear-gradient(90deg, ${colors.secondary}60, ${colors.secondary}30)`,
                borderRadius: '2px',
                margin: '0 auto',
                marginBottom: spacing.md,
                transition: 'all 0.3s ease',
                transform: hoveredElement === 'cat-2' ? 'scaleX(1.5)' : 'scaleX(1)',
              }}></div>
              <p style={{
                fontSize: typography.fontSize.md,
                color: colors.textSecondary,
                lineHeight: '1.8',
                transition: 'color 0.3s ease'
              }}>
                Recursos y aplicaciones que facilitan la enseñanza y el aprendizaje en entornos digitales.
              </p>
            </div>

            {/* Categoría 3 */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff, #f7f9fa)',
              borderRadius: '20px',
              padding: spacing.xl,
              boxShadow: hoveredElement === 'cat-3' 
                ? '0 20px 40px rgba(11, 68, 68, 0.15)' 
                : '0 10px 30px rgba(11, 68, 68, 0.08)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: hoveredElement === 'cat-3' ? 'translateY(-15px)' : 'translateY(0)',
              cursor: 'pointer',
              border: hoveredElement === 'cat-3' ? `2px solid ${colors.primary}15` : '2px solid transparent',
              animation: 'fadeInUp 1s ease-out'
            }}
              onMouseEnter={() => setHoveredElement('cat-3')}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => setActiveCategory('Educación de Calidad')}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: hoveredElement === 'cat-3'
                  ? `linear-gradient(135deg, ${colors.primary}90, ${colors.secondary}90)`
                  : `linear-gradient(135deg, ${colors.primary}70, ${colors.secondary}70)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing.lg,
                boxShadow: hoveredElement === 'cat-3' 
                  ? '0 10px 25px rgba(11, 68, 68, 0.2)' 
                  : '0 8px 15px rgba(11, 68, 68, 0.1)',
                transition: 'all 0.3s ease',
                transform: hoveredElement === 'cat-3' ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
              }}>
                <FaChalkboardTeacher size={36} color="#fff" style={{
                  animation: hoveredElement === 'cat-3' ? 'pulse 1.5s infinite' : 'none'
                }} />
              </div>
              <h3 style={{
                fontSize: typography.fontSize.xl,
                color: hoveredElement === 'cat-3' ? colors.primary : colors.textPrimary,
                marginBottom: spacing.md,
                transition: 'color 0.3s ease',
                fontWeight: typography.fontWeight.semiBold
              }}>
                Educación de Calidad
              </h3>
              <div style={{
                width: '60px',
                height: '4px',
                background: hoveredElement === 'cat-3'
                  ? `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
                  : `linear-gradient(90deg, ${colors.primary}60, ${colors.secondary}60)`,
                borderRadius: '2px',
                margin: '0 auto',
                marginBottom: spacing.md,
                transition: 'all 0.3s ease',
                transform: hoveredElement === 'cat-3' ? 'scaleX(1.5)' : 'scaleX(1)',
              }}></div>
              <p style={{
                fontSize: typography.fontSize.md,
                color: colors.textSecondary,
                lineHeight: '1.8',
                transition: 'color 0.3s ease'
              }}>
                Estándares y prácticas para asegurar una experiencia educativa de excelencia.
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={styles.categories}>
          {categories.map(category => (
            <button
              key={category}
              style={styles.category(
                activeCategory === category,
                hoveredElement === category
              )}
              onClick={() => setActiveCategory(category)}
              onMouseEnter={() => setHoveredElement(category)}
              onMouseLeave={() => setHoveredElement(null)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sección de posts */}
        <div style={styles.contentWrapper}>
          {/* Publicaciones recientes */}
          <section style={{ marginTop: spacing.xxl, marginBottom: spacing.xxl }}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Publicaciones recientes</h2>
              <div style={styles.titleUnderline}></div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: spacing.xl }}>
                <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '4px solid rgba(11, 68, 68, 0.1)', borderTopColor: colors.primary, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: spacing.md, color: colors.textSecondary }}>Cargando publicaciones...</p>
              </div>
            ) : postsError ? (
              <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.error }}>
                <p>Error al cargar publicaciones. Por favor, intenta de nuevo más tarde.</p>
              </div>
            ) : (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                gap: spacing.lg,
                marginBottom: spacing.xl
              }}>
                {/* Usar directamente los posts del hook usePosts */}
                {blogPosts.slice(0, 6).map((post, index) => (
                  <div 
                    key={post.ID_publicaciones} 
                    className="post-card-animation" 
                    style={{
                      "--animation-order": index,
                      background: "transparent"
                    }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: spacing.xl }}>
              <a 
                href="/blog" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: colors.primary,
                  color: '#fff',
                  padding: `${spacing.md} ${spacing.xl}`,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.medium,
                  boxShadow: '0 8px 20px rgba(11, 68, 68, 0.25)',
                  transition: 'all 0.3s ease',
                  ...(hoveredElement === 'blog-btn' ? {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 25px rgba(11, 68, 68, 0.35)'
                  } : {})
                }}
                onMouseEnter={() => setHoveredElement('blog-btn')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <span>Explora el blog</span>
                <FaArrowRight />
              </a>
            </div>
          </section>

          {/* Featured Post - Ahora a todo lo ancho */}
          <div style={styles.featuredPostWrapper}>
            {featuredPost && <FeaturedPost post={featuredPost} />}
          </div>
          
          {/* Título sección artículos */}
          <h2 style={styles.sectionTitle}>Explora nuestros artículos</h2>

          {/* Posts Grid - Ahora debajo del post destacado */}
          <div style={styles.postsGridWrapper}>
            <div style={styles.postsGrid}>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <p style={{gridColumn: '1 / -1', textAlign: 'center', color: colors.textSecondary}}>
                  No hay artículos disponibles en esta categoría.
                </p>
              )}
            </div>
          </div>
          
          {/* Banner de exploración */}
          <div 
            style={hoveredElement === 'explore-banner' ? 
              { ...styles.exploreBanner, ...styles.exploreBanner['&:hover'] } : 
              styles.exploreBanner
            }
            onMouseEnter={() => setHoveredElement('explore-banner')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <div style={styles.exploreBannerDecoration1}></div>
            <div style={styles.exploreBannerDecoration2}></div>
            <h2 style={styles.exploreBannerTitle}>Descubre todas nuestras categorías</h2>
            <p style={styles.exploreBannerText}>
              Explora nuestra biblioteca completa de artículos educativos, recursos didácticos, 
              técnicas innovadoras y mucho más. Encuentra soluciones a problemas comunes y 
              herramientas para mejorar tu experiencia educativa.
            </p>
            <a 
              href="/categories" 
              style={hoveredElement === 'explore-btn' ? 
                { ...styles.exploreBannerBtn, ...styles.exploreBannerBtn['&:hover'] } : 
                styles.exploreBannerBtn
              }
              onMouseEnter={() => setHoveredElement('explore-btn')}
              onMouseLeave={() => setHoveredElement('explore-banner')}
            >
              <span>Explorar categorías</span>
              <FaArrowRight size={12} />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;