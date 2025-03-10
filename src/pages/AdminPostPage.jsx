// src/pages/AdminPostPage.jsx
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostEditor from '../components/admin/PostEditor';
import { colors } from '../styles/theme';

const AdminPostPage = () => {
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