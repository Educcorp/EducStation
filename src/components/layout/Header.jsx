// src/components/layout/Header.jsx con correcciones
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';

const Header = () => {
  // Estado para detectar si la página ha sido scrolleada
  const [isScrolled, setIsScrolled] = useState(false);
  // Estado para el hover
  const [hoveredItem, setHoveredItem] = useState(null);
  // Estado para controlar la visibilidad del header
  const [isVisible, setIsVisible] = useState(true);
  // Estado para almacenar la posición de scroll anterior
  const [lastScrollY, setLastScrollY] = useState(0);
  // Estado para controlar la visibilidad del menú
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Usar useLocation en lugar de withRouter
  const location = useLocation();

  // Simular rol de usuario - En una implementación real, esto vendría de tu sistema de autenticación
  const userRole = 'admin'; // Opciones: 'admin', 'user', etc.

  // Detectar scroll para efectos de navegación
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    console.log('isVisible:', isVisible);
  }, [isVisible]);
  // Verificar si la ruta está activa, con lógica adicional para la sección de blog
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    // Marcar la sección de Blog como activa cuando estamos viendo un post
    if (path === '/blog') {
      return location.pathname.startsWith('/blog') || 
             location.pathname.includes('/post/') || 
             location.pathname.includes('/category/');
    }
    return location.pathname.startsWith(path);
  };

  // Estilos del header
  const styles = {
    header: {
      backgroundColor: isScrolled ? "rgba(240, 248, 247, 0.95)" : colors.white,
      padding: `${spacing.md} 0`,
      boxShadow: isScrolled ? shadows.md : shadows.sm,
      position: "fixed",
      top: isVisible ? 0 : '-100px', // Cambiar la posición top para mostrar/ocultar el header
      width: "100%",
      zIndex: 100,
      transition: transitions.default
    },
    headerSpacer: {
      // Añade un elemento espaciador para compensar la altura del header fijo
      height: "80px", // Altura aproximada del header con padding
      width: "100%"
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `0 ${spacing.md}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative"
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
    menu: {
      position: "absolute",
      top: "50px",
      right: "0",
      backgroundColor: colors.white,
      boxShadow: shadows.md,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      display: isMenuOpen ? "block" : "none",
      zIndex: 200
    },
    menuItem: {
      padding: `${spacing.sm} ${spacing.md}`,
      color: colors.textSecondary,
      textDecoration: "none",
      display: "block",
      cursor: "pointer",
      transition: transitions.default
    },
    loginButton: {
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: colors.secondary,
      color: colors.primary,
      border: "none",
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      transition: transitions.default,
      marginLeft: spacing.md,
      '&:hover': {
        backgroundColor: colors.primary,
        color: colors.white
      }
    }
  };

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/category/tecnicas-de-estudio', label: 'Blog' }, // Añadido item de navegación para Blog
    { path: '/about', label: 'Acerca de' },
    { path: '/contact', label: 'Contacto' },
    { path: '/admin/post', label: 'Crear Post', admin: true }
  ];

  return (
    <>
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
                <a
                  key={index}
                  href={item.path} // Usamos href para forzar el refresco
                  style={styles.navLink(isActive(item.path))}
                  onClick={(e) => {
                    e.preventDefault(); // Prevenir el comportamiento predeterminado
                    window.location.href = item.path; // Forzar el refresco de la página
                  }}
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
                </a>
              )
            ))}
          </nav>
          
          <button 
            style={styles.loginButton}
            onClick={() => (window.location.href = "/login")} // Redirect to login page
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.white;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.secondary;
              e.currentTarget.style.color = colors.primary;
            }}
          >
            Inicio de Sesión
          </button>
          <div 
            style={{
              ...styles.profileIcon,
              transform: hoveredItem === 'profile' ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoveredItem === 'profile' ? shadows.md : shadows.sm,
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredItem('profile')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu visibility
          >
            <img src="/assets/images/logoBN.png" alt="Profile" style={styles.profileImg} />
          </div>
          <div style={styles.menu}>
            <a href="/" style={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Inicio</a>
            <a href="/about" style={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Acerca de</a>
            <a href="/contact" style={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Contacto</a>
            <a href="/admin/post" style={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Crear Post</a>
          </div>
        </div>
      </header>
      {/* Añadimos un div espaciador para compensar la altura del header fijo */}
      <div style={styles.headerSpacer}></div>
    </>
  );
};

export default Header;


