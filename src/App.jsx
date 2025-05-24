// src/App.jsx (updated)
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/utils/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import './styles/darkMode.css'; // Los estilos oscuros solo se aplicarán cuando se active la clase .dark-mode
import Chatbot from './components/common/Chatbot';

// Importación de páginas
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPostPage from './pages/AdminPostPage';
import AdminPanel from './pages/AdminPanel';
import CategoryPage from './pages/CategoryPage';
import CategoriesListPage from './pages/CategoriesListPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

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
  const { isAuth, loading } = useAuth();
  
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

// Componente para rutas de administrador (solo accesibles para superusers)
const SuperUserRoute = ({ children }) => {
  const { isAuth, isSuperUser, loading } = useAuth();
  
  // Mostrar loader mientras se verifica la autenticación
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Redirigir a login si no está autenticado
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirigir a home si está autenticado pero no es superuser
  if (!isSuperUser) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Componente para rutas públicas (solo accesibles cuando NO está autenticado)
const PublicRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  
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
  // Forzar modo claro como predeterminado
  useEffect(() => {
    document.documentElement.classList.add('light-mode');
    document.documentElement.classList.remove('dark-mode');
  }, []);

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
                path="/forgot-password" 
                element={
                  <PublicRoute>
                    <ForgotPasswordPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/reset-password" 
                element={
                  <PublicRoute>
                    <ResetPasswordPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/reset-password/:token" 
                element={
                  <PublicRoute>
                    <ResetPasswordPage />
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
                path="/blog" 
                element={
                  <PrivateRoute>
                    <BlogPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/blog/:id" 
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
                  <SuperUserRoute>
                    <AdminPostPage />
                  </SuperUserRoute>
                } 
              />
              <Route 
                path="/admin/post/new" 
                element={
                  <SuperUserRoute>
                    <AdminPostPage />
                  </SuperUserRoute>
                } 
              />
              <Route 
                path="/admin/post/:postId" 
                element={
                  <SuperUserRoute>
                    <AdminPostPage />
                  </SuperUserRoute>
                } 
              />
              <Route 
                path="/admin/post/edit/:postId" 
                element={
                  <SuperUserRoute>
                    <AdminPostPage />
                  </SuperUserRoute>
                } 
              />
              <Route 
                path="/categoria/:id" 
                element={
                  <PrivateRoute>
                    <CategoryPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/categorias" 
                element={
                  <PrivateRoute>
                    <CategoriesListPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/panel" 
                element={
                  <SuperUserRoute>
                    <AdminPanel />
                  </SuperUserRoute>
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
          <Chatbot />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;