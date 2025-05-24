// src/components/layout/Footer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, transitions } from '../../styles/theme';
import { FaHome, FaInfo, FaEnvelope, FaQuestionCircle, FaPenSquare, FaBook, FaChartBar, FaAward, FaUsers, FaCog, FaList, FaTags, FaGlobe, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiX } from 'react-icons/si';

const Footer = () => {
  const { isDarkMode, colors } = useTheme(); // Obtener colores actualizados del contexto
  const location = useLocation(); // Para detectar la página actual
  const [emailValue, setEmailValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const footerRef = useRef(null);
  const buttonRef = useRef(null);

  // Actualizar todos los estilos dependientes del tema cuando cambie isDarkMode
  useEffect(() => {
    // Aplicar directamente los estilos al elemento del footer
    if (footerRef.current) {
      footerRef.current.style.backgroundColor = isDarkMode ? '#222' : colors.primary;
      footerRef.current.style.color = isDarkMode ? '#ccc' : colors.white;
    }
  }, [isDarkMode, colors]);

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
    
    // Si ya estamos en la página, recargar inmediatamente
    if(location.pathname === path) {
      window.location.reload();
    } else {
      // Si estamos en otra página, navegar directamente con recarga instantánea
      window.location.href = path;
    }
  };

  // --- ANIMACIONES Y EFECTOS GLOW ---
  // La animación de glow se aplicará directamente en el estilo inline si se requiere, no como keyframes en JS

  const styles = {
    // Quitamos backgroundColor y color del objeto de estilo
    // porque ahora lo aplicamos directamente al elemento con useEffect
    footer: {
      padding: `${spacing.lg} 0 ${spacing.lg}`,
      marginTop: spacing.lg,
    },
    container: {
      maxWidth: '1700px',
      margin: '0 auto',
      padding: `0 ${spacing.lg}`,
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
      color: isDarkMode ? '#aaa' : colors.gray200,
      marginBottom: spacing.xxl,
      lineHeight: "1.8",
      fontSize: typography.fontSize.md
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
      color: isDarkMode ? '#fff' : colors.white,
      textAlign: "left",
      width: "100%"
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
      transition: transitions.default,
      fontSize: typography.fontSize.sm,
      display: "flex",
      alignItems: "center",
      borderRadius: "8px",
      padding: "8px 40px 8px 32px",
      boxShadow: `0 2px 8px 0 ${colors.secondary}11`,
      background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.10)',
      willChange: "box-shadow, background, color, transform",
      border: `1px solid ${colors.secondary}22`,
      minWidth: '140px',
    },
    linkIcon: {
      marginRight: '12px',
      marginLeft: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      color: '#ffffff',
      fontSize: '18px',
      transition: transitions.default,
    },
    linkAnchor: {
      color: isDarkMode ? '#fff' : colors.primary,
      textDecoration: "none",
      transition: transitions.default,
      fontSize: typography.fontSize.md,
      fontWeight: 600,
      letterSpacing: "0.01em",
      filter: "drop-shadow(0 0 2px #0002)",
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
      backgroundColor: "rgba(240, 248, 247, 0.1)",
      color: colors.white,
      '&::placeholder': {
        color: colors.gray200
      },
      '&:focus': {
        outline: "none",
        backgroundColor: "rgba(240, 248, 247, 0.2)"
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
      boxShadow: `0 0 20px 2px ${colors.secondary}`,
    },
    message: {
      fontSize: typography.fontSize.sm,
      marginTop: spacing.sm,
      color: colors.secondary
    },
    bottom: {
      marginTop: spacing.xxl * 2,
      paddingTop: spacing.xl,
      borderTop: `1px solid ${isDarkMode ? '#444' : 'rgba(240, 248, 247, 0.1)'}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.xl
    },
    copyright: {
      color: isDarkMode ? '#aaa' : colors.gray200, // Cambia el color del texto de copyright
      fontSize: typography.fontSize.sm
    },
    bottomLinks: {
      display: "flex",
      gap: spacing.md
    },
    bottomLink: {
      color: colors.gray200,
      fontSize: typography.fontSize.sm,
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        color: colors.secondary
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
  const glowColor = isDarkMode ? '#7de2fc33' : '#b9ffb755'; // glow mucho más sutil
  const handleLinkMouseEnter = (e) => {
    e.currentTarget.style.boxShadow = `0 0 16px 4px ${glowColor}`;
    e.currentTarget.style.background = isDarkMode ? 'rgba(35,64,79,0.85)' : 'rgba(185,255,183,0.55)'; // fondo pastel translúcido
    e.currentTarget.style.color = isDarkMode ? '#fff' : '#23404f';
    e.currentTarget.style.transform = 'scale(1.03)';
  };
  const handleLinkMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = `0 0 0 0 ${colors.secondary}00`;
    e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.10)';
    e.currentTarget.style.color = isDarkMode ? '#fff' : colors.primary;
    e.currentTarget.style.transform = 'scale(1)';
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
    <footer ref={footerRef} style={{ ...styles.footer, position: 'relative', overflow: 'hidden' }}>
      {/* SVG para la curva superior */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '48px', zIndex: 1, pointerEvents: 'none' }}>
        <svg viewBox="0 0 1440 48" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
          <path fill={isDarkMode ? '#222' : colors.primary} d="M0,36 Q720,0 1440,36 L1440,0 L0,0 Z" />
        </svg>
      </div>
      <div style={{ ...styles.container, paddingTop: '48px', position: 'relative', zIndex: 2 }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: spacing.sm }}>
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
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, width: '100%' }}>
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
        <div style={styles.bottom}>
          <div style={styles.copyright}>
            &copy; {new Date().getFullYear()} EducStation. Todos los derechos reservados.
          </div>
          <div style={styles.bottomLinks}>
            <span style={{...styles.bottomLink, cursor: 'pointer'}} onClick={(e) => handleInstantNavigation('/terms', e)}>Términos</span>
            <span style={{...styles.bottomLink, cursor: 'pointer'}} onClick={(e) => handleInstantNavigation('/privacy', e)}>Privacidad</span>
            <span style={{...styles.bottomLink, cursor: 'pointer'}} onClick={(e) => handleInstantNavigation('/cookies', e)}>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;