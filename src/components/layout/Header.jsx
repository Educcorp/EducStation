// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius, transitions, applyHoverStyles } from '../../styles/theme';

const Header = () => {
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

  // Estilos del header
  const styles = {
    header: {
      backgroundColor: isScrolled ? "rgba(255,255,255,0.95)" : colors.white,
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
      width: "32px",
      height: "32px",
      backgroundColor: colors.primary,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: colors.white,
      borderRadius: borderRadius.md,
      boxShadow: shadows.primary,
      transition: transitions.default,
      '&:hover': {
        transform: "scale(1.1) rotate(5deg)"
      }
    },
    navLinks: {
      display: "flex",
      gap: spacing.xl
    },
    navLink: (isActive) => ({
      color: isActive ? colors.primary : colors.textPrimary,
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
      backgroundColor: colors.gray100,
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

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <a 
          href="/" 
          style={hoveredItem === 'logo' ? applyHoverStyles(styles.logo) : styles.logo}
          onMouseEnter={() => setHoveredItem('logo')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={{
            ...styles.logoIcon, 
            transform: hoveredItem === 'logo' ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
          }}>E</div>
          EducStation
        </a>
        
        <nav style={styles.navLinks}>
          {['Inicio', 'Tendencias', 'Popular', 'Acerca de'].map((link, index) => (
            <a 
              key={index} 
              href={index === 0 ? "/" : `/${link.toLowerCase()}`}
              style={styles.navLink(index === 0)}
              onMouseEnter={() => setHoveredItem(`nav-${index}`)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {link}
              <span 
                style={{
                  position: 'absolute',
                  width: index === 0 || hoveredItem === `nav-${index}` ? '100%' : '0%',
                  height: '2px',
                  bottom: 0,
                  left: 0,
                  backgroundColor: colors.primary,
                  transition: transitions.default
                }}
              ></span>
            </a>
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

export default Header;