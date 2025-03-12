// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../styles/theme';

const ContactPage = () => {
  // Estado para el formulario
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
      content: 'Av. Educación 123, Ciudad Digital, 28080'
    },
    {
      icon: '📧',
      title: 'Email',
      content: 'contacto@educstation.com'
    },
    {
      icon: '☎️',
      title: 'Teléfono',
      content: '+34 91 123 4567'
    },
    {
      icon: '🕒',
      title: 'Horario',
      content: 'Lunes a Viernes: 9:00 - 18:00'
    }
  ];
  
  // Preguntas frecuentes
  const faqs = [
    {
      question: '¿Cómo puedo colaborar con EducStation?',
      answer: 'Ofrecemos diferentes formas de colaboración: puedes enviar artículos para publicar, participar como revisor de contenidos o proponer webinars y eventos. Contacta con nosotros para más detalles.'
    },
    {
      question: '¿Ofrecen certificados para los cursos?',
      answer: 'Sí, todos nuestros cursos incluyen un certificado digital al completarlos satisfactoriamente. Estos certificados son verificables a través de nuestra plataforma.'
    },
    {
      question: '¿Tienen recursos para educación primaria?',
      answer: 'Absolutamente. Contamos con una amplia biblioteca de recursos clasificados por nivel educativo, desde infantil hasta educación superior, con un fuerte énfasis en primaria y secundaria.'
    },
    {
      question: '¿Cómo puedo reportar un problema técnico?',
      answer: 'Para reportar problemas técnicos, puedes utilizar este formulario de contacto seleccionando "Soporte Técnico" en el campo de asunto, o escribir directamente a soporte@educstation.com.'
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
      background: `linear-gradient(135deg, ${colors.white}20 0%, ${colors.secondary}20 100%)`,
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
            <h1 style={styles.title}>Contáctanos</h1>
            <p style={styles.subtitle}>
              Estamos aquí para ayudarte. Si tienes preguntas, sugerencias o comentarios, 
              no dudes en ponerte en contacto con nosotros. Respondemos a todas las consultas 
              en un plazo máximo de 48 horas.
            </p>
          </div>
        </section>
        
        <div style={styles.container}>
          {/* Contact Info and Form */}
          <div style={styles.contentWrapper}>
            {/* Contact Info Section */}
            <div style={styles.contactInfoSection}>
              <h2 style={{...styles.sectionTitle, '&:after': {...styles.sectionTitle['&:after'], content: '""'}}}>
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
                  src="https://maps.google.com/maps?q=Madrid,Spain&z=13&output=embed" 
                  style={styles.map} 
                  title="Mapa de ubicación"
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            
            {/* Contact Form Section */}
            <div style={styles.formSection}>
              <h2 style={{...styles.sectionTitle, '&:after': {...styles.sectionTitle['&:after'], content: '""'}}}>
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
                      style={styles.input}
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
                      style={styles.input}
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
                    style={styles.select}
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
                    style={styles.textarea}
                    placeholder="¿Cómo podemos ayudarte?"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  style={styles.submitButton}
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
                      e.currentTarget.style.color = colors.primary;
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
          <section style={styles.faqSection}>
            <h2 style={{...styles.sectionTitle, '&:after': {...styles.sectionTitle['&:after'], content: '""'}}}>
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