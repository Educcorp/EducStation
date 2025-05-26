import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';

const SettingsPage = () => {
  const { isDarkMode } = useTheme();
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Efecto para animación de entrada
  useEffect(() => {
    // Pequeño retraso para asegurar que la animación se ejecute después de renderizar
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Recarga forzada al entrar (solo una vez por sesión)
  useEffect(() => {
    if (location.state && location.state.forceReload) {
      if (!sessionStorage.getItem('settingspage-reloaded')) {
        sessionStorage.setItem('settingspage-reloaded', 'true');
        window.history.replaceState(null, '', window.location.pathname);
        window.location.reload();
      }
    } else {
      sessionStorage.removeItem('settingspage-reloaded');
    }
  }, [location]);

  return (
    <>
      <Header />

      <div className="settings-page-container" style={{
        background: 'linear-gradient(135deg, #8ca3a3 0%, #6b8a8a 100%)',
        minHeight: '100vh',
        padding: `${spacing.xl} 0`,
      }}>
        <div className={`settings-content ${fadeIn ? 'fade-in' : ''}`} style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: `0 ${spacing.md}`,
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: spacing.xl,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>Configuración</h1>

          {/* Sección de Cambiar Contraseña */}
          <div className="settings-card password-section" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            marginBottom: spacing.xl,
            transform: fadeIn ? 'translateY(0)' : 'translateY(30px)',
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
          }}>
            <div style={{
              padding: spacing.xl,
              borderBottom: '1px solid #f0f0f0'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: spacing.md
              }}>Cambiar Contraseña</h2>
            </div>

            <div style={{
              padding: spacing.xl,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.lg
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: spacing.md
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: spacing.xs
                  }}>Cambiar tu contraseña</h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#666',
                    margin: 0
                  }}>Actualiza tu contraseña para mantener tu cuenta segura</p>
                </div>

                <a
                  href="https://www.educstation.com/forgot-password"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-change-password"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#1e88e5',
                    color: '#ffffff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(30, 136, 229, 0.2)',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1976d2';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(30, 136, 229, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e88e5';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(30, 136, 229, 0.2)';
                  }}
                >
                  Cambiar Contraseña
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS para animaciones */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .fade-in {
            opacity: 1;
            transform: translateY(0);
          }
          
          @media (max-width: 600px) {
            .settings-content h1 {
              font-size: 2rem;
            }
            
            .btn-change-password {
              width: 100%;
              margin-top: 16px;
            }
          }
        `
      }} />

      <Footer />
    </>
  );
};

export default SettingsPage; 