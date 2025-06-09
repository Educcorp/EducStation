// src/App.jsx (updated)
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Mostrar loader mientras se verifica la autenticación
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirigir a login si no está autenticado
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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

  // Redirigir a dashboard si ya está autenticado
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Componente para rutas del blog (accesibles públicamente pero con funciones limitadas)
const PublicBlogRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Permitir acceso independientemente del estado de autenticación
  return children;
};

// Componente para redirección inteligente según autenticación
const SmartRedirect = () => {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirigir según el estado de autenticación
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/home" replace />;
  }
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

              {/* Página de inicio (accesible públicamente) */}
              <Route
                path="/home"
                element={
                  <PublicBlogRoute>
                    <HomePage />
                  </PublicBlogRoute>
                }
              />

              {/* Rutas del blog (accesibles públicamente) */}
              <Route
                path="/blog"
                element={
                  <PublicBlogRoute>
                    <BlogPage />
                  </PublicBlogRoute>
                }
              />
              <Route
                path="/blog/:id"
                element={
                  <PublicBlogRoute>
                    <BlogDetailPage />
                  </PublicBlogRoute>
                }
              />
              <Route
                path="/categoria/:id"
                element={
                  <PublicBlogRoute>
                    <CategoryPage />
                  </PublicBlogRoute>
                }
              />
              <Route
                path="/categorias"
                element={
                  <PublicBlogRoute>
                    <CategoriesListPage />
                  </PublicBlogRoute>
                }
              />

              {/* Ruta raíz - redirección inteligente */}
              <Route
                path="/"
                element={<SmartRedirect />}
              />

              {/* Rutas protegidas (requieren autenticación) */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <HomePage />
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

              {/* Ruta por defecto, redirige según el estado de autenticación */}
              <Route
                path="*"
                element={<SmartRedirect />}
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