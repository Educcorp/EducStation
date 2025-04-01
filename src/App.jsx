// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación del nuevo componente ScrollToTop
import ScrollToTop from './components/utils/ScrollToTop';

// Importación del ThemeProvider
import { ThemeProvider } from './context/ThemeContext';

// Importación de estilos del tema oscuro
import './styles/darkMode.css';

// Importación de páginas
import HomePage from './pages/HomePage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPostPage from './pages/AdminPostPage';
import CategoryPage from './pages/CategoryPage';
import PostViewer from './components/blog/PostViewer';

// Páginas adicionales
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        {/* ScrollToTop se ejecutará cada vez que cambie la ruta */}
        <ScrollToTop />
        
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog/:postId" element={<PostViewer />} />
            <Route path="/blog/detail/:blogId" element={<BlogDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/post" element={<AdminPostPage />} />
            <Route path="/admin/post/:postId" element={<AdminPostPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            
            {/* Rutas para términos, privacidad y cookies */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            
            {/* Ruta de respaldo */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;