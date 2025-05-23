// src/components/layout/Footer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, transitions } from '../../styles/theme';
import { FaHome, FaInfo, FaEnvelope, FaQuestionCircle, FaPenSquare, FaBook, FaChartBar, FaAward, FaUsers, FaCog, FaList, FaTags, FaGlobe, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiX } from 'react-icons/si';

const Footer = () => {
  const { isDarkMode, colors } = useTheme(); // Obtener colores actualizados del contexto
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

  // --- ANIMACIONES Y EFECTOS GLOW ---
  // La animación de glow se aplicará directamente en el estilo inline si se requiere, no como keyframes en JS

  const styles = {
    // Quitamos backgroundColor y color del objeto de estilo
    // porque ahora lo aplicamos directamente al elemento con useEffect
    footer: {
      padding: `${spacing.xxl} 0 ${spacing.xxl}`,
      marginTop: spacing.xxl,
    },
    container: {
      maxWidth: '1700px',
      margin: '0 auto',
      padding: `0 ${spacing.lg}`,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
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
      fontSize: typography.fontSize.lg, // Aumentar tamaño del título
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.md,
      color: isDarkMode ? '#fff' : colors.white,
      textAlign: "center", // Centrar título
      width: "100%" // Asegurar que ocupe todo el ancho
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
      marginBottom: spacing.sm,
      transition: transitions.default,
      fontSize: typography.fontSize.md,
      display: "flex",
      alignItems: "center",
      
      borderRadius: "12px",
      padding: `10px 58px 10px 48px`,
      boxShadow: `0 2px 12px 0 ${colors.secondary}11` ,
      background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.10)',
      willChange: "box-shadow, background, color, transform",
      border: `1.5px solid ${colors.secondary}22`,
      minWidth: '160px',
    },
    linkIcon: {
      marginRight: '20px',
      marginLeft: '10px',
      display: 'inline-flex',
      alignItems: 'center',
      color: '#ffffff',
      fontSize: '22px',
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
      margin: `${spacing.xl} 0 0 0`,
      padding: `${spacing.lg} ${spacing.xl}`,
      background: isDarkMode ? 'rgba(34,34,34,0.08)' : 'rgba(255,255,255,0.06)',
      color: isDarkMode ? colors.secondary : colors.primary,
      borderRadius: '18px',
      fontSize: typography.fontSize.lg,
      fontWeight: 600,
      boxShadow: `0 4px 32px 0 ${colors.secondary}11`,
      textAlign: 'center',
      letterSpacing: '0.01em',
      transition: transitions.default,
      border: `1px solid ${colors.secondary}11`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      maxWidth: '900px',
      marginLeft: 'auto',
      marginRight: 'auto',
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
    <footer ref={footerRef} style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* About Section */}
          <div>
            <div
              style={styles.logo}
              onClick={() => (window.location.href = "/")}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.secondary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = isDarkMode ? '#fff' : colors.white)}
            >
              <img src="/assets/images/Icon.png" alt="Logo" style={styles.logoIcon} />
              <span style={{
                color: isDarkMode ? '#fff' : colors.white,
                marginLeft: spacing.sm,
                fontWeight: typography.fontWeight.bold
              }}>EducStation</span>
            </div>
            <p style={styles.description}>
              Plataforma educativa dedicada al desarrollo profesional y personal
              de educadores y estudiantes. Fomentamos la innovación, colaboración y
              excelencia en el ámbito educativo.
            </p>
            <div style={styles.social}>
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

          {/* Quick Links */}
          <div>
            <h3 style={styles.title}>Enlaces Rápidos</h3>
            <ul style={styles.links}>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaHome size={22} /></span>
                <Link
                  to="/"
                  style={styles.linkAnchor}
                  onClick={e => { e.preventDefault(); window.location.href = "/"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  Inicio
                </Link>
              </li>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaInfo size={22} /></span>
                <Link
                  to="/about"
                  style={styles.linkAnchor}
                  onClick={e => { e.preventDefault(); window.location.href = "/about"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  Acerca de
                </Link>
              </li>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaEnvelope size={22} /></span>
                <Link
                  to="/contact"
                  style={styles.linkAnchor}
                  onClick={e => { e.preventDefault(); window.location.href = "/contact"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  Contacto
                </Link>
              </li>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaQuestionCircle size={22} /></span>
                <Link
                  to="/contact#faq-section"
                  style={styles.linkAnchor}
                  onClick={e => { e.preventDefault(); window.location.href = "/contact#faq-section"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  FAQ
                </Link>
              </li>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaTags size={22} /></span>
                <Link
                  to="/categorias"
                  style={styles.linkAnchor}
                  onClick={e => { e.preventDefault(); window.location.href = "/categorias"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  Categorías
                </Link>
              </li>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaGlobe size={22} /></span>
                <Link
                  to="/blog"
                  style={styles.linkAnchor}
                  onClick={e => { e.preventDefault(); window.location.href = "/blog"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 style={styles.title}>Categorías</h3>
            <ul style={styles.links}>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaBook size={22} /></span>
                <Link
                  to="/categoria/1"
                  style={styles.linkAnchor}
                  onClick={e => { e.preventDefault(); window.location.href = "/categoria/1"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  Noticias
                </Link>
              </li>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaChartBar size={22} /></span>
                <Link
                  to="/categoria/2"
                  style={styles.linkAnchor}
                  onClick={e => { e.preventDefault(); window.location.href = "/categoria/2"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  Técnicas de Estudio
                </Link>
              </li>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaAward size={22} /></span>
                <Link
                  to="/categoria/6"
                  style={{ ...styles.linkAnchor, whiteSpace: 'nowrap', overflow: 'visible', maxWidth: 'none' }}
                  onClick={e => { e.preventDefault(); window.location.href = "/categoria/6"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  Desarrollo Profesional Docente
                </Link>
              </li>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaUsers size={22} /></span>
                <Link
                  to="/categoria/7"
                  style={{ ...styles.linkAnchor, whiteSpace: 'nowrap', overflow: 'visible', maxWidth: 'none' }}
                  onClick={e => { e.preventDefault(); window.location.href = "/categoria/7"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  Comunidad y Colaboración
                </Link>
              </li>
              <li style={{ ...styles.link, paddingLeft: 0 }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}>
                <span style={styles.linkIcon}><FaCog size={22} /></span>
                <Link
                  to="/categoria/5"
                  style={{ ...styles.linkAnchor, whiteSpace: 'nowrap', overflow: 'visible', maxWidth: 'none' }}
                  onClick={e => { e.preventDefault(); window.location.href = "/categoria/5"; }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.secondary}
                  onMouseLeave={e => e.currentTarget.style.color = colors.gray200}
                >
                  Herramientas Tecnológicas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Educational Tip Section */}
        <div style={styles.educationalTip}>
          <span role="img" aria-label="idea">💡</span> "La educación es el arma más poderosa que puedes usar para cambiar el mundo." — Nelson Mandela
        </div>

        {/* Bottom Section */}
        <div style={styles.bottom}>
          <div style={styles.copyright}>
            &copy; {new Date().getFullYear()} EducStation. Todos los derechos reservados.
          </div>
          <div style={styles.bottomLinks}>
            <Link
              to="/terms"
              style={{ ...styles.bottomLink }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/terms";
              }}
              onMouseEnter={(e) => e.target.style.color = colors.secondary}
              onMouseLeave={(e) => e.target.style.color = colors.gray200}
            >
              Términos
            </Link>
            <Link
              to="/privacy"
              style={{ ...styles.bottomLink }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/privacy";
              }}
              onMouseEnter={(e) => e.target.style.color = colors.secondary}
              onMouseLeave={(e) => e.target.style.color = colors.gray200}
            >
              Privacidad
            </Link>
            <Link
              to="/cookies"
              style={{ ...styles.bottomLink }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/cookies";
              }}
              onMouseEnter={(e) => e.target.style.color = colors.secondary}
              onMouseLeave={(e) => e.target.style.color = colors.gray200}
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;