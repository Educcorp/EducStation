// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { colors, spacing, typography, shadows, borderRadius, transitions, applyHoverStyles } from '../../styles/theme';

const Header = ({ location }) => {
  // Estado para detectar si la página ha sido scrolleada
  const [isScrolled, setIsScrolled] = useState(false);
  // Estado para el hover
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Detectar scroll para efectos de navegación
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Verificar si la ruta está activa
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Estilos del header
  const styles = {
    header: {
      backgroundColor: isScrolled ? "rgba(240, 248, 247, 0.95)" : colors.white,
      padding: `${spacing.md} 0`,
      boxShadow: isScrolled ? shadows.md : shadows.sm,
      position: "sticky",
      top: 0,
      zIndex: 100,
      transition: transitions.default
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `0 ${spacing.md}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    logo: {
      display: "flex",
      alignItems: "center",
      color: colors.primary,
      textDecoration: "none",
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      transition: transitions.default,
      '&:hover': {
        transform: "translateY(-2px)"
      }
    },
    logoIcon: {
      marginRight: spacing.sm,
      width: "42px",
      height: "42px",
      backgroundColor: colors.primary,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: colors.white,
      borderRadius: borderRadius.md,
      boxShadow: shadows.primary,
      transition: transitions.default,
      backgroundImage: `linear-gradient(135deg, ${colors.primary} 60%, ${colors.secondary} 40%)`,
      position: "relative",
      overflow: "hidden",
      '&:hover': {
        transform: "scale(1.1) rotate(5deg)"
      },
      '&:before': {
        content: '""',
        position: "absolute",
        top: "15%",
        right: "15%",
        width: "35%",
        height: "35%",
        backgroundColor: colors.white,
        borderRadius: "50%",
        opacity: 0.5
      }
    },
    navLinks: {
      display: "flex",
      gap: spacing.xl
    },
    navLink: (isActivePath) => ({
      color: isActivePath ? colors.primary : colors.textSecondary,
      textDecoration: "none",
      fontWeight: typography.fontWeight.medium,
      position: "relative",
      padding: `${spacing.xs} 0`,
      transition: transitions.default,
      '&:hover': {
        color: colors.primary
      }
    }),
    profileIcon: {
      width: "40px",
      height: "40px",
      borderRadius: borderRadius.circle,
      backgroundColor: colors.primaryLight,
      overflow: "hidden",
      boxShadow: shadows.sm,
      border: `2px solid ${colors.white}`,
      transition: transitions.default,
      cursor: "pointer",
      '&:hover': {
        transform: "translateY(-2px)",
        boxShadow: shadows.md
      }
    },
    profileImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
  };

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'Acerca de' },
    { path: '/contact', label: 'Contacto' }
  ];

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link
          to="/" 
          style={hoveredItem === 'logo' ? applyHoverStyles(styles.logo) : styles.logo}
          onMouseEnter={() => setHoveredItem('logo')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={{
            ...styles.logoIcon, 
            transform: hoveredItem === 'logo' ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
          }}>E</div>
          EducStation
        </Link>
        
        <nav style={styles.navLinks}>
          {navItems.map((item, index) => (
            <Link
              key={index} 
              to={item.path}
              style={styles.navLink(isActive(item.path))}
              onMouseEnter={() => setHoveredItem(`nav-${index}`)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.label}
              <span 
                style={{
                  position: 'absolute',
                  width: isActive(item.path) || hoveredItem === `nav-${index}` ? '100%' : '0%',
                  height: '2px',
                  bottom: 0,
                  left: 0,
                  backgroundColor: colors.primary,
                  transition: transitions.default
                }}
              ></span>
            </Link>
          ))}
        </nav>
        
        <div 
          style={hoveredItem === 'profile' ? applyHoverStyles(styles.profileIcon) : styles.profileIcon}
          onMouseEnter={() => setHoveredItem('profile')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <img src="/api/placeholder/40/40" alt="Profile" style={styles.profileImg} />
        </div>
      </div>
    </header>
  );
};

export default withRouter(Header);