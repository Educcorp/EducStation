// src/pages/AboutPage.jsx
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';

const AboutPage = () => {
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
    section: {
      marginBottom: spacing.xxl,
      backgroundColor: colors.white,
      padding: spacing.xl,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm
    },
    sectionTitle: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.xl,
      position: "relative",
      paddingBottom: spacing.sm,
      color: colors.primary
    },
    content: {
      fontSize: typography.fontSize.md,
      color: colors.textSecondary,
      lineHeight: 1.6
    },
    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: spacing.lg,
      marginBottom: spacing.xxl,
      '@media (max-width: 768px)': {
        gridTemplateColumns: "repeat(2, 1fr)"
      }
    },
    statItem: {
      textAlign: "center",
      padding: spacing.lg,
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm
    },
    statNumber: {
      fontSize: "48px",
      fontWeight: typography.fontWeight.bold,
      color: colors.primary,
      marginBottom: spacing.sm
    },
    statLabel: {
      fontSize: typography.fontSize.md,
      color: colors.textSecondary
    },
    timeline: {
      position: "relative",
      maxWidth: "800px",
      margin: "0 auto",
      paddingLeft: spacing.xxl,
      '&:before': {
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "20px",
        width: "2px",
        backgroundColor: colors.secondary
      }
    },
    timelineItem: {
      position: "relative",
      marginBottom: spacing.xl,
      padding: spacing.lg,
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm
    },
    timelineYear: {
      position: "absolute",
      left: "-50px",
      top: "50px",
      width: "40px",
      height: "40px",
      backgroundColor: colors.secondary,
      color: colors.primary,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: typography.fontWeight.bold,
      boxShadow: shadows.sm
    },
    timelineTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.sm,
      color: colors.primary
    },
    team: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: spacing.xl,
      marginTop: spacing.xl
    },
    teamMember: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      overflow: "hidden",
      boxShadow: shadows.sm,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      '&:hover': {
        transform: "translateY(-10px)",
        boxShadow: shadows.lg
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    teamImage: {
      width: "100%",
      height: "250px",
      objectFit: "cover"
    },
    teamInfo: {
      padding: spacing.lg,
      textAlign: "center"
    },
    teamName: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.xs,
      color: colors.primary
    },
    teamRole: {
      fontSize: typography.fontSize.sm,
      color: colors.secondary,
      marginBottom: spacing.md,
      fontWeight: typography.fontWeight.medium
    },
    teamBio: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 1.6
    }
  };

  // Datos del equipo
  const teamMembers = [
    {
      name: 'Damian Valencia',
      role: 'Desarrollador Web',
      image: '/assets/images/educstation-logo.png', // Ruta relativa correcta
      bio: 'Se ocupa de de metodologias y estrategias para manejar el aprendizaje y los habitos de estudio.'
    },
    {
      name: 'Fernanda Zepeda',
      role: 'Desarrollador Web',
      image: '/assets/images/educstation-logo.png',
      bio: 'Encargado de recopilar, redactar o presentar noticias relevantes del ODS 4.'
    },
    {
      name: 'Emmanuel Palacios',
      role: 'Desarrollador Web',
      image: '/assets/images/educstation-logo.png',
      bio: 'Aborda problematicas en el estudio - Analiza dificultades, obstaculos o desafios que enfrentan los estudiantes durante su proceso de aprendizaje.'
    },
    {
      name: 'Priscila Lopez',
      role: 'Desarrollador Web',
      image: '/assets/images/educstation-logo.png',
      bio: 'Se enfoca en Educacion de Calidad.'
    },
    {
      name: 'Yoselin Reynaga',
      role: 'Desarrollador Web',
      image: '/assets/images/educstation-logo.png',
      bio: 'Encargada del desarrollo profesional docente.'
    },
    {
      name: 'Gregorio Sánchez',
      role: 'Desarrollador Web',
      image: '/assets/images/educstation-logo.png',
      bio: 'Maneja Herramientas tecnologicas - Se especializa en recursos digitales, aplicaciones o plataformas que apoyan al proceso educativo.'
    },
    {
      name: 'Ruben Lavariega',
      role: 'Desarrollador Web',
      image: '/assets/images/educstation-logo.png',
      bio: 'Promueve la participacion colectiva, trabajo en equipo y construccion de redes entre diversos actores educativos.'
    }
  ];

  // Datos de timeline
  const timelineEvents = [
    { year: '1', title: 'Expandir Orizontes', description: 'Buscamos hacer llegar a mas gente la importancia de recibir una buena educacion de calidad.' },
    { year: '2', title: 'Impulsar el progreso', description: 'Motivaremos a los docentes y alumnos a que integren las nuevas tecnologias a sus metodologias.' },
    { year: '3', title: 'Apoyo a estudiantes', description: 'Ofreceremos varios tips y guias para ayudar a que los alumnos mejoren en sus estudios.' },
    { year: '4', title: 'Comunicar noticias', description: 'Compartiremos las noticias mas relevantes relacionadas con la educacion.' },
    { year: '5', title: 'Crecer la comunidad', description: 'Nos enfocaremos en hacer que nuestro blog sea interactivo, para asi conseguir mas usuarios y motivarlos en sus estudios.' }
  ];

  return (
    <div style={{ fontFamily: typography.fontFamily, backgroundColor: colors.background }}>
      <Header />
      
      <main>
        <section style={styles.hero}>
          <div style={styles.container}>
            <h1 style={styles.title}>Sobre EducStation</h1>
            <p style={styles.subtitle}>
              Somos una plataforma dedicada a potenciar el desarrollo profesional de educadores 
              mediante la creación, curación y compartición de recursos educativos de calidad.
              Nuestra misión es transformar la educación a través de la innovación y la colaboración.
            </p>
          </div>
        </section>
        
        <div style={styles.container}>
          {/* Stats Section */}
          <section style={styles.stats}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>7</div>
              <div style={styles.statLabel}>Administradores</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Artículos</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Visitantes</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Alumnos</div>
            </div>
          </section>
          
          {/* Historia Section */}
          <section style={styles.section}>
            <h2 style={{...styles.sectionTitle}}>
              Motivaciones
              <span style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "60px",
                height: "3px",
                backgroundColor: colors.secondary
              }}></span>
            </h2>
            
            <div style={styles.timeline}>
              {timelineEvents.map((event, index) => (
                <div key={index} style={styles.timelineItem}>
                  <div style={styles.timelineYear}>{event.year.slice(-2)}</div>
                  <h3 style={styles.timelineTitle}>{event.title}</h3>
                  <p style={styles.content}>{event.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Equipo Section */}
          <section style={styles.section}>
            <h2 style={{...styles.sectionTitle}}>
              Nuestro Equipo
              <span style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "60px",
                height: "3px",
                backgroundColor: colors.secondary
              }}></span>
            </h2>
            
            <p style={{...styles.content, marginBottom: spacing.xl}}>
              Contamos con un equipo diverso y apasionado de profesionales dedicados a la mejora 
              continua de la experiencia educativa. Cada miembro aporta una perspectiva única y 
              valiosa a nuestra misión.
            </p>
            
            <div style={styles.team}>
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  style={styles.teamMember}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = shadows.sm;
                  }}
                >
                  <img src={member.image} alt={member.name} style={styles.teamImage} />
                  <div style={styles.teamInfo}>
                    <h3 style={styles.teamName}>{member.name}</h3>
                    <div style={styles.teamRole}>{member.role}</div>
                    <p style={styles.teamBio}>{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Valores Section */}
          <section style={styles.section}>
            <h2 style={{...styles.sectionTitle}}>
              Nuestros Valores
              <span style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "60px",
                height: "3px",
                backgroundColor: colors.secondary
              }}></span>
            </h2>
            
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: spacing.xl}}>
              {[
                { 
                  title: 'Innovación', 
                  icon: '💡', 
                  description: 'Buscamos traer variedad con todos nuestros posts y con la informacion que ofrecemos, trayendo lo mas reciente del momento.' 
                },
                { 
                  title: 'Colaboración', 
                  icon: '🤝', 
                  description: 'Creemos en el poder del trabajo en equipo y la sinergia que surge al compartir conocimientos y experiencias entre educadores.' 
                },
                { 
                  title: 'Inclusión', 
                  icon: '🌈', 
                  description: 'Nos aseguraremos que la informacion dada en nuestra pagina siempre sea inclusiva para todos, sin importar nuestras diferencias.' 
                },
                { 
                  title: 'Excelencia', 
                  icon: '🏆', 
                  description: 'Nos esforzamos por ofrecer contenido y herramientas para impulsar a los alumnos a que den lo mejor de si mismos.' 
                }
              ].map((value, index) => (
                <div 
                  key={index} 
                  style={{
                    backgroundColor: colors.white,
                    padding: spacing.lg,
                    borderRadius: borderRadius.lg,
                    boxShadow: shadows.sm,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = shadows.sm;
                  }}
                >
                  <div style={{fontSize: "36px", marginBottom: spacing.sm}}>{value.icon}</div>
                  <h3 style={{color: colors.primary, marginBottom: spacing.sm, fontSize: typography.fontSize.lg}}>{value.title}</h3>
                  <p style={{color: colors.textSecondary, fontSize: typography.fontSize.sm, lineHeight: 1.6}}>{value.description}</p>
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

export default AboutPage;