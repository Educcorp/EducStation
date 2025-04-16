// src/components/layout/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { colors, spacing, typography, transitions } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();
  const [emailValue, setEmailValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
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
  
  // Definir colores basados en el tema actual
  const currentColors = {
    background: isDarkMode ? '#1a2e2d' : colors.primary,
    text: isDarkMode ? '#e1e7e6' : colors.white,
    secondaryText: isDarkMode ? '#8ba6a4' : colors.gray200,
    accent: isDarkMode ? '#e0c7a8' : colors.secondary,
    border: isDarkMode ? 'rgba(139, 166, 164, 0.2)' : 'rgba(240, 248, 247, 0.1)',
    inputBg: isDarkMode ? 'rgba(11, 28, 27, 0.5)' : 'rgba(240, 248, 247, 0.1)',
    inputFocusBg: isDarkMode ? 'rgba(11, 28, 27, 0.8)' : 'rgba(240, 248, 247, 0.2)',
  };
  
  const styles = {
    footer: {
      backgroundColor: currentColors.background,
      color: currentColors.text,
      padding: `${spacing.xxl} 0 ${spacing.xl}`,
      marginTop: spacing.xxl
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `0 ${spacing.md}`
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: spacing.xl,
    },
    logo: {
      display: "flex",
      alignItems: "center",
      marginBottom: spacing.md,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: currentColors.text,
      cursor: "pointer"
    },
    logoIcon: {
      marginRight: spacing.sm,
      width: "32px",
      height: "32px",
      backgroundColor: isDarkMode ? colors.primary : colors.primaryLight,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `linear-gradient(135deg, ${isDarkMode ? colors.primary : colors.primaryLight} 60%, ${currentColors.accent} 40%)`,
      borderRadius: "8px"
    },
    description: {
      color: currentColors.secondaryText,
      marginBottom: spacing.xl,
      lineHeight: "1.6",
      fontSize: typography.fontSize.sm
    },
    social: {
      display: "flex",
      gap: spacing.md
    },
    socialIcon: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: currentColors.border,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: transitions.default,
      cursor: "pointer",
      fontSize: "18px",
      color: currentColors.text
    },
    title: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      color: currentColors.text
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
      color: currentColors.secondaryText
    },
    linkAnchor: {
      color: currentColors.secondaryText,
      textDecoration: "none",
      transition: transitions.default
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
      backgroundColor: currentColors.inputBg,
      color: currentColors.text,
      '&::placeholder': {
        color: currentColors.secondaryText
      },
      '&:focus': {
        outline: "none",
        backgroundColor: currentColors.inputFocusBg
      }
    },
    button: {
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: currentColors.accent,
      color: isDarkMode ? colors.text : colors.primary,
      border: "none",
      borderRadius: "0 4px 4px 0",
      cursor: "pointer",
      transition: transitions.default
    },
    message: {
      fontSize: typography.fontSize.sm,
      marginTop: spacing.sm,
      color: currentColors.accent
    },
    bottom: {
      marginTop: spacing.xxl,
      paddingTop: spacing.md,
      borderTop: `1px solid ${currentColors.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.md
    },
    copyright: {
      color: currentColors.secondaryText,
      fontSize: typography.fontSize.sm
    },
    bottomLinks: {
      display: "flex",
      gap: spacing.md
    },
    bottomLink: {
      color: currentColors.secondaryText,
      fontSize: typography.fontSize.sm,
      textDecoration: "none",
      transition: transitions.default
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* About Section */}
          <div>
            <div 
              style={styles.logo} 
              onClick={() => (window.location.href = "/")}
              onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.text)}
            >
              <img src="/assets/images/Icon.png" alt="Logo" style={styles.logoIcon} />
              EducStation
            </div>
            <p style={styles.description}>
              Plataforma educativa dedicada al desarrollo profesional y personal
              de educadores y estudiantes. Fomentamos la innovación, colaboración y
              excelencia en el ámbito educativo.
            </p>
            <div style={styles.social}>
              <a 
                href="https://x.com/EducCorp" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{...styles.socialIcon}}
                onMouseEnter={(e) => e.target.style.backgroundColor = currentColors.accent}
                onMouseLeave={(e) => e.target.style.backgroundColor = currentColors.border}
              >T</a>
              <a 
                href="https://www.linkedin.com/in/educcorp-inc-158297356/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{...styles.socialIcon}}
                onMouseEnter={(e) => e.target.style.backgroundColor = currentColors.accent}
                onMouseLeave={(e) => e.target.style.backgroundColor = currentColors.border}
              >in</a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 style={styles.title}>Enlaces Rápidos</h3>
            <ul style={styles.links}>
              <li 
                style={styles.link}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentColors.accent;
                  e.currentTarget.style.paddingLeft = spacing.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentColors.secondaryText;
                  e.currentTarget.style.paddingLeft = spacing.md;
                }}
              >
                <Link
                to="/" 
                  href="/"
                  style={styles.linkAnchor}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/";
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.secondaryText)}
                >Inicio</Link>
              </li>
              <li 
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = currentColors.accent;
                e.currentTarget.style.paddingLeft = spacing.lg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = currentColors.secondaryText;
                e.currentTarget.style.paddingLeft = spacing.md;
              }}
              >
                <Link 
                  to="/about"
                  href="/about"
                  style={styles.linkAnchor}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/about";
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.secondaryText)}
                >
                  Acerca de</Link>
              </li>
              <li 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = currentColors.accent;
                    e.currentTarget.style.paddingLeft = spacing.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentColors.secondaryText;
                  e.currentTarget.style.paddingLeft = spacing.md;
                }}
              >
                <Link 
                  to="/contact"
                  href="/contact"
                  style={styles.linkAnchor}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/contact";
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.secondaryText)}
                >Contacto</Link>
              </li>
              <li 
                style={styles.link}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentColors.accent;
                  e.currentTarget.style.paddingLeft = spacing.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentColors.secondaryText;
                  e.currentTarget.style.paddingLeft = spacing.md;
                }}
              >
                <Link 
                  to="/contact#faq-section"
                  style={styles.linkAnchor}
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.secondaryText)}
                >FAQ</Link>
              </li>
              <li 
                style={styles.link}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentColors.accent;
                  e.currentTarget.style.paddingLeft = spacing.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentColors.secondaryText;
                  e.currentTarget.style.paddingLeft = spacing.md;
                }}
              >
                <Link 
                  to="/admin/post"
                  style={styles.linkAnchor}
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.secondaryText)}
                >Crear Post</Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 style={styles.title}>Categorías</h3>
            <ul style={styles.links}>
              <li 
                style={styles.link}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentColors.accent;
                  e.currentTarget.style.paddingLeft = spacing.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentColors.secondaryText;
                  e.currentTarget.style.paddingLeft = spacing.md;
                }}
              >
                <Link 
                  to="/category/tecnicas-de-estudio"
                  style={styles.linkAnchor}
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.secondaryText)}
                >Técnicas de Estudio</Link>
              </li>
              <li 
                style={styles.link}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentColors.accent;
                  e.currentTarget.style.paddingLeft = spacing.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentColors.secondaryText;
                  e.currentTarget.style.paddingLeft = spacing.md;
                }}
              >
                <Link 
                  to="/category/desarrollo-docente"
                  style={styles.linkAnchor}
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.secondaryText)}
                >Desarrollo Profesional</Link>
              </li>
              <li 
                style={styles.link}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentColors.accent;
                  e.currentTarget.style.paddingLeft = spacing.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentColors.secondaryText;
                  e.currentTarget.style.paddingLeft = spacing.md;
                }}
              >
                <Link 
                  to="/category/educacion-de-calidad"
                  style={styles.linkAnchor}
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.secondaryText)}
                >Educación de Calidad</Link>
              </li>
              <li 
                style={styles.link}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentColors.accent;
                  e.currentTarget.style.paddingLeft = spacing.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentColors.secondaryText;
                  e.currentTarget.style.paddingLeft = spacing.md;
                }}
              >
                <Link 
                  to="/category/comunidad"
                  style={styles.linkAnchor}
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.secondaryText)}
                >Comunidad</Link>
              </li>
              <li 
                style={styles.link}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentColors.accent;
                  e.currentTarget.style.paddingLeft = spacing.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentColors.secondaryText;
                  e.currentTarget.style.paddingLeft = spacing.md;
                }}
              >
                <Link 
                  to="/category/herramientas"
                  style={styles.linkAnchor}
                  onMouseEnter={(e) => (e.currentTarget.style.color = currentColors.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = currentColors.secondaryText)}
                >Herramientas</Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter Section */}
          <div>
            <h3 style={styles.title}>Suscríbete</h3>
            <p style={styles.description}>
              Recibe nuestras últimas noticias y actualizaciones directamente en tu correo electrónico.
            </p>
            <form style={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Tu email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                style={styles.button}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDarkMode ? '#f0f0f0' : colors.white}
                onMouseLeave={(e) => e.target.style.backgroundColor = currentColors.accent}
              >
                {isSubmitting ? '...' : 'OK'}
              </button>
            </form>
            {isSuccess && (
              <div style={styles.message}>
                ¡Gracias por suscribirte!
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Section */}
        <div style={styles.bottom}>
          <div style={styles.copyright}>
            &copy; {new Date().getFullYear()} EducStation. Todos los derechos reservados.
          </div>
          <div style={styles.bottomLinks}>
            <Link 
              to="/terms" 
              style={{...styles.bottomLink}}
              onMouseEnter={(e) => e.target.style.color = currentColors.accent}
              onMouseLeave={(e) => e.target.style.color = currentColors.secondaryText}
            >
              Términos
            </Link>
            <Link 
              to="/privacy" 
              style={{...styles.bottomLink}}
              onMouseEnter={(e) => e.target.style.color = currentColors.accent}
              onMouseLeave={(e) => e.target.style.color = currentColors.secondaryText}
            >
              Privacidad
            </Link>
            <Link 
              to="/cookies" 
              style={{...styles.bottomLink}}
              onMouseEnter={(e) => e.target.style.color = currentColors.accent}
              onMouseLeave={(e) => e.target.style.color = currentColors.secondaryText}
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