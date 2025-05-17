// src/components/layout/Footer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';
import { spacing, typography, transitions } from '../../styles/theme';

const Footer = () => {
  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDarkMode || false;
  const colors = themeContext?.colors || {
    primary: '#0b4444',
    secondary: '#2a9d8f',
    white: '#ffffff',
    background: '#ffffff',
    gray200: '#e5e7eb',
    textSecondary: '#666666',
  };
  
  const [emailValue, setEmailValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const footerRef = useRef(null);
  const buttonRef = useRef(null);

  // Actualizar todos los estilos dependientes del tema cuando cambie isDarkMode
  useEffect(() => {
    // Aplicar directamente los estilos al elemento del footer
    if (footerRef.current) {
      // Usar siempre el verde oscuro como en la imagen de referencia, independientemente del modo
      footerRef.current.style.backgroundColor = '#0b4444';
      footerRef.current.style.color = '#ffffff';
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
    e.target.style.backgroundColor = isDarkMode ? '#35898a' : '#ffffff';
    e.target.style.color = isDarkMode ? '#ffffff' : '#0b4444';
  };

  const handleButtonMouseLeave = (e) => {
    e.target.style.backgroundColor = isDarkMode ? '#2a7979' : '#2a9d8f';
    e.target.style.color = isDarkMode ? '#ffffff' : '#0b4444';
  };

  // Enlaces del footer
  const footerLinks = [
    {
      title: 'Enlaces Rápidos',
      links: [
        { label: 'Inicio', path: '/' },
        { label: 'Acerca de', path: '/acerca-de' },
        { label: 'Contacto', path: '/contacto' },
        { label: 'FAQ', path: '/faq' },
      ]
    },
    {
      title: 'Categorías',
      links: [
        { label: 'Noticias', path: '/categorias/noticias' },
        { label: 'Técnicas de Estudio', path: '/categorias/tecnicas-de-estudio' },
        { label: 'Desarrollo Profesional', path: '/categorias/desarrollo-profesional' },
        { label: 'Comunidad y Colaboración', path: '/categorias/comunidad' },
        { label: 'Herramientas Tecnológicas', path: '/categorias/herramientas' },
      ]
    },
  ];

  // Estilos
  const styles = {
    footer: {
      backgroundColor: '#0b4444', // Siempre el mismo color, que coincide con la imagen
      color: '#ffffff',
      padding: `${spacing.xl} 0 ${spacing.md}`,
      position: "relative",
      overflow: "hidden"
    },
    footerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `0 ${spacing.lg}`,
      zIndex: 2,
      position: "relative"
    },
    footerPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: "0.05",
      backgroundSize: "20px 20px",
      backgroundImage: `linear-gradient(45deg, ${isDarkMode ? '#fff' : '#000'} 25%, transparent 25%, 
                        transparent 50%, ${isDarkMode ? '#fff' : '#000'} 50%, 
                        ${isDarkMode ? '#fff' : '#000'} 75%, transparent 75%, transparent)`,
      pointerEvents: "none"
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: spacing.md,
      textDecoration: "none",
      color: isDarkMode ? '#e0e0e0' : colors.white,
      transition: transitions.default,
      width: "fit-content",
      '&:hover': {
        color: isDarkMode ? '#35898a' : colors.secondary
      }
    },
    logoIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      objectFit: "cover"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: spacing.xl,
      marginTop: spacing.lg
    },
    description: {
      fontSize: typography.fontSize.sm,
      lineHeight: "1.5",
      marginBottom: spacing.md,
      maxWidth: "400px",
      opacity: "0.9",
      color: isDarkMode ? '#c5c5c5' : colors.white
    },
    social: {
      display: "flex",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.md
    },
    socialIcon: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: isDarkMode ? 'rgba(240, 248, 247, 0.05)' : "rgba(240, 248, 247, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: transitions.default,
      cursor: "pointer",
      fontSize: "18px",
      color: isDarkMode ? '#e0e0e0' : colors.white,
      '&:hover': {
        backgroundColor: isDarkMode ? '#2a7979' : colors.secondary,
        color: isDarkMode ? '#ffffff' : colors.primary
      }
    },
    title: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      color: isDarkMode ? '#e0e0e0' : '#ffffff', // Asegurar buen contraste
    },
    links: {
      listStyle: "none",
      padding: 0,
      margin: 0
    },
    link: {
      marginBottom: spacing.sm,
      position: "relative",
      paddingLeft: spacing.md,
      transition: transitions.default,
      '&:hover': {
        color: isDarkMode ? '#35898a' : colors.secondary,
        paddingLeft: spacing.lg
      },
      '&:before': {
        content: '"›"',
        position: "absolute",
        left: 0,
        color: isDarkMode ? '#35898a' : colors.secondary
      }
    },
    linkAnchor: {
      color: isDarkMode ? '#c5c5c5' : colors.gray200, // Mejor contraste en modo oscuro
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        color: isDarkMode ? '#35898a' : colors.secondary
      }
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
      border: "none",
      outline: "none",
      backgroundColor: isDarkMode ? "rgba(240, 248, 247, 0.05)" : "rgba(240, 248, 247, 0.1)",
      color: isDarkMode ? '#e0e0e0' : colors.white,
      borderRadius: "4px 0 0 4px",
      transition: transitions.default,
      '&::placeholder': {
        color: isDarkMode ? 'rgba(240, 248, 247, 0.5)' : "rgba(240, 248, 247, 0.7)"
      },
      '&:focus': {
        backgroundColor: isDarkMode ? "rgba(240, 248, 247, 0.1)" : "rgba(240, 248, 247, 0.2)"
      }
    },
    button: {
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: isDarkMode ? '#2a7979' : '#2a9d8f',
      color: isDarkMode ? '#ffffff' : '#0b4444',
      border: "none",
      borderRadius: "0 4px 4px 0",
      cursor: "pointer",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: isDarkMode ? '#35898a' : colors.white,
      },
      '&:disabled': {
        backgroundColor: isDarkMode ? '#235e5e' : colors.gray300,
        cursor: "not-allowed"
      }
    },
    message: {
      fontSize: typography.fontSize.sm,
      marginTop: spacing.sm,
      color: isDarkMode ? '#35898a' : colors.secondary
    },
    bottom: {
      marginTop: spacing.xl,
      paddingTop: spacing.md,
      borderTop: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(240, 248, 247, 0.1)',
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.md
    },
    copyright: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? '#c5c5c5' : colors.gray200
    },
    bottomLinks: {
      display: "flex",
      gap: spacing.md
    },
    bottomLink: {
      fontSize: typography.fontSize.sm,
      textDecoration: "none",
      transition: transitions.default
    }
  };

  return (
    <footer style={styles.footer} ref={footerRef}>
      {/* Patrón de fondo */}
      <div style={styles.footerPattern}></div>

      <div style={styles.footerContent}>
        {/* Grid de contenido */}
        <div style={styles.grid}>
          {/* Logo y descripción */}
          <div>
            <div 
              style={styles.logoContainer}
              onMouseEnter={(e) => (e.currentTarget.style.color = isDarkMode ? '#35898a' : colors.secondary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = isDarkMode ? '#e0e0e0' : colors.white)}
            >
              <img src="/assets/images/educstation-logo.png" alt="Logo" style={styles.logoIcon} />
              <span style={{
                color: isDarkMode ? '#e0e0e0' : colors.white,
                marginLeft: spacing.sm,
                fontWeight: typography.fontWeight.bold
              }}>EducStation</span>
            </div>
            <p style={styles.description}>
              Plataforma educativa dedicada al desarrollo profesional y personal
              de estudiantes y educadores, promovemos la innovación, 
              colaboración y excelencia en el ámbito educativo.
            </p>

            {/* Íconos de redes sociales */}
            <div style={styles.social}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={styles.socialIcon}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? '#2a7979' : colors.secondary;
                  e.currentTarget.style.color = isDarkMode ? '#ffffff' : colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(240, 248, 247, 0.05)' : "rgba(240, 248, 247, 0.1)";
                  e.currentTarget.style.color = isDarkMode ? '#e0e0e0' : colors.white;
                }}
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                style={styles.socialIcon}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? '#2a7979' : colors.secondary;
                  e.currentTarget.style.color = isDarkMode ? '#ffffff' : colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(240, 248, 247, 0.05)' : "rgba(240, 248, 247, 0.1)";
                  e.currentTarget.style.color = isDarkMode ? '#e0e0e0' : colors.white;
                }}
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={styles.socialIcon}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? '#2a7979' : colors.secondary;
                  e.currentTarget.style.color = isDarkMode ? '#ffffff' : colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(240, 248, 247, 0.05)' : "rgba(240, 248, 247, 0.1)";
                  e.currentTarget.style.color = isDarkMode ? '#e0e0e0' : colors.white;
                }}
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                style={styles.socialIcon}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? '#2a7979' : colors.secondary;
                  e.currentTarget.style.color = isDarkMode ? '#ffffff' : colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(240, 248, 247, 0.05)' : "rgba(240, 248, 247, 0.1)";
                  e.currentTarget.style.color = isDarkMode ? '#e0e0e0' : colors.white;
                }}
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Enlaces columnas */}
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 style={styles.title}>{section.title}</h4>
              <ul style={styles.links}>
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} style={styles.link}>
                    <Link
                      to={link.path}
                      style={{
                        ...styles.linkAnchor,
                        color: isDarkMode ? '#c5c5c5' : colors.gray200
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = isDarkMode ? '#35898a' : colors.secondary)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = isDarkMode ? '#c5c5c5' : colors.gray200)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 style={styles.title}>Suscríbete</h4>
            <p style={styles.description}>
              Recibe nuestras últimas noticias y actualizaciones directamente en tu correo electrónico.
            </p>
            <form style={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                style={{
                  ...styles.input,
                  backgroundColor: isDarkMode ? "rgba(240, 248, 247, 0.05)" : "rgba(240, 248, 247, 0.1)",
                  color: isDarkMode ? '#e0e0e0' : colors.white
                }}
                disabled={isSubmitting || isSuccess}
              />
              <button
                ref={buttonRef}
                type="submit"
                style={styles.button}
                onMouseEnter={handleButtonMouseEnter}
                onMouseLeave={handleButtonMouseLeave}
                disabled={isSubmitting || isSuccess || !emailValue.trim()}
              >
                {isSubmitting ? "..." : "Enviar"}
              </button>
            </form>
            {isSuccess && (
              <div style={{...styles.message, color: isDarkMode ? '#35898a' : colors.secondary}}>
                ¡Te has suscrito correctamente!
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={styles.bottom}>
          <div style={{...styles.copyright, color: isDarkMode ? '#c5c5c5' : colors.gray200}}>
            © 2023 EducStation. Todos los derechos reservados.
          </div>
          <div style={styles.bottomLinks}>
            <Link
              to="/terms"
              style={{
                ...styles.bottomLink,
                color: isDarkMode ? '#c5c5c5' : colors.gray200
              }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/terms";
              }}
              onMouseEnter={(e) => e.target.style.color = isDarkMode ? '#35898a' : colors.secondary}
              onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#c5c5c5' : colors.gray200}
            >
              Términos
            </Link>
            <Link
              to="/privacy"
              style={{
                ...styles.bottomLink,
                color: isDarkMode ? '#c5c5c5' : colors.gray200
              }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/privacy";
              }}
              onMouseEnter={(e) => e.target.style.color = isDarkMode ? '#35898a' : colors.secondary}
              onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#c5c5c5' : colors.gray200}
            >
              Privacidad
            </Link>
            <Link
              to="/cookies"
              style={{
                ...styles.bottomLink,
                color: isDarkMode ? '#c5c5c5' : colors.gray200
              }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/cookies";
              }}
              onMouseEnter={(e) => e.target.style.color = isDarkMode ? '#35898a' : colors.secondary}
              onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#c5c5c5' : colors.gray200}
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