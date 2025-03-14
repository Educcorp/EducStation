// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de páginas
import HomePage from './pages/HomePage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPostPage from './pages/AdminPostPage';
import CategoryPage from './pages/CategoryPage';
import PostViewer from './components/blog/PostViewer'; // Importamos el nuevo componente

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:postId" element={<PostViewer />} /> {/* Nueva ruta para visualizar posts */}
          <Route path="/blog/detail/:blogId" element={<BlogDetailPage />} /> {/* Mantenemos la ruta original */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/post" element={<AdminPostPage />} />
          <Route path="/admin/post/:postId" element={<AdminPostPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          
          {/* Ruta de respaldo */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;