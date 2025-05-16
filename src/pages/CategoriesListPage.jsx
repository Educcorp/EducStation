import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography, shadows, borderRadius } from '../styles/theme';
import { FaBook, FaChartBar, FaAward, FaUsers, FaCog, FaNewspaper, FaPenNib, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa';

const CategoriesListPage = () => {
  const { isDarkMode, colors } = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Noticias', description: 'Últimas noticias y novedades sobre educación y tecnología', icon: <FaNewspaper size={38} />, color: '#5e8b7e' },
    { id: 2, name: 'Técnicas de Estudio', description: 'Estrategias y métodos para mejorar el aprendizaje', icon: <FaBook size={38} />, color: '#a7c4bc' },
    { id: 3, name: 'Problemáticas en el Estudio', description: 'Dificultades y retos comunes en el aprendizaje', icon: <FaPenNib size={38} />, color: '#2c6975' },
    { id: 4, name: 'Educación de Calidad', description: 'Mejores prácticas y estándares para una educación eficaz', icon: <FaAward size={38} />, color: '#68b0ab' },
    { id: 5, name: 'Herramientas Tecnológicas', description: 'Tecnología y recursos para mejorar la enseñanza', icon: <FaCog size={38} />, color: '#52796f' },
    { id: 6, name: 'Desarrollo Profesional Docente', description: 'Capacitación y crecimiento profesional para docentes', icon: <FaChalkboardTeacher size={38} />, color: '#84a98c' },
    { id: 7, name: 'Comunidad y Colaboración', description: 'Interacción y trabajo en equipo en el ámbito educativo', icon: <FaUsers size={38} />, color: '#354f52' }
  ]);

  // Animación de entrada para las tarjetas
  useEffect(() => {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 * index);
    });
  }, []);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${spacing.xl} ${spacing.md}`,
      paddingBottom: spacing.xxl
    },
    pageTitle: {
      fontSize: '3rem',
      fontWeight: typography.fontWeight.bold,
      textAlign: 'center',
      marginBottom: spacing.md,
      color: isDarkMode ? colors.white : colors.primary,
      position: 'relative',
      display: 'inline-block'
    },
    titleUnderline: {
      position: 'absolute',
      bottom: '-10px',
      left: '10%',
      width: '80%',
      height: '4px',
      background: `linear-gradient(90deg, transparent, ${colors.secondary}, transparent)`,
      borderRadius: '2px'
    },
    titleContainer: {
      textAlign: 'center',
      marginBottom: spacing.xxl
    },
    subtitle: {
      fontSize: typography.fontSize.lg,
      textAlign: 'center',
      marginTop: spacing.md,
      maxWidth: '800px',
      margin: '20px auto 0',
      color: isDarkMode ? colors.gray200 : colors.textSecondary,
      lineHeight: '1.6'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
      gap: spacing.xl,
      marginTop: spacing.xxl
    },
    card: {
      backgroundColor: isDarkMode ? '#2a2a2a' : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer',
      border: '1px solid rgba(0,0,0,0.05)',
      opacity: 0,
      transform: 'translateY(30px)'
    },
    iconContainer: (color) => ({
      width: '100px',
      height: '100px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)',
      color: color,
      transition: 'all 0.3s ease',
      transform: 'rotate(0deg)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
    }),
    categoryName: {
      fontSize: '1.5rem',
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
      color: isDarkMode ? colors.white : colors.primary,
      position: 'relative',
      display: 'inline-block'
    },
    nameDecoration: (isHovered, color) => ({
      position: 'absolute',
      bottom: '-6px',
      left: isHovered ? '0%' : '50%',
      width: isHovered ? '100%' : '0%',
      height: '3px',
      backgroundColor: color,
      transition: 'all 0.3s ease',
      borderRadius: '3px'
    }),
    categoryDescription: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.gray200 : colors.textSecondary,
      marginBottom: spacing.lg,
      lineHeight: '1.6'
    },
    link: {
      textDecoration: 'none',
      display: 'block',
      width: '100%',
      height: '100%'
    },
    button: (isHovered, color) => ({
      backgroundColor: isHovered ? color : (isDarkMode ? colors.primaryDark : colors.primary),
      color: colors.white,
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
      boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.15)' : 'none'
    }),
    header: {
      backgroundColor: isDarkMode ? '#0b2b26' : '#0b4444',
      padding: `${spacing.xxl} 0`,
      marginBottom: spacing.xxl,
      position: 'relative',
      overflow: 'hidden'
    },
    headerContent: {
      position: 'relative',
      zIndex: 2
    },
    headerBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url(/assets/images/pattern-bg.png)',
      backgroundSize: 'cover',
      opacity: 0.1,
      zIndex: 1
    },
    headerDecoration: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '40px',
      backgroundImage: `linear-gradient(135deg, ${colors.primaryLight} 25%, transparent 25%), 
                        linear-gradient(225deg, ${colors.primaryLight} 25%, transparent 25%), 
                        linear-gradient(45deg, ${colors.primaryLight} 25%, transparent 25%), 
                        linear-gradient(315deg, ${colors.primaryLight} 25%, transparent 25%)`,
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 20px 0, 0 20px, 20px 20px',
      opacity: 0.3
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
      transform: 'translateY(20px)',
      pointerEvents: 'none'
    },
    categoryBadge: (color) => ({
      position: 'absolute',
      top: '16px',
      right: '16px',
      backgroundColor: color,
      color: '#fff',
      padding: '5px 10px',
      borderRadius: '30px',
      fontSize: '12px',
      fontWeight: 'bold',
      opacity: 0.85
    }),
    featuredSection: {
      marginBottom: spacing.xxl,
      textAlign: 'center'
    },
    featuredTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      marginBottom: spacing.md,
      position: 'relative',
      display: 'inline-block'
    },
    featuredCards: {
      display: 'flex',
      justifyContent: 'center',
      gap: spacing.lg,
      flexWrap: 'wrap',
      marginTop: spacing.xl
    },
    featuredCard: {
      width: '280px',
      textAlign: 'center',
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      backgroundColor: isDarkMode ? '#2a2a2a' : 'rgba(0,0,0,0.02)',
      transition: 'all 0.3s ease'
    },
    featuredIcon: {
      fontSize: '2.5rem',
      color: colors.secondary,
      marginBottom: spacing.sm
    },
    featuredText: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? colors.gray200 : colors.textSecondary
    }
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
        backToTopButton.style.transform = 'translateY(20px)';
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
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.featuredSection}>
          <h2 style={styles.featuredTitle}>
            Lo que encontrarás
            <div style={styles.titleUnderline}></div>
          </h2>
          <div style={styles.featuredCards}>
            <div style={styles.featuredCard}>
              <div style={styles.featuredIcon}>📚</div>
              <h3>Artículos de Calidad</h3>
              <p style={styles.featuredText}>Contenido redactado por expertos en educación y tecnología.</p>
            </div>
            <div style={styles.featuredCard}>
              <div style={styles.featuredIcon}>🔍</div>
              <h3>Recursos Filtrados</h3>
              <p style={styles.featuredText}>Navega por categorías para encontrar justo lo que necesitas.</p>
            </div>
            <div style={styles.featuredCard}>
              <div style={styles.featuredIcon}>💡</div>
              <h3>Ideas Innovadoras</h3>
              <p style={styles.featuredText}>Descubre nuevas tendencias en educación y tecnología.</p>
            </div>
          </div>
        </div>

        <div style={styles.grid}>
          {categories.map((category, index) => (
            <Link 
              key={category.id} 
              to={`/categoria/${category.id}`} 
              style={styles.link}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/categoria/${category.id}`;
              }}
            >
              <div 
                className="category-card"
                style={{
                  ...styles.card,
                  transform: hoveredCard === category.id ? 'translateY(-10px)' : 'translateY(30px)',
                  boxShadow: hoveredCard === category.id ? '0 20px 40px rgba(0, 0, 0, 0.15)' : '0 10px 30px rgba(0, 0, 0, 0.08)'
                }}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.categoryBadge(category.color)}>
                  Categoría {category.id}
                </div>
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
                <button style={styles.button(hoveredCard === category.id, category.color)}>
                  Ver artículos
                  <FaArrowRight size={14} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div 
        className="back-to-top" 
        style={styles.backToTop}
        onClick={scrollToTop}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
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
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          .icon-container-1:hover, .icon-container-2:hover, .icon-container-3:hover, .icon-container-4:hover, .icon-container-5:hover, .icon-container-6:hover, .icon-container-7:hover {
            animation: float 2s ease-in-out infinite;
            transform: rotate(5deg) scale(1.1);
          }
          
          .category-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
        `}
      </style>
    </>
  );
};

export default CategoriesListPage; 