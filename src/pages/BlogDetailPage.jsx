// src/pages/BlogDetailPage.jsx
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { spacing, typography } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

const BlogDetailPage = () => {
  const { colors } = useTheme();
  
  // Estilos CSS
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `${spacing.xl} ${spacing.md}`,
      minHeight: "70vh" // Altura mínima para que la página no se vea demasiado vacía
    }
  };

  return (
    <div style={{ fontFamily: typography.fontFamily, backgroundColor: colors.background }}>
      <Header />
      
      <main>
        <div style={styles.container}>
          {/* Contenido principal aquí cuando sea necesario */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogDetailPage;

