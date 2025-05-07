// src/pages/AdminPostPage.jsx
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostEditor from '../components/admin/PostEditor';
import { useTheme } from '../context/ThemeContext';

const AdminPostPage = () => {
  const { colors } = useTheme(); // Obtenemos los colores del tema actual
  
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: colors.background }}>
      <Header />
      <main>
        <PostEditor />
      </main>
      <Footer />
    </div>
  );
};

export default AdminPostPage;