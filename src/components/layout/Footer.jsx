// src/components/layout/Footer.jsx
import React, { useState } from 'react';
import { colors, spacing, typography, transitions } from '../../styles/theme';

const Footer = () => {
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
  
  const styles = {
    footer: {
      backgroundColor: colors.primary,
      color: colors.white,
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
      color: colors.white
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
      color: colors.gray200,
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
      backgroundColor: "rgba(240, 248, 247, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: transitions.default,
      cursor: "pointer",
      fontSize: "18px",
      '&:hover': {
        backgroundColor: colors.secondary,
        color: colors.primary
      }
    },
    title: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md,
      color: colors.white
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
        color: colors.secondary,
        paddingLeft: spacing.lg
      },
      '&:before': {
        content: '"›"',
        position: "absolute",
        left: 0,
        color: colors.secondary
      }
    },
    linkAnchor: {
      color: colors.gray200,
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        color: colors.secondary
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
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: colors.secondary,
      color: colors.primary,
      border: "none",
      borderRadius: "0 4px 4px 0",
      cursor: "pointer",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: colors.white
      },
      '&:disabled': {
        backgroundColor: colors.gray300,
        cursor: "not-allowed"
      }
    },
    message: {
      fontSize: typography.fontSize.sm,
      marginTop: spacing.sm,
      color: colors.secondary
    },
    bottom: {
      marginTop: spacing.xxl,
      paddingTop: spacing.md,
      borderTop: `1px solid rgba(240, 248, 247, 0.1)`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.md
    },
    copyright: {
      color: colors.gray200,
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
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* About Section */}
          <div>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>E</div>
              EducStation
            </div>
            <p style={styles.description}>
              Plataforma educativa dedicada al desarrollo profesional y personal
              de educadores y estudiantes. Fomentamos la innovación, colaboración y
              excelencia en el ámbito educativo.
            </p>
            <div style={styles.social}>
              <div 
                style={{...styles.socialIcon}}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.secondary}
                onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(240, 248, 247, 0.1)"}
              >f</div>
              <div 
                style={{...styles.socialIcon}}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.secondary}
                onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(240, 248, 247, 0.1)"}
              >t</div>
              <div 
                style={{...styles.socialIcon}}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.secondary}
                onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(240, 248, 247, 0.1)"}
              >in</div>
              <div 
                style={{...styles.socialIcon}}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.secondary}
                onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(240, 248, 247, 0.1)"}
              >ig</div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 style={styles.title}>Enlaces Rápidos</h3>
            <ul style={styles.links}>
              {['Inicio', 'Sobre Nosotros', 'Blog', 'Contacto', 'FAQ'].map((link, index) => (
                <li 
                  key={index} 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.secondary;
                    e.currentTarget.style.paddingLeft = spacing.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.gray200;
                    e.currentTarget.style.paddingLeft = spacing.md;
                  }}
                >
                  <a 
                    href="#"
                    style={styles.linkAnchor}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.gray200}
                  >{link}</a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 style={styles.title}>Categorías</h3>
            <ul style={styles.links}>
              {['Técnicas de Estudio', 'Desarrollo Profesional', 'Educación de Calidad', 'Comunidad', 'Herramientas'].map((link, index) => (
                <li 
                  key={index} 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.secondary;
                    e.currentTarget.style.paddingLeft = spacing.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.gray200;
                    e.currentTarget.style.paddingLeft = spacing.md;
                  }}
                >
                  <a 
                    href="#"
                    style={styles.linkAnchor}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.gray200}
                  >{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div style={styles.bottom}>
          <div style={styles.copyright}>
            &copy; {new Date().getFullYear()} EducStation. Todos los derechos reservados.
          </div>
          <div style={styles.bottomLinks}>
            {['Términos', 'Privacidad', 'Cookies'].map((link, index) => (
              <a 
                key={index} 
                href="#" 
                style={{...styles.bottomLink}}
                onMouseEnter={(e) => e.target.style.color = colors.secondary}
                onMouseLeave={(e) => e.target.style.color = colors.gray200}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;