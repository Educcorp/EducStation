// src/pages/CookiesPage.jsx
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';

const CookiesPage = () => {
  // Estado para mostrar/ocultar secciones de cookies
  const [expandedSection, setExpandedSection] = useState(null);

  // Fecha de última actualización
  const lastUpdated = "20 de febrero de 2025";

  // Toggle para expandir/contraer secciones
  const toggleSection = (sectionId) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  // Datos de los tipos de cookies
  const cookieTypes = [
    {
      id: 'essential',
      name: 'Cookies Esenciales',
      description: 'Estas cookies son necesarias para que nuestro sitio web funcione y no pueden ser desactivadas en nuestros sistemas. Generalmente se establecen solo en respuesta a acciones que usted realiza, como establecer sus preferencias de privacidad, iniciar sesión o completar formularios. Puede configurar su navegador para que bloquee o le alerte sobre estas cookies, pero algunas partes del sitio no funcionarán correctamente.',
      examples: [
        { name: 'session_id', purpose: 'Mantiene su sesión activa mientras navega por el sitio.' },
        { name: 'csrf_token', purpose: 'Ayuda a prevenir ataques de falsificación de solicitudes entre sitios.' },
        { name: 'cookie_consent', purpose: 'Guarda sus preferencias sobre el uso de cookies en nuestro sitio.' }
      ]
    },
    {
      id: 'preferences',
      name: 'Cookies de Preferencias',
      description: 'Estas cookies permiten a nuestro sitio web recordar información que cambia la apariencia o el comportamiento del sitio, como su idioma preferido o la región en la que se encuentra. La información que recopilan estas cookies puede ser anonimizada y no pueden rastrear su actividad de navegación en otros sitios web.',
      examples: [
        { name: 'language', purpose: 'Recuerda su preferencia de idioma en nuestro sitio.' },
        { name: 'theme', purpose: 'Almacena su preferencia de tema (claro/oscuro) para el sitio.' },
        { name: 'font_size', purpose: 'Recuerda su configuración de tamaño de texto preferido.' }
      ]
    },
    {
      id: 'statistics',
      name: 'Cookies Estadísticas',
      description: 'Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web recopilando y reportando información de forma anónima. Nos permiten mejorar nuestro sitio basándonos en los patrones de uso y las tendencias observadas.',
      examples: [
        { name: '_ga', purpose: 'Registra una ID única utilizada para generar datos estadísticos sobre cómo utiliza el visitante el sitio (Google Analytics).' },
        { name: '_gid', purpose: 'Registra una ID única utilizada para generar datos estadísticos sobre cómo utiliza el visitante el sitio (Google Analytics).' },
        { name: '_gat', purpose: 'Utilizado por Google Analytics para limitar la tasa de solicitudes.' }
      ]
    },
    {
      id: 'marketing',
      name: 'Cookies de Marketing',
      description: 'Estas cookies son utilizadas para rastrear a los visitantes a través de los sitios web. La intención es mostrar anuncios que sean relevantes y atractivos para el usuario individual, y por lo tanto más valiosos para los editores y anunciantes terceros.',
      examples: [
        { name: 'ads_id', purpose: 'Utilizado para rastrear sus acciones después de hacer clic en un anuncio.' },
        { name: 'social_share', purpose: 'Permite compartir contenido a través de redes sociales.' },
        { name: 'visitor_id', purpose: 'Identifica de forma única a los visitantes para mostrar anuncios personalizados.' }
      ]
    }
  ];

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `${spacing.xxl} ${spacing.md}`,
      fontFamily: typography.fontFamily
    },
    header: {
      textAlign: "center",
      marginBottom: spacing.xxl
    },
    title: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary,
      marginBottom: spacing.md
    },
    lastUpdated: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xl
    },
    introduction: {
      fontSize: typography.fontSize.lg,
      lineHeight: 1.6,
      color: colors.textPrimary,
      marginBottom: spacing.xl,
      maxWidth: "900px",
      margin: "0 auto",
      textAlign: "center"
    },
    section: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      boxShadow: shadows.sm
    },
    sectionTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.primary,
      marginBottom: spacing.lg,
      paddingBottom: spacing.sm,
      borderBottom: `2px solid ${colors.secondary}`
    },
    paragraph: {
      marginBottom: spacing.lg,
      lineHeight: 1.6,
      color: colors.textPrimary
    },
    cookieSection: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
      overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      transition: "box-shadow 0.3s ease"
    },
    cookieHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.md,
      backgroundColor: colors.white,
      cursor: "pointer",
      borderBottom: "1px solid transparent",
      transition: "all 0.3s ease"
    },
    cookieTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary,
      display: "flex",
      alignItems: "center",
      gap: spacing.sm
    },
    cookieIcon: {
      fontSize: "20px",
      transition: "transform 0.3s ease"
    },
    cookieContent: {
      padding: spacing.lg,
      backgroundColor: colors.background + '20',
      borderTop: `1px solid ${colors.gray200}`
    },
    cookieDescription: {
      marginBottom: spacing.lg,
      lineHeight: 1.6
    },
    cookieExamplesTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary,
      marginBottom: spacing.sm
    },
    cookieTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: spacing.md
    },
    tableHeader: {
      backgroundColor: colors.primary + '10',
      color: colors.primary,
      textAlign: "left",
      padding: spacing.sm,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      borderBottom: `2px solid ${colors.secondary + '40'}`
    },
    tableCell: {
      padding: spacing.sm,
      borderBottom: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.sm
    },
    managementSection: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      boxShadow: shadows.sm
    },
    browserSection: {
      marginBottom: spacing.lg
    },
    browserTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary,
      marginBottom: spacing.sm
    },
    link: {
      color: colors.primary,
      textDecoration: "none",
      borderBottom: `1px dotted ${colors.secondary}`,
      transition: "all 0.3s ease",
      fontWeight: typography.fontWeight.medium,
      '&:hover': {
        color: colors.secondary,
        borderBottom: `1px solid ${colors.secondary}`
      }
    },
    contactSection: {
      backgroundColor: colors.primary + '08', // Color primario con baja opacidad
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      marginTop: spacing.xxl,
      textAlign: "center"
    },
    contactTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.primary,
      marginBottom: spacing.md
    }
  };

  return (
    <div style={{ backgroundColor: colors.background }}>
      <Header />
      <main style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Política de Cookies</h1>
          <p style={styles.lastUpdated}>Última actualización: {lastUpdated}</p>
        </div>

        <p style={styles.introduction}>
          En EducStation utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web. Esta política explica cómo las utilizamos, qué tipos de cookies empleamos y cómo puede controlarlas.
        </p>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>¿Qué son las cookies?</h2>
          <p style={styles.paragraph}>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computadora, tablet o teléfono móvil) cuando visita un sitio web. Las cookies son ampliamente utilizadas para hacer que los sitios web funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
          </p>
          <p style={styles.paragraph}>
            Las cookies pueden permanecer en su computadora o dispositivo móvil durante diferentes períodos de tiempo. Algunas cookies son 'cookies de sesión', lo que significa que solo existen cuando su navegador está abierto y se eliminan automáticamente cuando cierra su navegador. Otras son 'cookies persistentes', lo que significa que permanecen después de cerrar su navegador hasta que caducan o hasta que las elimina.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>¿Cómo utilizamos las cookies?</h2>
          <p style={styles.paragraph}>
            Utilizamos cookies por varias razones. Algunas cookies son necesarias por razones técnicas para que nuestro sitio web funcione correctamente, por lo que las llamamos cookies "esenciales" o "estrictamente necesarias". Otras cookies nos permiten rastrear y dirigir los intereses de nuestros usuarios para mejorar la experiencia en nuestro sitio. Terceros sirven cookies a través de nuestro sitio para publicidad, análisis y otras funcionalidades.
          </p>
          <p style={styles.paragraph}>
            En particular, utilizamos cookies para:
          </p>
          <ul style={{ paddingLeft: spacing.xl, marginBottom: spacing.lg, listStyleType: "disc" }}>
            <li style={{ marginBottom: spacing.sm, lineHeight: 1.6 }}>Recordar sus preferencias y configuraciones</li>
            <li style={{ marginBottom: spacing.sm, lineHeight: 1.6 }}>Mantener sus sesiones activas mientras utiliza nuestro sitio</li>
            <li style={{ marginBottom: spacing.sm, lineHeight: 1.6 }}>Entender cómo utiliza nuestro sitio para mejorarlo</li>
            <li style={{ marginBottom: spacing.sm, lineHeight: 1.6 }}>Recopilar analíticas para optimizar el rendimiento de nuestro sitio</li>
            <li style={{ marginBottom: spacing.sm, lineHeight: 1.6 }}>En algunos casos, para proporcionar contenido y anuncios personalizados</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Tipos de cookies que utilizamos</h2>
          <p style={styles.paragraph}>
            A continuación detallamos los tipos de cookies que utilizamos y su propósito. Puede hacer clic en cada tipo para obtener más información.
          </p>

          {cookieTypes.map((cookieType) => (
            <div 
              key={cookieType.id} 
              style={{
                ...styles.cookieSection,
                boxShadow: expandedSection === cookieType.id ? 
                  "0 4px 8px rgba(0,0,0,0.1)" : "0 2px 4px rgba(0,0,0,0.05)"
              }}
            >
              <div 
                style={{
                  ...styles.cookieHeader,
                  borderBottomColor: expandedSection === cookieType.id ? 
                    colors.gray200 : "transparent",
                  backgroundColor: expandedSection === cookieType.id ? 
                    colors.primary + '05' : colors.white
                }}
                onClick={() => toggleSection(cookieType.id)}
              >
                <h3 style={styles.cookieTitle}>
                  <span>{cookieType.name}</span>
                </h3>
                <span 
                  style={{
                    ...styles.cookieIcon,
                    transform: expandedSection === cookieType.id ? 
                      "rotate(180deg)" : "rotate(0deg)"
                  }}
                >
                  ▼
                </span>
              </div>
              
              {expandedSection === cookieType.id && (
                <div style={styles.cookieContent}>
                  <p style={styles.cookieDescription}>{cookieType.description}</p>
                  
                  <h4 style={styles.cookieExamplesTitle}>Ejemplos de cookies utilizadas:</h4>
                  <table style={styles.cookieTable}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Nombre</th>
                        <th style={styles.tableHeader}>Propósito</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cookieType.examples.map((example, index) => (
                        <tr key={index}>
                          <td style={styles.tableCell}><code>{example.name}</code></td>
                          <td style={styles.tableCell}>{example.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </section>

        <section style={styles.managementSection}>
          <h2 style={styles.sectionTitle}>Cómo administrar las cookies</h2>
          <p style={styles.paragraph}>
            Usted tiene el derecho de decidir si acepta o rechaza las cookies. La mayoría de los navegadores web están configurados para aceptar cookies por defecto. Sin embargo, puede cambiar la configuración de su navegador para rechazar o eliminar cookies.
          </p>
          <p style={styles.paragraph}>
            Tenga en cuenta que si elige rechazar las cookies, es posible que no pueda utilizar todas las funcionalidades de nuestro sitio web.
          </p>
          
          <h3 style={{ ...styles.sectionTitle, fontSize: typography.fontSize.lg, marginTop: spacing.xl }}>Configuración de cookies en navegadores populares</h3>
          
          <div style={styles.browserSection}>
            <h4 style={styles.browserTitle}>Google Chrome</h4>
            <p style={{ marginBottom: spacing.sm, lineHeight: 1.6 }}>
              Para gestionar las cookies en Chrome, vaya a "Configuración" &gt; "Privacidad y seguridad" &gt; "Cookies y otros datos de sitios".
              <br />
              <a 
                href="https://support.google.com/chrome/answer/95647" 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.link}
                onMouseEnter={(e) => {
                  e.target.style.color = colors.secondary;
                  e.target.style.borderBottom = `1px solid ${colors.secondary}`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = colors.primary;
                  e.target.style.borderBottom = `1px dotted ${colors.secondary}`;
                }}
              >
                Más información sobre la gestión de cookies en Chrome
              </a>
            </p>
          </div>
          
          <div style={styles.browserSection}>
            <h4 style={styles.browserTitle}>Mozilla Firefox</h4>
            <p style={{ marginBottom: spacing.sm, lineHeight: 1.6 }}>
              Para gestionar las cookies en Firefox, vaya a "Opciones" &gt; "Privacidad y Seguridad" y busque la sección "Cookies y datos del sitio".
              <br />
              <a 
                href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.link}
                onMouseEnter={(e) => {
                  e.target.style.color = colors.secondary;
                  e.target.style.borderBottom = `1px solid ${colors.secondary}`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = colors.primary;
                  e.target.style.borderBottom = `1px dotted ${colors.secondary}`;
                }}
              >
                Más información sobre la gestión de cookies en Firefox
              </a>
            </p>
          </div>
          
          <div style={styles.browserSection}>
            <h4 style={styles.browserTitle}>Safari</h4>
            <p style={{ marginBottom: spacing.sm, lineHeight: 1.6 }}>
              Para gestionar las cookies en Safari, vaya a "Preferencias" &gt; "Privacidad" y busque la sección "Cookies y datos de sitios web".
              <br />
              <a 
                href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.link}
                onMouseEnter={(e) => {
                  e.target.style.color = colors.secondary;
                  e.target.style.borderBottom = `1px solid ${colors.secondary}`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = colors.primary;
                  e.target.style.borderBottom = `1px dotted ${colors.secondary}`;
                }}
              >
                Más información sobre la gestión de cookies en Safari
              </a>
            </p>
          </div>
          
          <div style={styles.browserSection}>
            <h4 style={styles.browserTitle}>Microsoft Edge</h4>
            <p style={{ marginBottom: spacing.sm, lineHeight: 1.6 }}>
              Para gestionar las cookies en Edge, vaya a "Configuración" &gt; "Cookies y permisos del sitio" &gt; "Cookies y datos del sitio".
              <br />
              <a 
                href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.link}
                onMouseEnter={(e) => {
                  e.target.style.color = colors.secondary;
                  e.target.style.borderBottom = `1px solid ${colors.secondary}`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = colors.primary;
                  e.target.style.borderBottom = `1px dotted ${colors.secondary}`;
                }}
              >
                Más información sobre la gestión de cookies en Edge
              </a>
            </p>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Cambios en nuestra Política de Cookies</h2>
          <p style={styles.paragraph}>
            Podemos actualizar nuestra Política de Cookies periódicamente. Cualquier cambio se publicará en esta página con una fecha de actualización revisada. Le recomendamos que revise periódicamente esta página para mantenerse informado sobre cómo utilizamos las cookies.
          </p>
        </section>

        <section style={styles.contactSection}>
          <h2 style={styles.contactTitle}>¿Tiene preguntas sobre nuestra Política de Cookies?</h2>
          <p style={styles.paragraph}>
            Si tiene alguna pregunta o inquietud sobre nuestra Política de Cookies, por favor contáctenos en:
          </p>
          <a 
            href="mailto:cookies@educstation.com" 
            style={styles.link}
            onMouseEnter={(e) => {
              e.target.style.color = colors.secondary;
              e.target.style.borderBottom = `1px solid ${colors.secondary}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = colors.primary;
              e.target.style.borderBottom = `1px dotted ${colors.secondary}`;
            }}
          >
            cookies@educstation.com
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPage;