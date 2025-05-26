// src/components/layout/Header.jsx modificado
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import ThemeToggle from '../common/ThemeToggle'; // Importa el componente ThemeToggle
import { useTheme } from '../../context/ThemeContext'; // Importa el contexto del tema
import { useAuth } from '../../context/AuthContext.jsx'; // Importa el contexto de autenticación
import { FaHome, FaInfo, FaGlobe, FaPhone, FaFileAlt, FaUser, FaSignOutAlt, FaLock, FaPenSquare, FaBell, FaExclamationTriangle, FaTags, FaEnvelope, FaUserShield, FaUserCog } from 'react-icons/fa';
import { updateSuperUserStatus } from '../../services/authService'; // Importar función para actualizar estado de superusuario

const Header = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Obtén el estado del modo oscuro
  const { user, isAuth, isSuperUser, logout } = useAuth(); // Obtener datos del contexto de autenticación
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
      // Si ya estamos en la página de perfil, recargar inmediatamente
      if (location.pathname === path) {
        window.location.reload();
      } else {
        // Si estamos en otra página, navegar directamente con recarga instantánea
        window.location.href = path;
      }
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

  // Función para obtener el avatar con prefijo base64 si es necesario
  const getAvatarSrc = (avatar) => {
    if (!avatar || avatar === "" || avatar === "null" || avatar.length < 30) {
      // Si es vacío, null, o demasiado corto para ser base64, usar placeholder
      return '/assets/images/logoBN.png';
    }
    return avatar.startsWith('data:image') ? avatar : `data:image/jpeg;base64,${avatar}`;
  };

  // Estilos del header
  const styles = {
    header: {
      backgroundColor: isDarkMode ? 'rgba(25, 34, 34, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      color: isDarkMode ? '#fff' : '#000',
      padding: '16px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 1000,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: isScrolled ? (isDarkMode ? '0 4px 30px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.1)') : 'none',
      borderBottom: isScrolled ? (isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)') : 'none',
      transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      boxSizing: 'border-box',
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
      position: "relative",
      width: "100%",
      boxSizing: "border-box"
    },
    logo: {
      display: "flex",
      alignItems: "center",
      color: colors.primary,
      textDecoration: "none",
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
    },
    logoIcon: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(31, 78, 78, 0.08)',
      borderRadius: borderRadius.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.sm,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      width: "42px",
      height: "42px",
      overflow: "hidden",
      boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(31, 78, 78, 0.15)',
    },
    navLinks: {
      display: "flex",
      gap: spacing.xl
    },
    navLink: (isActivePath) => ({
      color: isDarkMode
        ? (isActivePath ? '#d8d0a9' : 'rgba(255, 255, 255, 0.85)')
        : (isActivePath ? '#1F4E4E' : 'rgba(0, 0, 0, 0.75)'),
      textDecoration: 'none',
      fontWeight: isActivePath ? typography.fontWeight.bold : typography.fontWeight.medium,
      position: 'relative',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: '8px',
      transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
      display: 'flex',
      alignItems: 'center',
      background: isActivePath
        ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(31, 78, 78, 0.08)')
        : 'transparent',
      overflow: 'hidden',
    }),
    profileIcon: {
      width: "40px",
      height: "40px",
      borderRadius: borderRadius.circle,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(31, 78, 78, 0.08)',
      overflow: "hidden",
      boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(31, 78, 78, 0.15)',
      border: isDarkMode ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid rgba(31, 78, 78, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
      backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      color: isDarkMode ? "#fff" : colors.textPrimary,
      boxShadow: isDarkMode ? '0 10px 30px rgba(0, 0, 0, 0.25)' : '0 10px 30px rgba(0, 0, 0, 0.15)',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      display: isMenuOpen ? "block" : "none",
      zIndex: 200,
      minWidth: "200px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
      animation: isMenuOpen ? 'fadeInDown 0.3s forwards' : 'none',
      transformOrigin: 'top center',
    },
    menuItem: {
      padding: `${spacing.sm} ${spacing.md}`,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : colors.textPrimary,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: '8px',
      margin: '4px 0',
    },
    logoutButton: {
      padding: `${spacing.sm} ${spacing.md}`,
      background: isDarkMode
        ? 'linear-gradient(135deg, rgba(255, 82, 82, 0.8) 0%, rgba(255, 105, 105, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(255, 82, 82, 0.9) 0%, rgba(255, 105, 105, 0.9) 100%)',
      color: colors.white,
      border: "none",
      borderRadius: "12px",
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      cursor: "pointer",
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      marginLeft: spacing.md,
      boxShadow: '0 4px 12px rgba(255, 82, 82, 0.25)',
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    userProfileSection: {
      padding: spacing.md,
      borderBottom: isDarkMode
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : `1px solid rgba(31, 78, 78, 0.1)`,
      marginBottom: spacing.sm,
      textAlign: 'center',
      background: isDarkMode
        ? 'linear-gradient(135deg, rgba(40, 60, 60, 0.4) 0%, rgba(25, 35, 35, 0.4) 100%)'
        : 'linear-gradient(135deg, rgba(240, 248, 255, 0.5) 0%, rgba(220, 237, 240, 0.5) 100%)',
      borderRadius: '8px',
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
    },
    userAvatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      margin: '0 auto',
      marginBottom: spacing.sm,
      border: isDarkMode
        ? '2px solid rgba(216, 208, 169, 0.4)'
        : `2px solid ${colors.primary}`,
      padding: '2px',
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.white,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      boxShadow: '0 4px 15px rgba(31, 78, 78, 0.25)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    userName: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      color: isDarkMode ? '#d8d0a9' : colors.primary,
      marginBottom: spacing.xs,
      textShadow: isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none',
    },
    userRole: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary,
      marginBottom: spacing.sm,
      background: isDarkMode
        ? 'rgba(216, 208, 169, 0.2)'
        : 'rgba(31, 78, 78, 0.1)',
      padding: '4px 12px',
      borderRadius: '100px',
      display: 'inline-block',
    },
    menuSeparator: {
      height: "1px",
      background: isDarkMode
        ? 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)'
        : 'linear-gradient(90deg, transparent 0%, rgba(31, 78, 78, 0.1) 50%, transparent 100%)',
      margin: `${spacing.sm} 0`,
      width: "100%",
    },
    menuHeader: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : colors.textSecondary,
      textTransform: "uppercase",
      padding: `${spacing.xs} ${spacing.md}`,
      letterSpacing: "1px",
      marginTop: spacing.xs,
    },
    menuItemIcon: {
      marginRight: spacing.sm,
      fontSize: typography.fontSize.md,
      color: isDarkMode ? '#d8d0a9' : colors.primary,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    notification: {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      minWidth: '300px',
      maxWidth: '90%',
      backgroundColor: notification.type === 'success'
        ? 'rgba(31, 78, 78, 0.9)'
        : (notification.type === 'error' ? 'rgba(255, 82, 82, 0.9)' : 'rgba(31, 78, 78, 0.8)'),
      color: colors.white,
      padding: `${spacing.md} ${spacing.xl}`,
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
      zIndex: 9999,
      textAlign: 'center',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      display: notification.show ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      animation: notification.show ? 'fadeInUp 0.3s forwards' : 'none',
    },
    notificationIcon: {
      marginRight: spacing.md,
      fontSize: '20px'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: confirmLogout ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      animation: confirmLogout ? 'fadeIn 0.3s forwards' : 'none',
    },
    modalContent: {
      backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: '16px',
      boxShadow: isDarkMode
        ? '0 15px 40px rgba(0, 0, 0, 0.4)'
        : '0 15px 40px rgba(0, 0, 0, 0.2)',
      width: '90%',
      maxWidth: '450px',
      padding: 0,
      overflow: 'hidden',
      animation: 'modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      border: isDarkMode
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(31, 78, 78, 0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    },
    modalHeader: {
      background: isDarkMode
        ? 'linear-gradient(135deg, rgba(31, 78, 78, 0.8) 0%, rgba(25, 60, 60, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(31, 78, 78, 0.9) 0%, rgba(31, 78, 78, 0.8) 100%)',
      color: colors.white,
      padding: `${spacing.md} ${spacing.xl}`,
      display: 'flex',
      alignItems: 'center',
      borderBottom: isDarkMode
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(31, 78, 78, 0.2)',
    },
    modalBody: {
      padding: `${spacing.xl} ${spacing.xl}`,
      fontSize: typography.fontSize.md,
      lineHeight: '1.6',
      color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : colors.textPrimary,
      textAlign: 'center',
    },
    confirmButton: {
      padding: `${spacing.sm} ${spacing.xl}`,
      background: 'linear-gradient(135deg, rgba(255, 82, 82, 0.9) 0%, rgba(255, 105, 105, 0.9) 100%)',
      color: colors.white,
      border: 'none',
      borderRadius: '12px',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      boxShadow: '0 4px 15px rgba(255, 82, 82, 0.3)',
    },
    cancelButton: {
      padding: `${spacing.sm} ${spacing.xl}`,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.white,
      color: isDarkMode ? colors.white : colors.primary,
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : `1px solid ${colors.primary}`,
      borderRadius: '12px',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
    },
    waveAnimation: {
      display: 'inline-block',
      animation: 'waveHand 0.5s ease-in-out 2',
      transformOrigin: '70% 70%'
    },
    backgroundParticles: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: -1,
    },
    particle: {
      position: 'absolute',
      borderRadius: '50%',
      opacity: isDarkMode ? 0.3 : 0.2,
      animation: 'float 15s infinite linear',
    },
    decorativeLine: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '2px',
      background: `linear-gradient(90deg, 
        transparent 0%, 
        ${isDarkMode ? 'rgba(216, 208, 169, 0.3)' : 'rgba(31, 78, 78, 0.3)'} 50%, 
        transparent 100%)`,
      opacity: isScrolled ? 1 : 0,
      transition: 'opacity 0.5s ease',
      zIndex: 1,
    },
  };

  const getMenuItemStyle = (index) => ({
    ...styles.menuItem,
    backgroundColor: hoveredItem === `menu-${index}`
      ? (isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(31, 78, 78, 0.08)")
      : "transparent",
    color: isDarkMode
      ? (hoveredItem === `menu-${index}` ? "#d8d0a9" : "rgba(255, 255, 255, 0.85)")
      : (hoveredItem === `menu-${index}` ? colors.primary : colors.textPrimary),
    transform: hoveredItem === `menu-${index}` ? 'translateX(5px)' : 'translateX(0)',
    boxShadow: hoveredItem === `menu-${index}`
      ? (isDarkMode ? '0 0 15px rgba(216, 208, 169, 0.1)' : '0 0 15px rgba(31, 78, 78, 0.1)')
      : 'none',
  });

  const menuItems = [
    {
      path: isAuth ? '/dashboard' : '/home',
      label: 'Inicio',
      icon: <FaHome size={20} />
    },
    {
      path: '/blog',
      label: 'Blog',
      icon: <FaGlobe size={20} />
    },
    {
      path: '/categorias',
      label: 'Categorías',
      icon: <FaTags size={20} />
    },
    {
      path: '/about',
      label: 'Acerca de',
      icon: <FaInfo size={20} />,
      hideForSuperUser: true
    },
    {
      path: '/contact',
      label: 'Contacto',
      icon: <FaEnvelope size={20} />,
      hideForSuperUser: true
    },
    {
      path: 'https://www.educstation.com/admin/panel',
      label: 'Admin',
      superuser: true,
      icon: <FaUserShield size={20} />
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

  // Render particles for background decoration
  const renderParticles = () => {
    const particles = [];
    const particleColors = isDarkMode
      ? ['rgba(216, 208, 169, 0.3)', 'rgba(31, 78, 78, 0.3)', 'rgba(145, 168, 169, 0.3)', 'rgba(255, 255, 255, 0.2)']
      : ['rgba(31, 78, 78, 0.2)', 'rgba(145, 168, 169, 0.2)', 'rgba(210, 185, 154, 0.2)', 'rgba(31, 78, 78, 0.1)'];

    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 5 + 2;
      const style = {
        ...styles.particle,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: particleColors[Math.floor(Math.random() * particleColors.length)],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 20 + 10}s`,
        animationDelay: `${Math.random() * 5}s`,
      };
      particles.push(<div key={i} style={style} />);
    }

    return particles;
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.backgroundParticles}>
          {renderParticles()}
        </div>
        <div style={styles.decorativeLine}></div>
        <div style={styles.container}>
          <Link
            to="/"
            style={styles.logo}
            onMouseEnter={() => setHoveredItem('logo')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={e => {
              e.preventDefault();
              const homePath = isAuth ? '/dashboard' : '/home';
              // Si ya estamos en home, recargar inmediatamente
              if (location.pathname === homePath) {
                window.location.reload();
              } else {
                // Si estamos en otra página, navegar directamente con recarga instantánea
                window.location.href = homePath;
              }
            }}
          >
            <div style={{
              ...styles.logoIcon,
              transform: hoveredItem === 'logo' ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
              boxShadow: hoveredItem === 'logo'
                ? (isDarkMode ? '0 0 20px rgba(216, 208, 169, 0.3)' : '0 0 20px rgba(31, 78, 78, 0.3)')
                : (isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(31, 78, 78, 0.15)'),
            }}>
              <img
                src="/assets/images/educstation-logo.png"
                alt="EducStation Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: hoveredItem === 'logo' ? 'brightness(1.1)' : 'brightness(1)',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
              />
            </div>
            <span style={{
              color: isDarkMode ? '#d8d0a9' : colors.primary,
              fontWeight: typography.fontWeight.bold,
              textShadow: hoveredItem === 'logo'
                ? (isDarkMode ? '0 0 8px rgba(216, 208, 169, 0.5)' : '0 0 8px rgba(31, 78, 78, 0.3)')
                : 'none',
              transform: hoveredItem === 'logo' ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            }}>
              EducStation
            </span>
          </Link>

          <nav style={styles.navLinks}>
            {menuItems.map((item, index) => (
              // Mostrar elemento si no requiere ser superusuario o el usuario es superusuario
              // Y ocultar si hideForSuperUser es true y el usuario es superusuario
              ((!item.superuser || isSuperUser) && !(item.hideForSuperUser && isSuperUser)) && (
                <a
                  key={index}
                  href={item.path}
                  style={styles.navLink(isActive(item.path))}
                  onMouseEnter={() => setHoveredItem(`nav-${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.preventDefault();

                    // Para páginas con recarga forzada instantánea
                    if (item.path === '/' || item.path === '/blog' || item.path === '/categorias') {
                      // Si ya estamos en la página, recargar inmediatamente
                      if (location.pathname === item.path ||
                        (item.path === '/blog' && (location.pathname.startsWith('/blog') ||
                          location.pathname.includes('/post/') ||
                          location.pathname.includes('/category/')))) {
                        window.location.reload();
                      } else {
                        // Si estamos en otra página, navegar directamente con recarga instantánea
                        window.location.href = item.path;
                      }
                    } else if (item.path === 'https://www.educstation.com/admin/panel') {
                      // Redirección especial para el botón Admin
                      window.location.href = 'https://www.educstation.com/admin/panel';
                    } else {
                      // Para otras páginas, navegación normal
                      navigate(item.path);
                    }
                  }}
                >
                  <span style={{
                    marginRight: 10,
                    display: 'inline-flex',
                    alignItems: 'center',
                    verticalAlign: 'middle',
                    color: isActive(item.path)
                      ? (isDarkMode ? '#d8d0a9' : colors.primary)
                      : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(31, 78, 78, 0.7)'),
                    transform: hoveredItem === `nav-${index}` ? 'scale(1.2) translateY(-1px)' : 'scale(1)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  }}>
                    {item.icon}
                  </span>
                  <span style={{
                    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    transform: hoveredItem === `nav-${index}` ? 'translateX(3px)' : 'translateX(0)',
                  }}>
                    {item.label}
                  </span>
                  {/* Animated background */}
                  {hoveredItem === `nav-${index}` && !isActive(item.path) && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: isDarkMode
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(31, 78, 78, 0.05)',
                        zIndex: -1,
                        transform: 'translateY(100%)',
                        animation: 'slideUp 0.4s forwards cubic-bezier(0.25, 0.8, 0.25, 1)',
                      }}
                    ></span>
                  )}
                  {hoveredItem === `nav-${index}` && !isActive(item.path) && (
                    <span
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '2px',
                        bottom: '0',
                        left: '0',
                        background: isDarkMode
                          ? 'linear-gradient(90deg, transparent 0%, rgba(216, 208, 169, 0.5) 50%, transparent 100%)'
                          : 'linear-gradient(90deg, transparent 0%, rgba(31, 78, 78, 0.5) 50%, transparent 100%)',
                        animation: 'fadeIn 0.3s forwards',
                      }}
                    ></span>
                  )}
                </a>
              )
            ))}
          </nav>

          <div
            data-profile-button
            style={{
              ...styles.profileIcon,
              transform: hoveredItem === 'profile' ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
              boxShadow: hoveredItem === 'profile'
                ? (isDarkMode ? '0 8px 25px rgba(216, 208, 169, 0.3)' : '0 8px 25px rgba(31, 78, 78, 0.3)')
                : (isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(31, 78, 78, 0.15)'),
              marginLeft: spacing.md,
              border: hoveredItem === 'profile'
                ? (isDarkMode ? '2px solid rgba(216, 208, 169, 0.4)' : '2px solid rgba(31, 78, 78, 0.4)')
                : (isDarkMode ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid rgba(31, 78, 78, 0.2)'),
            }}
            onMouseEnter={() => setHoveredItem('profile')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={toggleMenu}
            className={isMenuOpen ? 'pulse-animation' : ''}
          >
            <img src={getAvatarSrc(userAvatar)} alt="Profile" style={styles.profileImg} />
          </div>

          {/* Menú desplegable con perfil del usuario */}
          <div ref={menuRef} style={styles.menu}>
            {isAuth ? (
              <>
                {/* Sección de perfil del usuario */}
                <div style={styles.userProfileSection}>
                  <div style={styles.userAvatar}>
                    <img src={getAvatarSrc(userAvatar)} alt="Avatar" style={styles.profileImg} />
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

                <div style={styles.menuSeparator}></div>

                {/* Enlaces de Acerca de y Contacto (eliminados del menú desplegable para usuarios normales) */}
                {isSuperUser && (
                  <>
                    <Link
                      to="/about"
                      style={getMenuItemStyle(1)}
                      onMouseEnter={() => setHoveredItem('menu-1')}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        // Si ya estamos en about, recargar inmediatamente
                        if (location.pathname === '/about') {
                          window.location.reload();
                        } else {
                          // Si estamos en otra página, navegar directamente con recarga instantánea
                          window.location.href = '/about';
                        }
                      }}
                    >
                      <span style={styles.menuItemIcon}>
                        <FaInfo size={24} />
                      </span> Acerca de
                    </Link>
                    <Link
                      to="/contact"
                      style={getMenuItemStyle(2)}
                      onMouseEnter={() => setHoveredItem('menu-2')}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        // Si ya estamos en contact, recargar inmediatamente
                        if (location.pathname === '/contact') {
                          window.location.reload();
                        } else {
                          // Si estamos en otra página, navegar directamente con recarga instantánea
                          window.location.href = '/contact';
                        }
                      }}
                    >
                      <span style={styles.menuItemIcon}>
                        <FaEnvelope size={24} />
                      </span> Contacto
                    </Link>
                    <div style={styles.menuSeparator}></div>
                  </>
                )}

                <a
                  href="#"
                  style={getMenuItemStyle(isSuperUser ? 3 : 1)}
                  onMouseEnter={() => setHoveredItem(isSuperUser ? 'menu-3' : 'menu-1')}
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
                <div style={styles.menuHeader}>Explorar</div>
                <Link to="/blog" style={getMenuItemStyle(0)} onMouseEnter={() => setHoveredItem('menu-0')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}><FaGlobe size={20} /></span> Blog
                </Link>
                <Link to="/categorias" style={getMenuItemStyle(1)} onMouseEnter={() => setHoveredItem('menu-1')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}><FaTags size={20} /></span> Categorías
                </Link>

                <div style={styles.menuSeparator}></div>

                <div style={styles.menuHeader}>Información</div>
                <Link to="/about" style={getMenuItemStyle(2)} onMouseEnter={() => setHoveredItem('menu-2')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}><FaInfo size={20} /></span> Acerca de
                </Link>
                <Link to="/contact" style={getMenuItemStyle(3)} onMouseEnter={() => setHoveredItem('menu-3')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}><FaEnvelope size={20} /></span> Contacto
                </Link>

                <div style={styles.menuSeparator}></div>

                <div style={styles.menuHeader}>Cuenta</div>
                <Link to="/login" style={getMenuItemStyle(4)} onMouseEnter={() => setHoveredItem('menu-4')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
                  <span style={styles.menuItemIcon}><FaLock size={20} /></span> Iniciar Sesión
                </Link>
                <Link to="/register" style={getMenuItemStyle(5)} onMouseEnter={() => setHoveredItem('menu-5')} onMouseLeave={() => setHoveredItem(null)} onClick={() => setIsMenuOpen(false)}>
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
          <div style={{
            ...styles.modalFooter,
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '-10px',
            paddingBottom: '20px'
          }}>
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

      {/* CSS for animations */}
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
          
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
            }
            25% {
              transform: translateY(-10px) translateX(10px);
            }
            50% {
              transform: translateY(0) translateX(15px);
            }
            75% {
              transform: translateY(10px) translateX(5px);
            }
            100% {
              transform: translateY(0) translateX(0);
            }
          }
          
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(31, 78, 78, 0.5);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(31, 78, 78, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(31, 78, 78, 0);
            }
          }
          
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          .hover-glow:hover {
            box-shadow: 0 0 15px rgba(31, 78, 78, 0.6);
          }
        `
      }} />
    </>
  );
};

export default Header;