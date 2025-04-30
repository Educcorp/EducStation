// src/components/layout/Header.jsx modificado
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';

const Header = () => {
  // Agregar useNavigate para manejar redirecciones
  const navigate = useNavigate();

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
  // Estado para controlar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado para almacenar el nombre del usuario
  const [userName, setUserName] = useState('');
  // Estado para la notificación (simplificado)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Usar useLocation en lugar de withRouter
  const location = useLocation();

  // Simular rol de usuario - En una implementación real, esto vendría de tu sistema de autenticación
  const userRole = 'admin'; // Opciones: 'admin', 'user', etc.

  // Verificar si el usuario está autenticado cuando se carga el componente
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const storedUserName = localStorage.getItem('userName') || 'Usuario';
    setIsAuthenticated(!!token);
    setUserName(storedUserName);
  }, []);

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

  // Ocultar notificación después de 3 segundos
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Función para mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    // Guardar el nombre del usuario antes de eliminarlo
    const currentUser = localStorage.getItem('userName') || 'Usuario';

    // Eliminar datos de autenticación
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');

    // Actualizar estado
    setIsAuthenticated(false);
    setUserName('');

    // Cerrar menú
    setIsMenuOpen(false);

    // Mostrar mensaje
    showNotification(`¡Hasta pronto, ${currentUser}! Has cerrado sesión correctamente.`);

    // Redireccionar a inicio (usando navigate en lugar de window.location)
    navigate('/');
  };

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
      zIndex: 200,
      minWidth: "200px"
    },
    menuItem: {
      padding: `${spacing.sm} ${spacing.md}`,
      color: colors.textSecondary,
      textDecoration: "none",
      display: "block",
      cursor: "pointer",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: colors.background,
        color: colors.primary
      }
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
    },
    logoutButton: {
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: colors.secondary, // Color diferente para distinguirlo
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
    },
    // Estilos adicionales para el perfil de usuario
    userProfileSection: {
      padding: spacing.md,
      borderBottom: `1px solid ${colors.gray200}`,
      marginBottom: spacing.sm,
      textAlign: 'center'
    },
    userAvatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      margin: '0 auto',
      marginBottom: spacing.sm,
      border: `2px solid ${colors.primary}`,
      padding: '2px',
      backgroundColor: colors.white
    },
    userName: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.primary,
      marginBottom: spacing.xs
    },
    userRole: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.sm
    },
    menuSeparator: {
      height: '1px',
      backgroundColor: colors.gray200,
      margin: `${spacing.xs} 0`,
      width: '100%'
    },
    menuHeader: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      padding: `${spacing.xs} ${spacing.md}`,
      letterSpacing: '1px'
    },
    menuItemIcon: {
      marginRight: spacing.sm,
      fontSize: typography.fontSize.sm,
      color: colors.primary
    },
    // Estilo para la notificación (simplificado y más estable)
    notification: {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      minWidth: '300px',
      maxWidth: '90%',
      backgroundColor: notification.type === 'success' ? colors.primary : (notification.type === 'error' ? colors.error : colors.primaryLight),
      color: colors.white,
      padding: `${spacing.md} ${spacing.xl}`,
      borderRadius: borderRadius.md,
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      zIndex: 9999,
      textAlign: 'center',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      display: notification.show ? 'block' : 'none'
    }
  };

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/category/tecnicas-de-estudio', label: 'Blog' }, // Añadido item de navegación para Blog
    { path: '/about', label: 'Acerca de' },
    { path: '/contact', label: 'Contacto' },
    { path: '/admin/post', label: 'Crear Post', admin: true }
  ];

  const getMenuItemStyle = (index) => ({
    ...styles.menuItem,
    backgroundColor: hoveredItem === `menu-${index}` ? colors.background : 'transparent',
    color: hoveredItem === `menu-${index}` ? colors.primary : colors.textSecondary
  });

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
                <Link
                  key={index}
                  to={item.path} // Usar Link de React Router en lugar de forzar refresco
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

          {/* Botón condicional: Inicio de Sesión o Cerrar Sesión */}
          {isAuthenticated ? (
            <button
              style={styles.logoutButton}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.color = colors.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.secondary;
                e.currentTarget.style.color = colors.primary;
              }}
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link to="/login">
              <button
                style={styles.loginButton}
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
            </Link>
          )}

          <div
            style={{
              ...styles.profileIcon,
              transform: hoveredItem === 'profile' ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoveredItem === 'profile' ? shadows.md : shadows.sm,
              marginLeft: spacing.md
            }}
            onMouseEnter={() => setHoveredItem('profile')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu visibility
          >
            <img src="/assets/images/logoBN.png" alt="Profile" style={styles.profileImg} />
          </div>

          {/* Menú desplegable con perfil del usuario */}
          <div style={styles.menu}>
            {isAuthenticated ? (
              <>
                {/* Sección de perfil del usuario */}
                <div style={styles.userProfileSection}>
                  <div style={styles.userAvatar}>
                    <img src="/assets/images/logoBN.png" alt="Avatar" style={styles.profileImg} />
                  </div>
                  <div style={styles.userName}>{userName}</div>
                  <div style={styles.userRole}>{userRole === 'admin' ? 'Administrador' : 'Usuario'}</div>
                </div>

                {/* Opciones del menú para usuario autenticado */}
                <div style={styles.menuHeader}>Cuenta</div>
                <Link
                  to="/profile"
                  style={getMenuItemStyle(0)}
                  onMouseEnter={() => setHoveredItem('menu-0')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span style={styles.menuItemIcon}>👤</span> Mi Perfil
                </Link>
                <Link
                  to="/settings"
                  style={getMenuItemStyle(1)}
                  onMouseEnter={() => setHoveredItem('menu-1')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span style={styles.menuItemIcon}>⚙️</span> Configuración
                </Link>
                {userRole === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    style={getMenuItemStyle(2)}
                    onMouseEnter={() => setHoveredItem('menu-2')}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span style={styles.menuItemIcon}>📊</span> Panel de Control
                  </Link>
                )}

                <div style={styles.menuSeparator}></div>

                <div style={styles.menuHeader}>Contenido</div>
                <Link
                  to="/admin/post"
                  style={getMenuItemStyle(3)}
                  onMouseEnter={() => setHoveredItem('menu-3')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span style={styles.menuItemIcon}>✏️</span> Crear Post
                </Link>
                <Link
                  to="/my-posts"
                  style={getMenuItemStyle(4)}
                  onMouseEnter={() => setHoveredItem('menu-4')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span style={styles.menuItemIcon}>📝</span> Mis Publicaciones
                </Link>
                <Link
                  to="/favorites"
                  style={getMenuItemStyle(5)}
                  onMouseEnter={() => setHoveredItem('menu-5')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span style={styles.menuItemIcon}>⭐</span> Favoritos
                </Link>

                <div style={styles.menuSeparator}></div>

                <a
                  href="#"
                  style={getMenuItemStyle(6)}
                  onMouseEnter={() => setHoveredItem('menu-6')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  <span style={styles.menuItemIcon}>🚪</span> Cerrar Sesión
                </a>
              </>
            ) : (
              <>
                {/* Menú para usuarios no autenticados */}
                <div style={styles.menuHeader}>Menú</div>
                <Link to="/" style={getMenuItemStyle(0)} onMouseEnter={() => setHoveredItem('menu-0')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}>🏠</span> Inicio
                </Link>
                <Link to="/about" style={getMenuItemStyle(1)} onMouseEnter={() => setHoveredItem('menu-1')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}>ℹ️</span> Acerca de
                </Link>
                <Link to="/contact" style={getMenuItemStyle(2)} onMouseEnter={() => setHoveredItem('menu-2')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}>📞</span> Contacto
                </Link>

                <div style={styles.menuSeparator}></div>

                <Link to="/login" style={getMenuItemStyle(3)} onMouseEnter={() => setHoveredItem('menu-3')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}>🔑</span> Iniciar Sesión
                </Link>
                <Link to="/register" style={getMenuItemStyle(4)} onMouseEnter={() => setHoveredItem('menu-4')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}>📝</span> Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      {/* Añadimos un div espaciador para compensar la altura del header fijo */}
      <div style={styles.headerSpacer}></div>

      {/* Notificación simplificada */}
      <div style={styles.notification}>
        {notification.message}
      </div>
    </>
  );
};

export default Header;