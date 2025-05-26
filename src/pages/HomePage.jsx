import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FeaturedPost from '../components/blog/FeaturedPost';
import PostCard from '../components/blog/PostCard';
// Elimina la importación de colors y solo importa lo que necesitas
import { spacing, typography, transitions, applyHoverStyles } from '../styles/theme';
// Importamos el hook useTheme
import { useTheme } from '../context/ThemeContext';
import { useLocation, Link } from 'react-router-dom';
import { getAllCategorias } from '../services/categoriasServices';
// Importamos el hook usePosts
import { usePosts } from '../components/blog/hooks/usePosts';
// Importamos el contexto de autenticación
import { useAuth } from '../context/AuthContext.jsx';
// Añadimos íconos
import { FaBookmark, FaLightbulb, FaGraduationCap, FaChalkboardTeacher, FaArrowRight, FaUserPlus, FaStar, FaUsers, FaRocket, FaHeart, FaShieldAlt, FaGift } from 'react-icons/fa';

// Componente para el carrusel
const NewsCarousel = ({ notes }) => {
  // Usamos useTheme para obtener los colores según el tema actual
  const { lightColors, colors } = useTheme();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null); 
  const autoPlayRef = useRef(null);

  // Efecto para el carrusel automático - MOVER ANTES DEL RETURN
  useEffect(() => {
    if (notes && notes.length > 0) {
      const playCarousel = () => {
        if (!isPaused) {
          setCurrentSlide((prevSlide) =>
            prevSlide === notes.length - 1 ? 0 : prevSlide + 1
          );
        }
      };
      autoPlayRef.current = playCarousel;
    }
  }, [notes?.length, isPaused]);

  // Efecto para controlar el intervalo del carrusel - MOVER ANTES DEL RETURN
  useEffect(() => {
    if (notes && notes.length > 0) {
      const interval = setInterval(() => {
        if (autoPlayRef.current) {
          autoPlayRef.current();
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [notes?.length]);

  // Verificar si hay notas para mostrar
  if (!notes || notes.length === 0) {
    return (
      <div style={{
        width: "100%",
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.gray100,
        borderRadius: "20px",
        marginTop: spacing.xl,
        marginBottom: spacing.xxl,
        border: `2px dashed ${colors.gray300}`
      }}>
        <div style={{
          textAlign: 'center',
          color: colors.textSecondary
        }}>
          <h3>Carrusel de Noticias</h3>
          <p>Cargando contenido destacado...</p>
        </div>
      </div>
    );
  }

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
            {/* Envolver toda la slide en un Link */}
            <Link
              to={`/blog/${slide.id}`}
              state={{ forceReload: true }}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer'
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={styles.carouselImage}
                onError={(e) => {
                  e.target.src = '/assets/images/tecnologia.jpg'; // Imagen de fallback
                }}
              />
              <div style={{
                ...styles.carouselContent,
                opacity: currentSlide === index ? 1 : 0,
                transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)'
              }}>
                <div style={styles.carouselCategory}>{slide.category}</div>
                <h2 style={styles.carouselTitle}>{slide.title}</h2>
                <p style={styles.carouselExcerpt}>{slide.excerpt}</p>
                
                {/* Indicador visual de que es clicable */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  marginTop: spacing.md,
                  fontSize: typography.fontSize.sm,
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: typography.fontWeight.medium
                }}>
                  <span>Leer artículo completo</span>
                  <FaArrowRight size={12} />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Controles del carrusel */}
      <div style={styles.carouselControls}>
        <button
          style={hoveredElement === 'prev-btn'
            ? { ...styles.carouselButton, backgroundColor: "rgba(255,255,255,0.3)", transform: "scale(1.15)", opacity: 1 }
            : styles.carouselButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
          }}
          onMouseEnter={() => setHoveredElement('prev-btn')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          &#10094;
        </button>
        <button
          style={hoveredElement === 'next-btn'
            ? { ...styles.carouselButton, backgroundColor: "rgba(255,255,255,0.3)", transform: "scale(1.15)", opacity: 1 }
            : styles.carouselButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
          }}
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
            style={{
              ...styles.carouselDot(currentSlide === index),
              ...(hoveredElement === `dot-${index}` ? { 
                backgroundColor: currentSlide === index ? lightColors.primary : "rgba(255,255,255,0.8)",
                transform: "scale(1.2)"
              } : {})
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToSlide(index);
            }}
            onMouseEnter={() => setHoveredElement(`dot-${index}`)}
            onMouseLeave={() => setHoveredElement(null)}
          ></span>
        ))}
      </div>
      
      {/* Botón de pausa/reproducción */}
      <button
        style={hoveredElement === 'pause-play'
          ? { ...styles.pausePlayButton, backgroundColor: "rgba(255,255,255,0.3)", transform: "scale(1.1)" }
          : styles.pausePlayButton}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsPaused(!isPaused);
        }}
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
  const { isAuth, user } = useAuth(); // Añadimos el contexto de autenticación
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [categories, setCategories] = useState(['Todos']);
  const [notes, setNotes] = useState([]); // Para el carrusel
  const [featuredPost, setFeaturedPost] = useState(null);
  const [posts, setPosts] = useState([]); // Mantenemos este estado para filtrar
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
    initialDisplayCount: 12 // Aumentamos para tener más posts para filtrar
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Utilizamos los posts cargados desde el hook usePosts
        if (blogPosts && blogPosts.length > 0) {
          console.log('HomePage: Posts disponibles:', blogPosts.length);
          
          // NUEVO: Crear datos para el carrusel con los posts más destacados
          const carouselPosts = blogPosts.slice(0, 5).map(post => ({
            id: post.ID_publicaciones,
            title: post.Titulo,
            image: post.Imagen_portada || '/assets/images/tecnologia.jpg',
            category: post.categorias && post.categorias.length > 0 
              ? post.categorias[0].Nombre_categoria 
              : 'Sin categoría',
            excerpt: post.Resumen || post.Titulo.substring(0, 150) + '...'
          }));
          
          console.log('HomePage: Datos del carrusel creados:', carouselPosts);
          setNotes(carouselPosts);

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
          
          // CORREGIR: Formatear TODOS los posts para que se puedan filtrar
          const allFormattedPosts = blogPosts.map(post => ({
            id: post.ID_publicaciones,
            title: post.Titulo,
            image: post.Imagen_portada || '/assets/images/tecnologia.jpg',
            category: post.categorias && post.categorias.length > 0 
              ? post.categorias[0].Nombre_categoria 
              : 'Sin categoría',
            time: '4 horas atrás',
            likes: Math.floor(Math.random() * 200),
            // Agregamos el post original para usar en PostCard
            originalPost: post
          }));
          
          setPosts(allFormattedPosts);
        } else {
          console.log('HomePage: No hay posts, usando datos de ejemplo');
          // Si no hay publicaciones, usar datos de ejemplo para el carrusel también
          const exampleNotes = [
            {
              id: 1,
              title: 'Herramientas Tecnológicas para la Educación',
              image: '/assets/images/tecnologia.jpg',
              category: 'Herramientas',
              excerpt: 'Descubre las mejores herramientas digitales que están transformando la educación moderna y cómo implementarlas en tu aula.'
            },
            {
              id: 2,
              title: 'Técnicas de Estudio Efectivas',
              image: '/assets/images/humanos.jpg',
              category: 'Técnicas de Estudio',
              excerpt: 'Aprende métodos científicamente probados para mejorar tu concentración y retención de información.'
            },
            {
              id: 3,
              title: 'El Futuro de la Educación Digital',
              image: '/assets/images/desafio.jpg',
              category: 'Noticias',
              excerpt: 'Exploramos las tendencias emergentes en educación digital y su impacto en el aprendizaje del siglo XXI.'
            },
            {
              id: 4,
              title: 'Desarrollo Profesional Docente',
              image: '/assets/images/maestro.jpg',
              category: 'Desarrollo Docente',
              excerpt: 'Estrategias y recursos para el crecimiento profesional continuo de educadores y formadores.'
            }
          ];
          
          console.log('HomePage: Usando datos de ejemplo para carrusel:', exampleNotes);
          setNotes(exampleNotes);

          // Si no hay publicaciones, usar los datos de ejemplo
          setFeaturedPost({
            id: 63,
            title: 'El pequeño tomate que revolucionó mi forma de estudiar (y puede transformar la tuya también)',
            image: '/assets/images/tecnologia.jpg',
            category: 'técnicas de estudio',
            time: '2 horas atrás',
            excerpt: 'Cuando mi compañero de universidad Gregorio llegó a mi cuarto de estudio el semestre pasado, me dijo algo que me resonó profundamente: "Damian, tengo mil ideas rondando en mi cabeza, pero cuando me siento a estudiar, no consigo concentrarme ni cinco minutos seguidos"...',
            // Agregamos propiedades para indicar que es destacado
            isFeatured: true,
            featuredBadge: '⭐ POST DESTACADO',
            author: 'Equipo EducStation',
            readTime: '5 min de lectura',
            views: '2.5K',
            rating: '98% útil'
          });
          
          setPosts([
            {
              id: 1,
              title: 'Herramientas Tecnológicas para la Educación',
              image: '/assets/images/tecnologia.jpg',
              category: 'Herramientas Tecnológicas',
              time: '4 horas atrás',
              likes: 124
            },
            {
              id: 2,
              title: 'Comunidad y Colaboración en la Educación',
              image: '/assets/images/humanos.jpg',
              category: 'Técnicas de Estudio',
              time: '4 horas atrás',
              likes: 89
            },
            {
              id: 3,
              title: 'Problemas a enfrentar en la actualidad',
              image: '/assets/images/desafio.jpg',
              category: 'Problemáticas en el Estudio',
              time: '4 horas atrás',
              likes: 76
            },
            {
              id: 4,
              title: 'La gamificación en el aula moderna',
              image: '/assets/images/tecnologia.jpg',
              category: 'Herramientas Tecnológicas',
              time: '5 horas atrás',
              likes: 105
            },
            {
              id: 5,
              title: 'Educación inclusiva: Estrategias prácticas',
              image: '/assets/images/humanos.jpg',
              category: 'Educación de Calidad',
              time: '6 horas atrás',
              likes: 92
            },
            {
              id: 6,
              title: 'Evaluación formativa vs sumativa',
              image: '/assets/images/maestro.jpg',
              category: 'Técnicas de Estudio',
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

  // Cleanup effect para evitar memory leaks
  useEffect(() => {
    return () => {
      // Cleanup any ongoing operations when component unmounts
    };
  }, []);

  // Filtrar posts por categoría activa
  const filteredPosts = activeCategory === 'Todos'
    ? posts
    : posts.filter(post => post.category === activeCategory);

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
      width: "100%"
    },
    featuredPostWrapper: {
      width: "100%",
      position: "relative",
      marginBottom: 0, // Cambiar de spacing.xl a 0
      maxWidth: "100%",
      margin: "0", // Ya está bien
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
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes shine {
        0% { left: -100%; }
        100% { left: 100%; }
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

        {/* NUEVO: Banner especial para usuarios no registrados */}
        {!isAuth && (
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary}95, ${colors.secondary}85)`,
            borderRadius: '24px',
            padding: `${spacing.xxl} ${spacing.xl}`,
            margin: `${spacing.xl} 0`,
            color: colors.white,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 20px 50px ${colors.primary}30`,
            animation: 'slideInUp 0.8s ease-out'
          }}>
            {/* Decoraciones de fondo */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              zIndex: 0
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '150px',
              height: '150px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '50%',
              zIndex: 0
            }}></div>

            <div style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.md,
                marginBottom: spacing.lg
              }}>
                <FaGift size={32} color={colors.white} />
                <h2 style={{
                  fontSize: typography.fontSize.xxl,
                  fontWeight: typography.fontWeight.bold,
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  ¡Únete a EducStation y desbloquea tu potencial!
                </h2>
              </div>
              
              <p style={{
                fontSize: typography.fontSize.lg,
                marginBottom: spacing.xl,
                opacity: 0.95,
                lineHeight: '1.6'
              }}>
                Accede a contenido exclusivo, guarda tus artículos favoritos, participa en discusiones 
                y forma parte de una comunidad educativa en constante crecimiento.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: spacing.lg,
                marginBottom: spacing.xl
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  justifyContent: 'center'
                }}>
                  <FaHeart size={20} color={colors.white} />
                  <span>Guarda favoritos</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  justifyContent: 'center'
                }}>
                  <FaUsers size={20} color={colors.white} />
                  <span>Únete a la comunidad</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  justifyContent: 'center'
                }}>
                  <FaShieldAlt size={20} color={colors.white} />
                  <span>Contenido exclusivo</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: spacing.md,
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <Link 
                  to="/register" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    backgroundColor: colors.white,
                    color: colors.primary,
                    padding: `${spacing.md} ${spacing.xl}`,
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.semibold,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    ...(hoveredElement === 'register-btn' ? {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 25px rgba(0,0,0,0.3)'
                    } : {})
                  }}
                  onMouseEnter={() => setHoveredElement('register-btn')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <FaUserPlus size={16} />
                  <span>Crear cuenta gratis</span>
                </Link>
                
                <Link 
                  to="/login" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    backgroundColor: 'transparent',
                    color: colors.white,
                    padding: `${spacing.md} ${spacing.xl}`,
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.medium,
                    border: `2px solid ${colors.white}`,
                    transition: 'all 0.3s ease',
                    ...(hoveredElement === 'login-btn' ? {
                      backgroundColor: colors.white,
                      color: colors.primary,
                      transform: 'translateY(-3px)'
                    } : {})
                  }}
                  onMouseEnter={() => setHoveredElement('login-btn')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <FaRocket size={16} />
                  <span>Iniciar sesión</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* NUEVO: Carrusel de Noticias */}
        <NewsCarousel notes={notes} />

        {/* Sección de categorías destacadas */}
        <div style={{
          marginTop: spacing.xxl,
          marginBottom: spacing.xxl,
          textAlign: 'center',
          position: 'relative',
          padding: `${spacing.xl} 0`,
          overflow: 'hidden',
          backgroundColor: '#c4d1ce',
          borderRadius: '24px' // Agregamos bordes redondeados
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
            lineHeight: "1.6",
            animation: 'fadeInUp 0.8s ease-out',
            position: 'relative',
            zIndex: 1
          }}>
            Explora nuestras áreas temáticas principales y encuentra contenido que te inspire, motive y ayude en tu desarrollo educativo.
          </p>

          

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: spacing.xl,
            marginTop: spacing.xl,
            position: 'relative',
            zIndex: 1,
            maxWidth: '1000px',
            margin: `${spacing.xl} auto 0 auto`
          }}>
            {/* Categoría 1 */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff, #f7f9fa)',
              borderRadius: '18px',
              padding: spacing.xl,
              boxShadow: hoveredElement === 'cat-1' 
                ? '0 15px 30px rgba(11, 68, 68, 0.12)' 
                : '0 8px 20px rgba(11, 68, 68, 0.06)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: hoveredElement === 'cat-1' ? 'translateY(-10px)' : 'translateY(0)',
              cursor: 'pointer',
              border: hoveredElement === 'cat-1' ? `2px solid ${colors.primary}15` : '2px solid transparent',
              animation: 'fadeInUp 0.6s ease-out'
            }}
              onMouseEnter={() => setHoveredElement('cat-1')}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => setActiveCategory('Técnicas de Estudio')}
            >
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '18px',
                background: hoveredElement === 'cat-1'
                  ? `linear-gradient(135deg, ${colors.primary}, ${colors.primary}90)`
                  : `linear-gradient(135deg, ${colors.primary}80, ${colors.primary}60)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing.lg,
                boxShadow: hoveredElement === 'cat-1' 
                  ? '0 8px 20px rgba(11, 68, 68, 0.15)' 
                  : '0 6px 12px rgba(11, 68, 68, 0.08)',
                transition: 'all 0.3s ease',
                transform: hoveredElement === 'cat-1' ? 'scale(1.05) rotate(3deg)' : 'scale(1) rotate(0)',
              }}>
                <FaLightbulb size={32} color="#fff" style={{
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
                transform: hoveredElement === 'cat-1' ? 'scaleX(1.3)' : 'scaleX(1)',
              }}></div>
              <p style={{
                fontSize: typography.fontSize.md,
                color: colors.textSecondary,
                lineHeight: '1.6',
                transition: 'color 0.3s ease'
              }}>
                Metodologías efectivas para optimizar el aprendizaje.
              </p>
            </div>

            {/* Categoría 2 */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff, #f7f9fa)',
              borderRadius: '18px',
              padding: spacing.xl,
              boxShadow: hoveredElement === 'cat-2' 
                ? '0 15px 30px rgba(11, 68, 68, 0.12)' 
                : '0 8px 20px rgba(11, 68, 68, 0.06)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: hoveredElement === 'cat-2' ? 'translateY(-10px)' : 'translateY(0)',
              cursor: 'pointer',
              border: hoveredElement === 'cat-2' ? `2px solid ${colors.secondary}15` : '2px solid transparent',
              animation: 'fadeInUp 0.8s ease-out'
            }}
              onMouseEnter={() => setHoveredElement('cat-2')}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => setActiveCategory('Herramientas Tecnológicas')}
            >
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '18px',
                background: hoveredElement === 'cat-2'
                  ? `linear-gradient(135deg, ${colors.secondary}, ${colors.secondary}90)`
                  : `linear-gradient(135deg, ${colors.secondary}80, ${colors.secondary}60)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing.lg,
                boxShadow: hoveredElement === 'cat-2' 
                  ? '0 8px 20px rgba(11, 68, 68, 0.15)' 
                  : '0 6px 12px rgba(11, 68, 68, 0.08)',
                transition: 'all 0.3s ease',
                transform: hoveredElement === 'cat-2' ? 'scale(1.05) rotate(3deg)' : 'scale(1) rotate(0)',
              }}>
                <FaGraduationCap size={32} color="#fff" style={{
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
                Herramientas Tecnológicas
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
                transform: hoveredElement === 'cat-2' ? 'scaleX(1.3)' : 'scaleX(1)',
              }}></div>
              <p style={{
                fontSize: typography.fontSize.md,
                color: colors.textSecondary,
                lineHeight: '1.6',
                transition: 'color 0.3s ease'
              }}>
                Recursos digitales para la enseñanza moderna.
              </p>
            </div>

            {/* Categoría 3 */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff, #f7f9fa)',
              borderRadius: '18px',
              padding: spacing.xl,
              boxShadow: hoveredElement === 'cat-3' 
                ? '0 15px 30px rgba(11, 68, 68, 0.12)' 
                : '0 8px 20px rgba(11, 68, 68, 0.06)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: hoveredElement === 'cat-3' ? 'translateY(-10px)' : 'translateY(0)',
              cursor: 'pointer',
              border: hoveredElement === 'cat-3' ? `2px solid ${colors.primary}15` : '2px solid transparent',
              animation: 'fadeInUp 1s ease-out'
            }}
              onMouseEnter={() => setHoveredElement('cat-3')}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => setActiveCategory('Educación de Calidad')}
            >
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '18px',
                background: hoveredElement === 'cat-3'
                  ? `linear-gradient(135deg, ${colors.primary}90, ${colors.secondary}90)`
                  : `linear-gradient(135deg, ${colors.primary}70, ${colors.secondary}70)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing.lg,
                boxShadow: hoveredElement === 'cat-3' 
                  ? '0 8px 20px rgba(11, 68, 68, 0.15)' 
                  : '0 6px 12px rgba(11, 68, 68, 0.08)',
                transition: 'all 0.3s ease',
                transform: hoveredElement === 'cat-3' ? 'scale(1.05) rotate(3deg)' : 'scale(1) rotate(0)',
              }}>
                <FaChalkboardTeacher size={32} color="#fff" style={{
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
                transform: hoveredElement === 'cat-3' ? 'scaleX(1.3)' : 'scaleX(1)',
              }}></div>
              <p style={{
                fontSize: typography.fontSize.md,
                color: colors.textSecondary,
                lineHeight: '1.6',
                transition: 'color 0.3s ease'
              }}>
                Estándares para una experiencia educativa de excelencia.
              </p>
            </div>
          </div>

          {/* Banner de exploración - Movido aquí, después de las categorías */}
          <div 
            style={{
              ...(hoveredElement === 'explore-banner' ? 
                { ...styles.exploreBanner, ...styles.exploreBanner['&:hover'] } : 
                styles.exploreBanner),
              maxWidth: '1000px', // Mismo ancho que el grid de categorías
              margin: `${spacing.xl} auto ${spacing.lg} auto`, // Margen top más grande para separar de las categorías
              padding: `${spacing.xl} ${spacing.lg}` // Padding más pequeño para que encaje mejor
            }}
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
            <Link 
              to="/categorias"
              style={hoveredElement === 'explore-btn' ? 
                { ...styles.exploreBannerBtn, ...styles.exploreBannerBtn['&:hover'] } : 
                styles.exploreBannerBtn
              }
              onMouseEnter={() => setHoveredElement('explore-btn')}
              onMouseLeave={() => setHoveredElement('explore-banner')}
            >
              <span>Explorar categorías</span>
              <FaArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* NUEVO: Sección de beneficios para usuarios no registrados */}
        {!isAuth && (
          <div style={{
            background: `linear-gradient(135deg, ${colors.white}, ${colors.gray50})`,
            borderRadius: '24px',
            padding: `${spacing.xxl} ${spacing.xl}`,
            margin: `${spacing.xxl} 0`,
            boxShadow: `0 15px 40px ${colors.primary}15`,
            border: `1px solid ${colors.primary}10`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decoraciones sutiles */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, ${colors.secondary}10, transparent)`,
              borderRadius: '50%',
              zIndex: 0
            }}></div>

            <div style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              <h2 style={{
                fontSize: typography.fontSize.xxl,
                color: colors.primary,
                marginBottom: spacing.lg,
                fontWeight: typography.fontWeight.bold
              }}>
                ¿Por qué unirse a EducStation?
              </h2>
              
              <p style={{
                fontSize: typography.fontSize.lg,
                color: colors.textSecondary,
                marginBottom: spacing.xxl,
                lineHeight: '1.6'
              }}>
                Descubre todo lo que puedes lograr siendo parte de nuestra comunidad educativa
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: spacing.xl,
                marginBottom: spacing.xxl
              }}>
                {/* Beneficio 1 */}
                <div style={{
                  textAlign: 'center',
                  padding: spacing.lg,
                  borderRadius: '16px',
                  background: hoveredElement === 'benefit-1' ? `${colors.primary}05` : 'transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={() => setHoveredElement('benefit-1')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginBottom: spacing.md,
                    transform: hoveredElement === 'benefit-1' ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <FaStar size={24} color={colors.white} />
                  </div>
                  <h3 style={{
                    fontSize: typography.fontSize.lg,
                    color: colors.primary,
                    marginBottom: spacing.sm,
                    fontWeight: typography.fontWeight.semibold
                  }}>
                    Contenido Premium
                  </h3>
                  <p style={{
                    fontSize: typography.fontSize.md,
                    color: colors.textSecondary,
                    lineHeight: '1.5'
                  }}>
                    Accede a artículos exclusivos, guías detalladas y recursos educativos de alta calidad
                  </p>
                </div>

                {/* Beneficio 2 */}
                <div style={{
                  textAlign: 'center',
                  padding: spacing.lg,
                  borderRadius: '16px',
                  background: hoveredElement === 'benefit-2' ? `${colors.secondary}05` : 'transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={() => setHoveredElement('benefit-2')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginBottom: spacing.md,
                    transform: hoveredElement === 'benefit-2' ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <FaUsers size={24} color={colors.white} />
                  </div>
                  <h3 style={{
                    fontSize: typography.fontSize.lg,
                    color: colors.primary,
                    marginBottom: spacing.sm,
                    fontWeight: typography.fontWeight.semibold
                  }}>
                    Comunidad Activa
                  </h3>
                  <p style={{
                    fontSize: typography.fontSize.md,
                    color: colors.textSecondary,
                    lineHeight: '1.5'
                  }}>
                    Conecta con otros estudiantes y educadores, comparte experiencias y aprende juntos
                  </p>
                </div>

                {/* Beneficio 3 */}
                <div style={{
                  textAlign: 'center',
                  padding: spacing.lg,
                  borderRadius: '16px',
                  background: hoveredElement === 'benefit-3' ? `${colors.primary}05` : 'transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={() => setHoveredElement('benefit-3')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primary}90, ${colors.secondary}90)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginBottom: spacing.md,
                    transform: hoveredElement === 'benefit-3' ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <FaRocket size={24} color={colors.white} />
                  </div>
                  <h3 style={{
                    fontSize: typography.fontSize.lg,
                    color: colors.primary,
                    marginBottom: spacing.sm,
                    fontWeight: typography.fontWeight.semibold
                  }}>
                    Progreso Personalizado
                  </h3>
                  <p style={{
                    fontSize: typography.fontSize.md,
                    color: colors.textSecondary,
                    lineHeight: '1.5'
                  }}>
                    Guarda tus artículos favoritos, sigue tu progreso y recibe recomendaciones personalizadas
                  </p>
                </div>
              </div>

              {/* Llamada a la acción final */}
              <div style={{
                background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
                borderRadius: '16px',
                padding: spacing.xl,
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: typography.fontSize.xl,
                  color: colors.primary,
                  marginBottom: spacing.md,
                  fontWeight: typography.fontWeight.semibold
                }}>
                  ¡Comienza tu viaje educativo hoy!
                </h3>
                <p style={{
                  fontSize: typography.fontSize.md,
                  color: colors.textSecondary,
                  marginBottom: spacing.lg,
                  lineHeight: '1.5'
                }}>
                  Únete a miles de estudiantes y educadores que ya están transformando su experiencia de aprendizaje
                </p>
                <Link 
                  to="/register" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    backgroundColor: colors.primary,
                    color: colors.white,
                    padding: `${spacing.md} ${spacing.xl}`,
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.semibold,
                    boxShadow: `0 8px 20px ${colors.primary}30`,
                    transition: 'all 0.3s ease',
                    ...(hoveredElement === 'final-cta' ? {
                      transform: 'translateY(-3px)',
                      boxShadow: `0 12px 25px ${colors.primary}40`
                    } : {})
                  }}
                  onMouseEnter={() => setHoveredElement('final-cta')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <FaUserPlus size={16} />
                  <span>Registrarse gratis</span>
                  <FaArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

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
                {/* Usar los posts filtrados */}
                {filteredPosts.slice(0, 6).map((post, index) => (
                  <div 
                    key={post.id} 
                    className="post-card-animation" 
                    style={{
                      "--animation-order": index,
                      background: "transparent"
                    }}
                  >
                    {/* Si existe originalPost (posts reales), usarlo; si no, usar el post formateado */}
                    <PostCard post={post.originalPost || post} />
                  </div>
                ))}
              </div>
            )}

            {/* Mostrar mensaje si no hay posts en la categoría seleccionada */}
            {!loading && !postsError && filteredPosts.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: spacing.xl,
                color: colors.textSecondary 
              }}>
                <p>No hay publicaciones disponibles para la categoría "{activeCategory}".</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: spacing.xl }}>
              <Link 
                to="/blog" 
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
              </Link>
            </div>
          </section>

          {/* Featured Post - Ahora a todo lo ancho con diseño premium */}
          <div style={{
            ...styles.featuredPostWrapper,
            position: 'relative',
            background: `linear-gradient(135deg, ${colors.white}, ${colors.gray50})`,
            borderRadius: '24px',
            padding: 0,
            boxShadow: `0 25px 60px ${colors.primary}20, 0 0 0 3px ${colors.primary}15`,
            border: `2px solid ${colors.primary}30`,
            overflow: 'hidden',
            transform: hoveredElement === 'featured-post' ? 'translateY(-12px)' : 'translateY(0)',
            transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
            onMouseEnter={() => setHoveredElement('featured-post')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            {/* Envolver todo el contenido en un Link */}
            <Link
              to={`/blog/${featuredPost?.id}`}
              state={{ forceReload: true }}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {/* Efecto de brillo animado */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'shine 3s ease-in-out infinite',
                zIndex: 1,
                pointerEvents: 'none'
              }}></div>
              
              {/* Badge "POST DESTACADO" */}
              <div style={{
                position: 'absolute',
                top: spacing.lg,
                right: spacing.lg,
                zIndex: 2,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: colors.white,
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: '50px',
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.bold,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                animation: 'pulse 2s infinite'
              }}>
                <span style={{ fontSize: '14px' }}>⭐</span>
                <span>POST DESTACADO</span>
              </div>

              {/* Decoración superior izquierda */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                width: '80px',
                height: '80px',
                background: `radial-gradient(circle, ${colors.primary}15, transparent)`,
                borderRadius: '50%',
                zIndex: 0
              }}></div>

              {/* Decoración inferior derecha */}
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                right: '-30px',
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${colors.secondary}10, transparent)`,
                borderRadius: '50%',
                zIndex: 0
              }}></div>

              {/* Indicador visual de que es clicable */}
              <div style={{
                position: 'absolute',
                bottom: spacing.lg,
                left: spacing.lg,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: colors.primary,
                padding: `${spacing.xs} ${spacing.sm}`,
                borderRadius: '20px',
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.medium,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                transform: hoveredElement === 'featured-post' ? 'translateY(-3px)' : 'translateY(0)'
              }}>
                <span>Leer artículo completo</span>
                <FaArrowRight size={10} />
              </div>

              {featuredPost && <FeaturedPost post={featuredPost} />}
            </Link>
          </div>
        </div>

        {/* NUEVO: Sección de estadísticas para usuarios no registrados */}
        {!isAuth && (
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary}95, ${colors.secondary}90)`,
            color: colors.white,
            padding: `${spacing.xxl} ${spacing.xl}`,
            margin: `${spacing.xxl} 0 0 0`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decoraciones de fondo */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              zIndex: 0
            }}></div>

            <div style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              <h2 style={{
                fontSize: typography.fontSize.xxl,
                fontWeight: typography.fontWeight.bold,
                marginBottom: spacing.lg,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Únete a una comunidad en crecimiento
              </h2>
              
              <p style={{
                fontSize: typography.fontSize.lg,
                marginBottom: spacing.xxl,
                opacity: 0.95,
                lineHeight: '1.6'
              }}>
                Miles de estudiantes y educadores ya confían en EducStation para su desarrollo profesional
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: spacing.xl,
                marginBottom: spacing.xxl
              }}>
                {/* Estadística 1 */}
                <div style={{
                  textAlign: 'center',
                  padding: spacing.lg,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  transform: hoveredElement === 'stat-1' ? 'translateY(-5px)' : 'translateY(0)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={() => setHoveredElement('stat-1')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <div style={{
                    fontSize: typography.fontSize.xxxl,
                    fontWeight: typography.fontWeight.bold,
                    marginBottom: spacing.sm,
                    color: colors.white
                  }}>
                    5K+
                  </div>
                  <p style={{
                    fontSize: typography.fontSize.md,
                    margin: 0,
                    opacity: 0.9
                  }}>
                    Estudiantes activos
                  </p>
                </div>

                {/* Estadística 2 */}
                <div style={{
                  textAlign: 'center',
                  padding: spacing.lg,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  transform: hoveredElement === 'stat-2' ? 'translateY(-5px)' : 'translateY(0)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={() => setHoveredElement('stat-2')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <div style={{
                    fontSize: typography.fontSize.xxxl,
                    fontWeight: typography.fontWeight.bold,
                    marginBottom: spacing.sm,
                    color: colors.white
                  }}>
                    200+
                  </div>
                  <p style={{
                    fontSize: typography.fontSize.md,
                    margin: 0,
                    opacity: 0.9
                  }}>
                    Artículos publicados
                  </p>
                </div>

                {/* Estadística 3 */}
                <div style={{
                  textAlign: 'center',
                  padding: spacing.lg,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  transform: hoveredElement === 'stat-3' ? 'translateY(-5px)' : 'translateY(0)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={() => setHoveredElement('stat-3')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <div style={{
                    fontSize: typography.fontSize.xxxl,
                    fontWeight: typography.fontWeight.bold,
                    marginBottom: spacing.sm,
                    color: colors.white
                  }}>
                    98%
                  </div>
                  <p style={{
                    fontSize: typography.fontSize.md,
                    margin: 0,
                    opacity: 0.9
                  }}>
                    Satisfacción de usuarios
                  </p>
                </div>

                {/* Estadística 4 */}
                <div style={{
                  textAlign: 'center',
                  padding: spacing.lg,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  transform: hoveredElement === 'stat-4' ? 'translateY(-5px)' : 'translateY(0)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={() => setHoveredElement('stat-4')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <div style={{
                    fontSize: typography.fontSize.xxxl,
                    fontWeight: typography.fontWeight.bold,
                    marginBottom: spacing.sm,
                    color: colors.white
                  }}>
                    24/7
                  </div>
                  <p style={{
                    fontSize: typography.fontSize.md,
                    margin: 0,
                    opacity: 0.9
                  }}>
                    Acceso disponible
                  </p>
                </div>
              </div>

              {/* Testimonio destacado */}
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '20px',
                padding: spacing.xl,
                maxWidth: '600px',
                margin: '0 auto',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{
                  fontSize: typography.fontSize.lg,
                  fontStyle: 'italic',
                  marginBottom: spacing.md,
                  lineHeight: '1.6'
                }}>
                  "EducStation ha transformado completamente mi forma de estudiar. Los recursos son increíbles y la comunidad es muy supportiva."
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.sm
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.white}30, ${colors.white}10)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaGraduationCap size={20} color={colors.white} />
                  </div>
                  <div>
                    <div style={{
                      fontWeight: typography.fontWeight.semibold,
                      fontSize: typography.fontSize.md
                    }}>
                      María González
                    </div>
                    <div style={{
                      fontSize: typography.fontSize.sm,
                      opacity: 0.8
                    }}>
                      Estudiante de Pedagogía
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;