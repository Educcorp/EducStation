// src/pages/TermsPage.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { spacing, typography, shadows, borderRadius } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

const TermsPage = () => {
  // Fecha de última actualización
  const lastUpdated = "10 de febrero de 2025";
  const { colors } = useTheme(); // Obtenemos los colores del tema actual
  const location = useLocation();

  // Recarga forzada al entrar (solo una vez por sesión)
  useEffect(() => {
    if (location.state && location.state.forceReload) {
      // Verificar si ya se realizó la recarga en esta sesión de navegación
      if (!sessionStorage.getItem('termspage-reloaded')) {
        // Marcar que se va a realizar la recarga
        sessionStorage.setItem('termspage-reloaded', 'true');
        // Limpiar el estado para evitar bucles infinitos
        window.history.replaceState(null, '', window.location.pathname);
        // Realizar la recarga
        window.location.reload();
      }
    } else {
      // Limpiar la marca de recarga si no hay forceReload
      sessionStorage.removeItem('termspage-reloaded');
    }
  }, [location]);

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
    list: {
      paddingLeft: spacing.xl,
      marginBottom: spacing.lg,
      listStyleType: "disc"
    },
    listItem: {
      marginBottom: spacing.md,
      lineHeight: 1.6,
      color: colors.textSecondary // Define el color del texto de los elementos de la lista
    },
    numberedList: {
      paddingLeft: spacing.xl,
      marginBottom: spacing.lg,
      listStyleType: "decimal"
    },
    emphasis: {
      fontWeight: typography.fontWeight.medium,
      color: colors.primary 
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
    },
    contactEmail: {
      color: colors.primary,
      fontWeight: typography.fontWeight.medium,
      textDecoration: "none",
      borderBottom: `1px dotted ${colors.secondary}`,
      transition: "all 0.3s ease",
      '&:hover': {
        color: colors.secondary,
        borderBottom: `1px solid ${colors.secondary}`
      }
    }
  };

  return (
    <div style={{ backgroundColor: colors.background }}>
      <Header />
      <main style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Términos y Condiciones de Uso</h1>
          <p style={styles.lastUpdated}>Última actualización: {lastUpdated}</p>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Introducción</h2>
          <p style={styles.paragraph}>
            Bienvenido a <span style={styles.emphasis}>EducStation</span>. Estos Términos y Condiciones rigen su acceso y uso de la plataforma EducStation, incluyendo cualquier contenido, funcionalidad y servicios ofrecidos en o a través de educstation.com.
          </p>
          <p style={styles.paragraph}>
            Al utilizar nuestro sitio, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con estos términos, por favor absténgase de utilizar nuestro sitio.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Uso del Sitio</h2>
          <p style={styles.paragraph}>
            EducStation es una plataforma educativa diseñada para proporcionar recursos, información y herramientas para educadores y estudiantes. Usted se compromete a utilizar el sitio solo con fines legales y de acuerdo con estos Términos y Condiciones.
          </p>
          <p style={styles.paragraph}>
            Específicamente, usted se compromete a no:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Utilizar el sitio de manera que pueda dañar, deshabilitar o sobrecargar la plataforma.</li>
            <li style={styles.listItem}>Utilizar robots, spiders u otros dispositivos automáticos para acceder al sitio con fines no autorizados.</li>
            <li style={styles.listItem}>Violar cualquier normativa aplicable, incluidas las leyes de derechos de autor y propiedad intelectual.</li>
            <li style={styles.listItem}>Publicar o transmitir contenido ilegal, amenazante, abusivo, difamatorio, obsceno o de carácter ofensivo.</li>
            <li style={styles.listItem}>Hacerse pasar por otra persona o entidad, o falsificar su afiliación con una persona o entidad.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Cuentas de Usuario</h2>
          <p style={styles.paragraph}>
            Al crear una cuenta en EducStation, usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y de restringir el acceso a su computadora. Usted acepta la responsabilidad por todas las actividades que ocurran bajo su cuenta.
          </p>
          <p style={styles.paragraph}>
            Nos reservamos el derecho de cancelar o modificar su cuenta si determinamos, a nuestra discreción, que ha violado estos Términos y Condiciones.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Propiedad Intelectual</h2>
          <p style={styles.paragraph}>
            El contenido, las características y la funcionalidad de EducStation, incluyendo pero no limitado a texto, gráficos, logotipos, íconos, imágenes, clips de audio, descargas digitales y software, son propiedad de EducCorp o sus proveedores de contenido y están protegidos por leyes internacionales de derechos de autor, marcas comerciales, patentes y otros derechos de propiedad intelectual.
          </p>
          <p style={styles.paragraph}>
            La recopilación, organización y montaje de todo el contenido en este sitio es propiedad exclusiva de EducCorp y está protegida por leyes internacionales de derechos de autor.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Contenido del Usuario</h2>
          <p style={styles.paragraph}>
            Al enviar, publicar o mostrar contenido en EducStation, usted otorga a EducCorp una licencia mundial, no exclusiva, libre de regalías, transferible y sublicenciable para usar, reproducir, modificar, adaptar, publicar, traducir, crear obras derivadas, distribuir y mostrar dicho contenido.
          </p>
          <p style={styles.paragraph}>
            Usted declara y garantiza que:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Es el creador y propietario del contenido que publica o tiene los derechos y licencias necesarios para otorgar los derechos otorgados a EducCorp.</li>
            <li style={styles.listItem}>El contenido no infringe ni violará los derechos de terceros, incluidos los derechos de autor, marca registrada, privacidad, publicidad u otros derechos personales o de propiedad.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Limitación de Responsabilidad</h2>
          <p style={styles.paragraph}>
            En ningún caso EducCorp, sus directores, empleados o agentes serán responsables de daños directos, indirectos, incidentales, especiales, punitivos o consecuentes que surjan de o estén relacionados con su uso o incapacidad para usar el sitio o cualquier contenido o servicio obtenido a través del sitio.
          </p>
          <p style={styles.paragraph}>
            EducStation se proporciona "tal cual" y "según disponibilidad", sin garantías de ningún tipo, ya sean expresas o implícitas.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Indemnización</h2>
          <p style={styles.paragraph}>
            Usted acepta defender, indemnizar y mantener indemne a EducCorp, sus afiliados, licenciantes y proveedores de servicios, y sus respectivos funcionarios, directores, empleados, contratistas, agentes, licenciantes, proveedores, sucesores y cesionarios de y contra cualquier reclamo, responsabilidad, daño, juicio, adjudicación, pérdida, costo, gasto o tarifa (incluidos honorarios razonables de abogados) que surjan de o estén relacionados con su incumplimiento de estos Términos y Condiciones.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Modificaciones</h2>
          <p style={styles.paragraph}>
            EducCorp se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio. Es su responsabilidad revisar periódicamente estos Términos y Condiciones.
          </p>
          <p style={styles.paragraph}>
            El uso continuado del sitio después de la publicación de cambios constituirá su aceptación de dichos cambios.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Ley Aplicable</h2>
          <p style={styles.paragraph}>
            Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de México, sin tener en cuenta sus principios de conflicto de leyes.
          </p>
          <p style={styles.paragraph}>
            Cualquier acción legal relacionada con estos Términos y Condiciones se presentará exclusivamente en los tribunales federales o estatales ubicados en México, y usted acepta someterse a la jurisdicción personal de dichos tribunales.
          </p>
        </section>

        <section style={styles.contactSection}>
          <h2 style={styles.contactTitle}>¿Tiene preguntas sobre nuestros Términos y Condiciones?</h2>
          <p style={styles.paragraph}>
            Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos en:
          </p>
          <a 
            href="mailto:terminos@educstation.com" 
            style={styles.contactEmail}
            onMouseEnter={(e) => {
              e.target.style.color = colors.secondary;
              e.target.style.borderBottom = `1px solid ${colors.secondary}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = colors.primary;
              e.target.style.borderBottom = `1px dotted ${colors.secondary}`;
            }}
          >
            terminos@educstation.com
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;