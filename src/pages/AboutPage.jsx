// src/pages/AboutPage.jsx
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography } from '../styles/theme';

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
      background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`,
      borderRadius: '12px',
      marginBottom: spacing.xxl,
      marginTop: spacing.xl
    },
    title: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.md,
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    },
    subtitle: {
      fontSize: typography.fontSize.lg,
      color: colors.textSecondary,
      maxWidth: "800px",
      margin: "0 auto",
      lineHeight: 1.6
    },
    section: {
      marginBottom: spacing.xxl
    },
    sectionTitle: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.xl,
      position: "relative",
      paddingBottom: spacing.sm
    },
    content: {
      fontSize: typography.fontSize.md,
      color: colors.textSecondary,
      lineHeight: 1.6
    }
  };

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
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Nuestra Historia
              <span style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "60px",
                height: "3px",
                backgroundColor: colors.primary
              }}></span>
            </h2>
            <p style={styles.content}>
              EducStation nació en 2018 como un proyecto personal de María Rodríguez para 
              compartir recursos con otros educadores. En 2019, se formó el equipo inicial y
              se lanzó la primera versión de la plataforma web con recursos descargables.
              Para 2021, EducStation se convirtió en una comunidad de más de 10,000 educadores
              que comparten experiencias y recursos. En 2023, hicimos un rediseño completo de
              la plataforma con enfoque en creación de contenido colaborativo y herramientas interactivas.
              Hoy, en 2025, EducStation se ha consolidado como referente en innovación educativa 
              con presencia en múltiples países.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;