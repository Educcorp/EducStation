// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';

const Header = () => {
  // Estado para detectar si la página ha sido scrolleada
  const [isScrolled, setIsScrolled] = useState(false);
  // Estado para el hover
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Usar useLocation en lugar de withRouter (que está obsoleto en React Router v6)
  const location = useLocation();
  
  // Simular rol de usuario - En una implementación real, esto vendría de tu sistema de autenticación
  const userRole = 'admin'; // Opciones: 'admin', 'user', etc.
  
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
      transition: transitions.default
    },
    logoIcon: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.sm,
      transition: transitions.default,
      width: "42px",
      height: "42px",
      overflow: "hidden"
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
      transition: transitions.default
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
      cursor: "pointer"
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
    { path: '/contact', label: 'Contacto' },
    { path: '/admin/post', label: 'Crear Post', admin: true }
  ];

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link
          to="/" 
          style={styles.logo}
          onMouseEnter={() => setHoveredItem('logo')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={{
            ...styles.logoIcon,
            transform: hoveredItem === 'logo' ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
          }}>
            <img 
              src="/assets/images/educstation-logo.png" 
              alt="EducStation Logo" 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }} 
            />
          </div>
          <span style={{
            color: colors.primary,
            fontWeight: typography.fontWeight.bold
          }}>
            EducStation
          </span>
        </Link>

        <nav style={styles.navLinks}>
          {navItems.map((item, index) => (
            // Solo mostrar enlaces de admin a usuarios con rol admin
            (!item.admin || userRole === 'admin') && (
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
            )
          ))}
        </nav>
        
        <div 
          style={{
            ...styles.profileIcon,
            transform: hoveredItem === 'profile' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: hoveredItem === 'profile' ? shadows.md : shadows.sm
          }}
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