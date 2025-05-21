// src/components/layout/Header.jsx modificado
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import ThemeToggle from '../common/ThemeToggle'; // Importa el componente ThemeToggle
import { useTheme } from '../../context/ThemeContext'; // Importa el contexto del tema
import { AuthContext } from '../../context/AuthContext'; // Importa el contexto de autenticación
import { FaHome, FaInfo, FaPhone, FaFileAlt, FaUser, FaCog, FaSignOutAlt, FaLock, FaPenSquare, FaBell, FaExclamationTriangle, FaTags, FaEnvelope } from 'react-icons/fa';
import { updateSuperUserStatus } from '../../services/authService'; // Importar función para actualizar estado de superusuario

const Header = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Obtén el estado del modo oscuro
  const { user, isAuth, isSuperUser, logout } = useContext(AuthContext); // Obtener datos del contexto de autenticación
  const menuRef = useRef(null);

  // Estados existentes
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('/assets/images/logoBN.png'); // Estado para la imagen de avatar
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Nuevo estado para el modal de confirmación
  const [confirmLogout, setConfirmLogout] = useState(false);

  const location = useLocation();

  // Verificar autenticación y permisos del usuario
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName') || 'Usuario';
    setUserName(storedUserName);

    // Depuración: Verificar si el estado de superusuario se está leyendo correctamente
    console.log('Estado de autenticación en Header:', {
      isAuth,
      userName: storedUserName,
      isSuperUser,
      contextUser: user,
      localStorageSuperUser: localStorage.getItem('isSuperUser')
    });

    // Actualizar el estado de superusuario desde el servidor al cargar
    if (isAuth) {
      // Obtener los datos del perfil del usuario, incluyendo el avatar
      fetch(`${process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app'}/api/auth/user/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Error al obtener perfil');
        })
        .then(userData => {
          console.log('Datos de perfil recibidos:', userData);
          if (userData.avatar) {
            setUserAvatar(userData.avatar);
          }
        })
        .catch(error => {
          console.error('Error al obtener perfil de usuario:', error);
        });

      updateSuperUserStatus()
        .then(serverIsSuperUser => {
          console.log('Estado de superusuario actualizado al cargar:', {
            contextSuperUser: isSuperUser,
            serverSuperUser: serverIsSuperUser
          });

          // Si hay discrepancia, mostrar una notificación
          if (isSuperUser !== serverIsSuperUser) {
            console.log('Corrigiendo discrepancia en estado de superusuario');
            showNotification(
              serverIsSuperUser
                ? '¡Bienvenido Administrador! Tus privilegios han sido activados.'
                : 'Tu sesión ha sido actualizada con tus permisos correctos.',
              'info'
            );
          }
        })
        .catch(error => {
          console.error('Error al actualizar estado de superusuario:', error);
        });
    }
  }, [isAuth, isSuperUser, user]);

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

  // Toggle del menú con verificación de estado de superusuario
  const toggleMenu = () => {
    const newIsMenuOpen = !isMenuOpen;
    setIsMenuOpen(newIsMenuOpen);

    // Añadir logs para depuración
    console.log('Estado de autenticación al abrir menú:', {
      isAuth,
      user,
      userName,
      isSuperUser,
      token: localStorage.getItem('userToken') || 'No hay token',
      accessToken: localStorage.getItem('accessToken') || 'No hay accessToken'
    });

    // Al abrir el menú, verificar el estado de superusuario
    if (newIsMenuOpen && isAuth) {
      updateSuperUserStatus()
        .then(serverIsSuperUser => {
          // El estado ahora se actualiza a través del contexto
          if (serverIsSuperUser !== isSuperUser) {
            console.log('Discrepancia detectada en estado de superusuario:', {
              contextSuperUser: isSuperUser,
              serverSuperUser: serverIsSuperUser
            });
            // El contexto se actualizará automáticamente
          }
        })
        .catch(error => {
          console.error('Error al actualizar estado de superusuario:', error);
        });
    }
  };

  // Modificar el manejo del botón de perfil para evitar redirecciones incorrectas
  const handleProfileNavigation = (path, e = null) => {
    if (e) e.preventDefault();

    console.log('Navegando a perfil. Estado de autenticación:', {
      isAuth,
      token: !!localStorage.getItem('userToken')
    });

    // Solo si está autenticado, ir a la página de perfil
    if (isAuth && localStorage.getItem('userToken')) {
      navigate(path);
    } else {
      console.warn('Usuario no autenticado, redirigiendo a login');
      navigate('/login');
    }
  };

  // Función para confirmar el cierre de sesión
  const confirmLogoutAction = () => {
    const currentUser = localStorage.getItem('userName') || 'Usuario';
    const wasSuperUser = localStorage.getItem('isSuperUser') === 'true';

    console.log('Cerrando sesión, estado actual:', {
      userName: currentUser,
      isSuperUser: wasSuperUser,
      localStorage: {
        userToken: !!localStorage.getItem('userToken'),
        userName: localStorage.getItem('userName'),
        isSuperUser: localStorage.getItem('isSuperUser')
      }
    });

    // Eliminar datos de autenticación usando el contexto
    logout();

    // Los estados se actualizarán a través del contexto
    setConfirmLogout(false);

    console.log('Después de limpiar localStorage:', {
      userToken: localStorage.getItem('userToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      userName: localStorage.getItem('userName'),
      isSuperUser: localStorage.getItem('isSuperUser')
    });

    // Mostrar mensaje
    showNotification(`¡Hasta pronto, ${currentUser}! Has cerrado sesión correctamente.`);

    // Usar navigate en lugar de window.location.href para evitar el refresh completo
    setTimeout(() => {
      navigate('/login');
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
      color: isDarkMode ? (isActivePath ? '#d8d0a9' : '#fff') : (isActivePath ? '#333' : '#000'), // Texto blanco en modo oscuro
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
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    profileImg: {
      width: "85%",
      height: "85%",
      objectFit: "contain",
      borderRadius: borderRadius.circle
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
        color: isDarkMode ? "#d8d0a9" : colors.primary, // Cambiado de #ffd700 a #d8d0a9
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
      backgroundColor: colors.white,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden"
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
    color: isDarkMode ? (hoveredItem === `menu-${index}` ? "#79bd9e" : "#fff") : (hoveredItem === `menu-${index}` ? colors.primary : colors.textSecondary), // Cambiado de #ffd700 a #d8d0a9
  });

  const menuItems = [
    {
      path: '/',
      label: 'Inicio',
      icon: <FaHome size={20} />
    },
    {
      path: '/blog',
      label: 'Blog',
      icon: <FaFileAlt size={20} />
    },
    {
      path: '/categorias',
      label: 'Categorías',
      icon: <FaTags size={20} />
    },
    {
      path: '/admin/post',
      label: 'Crear Post',
      superuser: true, // Cambiado de admin a superuser para una validación más específica
      icon: <FaPenSquare size={20} />
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
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
            onClick={e => {
              e.preventDefault();
              navigate('/');
            }}
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
              color: isDarkMode ? '#76a594' : colors.primary, // Color menta más opaco para modo oscuro
              fontWeight: typography.fontWeight.bold
            }}>
              EducStation
            </span>
          </Link>

          <nav style={styles.navLinks}>
            {menuItems.map((item, index) => (
              (!item.superuser || isSuperUser) && (
                <a
                  key={index}
                  href={item.path}
                  style={styles.navLink(isActive(item.path))}
                  onMouseEnter={() => setHoveredItem(`nav-${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                >
                  <span style={{ marginRight: 10, display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>{item.icon}</span>
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
          {isAuth && (
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
              <FaSignOutAlt size={16} style={{ marginRight: 8 }} />
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
            onClick={toggleMenu}
          >
            <img src={userAvatar} alt="Profile" style={styles.profileImg} />
          </div>

          {/* Menú desplegable con perfil del usuario */}
          <div ref={menuRef} style={styles.menu}>
            {isAuth ? (
              <>
                {/* Sección de perfil del usuario */}
                <div style={styles.userProfileSection}>
                  <div style={styles.userAvatar}>
                    <img src={userAvatar} alt="Avatar" style={styles.profileImg} />
                  </div>
                  <div style={styles.userName}>{userName}</div>
                  <div style={styles.userRole}>{isSuperUser ? 'Administrador' : 'Usuario'}</div>
                </div>

                {/* Opciones del menú para usuario autenticado */}
                <div style={styles.menuHeader}>Cuenta</div>
                <Link
                  to="/profile"
                  style={getMenuItemStyle(0)}
                  onMouseEnter={() => setHoveredItem('menu-0')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    handleProfileNavigation('/profile');
                  }}
                >
                  <span style={styles.menuItemIcon}>
                    <FaUser size={24} />
                  </span> Mi Perfil
                </Link>
                <a
                  href="/settings"
                  style={getMenuItemStyle(1)}
                  onMouseEnter={() => setHoveredItem('menu-1')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    navigate('/settings');
                  }}
                >
                  <span style={styles.menuItemIcon}>
                    <FaCog size={24} />
                  </span> Configuración
                </a>

                <div style={styles.menuSeparator}></div>

                {/* Enlaces de Acerca de y Contacto (movidos desde el footer) */}
                <Link
                  to="/about"
                  style={getMenuItemStyle(2)}
                  onMouseEnter={() => setHoveredItem('menu-2')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    navigate('/about');
                  }}
                >
                  <span style={styles.menuItemIcon}>
                    <FaInfo size={24} />
                  </span> Acerca de
                </Link>
                <Link
                  to="/contact"
                  style={getMenuItemStyle(3)}
                  onMouseEnter={() => setHoveredItem('menu-3')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    window.location.href = '/contact';
                  }}
                >
                  <span style={styles.menuItemIcon}>
                    <FaEnvelope size={24} />
                  </span> Contacto
                </Link>

                <div style={styles.menuSeparator}></div>

                <a
                  href="#"
                  style={getMenuItemStyle(4)}
                  onMouseEnter={() => setHoveredItem('menu-4')}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    initiateLogout();
                  }}
                >
                  <span style={styles.menuItemIcon}>
                    <FaSignOutAlt size={24} />
                  </span> Cerrar Sesión
                </a>
              </>
            ) : (
              <>
                {/* Menú para usuarios no autenticados */}
                <div style={styles.menuHeader}>Menú</div>
                <Link to="/" style={getMenuItemStyle(0)} onMouseEnter={() => setHoveredItem('menu-0')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}><FaHome size={20} /></span> Inicio
                </Link>
                <Link to="/about" style={getMenuItemStyle(1)} onMouseEnter={() => setHoveredItem('menu-1')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}><FaInfo size={20} /></span> Acerca de
                </Link>
                <Link to="/contact" style={getMenuItemStyle(2)} onMouseEnter={() => setHoveredItem('menu-2')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}><FaEnvelope size={20} /></span> Contacto
                </Link>

                <div style={styles.menuSeparator}></div>

                <Link to="/login" style={getMenuItemStyle(3)} onMouseEnter={() => setHoveredItem('menu-3')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}><FaLock size={20} /></span> Iniciar Sesión
                </Link>
                <Link to="/register" style={getMenuItemStyle(4)} onMouseEnter={() => setHoveredItem('menu-4')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}><FaPenSquare size={20} /></span> Registrarse
                </Link>

                <div style={styles.menuSeparator}></div>

                {/* Botón de modo oscuro dentro del menú
                <div style={{ padding: '8px 12px' }}>
                  <ThemeToggle inMenu={true} />
                </div> */}

                {/* <div style={styles.menuSeparator}></div> */}

                {/* Enlaces de Acerca de y Contacto (movidos desde el footer) */}
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
            <span style={styles.modalWarningIcon}><FaExclamationTriangle size={24} /></span>
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