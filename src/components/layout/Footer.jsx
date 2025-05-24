// src/components/layout/Footer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, transitions } from '../../styles/theme';
import { FaHome, FaInfo, FaEnvelope, FaQuestionCircle, FaPenSquare, FaBook, FaChartBar, FaAward, FaUsers, FaCog, FaList, FaTags, FaGlobe, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiX } from 'react-icons/si';

const Footer = () => {
  const { isDarkMode, colors } = useTheme();
  const location = useLocation();
  const [emailValue, setEmailValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const footerRef = useRef(null);
  const buttonRef = useRef(null);

  // Configuración dinámica de Capsule Render basada en el tema
  const getCapsuleRenderUrl = () => {
    const baseUrl = 'https://capsule-render.vercel.app/api';
    const params = new URLSearchParams({
      type: 'waving',
      height: '120',
      section: 'footer',
      text: 'EducStation',
      fontSize: '30',
      animation: 'fadeIn'
    });

    if (isDarkMode) {
      params.set('color', '333333');
      params.set('fontColor', '7de2fc');
    } else {
      params.set('color', '91a8a4');
      params.set('fontColor', '0b4444');
    }

    return `${baseUrl}?${params.toString()}`;
  };

  // Actualizar estilos del footer cuando cambie el tema
  useEffect(() => {
    if (footerRef.current) {
      // El fondo ahora será transparente ya que usamos la imagen de Capsule Render
      footerRef.current.style.backgroundColor = 'transparent';
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

  const styles = {
    footer: {
      padding: `0 0 ${spacing.lg}`,
      marginTop: spacing.lg,
      position: 'relative',
      background: isDarkMode ? '#1a1a1a' : '#f0f8f7',
    },
    capsuleContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '120px',
      overflow: 'hidden',
      zIndex: 1,
    },
    capsuleImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    container: {
      maxWidth: '1700px',
      margin: '0 auto',
      padding: `0 ${spacing.lg}`,
      position: 'relative',
      zIndex: 2,
    },
    contentWrapper: {
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f8f7',
      paddingTop: spacing.xl,
    },
    logo: {
      display: "flex",
      alignItems: "center",
      marginBottom: spacing.md,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? '#fff' : colors.primary,
      cursor: "pointer"
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
      color: isDarkMode ? '#aaa' : colors.gray600,
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
      color: isDarkMode ? '#fff' : colors.primary,
      textAlign: "left",
      width: "100%"
    },
    links: {
      listStyle: "none",
      padding: 0,
      margin: "0 auto",
      lineHeight: "1.8",
      width: "fit-content",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
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
      color: isDarkMode ? '#7de2fc' : colors.primary,
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
    bottom: {
      marginTop: spacing.xxl * 2,
      paddingTop: spacing.xl,
      borderTop: `1px solid ${isDarkMode ? '#444' : 'rgba(145, 168, 164, 0.3)'}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.xl
    },
    copyright: {
      color: isDarkMode ? '#aaa' : colors.gray600,
      fontSize: typography.fontSize.sm
    },
    bottomLinks: {
      display: "flex",
      gap: spacing.md
    },
    bottomLink: {
      color: isDarkMode ? '#aaa' : colors.gray600,
      fontSize: typography.fontSize.sm,
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        color: colors.secondary
      }
    },
  };

  // --- HANDLERS MEJORADOS PARA EFECTOS GLOW Y ANIMACIONES ---
  const glowColor = isDarkMode ? '#7de2fc33' : '#b9ffb755';
  const handleLinkMouseEnter = (e) => {
    e.currentTarget.style.boxShadow = `0 0 16px 4px ${glowColor}`;
    e.currentTarget.style.background = isDarkMode ? 'rgba(35,64,79,0.85)' : 'rgba(185,255,183,0.55)';
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
    <footer ref={footerRef} style={styles.footer}>
      {/* Capsule Render Background */}
      <div style={styles.capsuleContainer}>
        <img 
          src={getCapsuleRenderUrl()}
          alt="Footer Background"
          style={styles.capsuleImage}
        />
      </div>
      
      {/* Content Wrapper */}
      <div style={styles.contentWrapper}>
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: spacing.sm }}>
              <div 
                style={styles.logo}
                onClick={(e) => handleInstantNavigation('/', e)}
              >
                <img src="/assets/images/Icon.png" alt="Logo" style={styles.logoIcon} />
                <span style={{ color: isDarkMode ? '#fff' : colors.primary, marginLeft: spacing.sm, fontWeight: typography.fontWeight.bold }}>EducStation</span>
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
      </div>
    </footer>
  );
};

export default Footer;