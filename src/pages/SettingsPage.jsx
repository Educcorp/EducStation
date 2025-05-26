import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteAccount } from '../services/authService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';

const SettingsPage = () => {
  const { isDarkMode } = useTheme();
  const { logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
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

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Llamar a la función de eliminar cuenta
      await deleteAccount();
      
      // Cerrar el modal de confirmación
      setShowDeleteModal(false);
      
      // Realizar logout
      logout();
      
      // Mostrar animación de éxito y redireccionar
      showSuccessAnimation();
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      setError(error.message || 'Error al eliminar la cuenta');
      setIsDeleting(false);
    }
  };

  const showSuccessAnimation = () => {
    // Crear el contenedor principal
    const successModal = document.createElement('div');
    Object.assign(successModal.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '10000',
      backdropFilter: 'blur(5px)',
      opacity: '0',
      transition: 'opacity 0.5s ease'
    });

    // Crear la caja del mensaje
    const messageBox = document.createElement('div');
    Object.assign(messageBox.style, {
      backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      maxWidth: '450px',
      width: '90%',
      transform: 'translateY(30px)',
      opacity: '0',
      transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease'
    });

    // Crear el círculo de éxito
    const successCircle = document.createElement('div');
    Object.assign(successCircle.style, {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#4caf50',
      margin: '0 auto 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: 'scale(0)',
      transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    });

    // Crear el ícono de check
    const checkIcon = document.createElement('div');
    checkIcon.innerHTML = `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
      </svg>
    `;
    Object.assign(checkIcon.style, {
      opacity: '0',
      transition: 'opacity 0.3s ease 0.2s'
    });

    // Agregar el ícono al círculo
    successCircle.appendChild(checkIcon);

    // Crear el título
    const title = document.createElement('h3');
    title.innerText = '¡Cuenta Eliminada con Éxito!';
    Object.assign(title.style, {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: isDarkMode ? '#ffffff' : '#333333',
      opacity: '0',
      transform: 'translateY(10px)',
      transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s'
    });

    // Crear el mensaje
    const message = document.createElement('p');
    message.innerText = 'Tu cuenta ha sido eliminada exitosamente. Serás redirigido a la página de inicio de sesión.';
    Object.assign(message.style, {
      fontSize: '16px',
      lineHeight: '1.6',
      color: isDarkMode ? '#cccccc' : '#666666',
      marginBottom: '0',
      opacity: '0',
      transform: 'translateY(10px)',
      transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s'
    });

    // Ensamblar los elementos
    messageBox.appendChild(successCircle);
    messageBox.appendChild(title);
    messageBox.appendChild(message);
    successModal.appendChild(messageBox);
    document.body.appendChild(successModal);

    // Aplicar las animaciones secuencialmente
    requestAnimationFrame(() => {
      successModal.style.opacity = '1';
      
      setTimeout(() => {
        messageBox.style.opacity = '1';
        messageBox.style.transform = 'translateY(0)';
        
        setTimeout(() => {
          successCircle.style.transform = 'scale(1)';
          
          setTimeout(() => {
            checkIcon.style.opacity = '1';
            
            setTimeout(() => {
              title.style.opacity = '1';
              title.style.transform = 'translateY(0)';
              
              setTimeout(() => {
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';
                
                // Redireccionar después de mostrar todas las animaciones
                setTimeout(() => {
                  // Animación de salida
                  messageBox.style.opacity = '0';
                  messageBox.style.transform = 'translateY(30px)';
                  successModal.style.opacity = '0';
                  
                  setTimeout(() => {
                    document.body.removeChild(successModal);
                    navigate('/login', { replace: true });
                  }, 600);
                }, 2000);
              }, 100);
            }, 100);
          }, 100);
        }, 300);
      }, 300);
    });
  };

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

          {/* Sección de Eliminar Cuenta */}
          <div className="settings-card danger-section" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            marginBottom: spacing.xl,
            transform: fadeIn ? 'translateY(0)' : 'translateY(40px)',
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s',
            border: '2px solid #ff3333',
          }}>
            <div style={{
              padding: spacing.xl,
              borderBottom: '1px solid #ffe6e6',
              backgroundColor: '#fff5f5'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#cc0000',
                marginBottom: 0
              }}>Zona Peligrosa</h2>
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
                    color: '#cc0000',
                    marginBottom: spacing.xs
                  }}>Eliminar Cuenta</h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#990000',
                    margin: 0
                  }}>Esta acción es permanente y no se puede deshacer. Se perderán todos tus datos.</p>
                </div>
                
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn-delete-account"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ff3333',
                    color: '#ffffff',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(255, 51, 51, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e60000';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 51, 51, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff3333';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(255, 51, 51, 0.2)';
                  }}
                >
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar cuenta */}
      {showDeleteModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.3s ease forwards'
        }} onClick={() => !isDeleting && setShowDeleteModal(false)}>
          <div className="modal-content" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
            width: '90%',
            maxWidth: '500px',
            overflow: 'hidden',
            animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              backgroundColor: '#ff3333',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <span style={{
                  color: '#ff3333',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>!</span>
              </div>
              <h3 style={{
                margin: 0,
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: 'bold'
              }}>Eliminar Cuenta</h3>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#fff5f5'
            }}>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#333',
                marginTop: 0
              }}>¿Estás seguro de que deseas eliminar tu cuenta de <strong>EducStation</strong>?</p>
              
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#333'
              }}>Esta acción es permanente y no se puede deshacer. Se perderán todos tus datos, incluyendo:</p>
              
              <ul style={{
                backgroundColor: '#ffe6e6',
                padding: '16px 16px 16px 36px',
                borderRadius: '8px',
                margin: '16px 0',
                color: '#cc0000',
                border: '1px solid #ffcccc'
              }}>
                <li style={{ marginBottom: '8px' }}>Tu perfil y configuraciones</li>
                <li style={{ marginBottom: '8px' }}>Tus publicaciones y comentarios</li>
                <li style={{ marginBottom: '8px' }}>Tu historial de actividad</li>
                <li>Tus datos guardados</li>
              </ul>
              
              {error && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#ffebee',
                  color: '#d32f2f',
                  borderRadius: '8px',
                  marginTop: '16px',
                  fontSize: '0.9rem',
                  border: '1px solid #ffcdd2'
                }}>
                  {error}
                </div>
              )}
            </div>
            
            <div style={{
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              borderTop: '1px solid #ffcccc',
              backgroundColor: '#fff5f5'
            }}>
              <button
                onClick={() => !isDeleting && setShowDeleteModal(false)}
                disabled={isDeleting}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isDeleting ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = '#e0e0e0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
              >
                Cancelar
              </button>
              
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isDeleting ? '#999' : '#ff3333',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = '#e60000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = '#ff3333';
                  }
                }}
              >
                {isDeleting && (
                  <span className="spinner" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    borderTopColor: '#ffffff',
                    animation: 'spin 0.8s linear infinite'
                  }}></span>
                )}
                {isDeleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
      
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
            
            .btn-change-password,
            .btn-delete-account {
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