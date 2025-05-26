// src/components/layout/Footer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, transitions } from '../../styles/theme';
import { FaHome, FaInfo, FaEnvelope, FaQuestionCircle, FaPenSquare, FaBook, FaChartBar, FaAward, FaUsers, FaCog, FaList, FaTags, FaGlobe, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiX } from 'react-icons/si';

// Estilo keyframes para la animación de brillo
const shineAnimation = `
  @keyframes shine {
    from {
      opacity: 0;
      left: 0%;
    }
    50% {
      opacity: 1;
    }
    to {
      opacity: 0;
      left: 100%;
    }
  }
`;

// Añadir los estilos keyframes al documento
const addKeyframeStyles = () => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = shineAnimation;
  document.head.appendChild(styleSheet);
};

const Footer = () => {
  const { isDarkMode, colors } = useTheme(); // Obtener colores actualizados del contexto
  const location = useLocation(); // Para detectar la página actual
  const [emailValue, setEmailValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const footerRef = useRef(null);
  const buttonRef = useRef(null);

  // Añadir los keyframes al montar el componente
  useEffect(() => {
    addKeyframeStyles();
  }, []);

  // Actualizar todos los estilos dependientes del tema cuando cambie isDarkMode
  useEffect(() => {
    // Aplicar directamente los estilos al elemento del footer
    if (footerRef.current) {
      // Restaurar la animación original con la imagen de onda
      footerRef.current.style.backgroundImage = "url('https://capsule-render.vercel.app/api?type=waving&color=082c2c&height=280&section=footer&animation=twinkling')";
      footerRef.current.style.backgroundSize = "100% auto";
      footerRef.current.style.backgroundPosition = "center top"; // Cambiar a top para que esté más arriba
      footerRef.current.style.backgroundRepeat = "no-repeat";
      footerRef.current.style.backgroundColor = "transparent"; // Fondo transparente
      footerRef.current.style.color = isDarkMode ? '#ccc' : colors.white;
      
      // Ajustar propiedades para evitar el rectángulo verde
      footerRef.current.style.border = "none";
      footerRef.current.style.boxShadow = "none";
      footerRef.current.style.minHeight = "280px"; // Aumentar altura mínima
      footerRef.current.style.marginTop = "60px"; // Más espacio superior
      footerRef.current.style.position = "relative";
      footerRef.current.style.overflow = "hidden";
    }
  }, [isDarkMode, colors]);

  // Crear un estilo global para el body para asegurar que no haya fondo verde
  useEffect(() => {
    // Obtener el elemento body
    const bodyElement = document.body;
    
    // Guardar el estilo original para restaurarlo cuando se desmonte
    const originalBackgroundColor = bodyElement.style.backgroundColor;
    
    // Aplicar un fondo transparente al body
    bodyElement.style.backgroundColor = "transparent";
    
    // Limpiar cuando se desmonte el componente
    return () => {
      bodyElement.style.backgroundColor = originalBackgroundColor;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailValue.trim() === '') return;

    setIsSubmitting(true);

    // Simulación de envío (reemplazar con llamada a API real)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmailValue('');

      // Reiniciar el mensaje de éxito después de 3 segundos
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  // Manejadores de eventos para el botón con referencias al tema actual
  const handleButtonMouseEnter = (e) => {
    e.target.style.background = `linear-gradient(90deg, ${colors.primaryLight} 60%, ${colors.secondary} 100%)`;
    e.target.style.boxShadow = `0 0 24px 4px ${colors.secondary}`;
    e.target.style.color = isDarkMode ? '#fff' : colors.primary;
  };

  const handleButtonMouseLeave = (e) => {
    e.target.style.background = `linear-gradient(90deg, ${colors.secondary} 60%, ${colors.primaryLight} 100%)`;
    e.target.style.boxShadow = `0 0 8px 0 ${colors.secondary}33`;
    e.target.style.color = isDarkMode ? '#fff' : colors.primary;
  };

  // Función para manejar navegación con recarga instantánea
  const handleInstantNavigation = (path, e) => {
    e.preventDefault();
    
    // Para páginas con recarga forzada instantánea
    if(path === '/' || path === '/blog' || path === '/categorias' || 
       path === '/about' || path === '/contact' || path.startsWith('/categoria/') ||
       path === '/admin/post' || path === '/terms' || path === '/privacy' || path === '/cookies') {
      // Si ya estamos en la página, recargar inmediatamente
      if(location.pathname === path || 
         (path === '/blog' && (location.pathname.startsWith('/blog') || 
          location.pathname.includes('/post/') || 
          location.pathname.includes('/category/')))) {
        window.location.reload();
      } else {
        // Si estamos en otra página, navegar directamente con recarga instantánea
        window.location.href = path;
      }
    } else {
      // Para otras páginas, navegación normal
      window.location.href = path;
    }
  };

  // --- ANIMACIONES Y EFECTOS GLOW ---
  // La animación de glow se aplicará directamente en el estilo inline si se requiere, no como keyframes en JS

  const styles = {
    // Quitamos backgroundColor y color del objeto de estilo
    // porque ahora lo aplicamos directamente al elemento con useEffect
    footer: {
      padding: 0,
      margin: 0,
      minHeight: '280px', // Aumentar altura para acomodar mejor la animación
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      zIndex: 1,
      marginTop: '60px', // Más espacio superior para la animación
    },
    container: {
      maxWidth: '1900px',
      margin: '0 auto',
      padding: `${spacing.lg} ${spacing.lg} ${spacing.xl * 4}`, // Más padding abajo
      position: 'relative',
      zIndex: 3,
      backgroundColor: 'transparent',
    },
    contentBox: {
      backgroundColor: 'rgba(8, 44, 44, 0.6)', // Más transparente
      borderRadius: '12px',
      padding: spacing.md,
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: spacing.md,
    },
    transparentBox: {
      backgroundColor: 'transparent',
      padding: spacing.md,
      marginBottom: spacing.md,
      border: 'none',
      boxShadow: 'none',
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr", // Mantener 2 columnas en desktop
      gap: spacing.xl,
      justifyContent: "center",
      alignItems: "flex-start",
      maxWidth: "2100px",
      margin: "0 auto",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      marginBottom: spacing.md,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.white,
      cursor: "pointer" // Add cursor pointer for button-like behavior
    },
    logoIcon: {
      marginRight: spacing.sm,
      width: "32px",
      height: "32px",
      backgroundColor: colors.primaryLight,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `linear-gradient(135deg, ${colors.primaryLight} 60%, ${colors.secondary} 40%)`,
      borderRadius: "8px"
    },
    description: {
      color: '#fff', // Siempre blanco
      marginBottom: spacing.xxl,
      lineHeight: "1.8",
      fontSize: typography.fontSize.md,
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)', // Sombra para mejor legibilidad
    },
    social: {
      display: "flex",
      gap: spacing.md
    },
    socialIcon: {
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: "rgba(240, 248, 247, 0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: transitions.default,
      cursor: "pointer",
      fontSize: "22px",
      color: colors.white,
      boxShadow: `0 4px 24px 0 ${colors.secondary}22`,
      filter: "brightness(1.08)",
      backdropFilter: "blur(6px)",
      border: `1.5px solid ${colors.secondary}33`,
      willChange: "box-shadow, filter, background",
    },
    title: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
      color: '#fff', // Siempre blanco
      textAlign: "left",
      width: "100%",
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Sombra para mejor legibilidad
    },
    links: {
      listStyle: "none",
      padding: 0,
      margin: "0 auto", // Centrar la lista
      lineHeight: "1.8",
      width: "fit-content", // Ajustar ancho al contenido
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start" // Alinear los elementos a la izquierda dentro del contenedor centrado
    },
    link: {
      marginBottom: spacing.xs,
      transition: 'all 0.2s ease-in',
      fontSize: typography.fontSize.sm,
      display: "flex",
      alignItems: "center",
      borderRadius: "8px",
      padding: "8px 40px 8px 32px",
      boxShadow: '0 0 0 0 transparent',
      background: 'rgba(8, 44, 44, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      willChange: "box-shadow, background, color, transform",
      border: '1px solid rgba(255, 255, 255, 0.1)',
      minWidth: '140px',
      color: '#fff',
      cursor: 'pointer',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    },
    linkIcon: {
      marginRight: '12px',
      marginLeft: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      color: '#fff',
      fontSize: '18px',
      transition: transitions.default,
      position: 'relative',
      zIndex: 2,
    },
    linkAnchor: {
      color: '#fff',
      textDecoration: "none",
      transition: transitions.default,
      fontSize: typography.fontSize.md,
      fontWeight: 600,
      letterSpacing: "0.01em",
      position: 'relative',
      zIndex: 2,
      marginLeft: '6px',
    },
    newsletter: {
      marginTop: spacing.md
    },
    form: {
      display: "flex",
      marginTop: spacing.md
    },
    input: {
      flex: 1,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: "4px 0 0 4px",
      border: "none",
      backgroundColor: "rgba(240, 248, 247, 0.04)",
      color: colors.white,
      '&::placeholder': {
        color: colors.gray200
      },
      '&:focus': {
        outline: "none",
        backgroundColor: "rgba(240, 248, 247, 0.01)"
      }
    },
    button: {
      padding: `${spacing.md} ${spacing.xl}`,
      background: `linear-gradient(90deg, ${colors.secondary} 60%, ${colors.primaryLight} 100%)`,
      color: isDarkMode ? '#fff' : colors.primary,
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
      boxShadow: `0 2px 16px 0 ${colors.secondary}33`,
      fontWeight: 700,
      letterSpacing: "0.02em",
      willChange: "box-shadow, background, color",
      fontSize: typography.fontSize.md,
      marginLeft: '8px',
    },
    buttonGlow: {
      animation: "glow 1.5s alternate infinite",
      boxShadow: `0 0 5px 2px ${colors.secondary}`,
    },
    message: {
      fontSize: typography.fontSize.sm,
      marginTop: spacing.sm,
      color: colors.secondary
    },
    bottom: {
      marginTop: spacing.xxl * 2,
      paddingTop: spacing.xl,
      borderTop: `1px solid rgba(255, 255, 255, 0.2)`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.xl
    },
    copyright: {
      color: '#fff',
      fontSize: typography.fontSize.sm,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)', // Sombra para mejor legibilidad
    },
    bottomLinks: {
      display: "flex",
      gap: spacing.md
    },
    bottomLink: {
      color: '#fff',
      fontSize: typography.fontSize.sm,
      textDecoration: "none",
      transition: 'all 0.2s ease-in',
      padding: '8px 16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      background: 'rgba(8, 44, 44, 0.2)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      fontWeight: typography.fontWeight.medium,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      marginLeft: '5px',
      '&:hover': {
        color: 'white',
        boxShadow: '0 0 15px 0 rgba(8, 44, 44, 0.3)',
        backgroundColor: 'rgba(8, 44, 44, 0.5)',
        transition: 'all 0.2s ease-out'
      }
    },
    educationalTip: {
      margin: `${spacing.lg} 0 ${spacing.lg} 0`,
      padding: `${spacing.sm} ${spacing.md}`,
      background: isDarkMode ? 'rgba(34,34,34,0.08)' : 'rgba(255,255,255,0.06)',
      color: isDarkMode ? colors.secondary : colors.primary,
      borderRadius: '12px',
      fontSize: typography.fontSize.sm,
      fontWeight: 500,
      boxShadow: `0 2px 12px 0 ${colors.secondary}11`,
      textAlign: 'center',
      letterSpacing: '0.01em',
      transition: transitions.default,
      border: `1px solid ${colors.secondary}11`,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      maxWidth: '500px',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing.lg,
      marginBottom: spacing.lg
    },
  };

  const footerLinks = [
    {
      title: 'Navegación',
      links: [
        { path: '/', label: 'Inicio', icon: <FaHome size={22} /> },
        { path: '/about', label: 'Acerca de', icon: <FaInfo size={22} /> },
        { path: '/contact', label: 'Contacto', icon: <FaEnvelope size={22} /> },
        { path: '/categorias', label: 'Categorías', icon: <FaTags size={22} /> },
        { path: '/cookies', label: 'Política de Cookies', icon: <FaQuestionCircle size={22} /> },
        { path: '/admin/post', label: 'Crear Post', admin: true, icon: <FaPenSquare size={22} /> }
      ]
    },
    {
      title: 'Categorías',
      links: [
        { path: '/categoria/1', label: 'Noticias', icon: <FaBook size={22} /> },
        { path: '/categoria/2', label: 'Técnicas de Estudio', icon: <FaChartBar size={22} /> },
        { path: '/categoria/3', label: 'Problemáticas en el Estudio', icon: <FaAward size={22} /> },
        { path: '/categoria/4', label: 'Educación de Calidad', icon: <FaUsers size={22} /> },
        { path: '/categoria/5', label: 'Herramientas Tecnológicas', icon: <FaCog size={22} /> }
      ]
    }
  ];

  // --- HANDLERS MEJORADOS PARA EFECTOS GLOW Y ANIMACIONES ---
  const handleLinkMouseEnter = (e) => {
    // Aplicar estilos de hover con el color verde temático
    e.currentTarget.style.color = 'white';
    e.currentTarget.style.boxShadow = '0 0 30px 0 rgba(8, 44, 44, 0.5)';
    e.currentTarget.style.backgroundColor = '#082c2c';
    e.currentTarget.style.transition = 'all 0.2s ease-out';
    
    // Cambiar el color del texto y los iconos a blanco
    const iconElement = e.currentTarget.querySelector('[style*="linkIcon"]');
    const textElement = e.currentTarget.querySelector('[style*="linkAnchor"]');
    
    if (iconElement) iconElement.style.color = 'white';
    if (textElement) textElement.style.color = 'white';
    
    // Crear y animar el elemento de brillo
    const shineElement = document.createElement('div');
    shineElement.style.cssText = `
      content: '';
      display: block;
      width: 0px;
      height: 86%;
      position: absolute;
      top: 7%;
      left: 0%;
      opacity: 0;
      background: white;
      box-shadow: 0 0 15px 3px white;
      transform: skewX(-20deg);
      animation: shine 0.5s 0s linear;
    `;
    
    e.currentTarget.appendChild(shineElement);
    
    // Eliminar el elemento de brillo después de la animación
    setTimeout(() => {
      if (e.currentTarget.contains(shineElement)) {
        e.currentTarget.removeChild(shineElement);
      }
    }, 500);
  };

  const handleLinkMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
    e.currentTarget.style.backgroundColor = 'rgba(8, 44, 44, 0.3)';
    e.currentTarget.style.color = '#fff';
    e.currentTarget.style.transition = 'all 0.2s ease-in';
    
    // Restaurar el color del texto y los iconos
    const iconElement = e.currentTarget.querySelector('[style*="linkIcon"]');
    const textElement = e.currentTarget.querySelector('[style*="linkAnchor"]');
    
    if (iconElement) iconElement.style.color = '#fff';
    if (textElement) textElement.style.color = '#fff';
  };

  const socialLinks = [
    {
      icon: <FaGithub />,
      url: 'https://github.com/Educcorp/EducStation',
      label: 'GitHub',
      colors: {
        primary: '#24292e',
        secondary: '#333',
        hover: '#171515',
        glow: '#24292e66'
      }
    },
    {
      icon: <SiX />,
      url: 'https://twitter.com/EducStation',
      label: 'X (Twitter)',
      colors: {
        primary: '#000000',
        secondary: '#14171A',
        hover: '#000000',
        glow: '#00000066'
      }
    },
    {
      icon: <FaLinkedin />,
      url: 'https://www.linkedin.com/in/educcorp-inc-158297356/',
      label: 'LinkedIn',
      colors: {
        primary: '#0077B5',
        secondary: '#0A66C2',
        hover: '#004182',
        glow: '#0077B566'
      }
    }
  ];

  // Reemplazar todo el responsiveStyles con esta versión súper compacta
  const responsiveStyles = `
    /* TABLETS - 768px y menos */
    @media (max-width: 768px) {
      .footer-content {
        padding: 30px 12px 80px 12px !important; /* Más padding abajo */
        gap: 24px !important;
      }
      
      .footer-grid {
        grid-template-columns: 1fr !important;
        gap: 24px !important;
        text-align: center !important;
      }
      
      .footer-column {
        width: 100% !important;
        text-align: center !important;
      }
      
      .footer-logo {
        font-size: 18px !important;
        margin-bottom: 12px !important;
        justify-content: center !important;
      }
      
      .footer-logo img {
        width: 28px !important;
        height: 28px !important;
      }
      
      .footer-description {
        font-size: 13px !important;
        line-height: 1.5 !important;
        margin-bottom: 16px !important;
        text-align: center !important;
      }
      
      .footer-social {
        justify-content: center !important;
        gap: 12px !important;
        margin-bottom: 20px !important;
      }
      
      .footer-social-icon {
        width: 36px !important;
        height: 36px !important;
        font-size: 18px !important;
      }
      
      .footer-title {
        font-size: 16px !important;
        margin-bottom: 12px !important;
        text-align: center !important;
      }
      
      .footer-links {
        flex-direction: column !important;
        gap: 8px !important;
        align-items: center !important;
        margin: 0 auto !important;
      }
      
      .footer-link {
        font-size: 13px !important;
        padding: 6px 16px !important;
        min-width: 120px !important;
        margin-bottom: 4px !important;
        text-align: center !important;
      }
      
      .footer-link-icon {
        font-size: 14px !important;
        margin-right: 8px !important;
      }
      
      .footer-categories-container {
        flex-direction: row !important; /* Mantener lado a lado en tablets */
        gap: 20px !important;
        align-items: flex-start !important;
        justify-content: center !important;
        width: 100% !important;
      }
      
      .footer-categories-container > div {
        flex: 1 !important;
        max-width: 200px !important;
      }
      
      .footer-bottom {
        flex-direction: column !important;
        gap: 12px !important;
        text-align: center !important;
        margin-top: 24px !important;
        padding-top: 16px !important;
      }
      
      .footer-copyright {
        font-size: 12px !important;
      }
      
      .footer-bottom-links {
        justify-content: center !important;
        gap: 8px !important;
        flex-wrap: wrap !important;
      }
      
      .footer-bottom-link {
        font-size: 11px !important;
        padding: 6px 12px !important;
        min-width: 80px !important;
      }
    }
    
    /* MÓVILES - 480px y menos */
    @media (max-width: 480px) {
      .footer-content {
        padding: 20px 8px 70px 8px !important;
        gap: 18px !important;
      }
      
      .footer-grid {
        gap: 18px !important;
      }
      
      .footer-logo {
        font-size: 16px !important;
        margin-bottom: 10px !important;
      }
      
      .footer-logo img {
        width: 24px !important;
        height: 24px !important;
      }
      
      .footer-description {
        font-size: 12px !important;
        line-height: 1.4 !important;
        margin-bottom: 14px !important;
      }
      
      .footer-social {
        gap: 10px !important;
        margin-bottom: 16px !important;
      }
      
      .footer-social-icon {
        width: 32px !important;
        height: 32px !important;
        font-size: 16px !important;
      }
      
      .footer-title {
        font-size: 14px !important;
        margin-bottom: 10px !important;
      }
      
      .footer-links {
        gap: 6px !important;
      }
      
      .footer-link {
        font-size: 12px !important;
        padding: 5px 12px !important;
        min-width: 100px !important;
        margin-bottom: 3px !important;
      }
      
      .footer-link-icon {
        font-size: 12px !important;
        margin-right: 6px !important;
      }
      
      .footer-categories-container {
        flex-direction: row !important; /* Mantener lado a lado en móviles */
        gap: 16px !important;
        justify-content: space-between !important;
      }
      
      .footer-categories-container > div {
        flex: 1 !important;
        max-width: 140px !important;
      }
      
      .footer-bottom {
        gap: 10px !important;
        margin-top: 18px !important;
        padding-top: 12px !important;
      }
      
      .footer-copyright {
        font-size: 11px !important;
      }
      
      .footer-bottom-links {
        gap: 6px !important;
      }
      
      .footer-bottom-link {
        font-size: 10px !important;
        padding: 4px 8px !important;
        min-width: 70px !important;
      }
    }
    
    /* MÓVILES PEQUEÑOS - 360px y menos */
    @media (max-width: 360px) {
      .footer-content {
        padding: 16px 6px 60px 6px !important;
        gap: 14px !important;
      }
      
      .footer-grid {
        gap: 14px !important;
      }
      
      .footer-logo {
        font-size: 14px !important;
        margin-bottom: 8px !important;
      }
      
      .footer-logo img {
        width: 22px !important;
        height: 22px !important;
      }
      
      .footer-description {
        font-size: 11px !important;
        line-height: 1.3 !important;
        margin-bottom: 12px !important;
      }
      
      .footer-social {
        gap: 8px !important;
        margin-bottom: 12px !important;
      }
      
      .footer-social-icon {
        width: 28px !important;
        height: 28px !important;
        font-size: 14px !important;
      }
      
      .footer-title {
        font-size: 13px !important;
        margin-bottom: 8px !important;
      }
      
      .footer-links {
        gap: 4px !important;
      }
      
      .footer-link {
        font-size: 11px !important;
        padding: 4px 10px !important;
        min-width: 90px !important;
        margin-bottom: 2px !important;
      }
      
      .footer-link-icon {
        font-size: 11px !important;
        margin-right: 5px !important;
      }
      
      .footer-categories-container {
        flex-direction: column !important; /* Cambiar a columna solo en pantallas muy pequeñas */
        gap: 12px !important;
        align-items: center !important;
      }
      
      .footer-categories-container > div {
        max-width: 200px !important;
      }
      
      .footer-bottom {
        gap: 8px !important;
        margin-top: 14px !important;
        padding-top: 10px !important;
      }
      
      .footer-copyright {
        font-size: 10px !important;
      }
      
      .footer-bottom-links {
        gap: 4px !important;
        flex-direction: column !important;
      }
      
      .footer-bottom-link {
        font-size: 9px !important;
        padding: 3px 6px !important;
        min-width: 60px !important;
      }
    }
    
    /* MÓVILES EXTRA PEQUEÑOS - 320px y menos */
    @media (max-width: 320px) {
      .footer-content {
        padding: 12px 4px 50px 4px !important;
        gap: 12px !important;
      }
      
      .footer-grid {
        gap: 12px !important;
      }
      
      .footer-logo {
        font-size: 13px !important;
        margin-bottom: 6px !important;
      }
      
      .footer-logo img {
        width: 20px !important;
        height: 20px !important;
      }
      
      .footer-description {
        font-size: 10px !important;
        line-height: 1.2 !important;
        margin-bottom: 10px !important;
      }
      
      .footer-social {
        gap: 6px !important;
        margin-bottom: 10px !important;
      }
      
      .footer-social-icon {
        width: 26px !important;
        height: 26px !important;
        font-size: 13px !important;
      }
      
      .footer-title {
        font-size: 12px !important;
        margin-bottom: 6px !important;
      }
      
      .footer-links {
        gap: 3px !important;
      }
      
      .footer-link {
        font-size: 10px !important;
        padding: 3px 8px !important;
        min-width: 80px !important;
        margin-bottom: 2px !important;
      }
      
      .footer-link-icon {
        font-size: 10px !important;
        margin-right: 4px !important;
      }
      
      .footer-categories-container {
        gap: 10px !important;
      }
      
      .footer-bottom {
        gap: 6px !important;
        margin-top: 12px !important;
        padding-top: 8px !important;
      }
      
      .footer-copyright {
        font-size: 9px !important;
      }
      
      .footer-bottom-links {
        gap: 3px !important;
      }
      
      .footer-bottom-link {
        font-size: 8px !important;
        padding: 2px 5px !important;
        min-width: 50px !important;
      }
    }
  `;

  return (
    <footer ref={footerRef} style={styles.footer}>
      <style>{responsiveStyles}</style>
      <div className="footer-content" style={styles.container}>
        <div className="footer-grid" style={styles.grid}>
          <div className="footer-column">
            {/* Columna Izquierda: Logo, descripción y redes sociales */}
            <div style={{ ...styles.transparentBox, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: spacing.sm }}>
              <div 
                className="footer-logo"
                style={styles.logo}
                onClick={(e) => handleInstantNavigation('/', e)}
              >
                <img src="/assets/images/Icon.png" alt="Logo" style={styles.logoIcon} />
                <span style={{ color: isDarkMode ? '#fff' : colors.white, marginLeft: spacing.sm, fontWeight: typography.fontWeight.bold }}>EducStation</span>
              </div>
              <p className="footer-description" style={styles.description}>
                Plataforma educativa dedicada al desarrollo profesional y personal de educadores y estudiantes. Fomentamos la innovación, colaboración y excelencia en el ámbito educativo.
              </p>
              <div className="footer-social" style={{ ...styles.social, marginTop: 0 }}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    style={{
                      ...styles.socialIcon,
                      background: `linear-gradient(135deg, ${social.colors.primary} 0%, ${social.colors.secondary} 100%)`,
                      boxShadow: `0 4px 24px 0 ${social.colors.glow}`,
                      color: social.colors.primary === '#000000' ? '#fff' : '#fff'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = `0 8px 32px 0 ${social.colors.glow}`;
                      e.currentTarget.style.background = `linear-gradient(135deg, ${social.colors.secondary} 0%, ${social.colors.hover} 100%)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 4px 24px 0 ${social.colors.glow}`;
                      e.currentTarget.style.background = `linear-gradient(135deg, ${social.colors.primary} 0%, ${social.colors.secondary} 100%)`;
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="footer-column">
            {/* Columna Derecha: Enlaces y Categorías LADO A LADO */}
            <div className="footer-categories-container" style={{ 
              ...styles.transparentBox, 
              display: 'flex', 
              flexDirection: 'row', // Forzar que estén lado a lado
              justifyContent: 'space-between', // Distribuir espacio uniformemente
              gap: spacing.xl, 
              width: '100%',
              alignItems: 'flex-start' // Alinear al inicio para mejor distribución
            }}>
              {/* Descubre Más */}
              <div style={{ flex: 1, minWidth: '160px' }}>
                <h3 className="footer-title" style={styles.title}>Descubre Más</h3>
                <ul className="footer-links" style={styles.links}>
                  <li className="footer-link" style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/', e)}>
                    <span className="footer-link-icon" style={styles.linkIcon}><FaHome size={18} /></span>
                    <span style={styles.linkAnchor}>Inicio</span>
                  </li>
                  <li className="footer-link" style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/about', e)}>
                    <span className="footer-link-icon" style={styles.linkIcon}><FaInfo size={18} /></span>
                    <span style={styles.linkAnchor}>Acerca de</span>
                  </li>
                  <li className="footer-link" style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/contact', e)}>
                    <span className="footer-link-icon" style={styles.linkIcon}><FaEnvelope size={18} /></span>
                    <span style={styles.linkAnchor}>Contacto</span>
                  </li>
                  <li className="footer-link" style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/contact', e)}>
                    <span className="footer-link-icon" style={styles.linkIcon}><FaQuestionCircle size={18} /></span>
                    <span style={styles.linkAnchor}>FAQ</span>
                  </li>
                </ul>
              </div>
              
              {/* Categorías */}
              <div style={{ flex: 1, minWidth: '160px' }}>
                <h3 className="footer-title" style={styles.title}>Categorías</h3>
                <ul className="footer-links" style={styles.links}>
                  <li className="footer-link" style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/categoria/1', e)}>
                    <span className="footer-link-icon" style={styles.linkIcon}><FaBook size={18} /></span>
                    <span style={styles.linkAnchor}>Noticias</span>
                  </li>
                  <li className="footer-link" style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/categoria/2', e)}>
                    <span className="footer-link-icon" style={styles.linkIcon}><FaChartBar size={18} /></span>
                    <span style={styles.linkAnchor}>Técnicas de Estudio</span>
                  </li>
                  <li className="footer-link" style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/categoria/6', e)}>
                    <span className="footer-link-icon" style={styles.linkIcon}><FaAward size={18} /></span>
                    <span style={styles.linkAnchor}>Desarrollo Profesional</span>
                  </li>
                  <li className="footer-link" style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/categorias', e)}>
                    <span className="footer-link-icon" style={styles.linkIcon}><FaTags size={18} /></span>
                    <span style={styles.linkAnchor}>Descubre más categorías</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="footer-bottom" style={{
          ...styles.bottom, 
          ...styles.transparentBox, 
          marginTop: spacing.xl,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: spacing.md,
          flexWrap: 'wrap'
        }}>
          <div className="footer-copyright" style={styles.copyright}>
            &copy; {new Date().getFullYear()} EducStation. Todos los derechos reservados.
          </div>
          <div className="footer-bottom-links" style={{
            display: 'flex',
            gap: '10px',
            marginTop: window.innerWidth < 768 ? spacing.md : 0
          }}>
            <span 
              className="footer-bottom-link"
              style={{
                ...styles.bottomLink,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '100px',
              }} 
              onClick={(e) => {
                handleLinkMouseEnter(e);
                handleInstantNavigation('/terms', e);
              }}
              onMouseEnter={handleLinkMouseEnter}
              onMouseLeave={handleLinkMouseLeave}
            >
              Términos
            </span>
            <span 
              className="footer-bottom-link"
              style={{
                ...styles.bottomLink,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '100px',
              }} 
              onClick={(e) => {
                handleLinkMouseEnter(e);
                handleInstantNavigation('/privacy', e);
              }}
              onMouseEnter={handleLinkMouseEnter}
              onMouseLeave={handleLinkMouseLeave}
            >
              Privacidad
            </span>
            <span 
              className="footer-bottom-link"
              style={{
                ...styles.bottomLink,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '100px',
              }} 
              onClick={(e) => {
                handleLinkMouseEnter(e);
                handleInstantNavigation('/cookies', e);
              }}
              onMouseEnter={handleLinkMouseEnter}
              onMouseLeave={handleLinkMouseLeave}
            >
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;