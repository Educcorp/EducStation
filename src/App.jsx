// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/utils/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './styles/darkMode.css';

// Importación de páginas
import HomePage from './pages/HomePage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPostPage from './pages/AdminPostPage';
import CategoryPage from './pages/CategoryPage';
import PostViewer from './components/blog/PostViewer';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';

// Componente para rutas protegidas
const PrivateRoute = ({ children, requiredRole = null }) => {
  const { user, isAuth, loading } = useContext(AuthContext);
  
  // Mostrar loader mientras se verifica la autenticación
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Verificar autenticación
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar permisos si se requiere un rol específico
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="app">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog/:postId" element={<PostViewer />} />
              <Route path="/blog/detail/:blogId" element={<BlogDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route 
                path="/admin/post" 
                element={
                  <PrivateRoute>
                    <AdminPostPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/post/:postId" 
                element={
                  <PrivateRoute>
                    <AdminPostPage />
                  </PrivateRoute>
                } 
              />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;