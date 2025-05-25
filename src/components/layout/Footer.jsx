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
      // Aplicar un fondo sólido base antes de la imagen de onda
      footerRef.current.style.backgroundColor = "#082c2c"; // Color base sólido
      
      // Aplicar la imagen de onda encima del fondo sólido
      footerRef.current.style.backgroundImage = "url('https://capsule-render.vercel.app/api?type=waving&color=082c2c&height=240&section=footer&animation=twinkling')";
      footerRef.current.style.backgroundSize = "100% auto";
      footerRef.current.style.backgroundPosition = "center bottom";
      footerRef.current.style.backgroundRepeat = "no-repeat";
      footerRef.current.style.color = isDarkMode ? '#ccc' : colors.white;
      
      // Ajustar propiedades para evitar interferencias del fondo padre
      footerRef.current.style.border = "none";
      footerRef.current.style.boxShadow = "none";
      footerRef.current.style.minHeight = "240px"; // Asegurar altura suficiente para la onda
      footerRef.current.style.marginTop = "40px"; // Espaciado superior
      footerRef.current.style.position = "relative";
      footerRef.current.style.overflow = "hidden";
      
      // Asegurar que el footer tenga su propio contexto de apilamiento
      footerRef.current.style.zIndex = "10";
      footerRef.current.style.isolation = "isolate"; // Crear un nuevo contexto de apilamiento
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
    // Footer con fondo sólido para evitar interferencias
    footer: {
      padding: 0,
      margin: 0,
      minHeight: '240px', // Altura para acomodar la onda completa
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      zIndex: 10,
      backgroundColor: '#082c2c', // Fondo sólido base
      isolation: 'isolate' // Crear contexto de apilamiento independiente
    },
    container: {
      maxWidth: '1900px',
      margin: '0 auto',
      padding: `${spacing.md} ${spacing.lg} ${spacing.xl * 3}`, // Más padding abajo para la onda
      position: 'relative',
      zIndex: 3, // Asegurar que el contenido está por encima del fondo
      backgroundColor: 'transparent', // Contenedor transparente
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
      gridTemplateColumns: "1fr 1fr",
      gap: spacing.lg,
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

  return (
    <footer ref={footerRef} style={styles.footer}>
      <div style={styles.container}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: spacing.xl,
          alignItems: 'flex-start',
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Columna Izquierda: Logo, descripción y redes sociales */}
          <div style={{ ...styles.transparentBox, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: spacing.sm }}>
            <div 
              style={styles.logo}
              onClick={(e) => handleInstantNavigation('/', e)}
            >
              <img src="/assets/images/Icon.png" alt="Logo" style={styles.logoIcon} />
              <span style={{ color: isDarkMode ? '#fff' : colors.white, marginLeft: spacing.sm, fontWeight: typography.fontWeight.bold }}>EducStation</span>
            </div>
            <p style={styles.description}>
              Plataforma educativa dedicada al desarrollo profesional y personal de educadores y estudiantes. Fomentamos la innovación, colaboración y excelencia en el ámbito educativo.
            </p>
            <div style={{ ...styles.social, marginTop: 0 }}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
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

          {/* Columna Derecha: Enlaces y Categorías */}
          <div style={{ ...styles.transparentBox, display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, width: '100%' }}>
            {/* Descubre Más */}
            <div>
              <h3 style={styles.title}>Descubre Más</h3>
              <ul style={styles.links}>
                <li style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/', e)}>
                  <span style={styles.linkIcon}><FaHome size={18} /></span>
                  <span style={styles.linkAnchor}>Inicio</span>
                </li>
                <li style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/about', e)}>
                  <span style={styles.linkIcon}><FaInfo size={18} /></span>
                  <span style={styles.linkAnchor}>Acerca de</span>
                </li>
                <li style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/contact', e)}>
                  <span style={styles.linkIcon}><FaEnvelope size={18} /></span>
                  <span style={styles.linkAnchor}>Contacto</span>
                </li>
                <li style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/contact', e)}>
                  <span style={styles.linkIcon}><FaQuestionCircle size={18} /></span>
                  <span style={styles.linkAnchor}>FAQ</span>
                </li>
              </ul>
            </div>
            {/* Categorías */}
            <div>
              <h3 style={styles.title}>Categorías</h3>
              <ul style={styles.links}>
                <li style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/categoria/1', e)}>
                  <span style={styles.linkIcon}><FaBook size={18} /></span>
                  <span style={styles.linkAnchor}>Noticias</span>
                </li>
                <li style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/categoria/2', e)}>
                  <span style={styles.linkIcon}><FaChartBar size={18} /></span>
                  <span style={styles.linkAnchor}>Técnicas de Estudio</span>
                </li>
                <li style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/categoria/6', e)}>
                  <span style={styles.linkIcon}><FaAward size={18} /></span>
                  <span style={styles.linkAnchor}>Desarrollo Profesional</span>
                </li>
                <li style={{...styles.link, cursor: 'pointer'}} onMouseEnter={handleLinkMouseEnter} onMouseLeave={handleLinkMouseLeave} onClick={(e) => handleInstantNavigation('/categorias', e)}>
                  <span style={styles.linkIcon}><FaTags size={18} /></span>
                  <span style={styles.linkAnchor}>Descubre más categorías</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div style={{
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
          <div style={styles.copyright}>
            &copy; {new Date().getFullYear()} EducStation. Todos los derechos reservados.
          </div>
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: window.innerWidth < 768 ? spacing.md : 0
          }}>
            <span 
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