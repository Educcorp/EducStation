// src/App.jsx (actualizado)
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/utils/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './styles/theme.css'; // Importamos nuestro nuevo archivo de temas

// Importación de páginas
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPostPage from './pages/AdminPostPage';
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
  <div className="loading-spinner-container">
    <div className="loading-spinner"></div>
    <style>{`
      .loading-spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .loading-spinner {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 5px solid var(--color-divider);
        border-top: 5px solid var(--color-primary);
        animation: spin 1s linear infinite;
      }
    `}</style>
  </div>
);

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useContext(AuthContext);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Componente para rutas públicas
const PublicRoute = ({ children }) => {
  const { isAuth, loading } = useContext(AuthContext);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
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
              {/* Rutas públicas */}
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
                element={<TermsPage />} 
              />
              <Route 
                path="/privacy" 
                element={<PrivacyPage />} 
              />
              <Route 
                path="/cookies" 
                element={<CookiesPage />} 
              />

              {/* Rutas protegidas */}
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
                  <PrivateRoute>
                    <AdminPostPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/post/new" 
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
              
              {/* Ruta por defecto */}
              <Route 
                path="*" 
                element={<Navigate to="/login" replace />} 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;