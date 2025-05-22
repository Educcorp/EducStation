// src/pages/ContactPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { spacing, typography, shadows, borderRadius, transitions } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import '../styles/animations.css';

const ContactPage = () => {
  // Estado para el formulario
  const [animate, setAnimate] = useState(false);
  const { colors, isDarkMode } = useTheme(); // Obtenemos los colores del tema actual

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 0); // Activa la animación al montar el componente
    return () => clearTimeout(timeout); // Limpia el timeout al desmontar
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Estado para gestionar el envío del formulario
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });

  const sendEmail = async (templateParams) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: templateParams.from_name,
          email: templateParams.from_email,
          subject: templateParams.subject,
          message: templateParams.message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar mensaje');
      }

      return data;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  };

  // Manejar los cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.name || !formData.email || !formData.message || !formData.subject) {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Por favor, completa todos los campos obligatorios.'
      });
      return;
    }

    // Simulación de envío
    setFormStatus({
      submitting: true,
      success: false,
      error: false,
      message: ''
    });

    // Simular una petición a un servidor (reemplazar con llamada real a API)
    setTimeout(() => {
      setFormStatus({
        submitting: false,
        success: true,
        error: false,
        message: 'Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.'
      });

      // Reiniciar el formulario
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Reiniciar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setFormStatus({
          submitting: false,
          success: false,
          error: false,
          message: ''
        });
      }, 5000);
    }, 1500);
  };

  // Datos de información de contacto
  const contactInfo = [
    {
      icon: '📍',
      title: 'Ubicación',
      content: 'Facultad de Ingeniería Electromecánica, UCOL, Colima, México'
    },
    {
      icon: '📧',
      title: 'Email',
      content: 'educcorp3@gmail.com'
    },
    {
      icon: '☎️',
      title: 'Teléfono',
      content: '+314 331 1207'
    },
    {
      icon: '🕒',
      title: 'Horario',
      content: 'Lunes a Viernes: 7:00 - 22:00'
    }
  ];

  // Preguntas frecuentes
  const faqs = [
    {
      question: '¿Cómo puedo colaborar con EducStation?',
      answer: 'Puedes colaborar con la página dejando tus comentarios en nuestros posts, además de enviandonos tus preguntas en el apartado de contactos.'
    },
    {
      question: '¿Tienen recursos relacionados a las técnicas de estudio?',
      answer: '!Sí! Aquí en EducStation contamos con varias guías y herramientas con las cuales puedes mejorar tus métodos de estudio.'
    },
    {
      question: '¿Podre encontrar información reciente aqui?',
      answer: '!Sí! Aquí en EdcuStation nos aseguramos de siempre tener a la mano las noticias recientes más relevantes del momento relacionadas a la educación.'
    },
    {
      question: '¿Cómo puedo reportar un problema técnico?',
      answer: 'Para reportar problemas técnicos, puedes escribirnos directamente a soporte@educstation.com, responderemos en un plazo de 48hrs.'
    }
  ];

  // Estado para gestionar las FAQ abiertas
  const [openFaq, setOpenFaq] = useState(null);

  // Manejar apertura de FAQ
  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  // Estilos CSS
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `0 ${spacing.md}`
    },
    hero: {
      textAlign: "center",
      padding: `${spacing.xxl} 0`,
      background: `linear-gradient(100deg, ${colors.white}99 100%, ${colors.secondary}99 100%)`,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.xxl,
      marginTop: spacing.xl
    },
    title: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.md,
      color: colors.primary
    },
    subtitle: {
      fontSize: typography.fontSize.lg,
      color: colors.textSecondary,
      maxWidth: "800px",
      margin: "0 auto",
      lineHeight: 1.6
    },
    contentWrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: spacing.xxl,
      marginBottom: spacing.xxl,
      '@media (max-width: 768px)': {
        gridTemplateColumns: "1fr"
      }
    },
    contactInfoSection: {
      padding: spacing.xl,
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.md,
      height: "fit-content"
    },
    contactGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: spacing.lg,
      '@media (max-width: 500px)': {
        gridTemplateColumns: "1fr"
      }
    },
    contactCard: {
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      backgroundColor: "rgba(11, 68, 68, 0.05)",
      transition: transitions.default,
      '&:hover': {
        backgroundColor: "rgba(210, 185, 154, 0.15)",
        transform: "translateY(-5px)"
      }
    },
    contactIcon: {
      fontSize: "32px",
      marginBottom: spacing.sm
    },
    contactTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.xs,
      color: colors.primary
    },
    contactContent: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary
    },
    mapContainer: {
      marginTop: spacing.xl,
      borderRadius: borderRadius.md,
      overflow: "hidden",
      height: "250px",
      backgroundColor: colors.gray200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: colors.textSecondary
    },
    formSection: {
      padding: spacing.xl,
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.md
    },
    sectionTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.xl,
      position: "relative",
      paddingBottom: spacing.sm,
      color: colors.primary,
      '&:after': {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "60px",
        height: "3px",
        backgroundColor: colors.secondary
      }
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.lg
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: spacing.lg,
      '@media (max-width: 500px)': {
        gridTemplateColumns: "1fr"
      }
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.xs
    },
    label: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary
    },
    input: {
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.md,
      transition: transitions.default,
      '&:focus': {
        outline: "none",
        borderColor: colors.primary,
        boxShadow: `0 0 0 2px rgba(11, 68, 68, 0.1)`
      }
    },
    select: {
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.md,
      transition: transitions.default,
      '&:focus': {
        outline: "none",
        borderColor: colors.primary,
        boxShadow: `0 0 0 2px rgba(11, 68, 68, 0.1)`
      }
    },
    textarea: {
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.md,
      minHeight: "150px",
      resize: "vertical",
      transition: transitions.default,
      '&:focus': {
        outline: "none",
        borderColor: colors.primary,
        boxShadow: `0 0 0 2px rgba(11, 68, 68, 0.1)`
      }
    },
    submitButton: {
      padding: `${spacing.md} ${spacing.xl}`,
      backgroundColor: colors.secondary,
      color: colors.primary,
      border: "none",
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      transition: transitions.default,
      alignSelf: "flex-start",
      '&:hover': {
        backgroundColor: colors.primary,
        color: colors.white
      },
      '&:disabled': {
        backgroundColor: colors.gray300,
        cursor: "not-allowed"
      }
    },
    formMessage: {
      padding: spacing.md,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      marginTop: spacing.md
    },
    successMessage: {
      backgroundColor: "rgba(76, 121, 119, 0.1)",
      color: colors.primary,
      border: `1px solid ${colors.primaryLight}`,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      marginTop: spacing.md
    },
    errorMessage: {
      backgroundColor: "rgba(210, 185, 154, 0.1)",
      color: colors.secondary,
      border: `1px solid ${colors.secondary}`,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      marginTop: spacing.md
    },
    faqSection: {
      marginTop: spacing.xxl,
      marginBottom: spacing.xxl
    },
    faqList: {
      display: "flex",
      flexDirection: "column",
      gap: spacing.lg
    },
    faqItem: {
      padding: spacing.lg,
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
      transition: transitions.default,
      '&:hover': {
        boxShadow: shadows.md
      }
    },
    faqQuestion: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.primary,
      marginBottom: spacing.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer"
    },
    faqAnswer: {
      fontSize: typography.fontSize.md,
      color: colors.textSecondary,
      lineHeight: 1.6,
      borderTop: `1px solid ${colors.gray200}`,
      paddingTop: spacing.md,
      marginTop: spacing.md
    },
    map: {
      width: "100%",
      height: "100%",
      border: "none"
    },
    required: {
      color: colors.secondary,
      marginLeft: spacing.xs
    }
  };

  return (

    <div style={{ fontFamily: typography.fontFamily, backgroundColor: colors.background }}>
      <Header />
      <main>
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.container}>
            <h1
              className={animate ? "page-animation" : ""}
              style={styles.title}>Contáctanos</h1>
            <p
              className={animate ? "page-animation" : ""}
              style={styles.subtitle}>
              Estamos aquí para ayudarte. Resolveremos cualquier incognita que tengas relacionada con nuestro blog,
              No dudes en contactarte con nosotros!. Respondemos a todas las consultas
              en un plazo máximo de 48 horas.
            </p>
          </div>
        </section>

        <div style={styles.container}>
          {/* Contact Info and Form */}
          <div style={styles.contentWrapper}>
            {/* Contact Info Section */}
            <div style={styles.contactInfoSection}>
              <h2 style={{ ...styles.sectionTitle, '&:after': { ...styles.sectionTitle['&:after'], content: '""' } }}>
                Información de Contacto
                <span style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "60px",
                  height: "3px",
                  backgroundColor: colors.secondary
                }}></span>
              </h2>

              <div style={styles.contactGrid}>
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    style={styles.contactCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(210, 185, 154, 0.15)";
                      e.currentTarget.style.transform = "translateY(-5px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(11, 68, 68, 0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={styles.contactIcon}>{info.icon}</div>
                    <h3 style={styles.contactTitle}>{info.title}</h3>
                    <div style={styles.contactContent}>{info.content}</div>
                  </div>
                ))}
              </div>

              <div style={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.6293535527034!2d-104.40488172201485!3d19.123909435912225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84255a99f51cf4b5%3A0x71073f9935f08f0a!2sFacultad%20de%20Ingenier%C3%ADa%20Electromec%C3%A1nica%20(FIE)!5e0!3m2!1sen!2sus!4v1741748318372!5m2!1sen!2sus"
                  style={styles.map}
                  title="Mapa de ubicación"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Contact Form Section */}
            <div id="contact-from" style={styles.formSection}> {/* Añadir id="middle" para enlazar con el botón de scroll */}
              <h2 style={{ ...styles.sectionTitle, '&:after': { ...styles.sectionTitle['&:after'], content: '""' } }}>
                Envíanos un Mensaje
                <span style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "60px",
                  height: "3px",
                  backgroundColor: colors.secondary
                }}></span>
              </h2>

              <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="name">
                      Nombre <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        backgroundColor: isDarkMode ? '#333' : colors.white,
                        color: isDarkMode ? '#fff' : colors.textPrimary,
                        border: `1px solid ${isDarkMode ? '#555' : colors.gray200}`
                      }}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="email">
                      Email <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        backgroundColor: isDarkMode ? '#333' : colors.white,
                        color: isDarkMode ? '#fff' : colors.textPrimary,
                        border: `1px solid ${isDarkMode ? '#555' : colors.gray200}`
                      }}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="subject">
                    Asunto<span style={styles.required}>*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    style={{
                      ...styles.select,
                      backgroundColor: isDarkMode ? '#333' : colors.white,
                      color: isDarkMode ? '#fff' : colors.textPrimary,
                      border: `1px solid ${isDarkMode ? '#555' : colors.gray200}`
                    }}
                    required
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="Información general">Información general</option>
                    <option value="Soporte técnico">Soporte técnico</option>
                    <option value="Colaboración">Colaboración</option>
                    <option value="Sugerencias">Sugerencias</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="message">
                    Mensaje <span style={styles.required}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                      ...styles.textarea,
                      backgroundColor: isDarkMode ? '#333' : colors.white,
                      color: isDarkMode ? '#fff' : colors.textPrimary,
                      border: `1px solid ${isDarkMode ? '#555' : colors.gray200}`
                    }}
                    placeholder="¿Cómo podemos ayudarte?"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  style={{
                    ...styles.submitButton,
                    // Hacer el texto más oscuro en modo oscuro para que resalte mejor
                    color: isDarkMode ? '#0a1919' : colors.primary
                  }}
                  disabled={formStatus.submitting}
                  onMouseEnter={(e) => {
                    if (!formStatus.submitting) {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.color = colors.white;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!formStatus.submitting) {
                      e.currentTarget.style.backgroundColor = colors.secondary;
                      // Restaurar al color original según el modo
                      e.currentTarget.style.color = isDarkMode ? '#0a1919' : colors.primary;
                    }
                  }}
                >
                  {formStatus.submitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>

                {formStatus.success && (
                  <div style={styles.successMessage}>
                    {formStatus.message}
                  </div>
                )}

                {formStatus.error && (
                  <div style={styles.errorMessage}>
                    {formStatus.message}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <section id="faq-section" style={styles.faqSection}>
            <h2 style={{ ...styles.sectionTitle, '&:after': { ...styles.sectionTitle['&:after'], content: '""' } }}>
              Preguntas Frecuentes
              <span style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "60px",
                height: "3px",
                backgroundColor: colors.secondary
              }}></span>
            </h2>

            <div style={styles.faqList}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={styles.faqItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = shadows.sm;
                  }}
                >
                  <div
                    style={styles.faqQuestion}
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    <span>{openFaq === index ? '−' : '+'}</span>
                  </div>

                  {openFaq === index && (
                    <div style={styles.faqAnswer}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;