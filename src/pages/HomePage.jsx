import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FeaturedPost from '../components/blog/FeaturedPost';
import PostCard from '../components/blog/PostCard';
// Elimina la importación de colors y solo importa lo que necesitas
import { spacing, typography, transitions, applyHoverStyles } from '../styles/theme';
// Importamos el hook useTheme
import { useTheme } from '../context/ThemeContext';
// Importación del servicio de búsqueda
import { searchPublicaciones } from '../services/searchService';
// Importación del componente SearchBox
import SearchBox from '../components/common/SearchBox';

// Componente para el carrusel
const NewsCarousel = ({ notes }) => {
  // Usamos useTheme para obtener los colores según el tema actual
  const { colors } = useTheme();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredElement, setHoveredElement] = useState(null);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Efecto para el carrusel automático
  useEffect(() => {
    const playCarousel = () => {
      setCurrentSlide((prevSlide) =>
        prevSlide === notes.length - 1 ? 0 : prevSlide + 1
      );
    };
    autoPlayRef.current = playCarousel;
  }, [notes.length]);

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
      height: "400px",
      overflow: "hidden",
      borderRadius: "16px",
      marginTop: spacing.xl,
      marginBottom: spacing.xxl,
      boxShadow: `0 10px 30px ${colors.primary}33`,
      cursor: "pointer", // Añadido para indicar que todo el carrusel es clickeable
    },
    carouselInner: {
      whiteSpace: "nowrap",
      transition: "transform 0.5s ease-in-out",
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
    },
    carouselContent: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      padding: spacing.xl,
      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
      color: colors.white,
      whiteSpace: "normal",
    },
    carouselTitle: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    },
    carouselExcerpt: {
      fontSize: typography.fontSize.md,
      marginBottom: 0, // Cambiado de spacing.lg a 0 ya que no hay botón después
      opacity: "0.9",
    },
    carouselCategory: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: "16px",
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
      textTransform: "uppercase",
      display: "inline-block",
      marginBottom: spacing.md,
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
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: "50%",
      width: "44px",
      height: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "none",
      fontSize: "24px",
      color: colors.white,
      backdropFilter: "blur(3px)",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: "rgba(255,255,255,0.5)",
        transform: "scale(1.1)",
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
      backgroundColor: isActive ? colors.primary : "rgba(255,255,255,0.5)",
      cursor: "pointer",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: isActive ? colors.primary : "rgba(255,255,255,0.8)",
      }
    })
  };

  return (
    <div style={styles.carousel} ref={carouselRef}>
      <div style={styles.carouselInner}>
        {notes.map((slide, index) => (
          <div key={slide.id} style={styles.carouselItem}>
            <img
              src={slide.image}
              alt={slide.title}
              style={styles.carouselImage}
            />
            <div style={styles.carouselContent}>
              <div style={styles.carouselCategory}>{slide.category}</div>
              <h2 style={styles.carouselTitle}>{slide.title}</h2>
              <p style={styles.carouselExcerpt}>{slide.excerpt}</p>
              {/* El botón "Leer más" ha sido eliminado */}
            </div>
          </div>
        ))}
      </div>

      {/* Controles del carrusel */}
      <div style={styles.carouselControls}>
        <button
          style={hoveredElement === 'prev-btn'
            ? applyHoverStyles(styles.carouselButton)
            : styles.carouselButton}
          onClick={prevSlide}
          onMouseEnter={() => setHoveredElement('prev-btn')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          &#10094;
        </button>
        <button
          style={hoveredElement === 'next-btn'
            ? applyHoverStyles(styles.carouselButton)
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
              ? applyHoverStyles(styles.carouselDot(currentSlide === index))
              : styles.carouselDot(currentSlide === index)}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setHoveredElement(`dot-${index}`)}
            onMouseLeave={() => setHoveredElement(null)}
          ></span>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  // Añadimos el hook useTheme en el componente principal
  const { colors } = useTheme();

  // Estado para la categoría activa
  const [activeCategory, setActiveCategory] = useState('Todos');
  // Estado para la categoría sobre la que se está haciendo hover
  const [hoveredCategory, setHoveredCategory] = useState(null);
  // Estado para el valor de búsqueda
  const [searchValue, setSearchValue] = useState('');
  // Nuevo estado para el loading de búsqueda
  const [loading, setLoading] = useState(false);

  // Categorías de los artículos
  const categories = [
    'Todos',
    'Noticias',
    'Técnicas de Estudio',
    'Problemáticas',
    'Educación de Calidad',
    'Herramientas',
    'Desarrollo Docente',
    'Comunidad'
  ];

  // Artículo destacado
  const featuredPost = {
    id: 'featured', // Agregamos el ID para el enlace
    title: 'Herramientas Tecnológicas para la Educación',
    image: '/assets/images/tecnologia.jpg',
    category: 'desarrollo docente',
    time: '2 horas atrás',
    number: '01',
    excerpt: 'Descubre cómo los educadores están reinventando sus métodos de enseñanza para adaptarse a un mundo cada vez más digitalizado.'
  };

  // Convertimos posts a un estado para poder actualizarlo con la búsqueda
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Herramientas Tecnológicas para la Educación',
      image: '/assets/images/tecnologia.jpg',
      category: 'herramientas',
      time: '4 horas atrás',
      number: '02',
      likes: 124
    },
    {
      id: 2,
      title: 'Comunidad y Colaboración en la Educación',
      image: '/assets/images/humanos.jpg',
      category: 'técnicas de estudio',
      time: '4 horas atrás',
      number: '03',
      likes: 89
    },
    {
      id: 3,
      title: 'Problemas a enfrentar en la actualidad',
      image: '/assets/images/desafio.jpg',
      category: 'comunidad',
      time: '4 horas atrás',
      number: '04',
      likes: 76
    },
    {
      id: 4,
      title: 'Desarrollo Profesional Docente',
      image: '/assets/images/maestro.jpg',
      category: 'educación de calidad',
      time: '4 horas atrás',
      number: '05',
      likes: 112
    }
  ]);

  // Función para manejar la búsqueda
  const handleSearch = async (term) => {
    try {
      setLoading(true);
      setSearchValue(term);

      if (!term.trim()) {
        // Si la búsqueda está vacía, restaurar los posts originales
        setPosts([
          {
            id: 1,
            title: 'Herramientas Tecnológicas para la Educación',
            image: '/assets/images/tecnologia.jpg',
            category: 'herramientas',
            time: '4 horas atrás',
            number: '02',
            likes: 124
          },
          {
            id: 2,
            title: 'Comunidad y Colaboración en la Educación',
            image: '/assets/images/humanos.jpg',
            category: 'técnicas de estudio',
            time: '4 horas atrás',
            number: '03',
            likes: 89
          },
          {
            id: 3,
            title: 'Problemas a enfrentar en la actualidad',
            image: '/assets/images/desafio.jpg',
            category: 'comunidad',
            time: '4 horas atrás',
            number: '04',
            likes: 76
          },
          {
            id: 4,
            title: 'Desarrollo Profesional Docente',
            image: '/assets/images/maestro.jpg',
            category: 'educación de calidad',
            time: '4 horas atrás',
            number: '05',
            likes: 112
          }
        ]);
        setLoading(false);
        return;
      }

      const results = await searchPublicaciones(term);
      // Actualizar los posts con los resultados de la búsqueda
      setPosts(results);
      setLoading(false);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setLoading(false);
    }
  };

  // NUEVO: Notas para el carrusel
  const carouselNotes = [
    {
      id: 1,
      title: "Prohibición de bebidas azucaradas en comedores escolares",
      excerpt: "El gobierno español está trabajando en un decreto para prohibir el consumo de bebidas azucaradas en comedores escolares, donde se busca promover hábitos mas saludables y combatir la obesidad infantil.",
      image: "/assets/images/humanos.jpg", // Cambiado para usar la misma imagen
      category: "Ultima Noticia"
    },
    {
      id: 2,
      title: "Aprendizaje colaborativo: La clave del éxito académico",
      excerpt: "Estudios demuestran que el trabajo en equipo mejora la retención y comprensión de conceptos complejos.",
      image: "/assets/images/desafio.jpg", // Cambiado para usar la misma imagen
      category: "Técnicas de Estudio"
    },
    {
      id: 3,
      title: "Mindfulness en la educación: Mejorando la concentración",
      excerpt: "Implementar prácticas de atención plena puede reducir el estrés y mejorar el rendimiento académico.",
      image: "/assets/images/maestro.jpg", // Cambiado para usar la misma imagen
      category: "Bienestar"
    },
    {
      id: 4,
      title: "La gamificación como estrategia pedagógica efectiva",
      excerpt: "El uso de elementos de juego en el aula aumenta la motivación y el compromiso de los estudiantes.",
      image: "/assets/images/tecnologia.jpg", // Cambiado para usar la misma imagen
      category: "Innovación"
    }
  ];

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
      background: `linear-gradient(100deg, ${colors.white}99 100%, ${colors.secondary}99 100%)`,
      padding: `${spacing.xl} ${spacing.md}`,
      borderRadius: '12px'
    },
    heroTitle: {
      fontSize: typography.fontSize.xxxl,
      color: colors.primary,
      marginBottom: spacing.md,
      lineHeight: "1.2",
      animation: "fadeInUp 0.8s ease-out"
    },
    heroText: {
      fontSize: typography.fontSize.lg,
      color: colors.textSecondary,
      marginBottom: spacing.xl,
      maxWidth: "700px",
      lineHeight: "1.6",
      animation: "fadeInUp 1s ease-out"
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
      boxShadow: "0 4px 15px rgba(11, 68, 68, 0.08)",
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
      transition: transitions.default,
      boxShadow: isActive ? "0 4px 12px rgba(11, 68, 68, 0.15)" : "none",
      transform: isHovered && !isActive ? "translateY(-2px)" : "translateY(0)"
    }),
    searchBox: {
      flex: "1",
      maxWidth: "300px",
      position: "relative",
      marginLeft: "auto"
    },
    searchInput: {
      width: "100%",
      padding: `${spacing.sm} ${spacing.md} ${spacing.sm} ${spacing.xxl}`,
      border: "none",
      borderRadius: "24px",
      backgroundColor: "rgba(11, 68, 68, 0.05)",
      fontSize: typography.fontSize.sm,
      transition: transitions.default,
      boxShadow: "inset 0 2px 5px rgba(11, 68, 68, 0.05)",
      '&:focus': {
        backgroundColor: colors.white,
        boxShadow: `0 0 0 2px rgba(11, 68, 68, 0.1), inset 0 2px 5px rgba(11, 68, 68, 0.05)`,
        outline: "none"
      }
    },
    searchIcon: {
      position: "absolute",
      left: spacing.md,
      top: "50%",
      transform: "translateY(-50%)",
      color: colors.textSecondary,
      fontSize: "18px"
    },
    contentWrapper: {
      display: "grid",
      gridTemplateColumns: "60% 1fr",
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
      height: "100%",
      position: "relative",
      minWidth: "300px",
      // La siguiente propiedad evita que el featuredPost se minimice al hacer scroll
      position: "sticky",
      top: spacing.xl,
    },
    postsGridWrapper: {
      width: "100%",
      minWidth: "300px"
    },
    postsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: spacing.xl,
    },
    animationStyles: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
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
          transform: translateY(30px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
    // Nueva propiedad para mostrar inmediatamente el contenido sin minimizarlo
    noOverflow: {
      overflow: "visible"
    }
  };

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

          href="#"
          style={styles.breadcrumbLink}
          onMouseEnter={(e) => e.target.style.color = colors.primary}
          onMouseLeave={(e) => e.target.style.color = colors.primaryLight}
          <a>Inicio</a>
          <span style={{ color: colors.secondary, fontSize: '10px' }}>►</span>
          <span>Blogs y Artículos</span>
        </div>

        {/* Hero Section */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Tu Destino para Educación, Innovación y Crecimiento</h1>
          <p style={styles.heroText}>Descubre consejos, tendencias y técnicas para mejorar tu experiencia educativa y desarrollo profesional. Únete a nuestra comunidad de aprendices y educadores comprometidos.</p>

          <div
            style={hoveredCategory === 'circle' ? applyHoverStyles(styles.circleLink) : styles.circleLink}
            onMouseEnter={() => setHoveredCategory('circle')}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div style={{
              ...styles.circleText,
              animation: 'spin 1s linear infinite',
              transform: hoveredCategory === 'circle' ? 'rotate(-5deg)' : 'rotate(0deg)',
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
        <NewsCarousel notes={carouselNotes} />

        {/* Categories */}
        <div style={styles.categories}>
          {categories.map(category => (
            <button
              key={category}
              style={styles.category(
                activeCategory === category,
                hoveredCategory === category
              )}
              onClick={() => setActiveCategory(category)}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {category}
            </button>
          ))}

          {/* Reemplazamos el input comentado por nuestro SearchBox */}
          <div style={styles.searchBox}>
            <SearchBox
              onSearch={handleSearch}
              initialValue={searchValue}
              placeholder="Buscar un artículo..."
              loading={loading}
            />
          </div>
        </div>

        {/* Featured Post and Posts Grid - CORREGIDO */}
        <div style={styles.contentWrapper}>
          {/* Featured Post */}
          <div style={styles.featuredPostWrapper}>
            <FeaturedPost post={featuredPost} />
          </div>

          {/* Posts Grid */}
          <div style={styles.postsGridWrapper}>
            <div style={styles.postsGrid}>
              {filteredPosts.map((post, index) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;