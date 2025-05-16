import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography, shadows, borderRadius } from '../styles/theme';
import { FaBook, FaChartBar, FaAward, FaUsers, FaCog, FaNewspaper, FaPenNib, FaChalkboardTeacher } from 'react-icons/fa';

const CategoriesListPage = () => {
  const { isDarkMode, colors } = useTheme();
  const [categories, setCategories] = useState([
    { id: 1, name: 'Noticias', description: 'Últimas noticias y novedades sobre educación y tecnología', icon: <FaNewspaper size={32} /> },
    { id: 2, name: 'Técnicas de Estudio', description: 'Estrategias y métodos para mejorar el aprendizaje', icon: <FaBook size={32} /> },
    { id: 3, name: 'Problemáticas en el Estudio', description: 'Dificultades y retos comunes en el aprendizaje', icon: <FaPenNib size={32} /> },
    { id: 4, name: 'Educación de Calidad', description: 'Mejores prácticas y estándares para una educación eficaz', icon: <FaAward size={32} /> },
    { id: 5, name: 'Herramientas Tecnológicas', description: 'Tecnología y recursos para mejorar la enseñanza', icon: <FaCog size={32} /> },
    { id: 6, name: 'Desarrollo Profesional Docente', description: 'Capacitación y crecimiento profesional para docentes', icon: <FaChalkboardTeacher size={32} /> },
    { id: 7, name: 'Comunidad y Colaboración', description: 'Interacción y trabajo en equipo en el ámbito educativo', icon: <FaUsers size={32} /> }
  ]);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${spacing.xl} ${spacing.md}`,
      paddingBottom: spacing.xxl
    },
    pageTitle: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      textAlign: 'center',
      marginBottom: spacing.xl,
      color: isDarkMode ? colors.white : colors.primary
    },
    subtitle: {
      fontSize: typography.fontSize.lg,
      textAlign: 'center',
      marginBottom: spacing.xxl,
      maxWidth: '800px',
      margin: '0 auto',
      color: isDarkMode ? colors.gray200 : colors.textSecondary
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: spacing.xl,
      marginTop: spacing.xl
    },
    card: {
      backgroundColor: isDarkMode ? '#333' : colors.white,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      boxShadow: shadows.md,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: shadows.lg
      }
    },
    iconContainer: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      backgroundColor: isDarkMode ? colors.primaryDark : colors.primaryLight,
      color: isDarkMode ? colors.white : colors.primary
    },
    categoryName: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.sm,
      color: isDarkMode ? colors.white : colors.primary
    },
    categoryDescription: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? colors.gray200 : colors.textSecondary,
      marginBottom: spacing.md
    },
    link: {
      textDecoration: 'none',
      display: 'block',
      width: '100%',
      height: '100%'
    },
    button: {
      backgroundColor: isDarkMode ? colors.primaryDark : colors.primary,
      color: colors.white,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.sm,
      border: 'none',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      marginTop: 'auto',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: colors.primaryDark
      }
    },
    intro: {
      backgroundColor: isDarkMode ? '#2a2a2a' : colors.primaryLight,
      padding: `${spacing.xl} 0`,
      marginBottom: spacing.xl,
      borderRadius: borderRadius.md,
      textAlign: 'center'
    }
  };

  return (
    <>
      <Header />
      <div style={styles.intro}>
        <div style={styles.container}>
          <h1 style={styles.pageTitle}>Explora Nuestras Categorías</h1>
          <p style={styles.subtitle}>
            Descubre contenido especializado organizado en categorías diseñadas para potenciar tu desarrollo educativo
            y profesional. Cada categoría ofrece recursos, artículos y herramientas adaptados a tus necesidades.
          </p>
        </div>
      </div>
      <div style={styles.container}>
        <div style={styles.grid}>
          {categories.map(category => (
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
                style={{
                  ...styles.card,
                  '&:hover': styles.card['&:hover']
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = shadows.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = shadows.md;
                }}
              >
                <div style={styles.iconContainer}>
                  {category.icon}
                </div>
                <h2 style={styles.categoryName}>{category.name}</h2>
                <p style={styles.categoryDescription}>{category.description}</p>
                <button 
                  style={styles.button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode ? colors.primaryDark : colors.primary;
                  }}
                >
                  Ver artículos
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoriesListPage; 