// src/App.jsx (updated)
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/utils/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
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

// Componente LoadingSpinner
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #0b4444',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useContext(AuthContext);
  
  // Mostrar loader mientras se verifica la autenticación
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Redirigir a login si no está autenticado
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Componente para rutas públicas (solo accesibles cuando NO está autenticado)
const PublicRoute = ({ children }) => {
  const { isAuth, loading } = useContext(AuthContext);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Redirigir a home si ya está autenticado
  if (isAuth) {
    return <Navigate to="/" replace />;
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
              {/* Rutas públicas (accesibles sin autenticación) */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/terms" 
                element={
                  <TermsPage />
                } 
              />
              <Route 
                path="/privacy" 
                element={
                  <PrivacyPage />
                } 
              />
              <Route 
                path="/cookies" 
                element={
                  <CookiesPage />
                } 
              />

              {/* Rutas protegidas (requieren autenticación) */}
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/blog/:postId" 
                element={
                  <PrivateRoute>
                    <PostViewer />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/blog/detail/:blogId" 
                element={
                  <PrivateRoute>
                    <BlogDetailPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <PrivateRoute>
                    <AboutPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <PrivateRoute>
                    <ContactPage />
                  </PrivateRoute>
                } 
              />
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
              <Route 
                path="/category/:categoryName" 
                element={
                  <PrivateRoute>
                    <CategoryPage />
                  </PrivateRoute>
                } 
              />
              
              {/* Ruta por defecto, redirige a login o home dependiendo de la autenticación */}
              <Route 
                path="*" 
                element={
                  <Navigate to="/login" replace />
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;