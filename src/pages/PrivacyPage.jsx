// src/pages/PrivacyPage.jsx
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { spacing, typography, shadows, borderRadius } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

const PrivacyPage = () => {
  // Fecha de última actualización
  const lastUpdated = "15 de febrero de 2025";
  const { colors } = useTheme(); // Obtenemos los colores del tema actual

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
    list: {
      paddingLeft: spacing.xl,
      marginBottom: spacing.lg,
      listStyleType: "disc"
    },
    listItem: {
      marginBottom: spacing.md,
      lineHeight: 1.6,
      color: colors.textSecondary
    },
    emphasis: {
      fontWeight: typography.fontWeight.medium,
      color: colors.primary
    },
    dataCategory: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary,
      marginBottom: spacing.sm,
      marginTop: spacing.lg
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
          <h1 style={styles.title}>Política de Privacidad</h1>
          <p style={styles.lastUpdated}>Última actualización: {lastUpdated}</p>
        </div>

        <p style={styles.introduction}>
          En EducStation, valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos y compartimos su información personal cuando visita y utiliza nuestra plataforma.
        </p>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Información que Recopilamos</h2>
          <p style={styles.paragraph}>
            Recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios:
          </p>

          <h3 style={styles.dataCategory}>Información que usted nos proporciona:</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Información de la cuenta:</strong> Cuando se registra en EducStation, recopilamos su nombre, dirección de correo electrónico, contraseña y, opcionalmente, su fotografía de perfil.
            </li>
            <li style={styles.listItem}>
              <strong>Información de perfil:</strong> Puede optar por proporcionar información adicional como su título profesional, institución educativa, biografía y áreas de interés.
            </li>
            <li style={styles.listItem}>
              <strong>Contenido generado por el usuario:</strong> Recopilamos el contenido que usted crea, publica o comparte en nuestra plataforma, incluidos artículos, comentarios y mensajes.
            </li>
            <li style={styles.listItem}>
              <strong>Comunicaciones:</strong> Cuando se comunica con nosotros, guardamos registros de esas comunicaciones.
            </li>
          </ul>

          <h3 style={styles.dataCategory}>Información recopilada automáticamente:</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Información de uso:</strong> Recopilamos información sobre cómo interactúa con nuestros servicios, como las páginas que visita, el tiempo que pasa en ellas y las características que utiliza.
            </li>
            <li style={styles.listItem}>
              <strong>Información del dispositivo:</strong> Recopilamos información sobre el dispositivo que utiliza para acceder a nuestros servicios, incluido el modelo de hardware, sistema operativo, identificadores únicos y datos de la red móvil.
            </li>
            <li style={styles.listItem}>
              <strong>Información de registro:</strong> Nuestros servidores registran automáticamente cierta información, como su dirección IP, tipo de navegador, páginas de referencia/salida, sistema operativo, fecha/hora y clics.
            </li>
          </ul>

          <h3 style={styles.dataCategory}>Información de terceros:</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Redes sociales:</strong> Si elige conectar su cuenta de EducStation con una cuenta de redes sociales, podemos recopilar información de esa red social, como su nombre, correo electrónico y otra información que haya hecho pública.
            </li>
            <li style={styles.listItem}>
              <strong>Socios:</strong> Podemos recibir información sobre usted de nuestros socios comerciales y de servicios, como proveedores de análisis de datos y redes publicitarias.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Cómo Utilizamos Su Información</h2>
          <p style={styles.paragraph}>
            Utilizamos la información que recopilamos para los siguientes propósitos:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Proporcionar y mantener nuestros servicios:</strong> Para gestionar su cuenta, entregar el contenido solicitado y permitir la interacción con nuestras funciones y otros usuarios.
            </li>
            <li style={styles.listItem}>
              <strong>Mejorar y desarrollar nuestros servicios:</strong> Para entender cómo se utilizan nuestros servicios, identificar áreas de mejora y desarrollar nuevas características.
            </li>
            <li style={styles.listItem}>
              <strong>Personalizar su experiencia:</strong> Para ofrecer contenido, recomendaciones y funciones adaptadas a sus intereses y preferencias.
            </li>
            <li style={styles.listItem}>
              <strong>Comunicarnos con usted:</strong> Para enviarle actualizaciones, notificaciones, información administrativa y boletines que ha solicitado.
            </li>
            <li style={styles.listItem}>
              <strong>Garantizar la seguridad:</strong> Para verificar cuentas, prevenir y abordar actividades fraudulentas, no autorizadas o ilegales.
            </li>
            <li style={styles.listItem}>
              <strong>Cumplimiento legal:</strong> Para cumplir con las obligaciones legales y resolver cualquier disputa.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Cómo Compartimos Su Información</h2>
          <p style={styles.paragraph}>
            No vendemos su información personal a terceros. Sin embargo, podemos compartir su información en las siguientes circunstancias:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Con otros usuarios:</strong> La información de su perfil, como su nombre, foto, biografía y contenido que publica, está visible para otros usuarios de la plataforma según su configuración de privacidad.
            </li>
            <li style={styles.listItem}>
              <strong>Con proveedores de servicios:</strong> Compartimos información con proveedores de servicios que nos ayudan a operar, mantener y mejorar nuestros servicios, como proveedores de alojamiento, análisis, atención al cliente y marketing.
            </li>
            <li style={styles.listItem}>
              <strong>Con afiliados corporativos:</strong> Podemos compartir información con nuestras subsidiarias y afiliadas para propósitos consistentes con esta política.
            </li>
            <li style={styles.listItem}>
              <strong>Por razones legales:</strong> Podemos divulgar información si creemos de buena fe que es necesario para cumplir con una obligación legal, proteger los derechos o la seguridad de EducStation, nuestros usuarios o el público.
            </li>
            <li style={styles.listItem}>
              <strong>Con su consentimiento:</strong> Compartiremos su información personal para cualquier otro propósito con su consentimiento.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Sus Derechos y Opciones</h2>
          <p style={styles.paragraph}>
            Respetamos sus derechos sobre sus datos personales y le proporcionamos opciones y controles:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Acceso y actualización:</strong> Puede acceder y actualizar la información de su cuenta a través de la configuración de su perfil.
            </li>
            <li style={styles.listItem}>
              <strong>Eliminación de datos:</strong> Puede solicitar la eliminación de su cuenta y datos personales.
            </li>
            <li style={styles.listItem}>
              <strong>Opciones de comunicación:</strong> Puede optar por no recibir correos electrónicos de marketing siguiendo las instrucciones de cancelación de suscripción en los mensajes.
            </li>
            <li style={styles.listItem}>
              <strong>Configuración de cookies:</strong> Puede gestionar sus preferencias de cookies a través de la configuración de su navegador.
            </li>
            <li style={styles.listItem}>
              <strong>Ejercicio de derechos:</strong> Según la legislación aplicable, puede tener derechos adicionales, como el derecho a la portabilidad de datos o a objetar el procesamiento.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Seguridad de los Datos</h2>
          <p style={styles.paragraph}>
            La seguridad de su información es importante para nosotros. Implementamos medidas técnicas, administrativas y físicas diseñadas para proteger su información personal contra el acceso, el uso o la divulgación no autorizados.
          </p>
          <p style={styles.paragraph}>
            Sin embargo, ningún sistema de seguridad es completamente impenetrable, y no podemos garantizar la seguridad absoluta de nuestra base de datos, ni podemos garantizar que la información que proporcione no será interceptada mientras se transmite a través de Internet.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Retención de Datos</h2>
          <p style={styles.paragraph}>
            Conservamos su información personal mientras sea necesario para proporcionar los servicios que ha solicitado, cumplir con nuestras obligaciones legales, resolver disputas y hacer cumplir nuestros acuerdos.
          </p>
          <p style={styles.paragraph}>
            Cuando ya no necesitemos usar su información personal, la eliminaremos de nuestros sistemas o la anonimizaremos para que ya no pueda identificarlo.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Menores</h2>
          <p style={styles.paragraph}>
            Nuestros servicios no están dirigidos a personas menores de 16 años, y no recopilamos a sabiendas información personal de niños menores de 16 años. Si descubrimos que un niño menor de 16 años nos ha proporcionado información personal, tomaremos medidas para eliminar dicha información.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Cambios a Esta Política</h2>
          <p style={styles.paragraph}>
            Podemos actualizar esta Política de Privacidad periódicamente. Publicaremos cualquier cambio en esta página y, si los cambios son significativos, proporcionaremos un aviso más prominente.
          </p>
          <p style={styles.paragraph}>
            Le recomendamos que revise nuestra Política de Privacidad periódicamente para mantenerse informado sobre cómo protegemos su información.
          </p>
        </section>

        <section style={styles.contactSection}>
          <h2 style={styles.contactTitle}>¿Tiene preguntas sobre nuestra Política de Privacidad?</h2>
          <p style={styles.paragraph}>
            Si tiene alguna pregunta o inquietud sobre nuestra Política de Privacidad o prácticas de datos, por favor contáctenos en:
          </p>
          <a 
            href="mailto:privacidad@educstation.com" 
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
            privacidad@educstation.com
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;