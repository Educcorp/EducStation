// src/pages/AdminPostPage.jsx
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostEditor from '../components/admin/PostEditor';
import { useTheme } from '../context/ThemeContext';

const AdminPostPage = () => {
  const { colors } = useTheme(); // Obtenemos los colores del tema actual
  const location = useLocation();
  const { postId } = useParams(); // Extraer el postId de los parámetros de la URL

  console.log('AdminPostPage - Post ID desde URL:', postId);

  // Recarga forzada al entrar (solo una vez por sesión)
  useEffect(() => {
    if (location.state && location.state.forceReload) {
      // Verificar si ya se realizó la recarga en esta sesión de navegación
      if (!sessionStorage.getItem('adminpostpage-reloaded')) {
        // Marcar que se va a realizar la recarga
        sessionStorage.setItem('adminpostpage-reloaded', 'true');
        // Limpiar el estado para evitar bucles infinitos
        window.history.replaceState(null, '', window.location.pathname);
        // Realizar la recarga
        window.location.reload();
      }
    } else {
      // Limpiar la marca de recarga si no hay forceReload
      sessionStorage.removeItem('adminpostpage-reloaded');
    }
  }, [location]);
  
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: colors.background }}>
      <Header />
      <main>
        <PostEditor postId={postId} />
      </main>
      <Footer />
    </div>
  );
};

export default AdminPostPage;