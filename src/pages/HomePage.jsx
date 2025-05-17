import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostCard from '../components/blog/PostCard';
import { spacing, typography, transitions } from '../styles/theme';
import useTheme from '../hooks/useTheme';

// Componente para el carrusel
const NewsCarousel = ({ notes }) => {
  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDarkMode || false;
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredElement, setHoveredElement] = useState(null);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Efecto para el carrusel automático
  useEffect(() => {
    const playCarousel = () => {
      setCurrentSlide((prev) => (prev === notes.length - 1 ? 0 : prev + 1));
    };
    
    autoPlayRef.current = playCarousel;
  }, [notes.length]);

  useEffect(() => {
    const play = () => {
      autoPlayRef.current();
    };
    
    const interval = setInterval(play, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === notes.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? notes.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Estilos del carrusel
  const styles = {
    carousel: {
      position: "relative",
      width: "100%",
      marginBottom: spacing.xl,
      overflow: "hidden",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      height: "380px",
    },
    carouselInner: {
      whiteSpace: "nowrap",
      transition: "transform 0.5s ease",
      transform: `translateX(-${currentSlide * 100}%)`,
      height: "100%",
    },
    carouselItem: {
      display: "inline-block",
      width: "100%",
      height: "100%",
      position: "relative",
      whiteSpace: "normal",
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
      color: "#fff",
      whiteSpace: "normal",
    },
    carouselTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
      textShadow: "0 1px 3px rgba(0,0,0,0.3)",
      color: "#fff",
    },
    carouselExcerpt: {
      fontSize: typography.fontSize.sm,
      marginBottom: 0,
      opacity: "0.9",
      color: "#f0f8f7",
    },
    carouselCategory: {
      backgroundColor: "#0b4444",
      color: "#fff",
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: "4px",
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
      textTransform: "uppercase",
      display: "inline-block",
      marginBottom: spacing.xs,
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
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "none",
      fontSize: "18px",
      color: "#fff",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: "rgba(255,255,255,0.5)",
        transform: "scale(1.1)",
      }
    },
    carouselDots: {
      position: "absolute",
      bottom: spacing.md,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      gap: spacing.xs,
      zIndex: 2,
    },
    carouselDot: (isActive) => ({
      width: isActive ? "24px" : "8px",
      height: "8px",
      borderRadius: isActive ? "4px" : "50%",
      backgroundColor: isActive ? "#fff" : "rgba(255,255,255,0.5)",
      cursor: "pointer",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: isActive ? "#fff" : "rgba(255,255,255,0.8)",
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
            </div>
          </div>
        ))}
      </div>

      {/* Controles del carrusel */}
      <div style={styles.carouselControls}>
        <button
          style={hoveredElement === 'prev-btn'
            ? {...styles.carouselButton, backgroundColor: "rgba(255,255,255,0.5)", transform: "scale(1.1)"}
            : styles.carouselButton}
          onClick={prevSlide}
          onMouseEnter={() => setHoveredElement('prev-btn')}
          onMouseLeave={() => setHoveredElement(null)}
          aria-label="Anterior"
        >
          &#10094;
        </button>
        <button
          style={hoveredElement === 'next-btn'
            ? {...styles.carouselButton, backgroundColor: "rgba(255,255,255,0.5)", transform: "scale(1.1)"}
            : styles.carouselButton}
          onClick={nextSlide}
          onMouseEnter={() => setHoveredElement('next-btn')}
          onMouseLeave={() => setHoveredElement(null)}
          aria-label="Siguiente"
        >
          &#10095;
        </button>
      </div>

      {/* Indicadores de puntos */}
      <div style={styles.carouselDots}>
        {notes.map((_, index) => (
          <button
            key={index}
            style={
              hoveredElement === `dot-${index}`
                ? { ...styles.carouselDot(currentSlide === index), transform: "scale(1.1)" }
                : styles.carouselDot(currentSlide === index)
            }
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setHoveredElement(`dot-${index}`)}
            onMouseLeave={() => setHoveredElement(null)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  // Estado para la categoría activa
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Obtener el contexto del tema
  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDarkMode || false;
  const colors = themeContext?.colors || {
    primary: '#0b4444',
    secondary: '#2a9d8f',
    white: '#ffffff',
    background: '#ffffff',
    gray200: '#e5e7eb',
    textPrimary: '#333333',
    textSecondary: '#666666',
  };
  
  // Estado para manejar errores
  const [error, setError] = useState(null);
  
  // Categorías disponibles - Exactamente como en la imagen
  const categories = ['Todos', 'Noticias', 'Técnicas de Estudio', 'Problemáticas', 'Educación de Calidad', 'Herramientas', 'Desarrollo Docente'];

  // Datos para el carrusel
  const carouselNotes = [
    {
      id: 1,
      title: "Aprendizaje colaborativo: La clave del éxito académico",
      excerpt: "Estudios demuestran que el trabajo en equipo mejora la retención y comprensión de conceptos complejos.",
      image: "/assets/images/desafio.jpg",
      category: "Técnicas de Estudio"
    },
    {
      id: 2,
      title: "La gamificación como estrategia pedagógica efectiva",
      excerpt: "El uso de elementos de juego en el aula aumenta la motivación y el compromiso de los estudiantes.",
      image: "/assets/images/tecnologia.jpg",
      category: "Innovación"
    }
  ];

  // Posts de ejemplo
  const posts = [
    {
      id: 1,
      title: "Aprendizaje Basado en Proyectos: Guía Completa",
      excerpt: "El ABP es una metodología que permite a los estudiantes adquirir conocimientos y competencias clave a través de proyectos que responden a problemas de la vida real.",
      image: "/assets/images/humanos.jpg",
      category: "Técnicas de Estudio"
    },
    {
      id: 2,
      title: "Inclusión Educativa: Retos y Soluciones",
      excerpt: "Análisis de los desafíos actuales en la implementación de programas inclusivos y estrategias efectivas para superarlos.",
      image: "/assets/images/desafio.jpg",
      category: "Problemáticas"
    },
    {
      id: 3,
      title: "El Poder de la Colaboración en Entornos Educativos",
      excerpt: "Cómo fomentar la colaboración entre estudiantes y cómo esta mejora significativamente los resultados académicos y el desarrollo social.",
      image: "/assets/images/maestro.jpg",
      category: "Técnicas de Estudio"
    },
    {
      id: 4,
      title: "Tecnologías Emergentes en Educación 2024",
      excerpt: "Un análisis de las tecnologías que están transformando las aulas y cómo los educadores pueden aprovecharlas.",
      image: "/assets/images/tecnologia.jpg",
      category: "Herramientas"
    },
    {
      id: 5,
      title: "Desarrollo Profesional Continuo para Docentes",
      excerpt: "Estrategias y recursos para que los educadores mantengan sus habilidades actualizadas en un mundo en constante cambio.",
      image: "/assets/images/formacion.jpg",
      category: "Desarrollo Docente"
    },
    {
      id: 6,
      title: "Evaluación por Competencias: Más Allá de las Calificaciones",
      excerpt: "Cómo diseñar sistemas de evaluación que midan realmente el desarrollo de habilidades esenciales para el siglo XXI.",
      image: "/assets/images/evaluacion.jpg",
      category: "Educación de Calidad"
    },
  ];

  // Filtrar posts por categoría activa
  const filteredPosts = activeCategory === 'Todos'
    ? posts
    : posts.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase());

  // Estilos CSS exactos como en la imagen de referencia
  const styles = {
    app: {
      fontFamily: typography.fontFamily,
      margin: 0,
      padding: 0,
      backgroundColor: isDarkMode ? "#121212" : "#f8f9fa", // Color de fondo ajustado
      color: isDarkMode ? "#e0e0e0" : "#333333",
      overflowX: "hidden"
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `0 ${spacing.md}`
    },
    breadcrumb: {
      margin: `${spacing.md} 0`,
      color: isDarkMode ? "#e0e0e0" : "#0b4444",
      fontSize: typography.fontSize.sm,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs
    },
    breadcrumbLink: {
      color: isDarkMode ? "#8cc9c9" : "#0b4444",
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        color: isDarkMode ? "#a8dcdc" : "#166464"
      }
    },
    hero: {
      margin: `${spacing.md} 0 ${spacing.lg}`,
      position: "relative",
      background: isDarkMode ? "#1a2e2d" : "#c5d6d4", // Color exacto de la imagen de referencia
      borderRadius: "16px",
      padding: `${spacing.xl} ${spacing.xl}`,
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      overflow: "hidden",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      animation: "fadeIn 1s ease-out"
    },
    heroTitle: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.md,
      color: isDarkMode ? "#e0e0e0" : "#0b4444",
      position: "relative",
      zIndex: 2,
      animation: "slideInUp 1s ease-out",
      maxWidth: "800px",
    },
    heroText: {
      fontSize: typography.fontSize.md,
      marginBottom: spacing.lg,
      maxWidth: "700px",
      lineHeight: "1.5",
      color: isDarkMode ? "#c5c5c5" : "#445555",
      animation: "slideInUp 1.2s ease-out",
      position: "relative",
      zIndex: 2,
    },
    circleLink: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      backgroundColor: isDarkMode ? "#2a7979" : "#0b4444",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      marginTop: "20px",
      boxShadow: isDarkMode ? "0 6px 20px rgba(42, 121, 121, 0.3)" : "0 6px 20px rgba(11, 68, 68, 0.3)",
      cursor: "pointer",
      transition: transitions.default,
      '&:hover': {
        transform: "scale(1.05) rotate(5deg)",
        boxShadow: isDarkMode ? "0 8px 25px rgba(42, 121, 121, 0.4)" : "0 8px 25px rgba(11, 68, 68, 0.4)"
      }
    },
    circleText: {
      position: "absolute",
      width: "100%",
      height: "100%",
      fontSize: "10px",
      color: isDarkMode ? "rgba(220, 240, 240, 0.9)" : "rgba(240, 248, 247, 0.9)"
    },
    categories: {
      display: "flex",
      flexWrap: "wrap",
      gap: spacing.xs,
      background: isDarkMode ? "#1a2e2d" : "#fff",
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      marginBottom: spacing.md,
      justifyContent: "center",
      overflow: "auto",
    },
    category: (isActive, isHovered) => ({
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: "20px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.normal,
      fontSize: typography.fontSize.sm,
      backgroundColor: isActive 
        ? (isDarkMode ? "#2a7979" : "#0b4444")
        : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(11, 68, 68, 0.05)'),
      color: isActive 
        ? "#fff"
        : (isDarkMode ? "#e0e0e0" : "#333333"),
      border: "none",
      '&:hover': {
        backgroundColor: isActive 
          ? (isDarkMode ? "#35898a" : "#093333")
          : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(11, 68, 68, 0.08)'),
        transform: "translateY(-2px)"
      }
    }),
    contentWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.md,
      marginBottom: spacing.xl,
      animation: "fadeIn 1s ease-out",
      position: "relative",
      width: "100%",
    },
    postsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: spacing.lg,
      marginBottom: spacing.xl,
    },
    animationStyles: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
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
      
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      /* Modo oscuro específico */
      .dark-mode .hero-title {
        color: #e0e0e0 !important;
      }
      
      .dark-mode .hero-text {
        color: #c5c5c5 !important;
      }
      
      .dark-mode .post-title {
        color: #e0e0e0 !important;
      }
      
      .dark-mode .post-excerpt {
        color: #b0b0b0 !important;
      }
      
      .dark-mode footer {
        background-color: #0b4444 !important;
        color: #e0e0e0 !important;
      }
      
      .dark-mode footer a,
      .dark-mode footer h4,
      .dark-mode footer p {
        color: #c5c5c5 !important;
      }
      
      .dark-mode .category-button {
        background-color: #1a2e2d !important;
        color: #e0e0e0 !important;
      }
      
      .dark-mode .category-button.active {
        background-color: #2a7979 !important;
        color: #ffffff !important;
      }

      /* Media queries para responsividad */
      @media screen and (max-width: 768px) {
        .hero-title {
          font-size: 24px !important;
        }
        .hero-text {
          font-size: 14px !important;
        }
        .posts-grid {
          grid-template-columns: 1fr !important;
        }
        .categories {
          overflow-x: auto;
          justify-content: flex-start;
          padding: 8px !important;
        }
        .carousel {
          height: 300px !important;
        }
      }
    `,
    noOverflow: {
      overflow: "visible"
    },
    pageBackground: {
      backgroundColor: isDarkMode ? "#121212" : "#f8f9fa", // Fondo ajustado
      minHeight: "100vh",
      width: "100%"
    }
  };

  // Media queries adicionales para pantallas pequeñas
  const mediaQueryStyles = `
    @media (max-width: 768px) {
      .hero-title {
        font-size: ${typography.fontSize.xl} !important;
      }
      .hero-text {
        font-size: ${typography.fontSize.md} !important;
      }
      .categories {
        padding: ${spacing.sm} ${spacing.md} !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
      }
      .post-card {
        margin-left: auto !important;
        margin-right: auto !important;
      }
    }
  `;

  return (
    <div style={styles.app}>
      {error ? (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          backgroundColor: '#ffdddd', 
          border: '1px solid #ff0000',
          borderRadius: '4px',
          color: '#ff0000' 
        }}>
          <h2>Error al cargar la página</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Recargar página</button>
        </div>
      ) : (
        <>
          {/* Añadir estilos de animación */}
          <style dangerouslySetInnerHTML={{ __html: styles.animationStyles + mediaQueryStyles }} />

          {/* Header */}
          <Header />

          {/* Main Content */}
          <main style={{ ...styles.container, ...styles.noOverflow }}>
            {/* Breadcrumb */}
            <div style={styles.breadcrumb}>
              <a
                href="#"
                style={{ ...styles.breadcrumbLink, color: isDarkMode ? "#8cc9c9" : "#0b4444" }}
                onMouseEnter={(e) => e.target.style.color = isDarkMode ? "#a8dcdc" : "#166464"}
                onMouseLeave={(e) => e.target.style.color = isDarkMode ? "#8cc9c9" : "#0b4444"}
              >Inicio</a>
              <span style={{ color: isDarkMode ? "#8cc9c9" : "#0b4444", fontSize: '10px', margin: '0 4px' }}>►</span>
              <span style={{ color: isDarkMode ? "#a8a8a8" : "#445555" }}>Blogs y Artículos</span>
            </div>

            {/* Hero Section */}
            <div style={styles.hero}>
              <h1 className="hero-title" style={styles.heroTitle}>Tu Destino para Educación, Innovación y Crecimiento</h1>
              <p className="hero-text" style={styles.heroText}>Descubre consejos, tendencias y técnicas para mejorar tu experiencia educativa y desarrollo profesional. Únete a nuestra comunidad de aprendices y educadores comprometidos.</p>

              <div
                style={{
                  ...styles.circleLink,
                  ...(hoveredCategory === 'circle' ? { 
                    transform: "scale(1.05) rotate(5deg)",
                    boxShadow: isDarkMode ? "0 8px 25px rgba(42, 121, 121, 0.4)" : "0 8px 25px rgba(11, 68, 68, 0.4)"
                  } : {})
                }}
                onMouseEnter={() => setHoveredCategory('circle')}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div style={{
                  ...styles.circleText,
                  animation: 'spin 20s linear infinite',
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
                    alt="EducStation Logo"
                  />
                </div>
              </div>
            </div>

            {/* Carrusel de Noticias */}
            {carouselNotes && carouselNotes.length > 0 && (
              <NewsCarousel notes={carouselNotes} />
            )}

            {/* Categories - Ajustadas exactamente como en la imagen */}
            <div className="categories" style={{
              ...styles.categories, 
              display: "flex",
              overflowX: "auto", 
              justifyContent: "center",
              backgroundColor: isDarkMode ? "#1a2e2d" : "#fff",
              padding: "8px 16px", 
              margin: "16px auto 32px auto",
              borderRadius: "8px", 
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-button ${activeCategory === category ? 'active' : ''}`}
                  style={{
                    padding: "6px 16px",
                    marginRight: "8px",
                    borderRadius: "20px",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: activeCategory === category ? "600" : "400",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor: activeCategory === category 
                      ? (isDarkMode ? "#2a7979" : "#0b4444")
                      : (isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(11,68,68,0.05)"),
                    color: activeCategory === category 
                      ? "#ffffff" 
                      : (isDarkMode ? "#e0e0e0" : "#333333"),
                    transform: hoveredCategory === category ? "translateY(-2px)" : "translateY(0)",
                    whiteSpace: "nowrap"
                  }}
                  onClick={() => setActiveCategory(category)}
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Post Cards Grid - Sin título */}
            <div className="content-wrapper" style={styles.contentWrapper}>              
              <div className="posts-grid" style={{
                ...styles.postsGrid,
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "24px"
              }}>
                {filteredPosts && filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <p>No hay artículos disponibles en esta categoría.</p>
                )}
              </div>
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </>
      )}
    </div>
  );
};

export default HomePage;