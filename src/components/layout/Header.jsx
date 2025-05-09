// src/components/layout/Header.jsx modificado
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import ThemeToggle from '../common/ThemeToggle'; // Importa el componente ThemeToggle
import { useTheme } from '../../context/ThemeContext'; // Importa el contexto del tema
import { AuthContext } from '../../context/AuthContext'; // Importa el contexto de autenticación

const Header = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Obtén el estado del modo oscuro
  const { logout } = useContext(AuthContext);
  const menuRef = useRef(null);

  // Estados existentes
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Nuevo estado para el modal de confirmación
  const [confirmLogout, setConfirmLogout] = useState(false);

  const location = useLocation();
  const userRole = 'admin';

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const storedUserName = localStorage.getItem('userName') || 'Usuario';
    setIsAuthenticated(!!token);
    setUserName(storedUserName);
  }, []);

  // Detectar scroll
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

  // Función para iniciar el proceso de cierre de sesión
  const initiateLogout = () => {
    setConfirmLogout(true);
    setIsMenuOpen(false);
  };

  // Función para confirmar el cierre de sesión
  const confirmLogoutAction = () => {
    const currentUser = localStorage.getItem('userName') || 'Usuario';

    // Eliminar datos de autenticación
    localStorage.clear(); // Limpiamos todo el localStorage
    sessionStorage.clear(); // Limpiamos también el sessionStorage por si acaso

    // Actualizar estado
    setIsAuthenticated(false);
    setUserName('');
    setConfirmLogout(false);

    // Mostrar mensaje
    showNotification(`¡Hasta pronto, ${currentUser}! Has cerrado sesión correctamente.`);

    // Redireccionar a login después de un breve delay para que se vea la notificación
    setTimeout(() => {
      window.location.href = '/login'; // Forzamos un refresh completo
    }, 1500);
  };

  // Función para cancelar el cierre de sesión
  const cancelLogout = () => {
    setConfirmLogout(false);
  };

  // Verificar si la ruta está activa
  const isActive = (path) => {
    if (path === '/login') {
      return location.pathname === '/login';
    }
    if (path === '/blog') {
      return location.pathname.startsWith('/blog') ||
        location.pathname.includes('/post/') ||
        location.pathname.includes('/category/');
    }
    return location.pathname === path;
  };

  // Estilos del header
  const styles = {
    header: {
      backgroundColor: isDarkMode ? '#333' : '#fff', // Cambia el color de fondo según el modo
      color: isDarkMode ? '#fff' : '#000', // Cambia el color del texto según el modo
      padding: '16px',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      transition: 'background-color 0.3s ease, color 0.3s ease', // Transición suave
    },
    headerSpacer: {
      height: "80px",
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
      color: isDarkMode ? (isActivePath ? '#ffd700' : '#fff') : (isActivePath ? '#333' : '#000'), // Texto blanco en modo oscuro
      textDecoration: 'none',
      fontWeight: typography.fontWeight.medium,
      position: 'relative',
      padding: `${spacing.xs} 0`,
      transition: transitions.default,
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
      backgroundColor: isDarkMode ? "#444" : colors.white, // Fondo más oscuro en modo oscuro
      color: isDarkMode ? "#fff" : colors.textPrimary, // Texto más claro en modo oscuro
      boxShadow: shadows.md,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      display: isMenuOpen ? "block" : "none",
      zIndex: 200,
      minWidth: "200px",
      transition: "background-color 0.3s ease, color 0.3s ease", // Transición suave
    },
    menuItem: {
      padding: `${spacing.sm} ${spacing.md}`,
      color: isDarkMode ? '#fff' : colors.textPrimary,
      textDecoration: 'none',
      display: 'block',
      cursor: 'pointer',
      transition: transitions.default,
      "&:hover": {
        backgroundColor: isDarkMode ? "#555" : colors.background,
        color: isDarkMode ? "#ffd700" : colors.primary,
      },
    },
    logoutButton: {
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
      height: "1px",
      backgroundColor: isDarkMode ? "#555" : colors.gray200, // Línea más oscura en modo oscuro
      margin: `${spacing.xs} 0`,
      width: "100%",
    },
    menuHeader: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: isDarkMode ? "#ccc" : colors.textSecondary, // Cambia el color del encabezado
      textTransform: "uppercase",
      padding: `${spacing.xs} ${spacing.md}`,
      letterSpacing: "1px",
    },
    menuItemIcon: {
      marginRight: spacing.sm,
      fontSize: typography.fontSize.sm,
      color: colors.primary
    },
    // Estilo para la notificación
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
      display: notification.show ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center'
    },
    notificationIcon: {
      marginRight: spacing.md,
      fontSize: '20px'
    },

    // Estilos para el modal de confirmación
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: confirmLogout ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    },
    modalContent: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.xl,
      width: '90%',
      maxWidth: '450px',
      padding: 0,
      overflow: 'hidden',
      animation: 'modalFadeIn 0.3s ease-out forwards',
      transform: 'scale(0.9)',
      opacity: 0
    },
    modalHeader: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: `${spacing.md} ${spacing.xl}`,
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${colors.primaryDark}`
    },
    modalWarningIcon: {
      fontSize: '24px',
      marginRight: spacing.md,
      color: colors.white
    },
    modalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      margin: 0
    },
    modalBody: {
      padding: `${spacing.xl} ${spacing.xl}`,
      fontSize: typography.fontSize.md,
      lineHeight: '1.6',
      color: colors.textPrimary,
      textAlign: 'center'
    },
    modalFooter: {
      padding: `${spacing.md} ${spacing.xl}`,
      borderTop: `1px solid ${colors.gray200}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: spacing.md
    },
    cancelButton: {
      padding: `${spacing.sm} ${spacing.xl}`,
      backgroundColor: colors.white,
      color: colors.primary,
      border: `1px solid ${colors.primary}`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none'
    },
    confirmButton: {
      padding: `${spacing.sm} ${spacing.xl}`,
      backgroundColor: '#ff5252', // Color de advertencia para cerrar sesión
      color: colors.white,
      border: 'none',
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none'
    },
    userName: {
      fontWeight: typography.fontWeight.bold,
      color: colors.primary
    },
    waveAnimation: {
      display: 'inline-block',
      animation: 'waveHand 0.5s ease-in-out 2',
      transformOrigin: '70% 70%'
    }
  };

  const getMenuItemStyle = (index) => ({
    ...styles.menuItem,
    backgroundColor: hoveredItem === `menu-${index}` ? (isDarkMode ? "#555" : colors.background) : "transparent", // Fondo al pasar el mouse
    color: isDarkMode ? (hoveredItem === `menu-${index}` ? "#ffd700" : "#fff") : (hoveredItem === `menu-${index}` ? colors.primary : colors.textSecondary), // Texto blanco en modo oscuro
  });

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/category/tecnicas-de-estudio', label: 'Blog' },
    { path: '/about', label: 'Acerca de' },
    { path: '/contact', label: 'Contacto' },
    { path: '/admin/post', label: 'Crear Post', admin: true }
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  // Manejador de clics fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Verificar si el clic no fue en el botón de perfil
        const profileButton = document.querySelector('[data-profile-button]');
        if (!profileButton?.contains(event.target)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                  href={item.path}
                  style={styles.navLink(isActive(item.path))}
                  onMouseEnter={() => setHoveredItem(`nav-${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
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

          {/* Solo mostrar el botón de Cerrar Sesión cuando esté autenticado */}
          {isAuthenticated && (
            <button
              style={styles.logoutButton}
              onClick={initiateLogout}
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
          )}

          <div
            data-profile-button
            style={{
              ...styles.profileIcon,
              transform: hoveredItem === 'profile' ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoveredItem === 'profile' ? shadows.md : shadows.sm,
              marginLeft: spacing.md
            }}
            onMouseEnter={() => setHoveredItem('profile')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <img src="/assets/images/logoBN.png" alt="Profile" style={styles.profileImg} />
          </div>

          {/* Menú desplegable con perfil del usuario */}
          <div ref={menuRef} style={styles.menu}>
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

                <div style={styles.menuSeparator}></div>

                {/* Botón de modo oscuro dentro del menú */}
                <div style={{ padding: '8px 12px' }}>
                  <ThemeToggle inMenu={true} />
                </div>

                <div style={styles.menuSeparator}></div>

                <a
                  href="#"
                  style={getMenuItemStyle(6)}
                  onMouseEnter={() => setHoveredItem('menu-')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    initiateLogout();
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

                <div style={styles.menuSeparator}></div>

                {/* Botón de modo oscuro */}
                <div
                  style={{
                    ...getMenuItemStyle(5), // Aplica el mismo estilo que los demás elementos del menú
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredItem('menu-5')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <ThemeToggle inMenu={true} />
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      {/* Añadimos un div espaciador para compensar la altura del header fijo */}
      <div style={styles.headerSpacer}></div>

      {/* Notificación de éxito al cerrar sesión */}
      <div style={styles.notification}>
        {notification.type === 'success' && (
          <span style={styles.notificationIcon}>
            <span style={styles.waveAnimation}>👋</span>
          </span>
        )}
        {notification.type === 'error' && (
          <span style={styles.notificationIcon}>❌</span>
        )}
        {notification.message}
      </div>

      {/* Modal de confirmación para cerrar sesión */}
      <div style={styles.modalOverlay} onClick={cancelLogout}>
        <div
          style={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.modalHeader}>
            <span style={styles.modalWarningIcon}>⚠️</span>
            <h3 style={styles.modalTitle}>Confirmar cierre de sesión</h3>
          </div>
          <div style={styles.modalBody}>
            <p>¿Estás seguro de que deseas cerrar tu sesión en <strong>EducStation</strong>?</p>
            <p>Tendrás que volver a iniciar sesión para acceder a tu perfil y contenido personalizado.</p>
          </div>
          <div style={styles.modalFooter}>
            <button
              style={styles.cancelButton}
              onClick={cancelLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.white;
              }}
            >
              Cancelar
            </button>
            <button
              style={styles.confirmButton}
              onClick={confirmLogoutAction}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ff3030';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ff5252';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Sí, cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* CSS para animaciones */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes modalFadeIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes waveHand {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(15deg); }
            100% { transform: rotate(0deg); }
          }
        `
      }} />
    </>
  );
};

export default Header;