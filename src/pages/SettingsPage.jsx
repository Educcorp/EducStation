import React, { useState, useContext, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { deleteAccount } from '../services/authService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout } = useContext(AuthContext); // Obtener logout del contexto
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessButton, setShowSuccessButton] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Para manejar estado de carga
  const [error, setError] = useState(null); // Para manejar errores

  // Efecto para forzar la recarga al montar el componente
  useEffect(() => {
    // Verificar si es la primera carga
    const isFirstLoad = !sessionStorage.getItem('settingsPageLoaded');

    if (isFirstLoad) {
      // Marcar que ya se cargó la página
      sessionStorage.setItem('settingsPageLoaded', 'true');
      // Forzar recarga
      window.location.reload();
    }

    // Limpiar el marcador cuando se desmonte el componente
    return () => {
      sessionStorage.removeItem('settingsPageLoaded');
    };
  }, []);

  const [settings, setSettings] = useState({
    notifications: {
      newPosts: true,
      comments: true,
      newsletter: false
    },
    privacy: {
      showProfile: true,
      showEmail: false,
      allowComments: true
    },
    display: {
      fontSize: 'medium',
      showAuthor: true,
      showDate: true,
      showReadTime: true
    },
    email: {
      frequency: 'weekly',
      digest: true,
      marketing: false
    }
  });

  const handleReturnHome = () => {
    window.location.href = '/login';  // Redirecciona al login
  };

  const handleSettingChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelectChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${spacing.xxl} ${spacing.md}`,
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#1a1a1a' : colors.background,
      color: isDarkMode ? '#fff' : '#1a1a1a',
    },
    title: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.xl,
      color: isDarkMode ? '#fff' : '#1a1a1a',
    },
    section: {
      backgroundColor: isDarkMode ? '#2d2d2d' : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      boxShadow: shadows.md,
    },
    sectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.lg,
      color: isDarkMode ? colors.primary : '#1a1a1a',
    },
    optionContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.md,
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      backgroundColor: isDarkMode ? '#3d3d3d' : colors.background,
      borderRadius: borderRadius.md,
      transition: 'all 0.3s ease',
    },
    optionLabel: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      color: isDarkMode ? '#fff' : '#1a1a1a',
    },
    optionDescription: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? '#ccc' : '#4a4a4a',
      marginTop: spacing.xs,
    },
    switch: {
      width: '50px',
      height: '24px',
      backgroundColor: colors.gray200,
      borderRadius: '12px',
      padding: '2px',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background-color 0.3s ease',
    },
    switchActive: {
      backgroundColor: colors.primary,
    },
    switchHandle: {
      width: '20px',
      height: '20px',
      backgroundColor: colors.white,
      borderRadius: '50%',
      position: 'absolute',
      transition: 'transform 0.3s ease',
    },
    select: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      border: `1px solid ${isDarkMode ? '#555' : colors.gray200}`,
      backgroundColor: isDarkMode ? '#3d3d3d' : colors.white,
      color: isDarkMode ? '#fff' : '#1a1a1a',
      fontSize: typography.fontSize.md,
      cursor: 'pointer',
      outline: 'none',
      fontWeight: typography.fontWeight.medium,
    },
    saveButton: {
      padding: `${spacing.md} ${spacing.xl}`,
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: spacing.xl,
      '&:hover': {
        backgroundColor: colors.primaryDark,
        transform: 'translateY(-2px)',
      },
    },
    // Estilos para el modal de confirmación
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: showDeleteModal ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#2d2d2d' : colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.xl,
      width: '90%',
      maxWidth: '450px',
      padding: 0,
      overflow: 'hidden',
      animation: 'modalFadeIn 0.3s ease-out forwards',
      transform: 'scale(0.9)',
      opacity: 0
    },
    modalHeader: {
      backgroundColor: colors.error,
      color: colors.white,
      padding: `${spacing.md} ${spacing.xl}`,
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${colors.error}`
    },
    modalWarningIcon: {
      fontSize: '24px',
      marginRight: spacing.md,
      color: colors.white
    },
    modalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      margin: 0,
      color: colors.white
    },
    modalBody: {
      padding: `${spacing.xl} ${spacing.xl}`,
      fontSize: typography.fontSize.md,
      lineHeight: '1.6',
      color: isDarkMode ? colors.white : colors.textPrimary,
      textAlign: 'center'
    },
    modalFooter: {
      padding: `${spacing.md} ${spacing.xl}`,
      borderTop: `1px solid ${isDarkMode ? '#3d3d3d' : colors.gray200}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: spacing.md
    },
    cancelButton: {
      padding: `${spacing.sm} ${spacing.xl}`,
      backgroundColor: isDarkMode ? '#3d3d3d' : colors.white,
      color: isDarkMode ? colors.white : colors.textPrimary,
      border: `1px solid ${isDarkMode ? '#4d4d4d' : colors.gray200}`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    confirmDeleteButton: {
      padding: `${spacing.sm} ${spacing.xl}`,
      backgroundColor: colors.error,
      color: colors.white,
      border: 'none',
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  };

  const Switch = ({ isOn, onToggle }) => (
    <div
      style={{
        ...styles.switch,
        ...(isOn && styles.switchActive),
      }}
      onClick={onToggle}
    >
      <div
        style={{
          ...styles.switchHandle,
          transform: isOn ? 'translateX(26px)' : 'translateX(0)',
        }}
      />
    </div>
  );

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Llamar a la función de eliminar cuenta
      await deleteAccount();

      // Cerrar el modal de confirmación de eliminación
      setShowDeleteModal(false);

      // Mostrar el mensaje de éxito estilizado
      const successModal = document.createElement('div');
      successModal.style.position = 'fixed';
      successModal.style.top = '0';
      successModal.style.left = '0';
      successModal.style.right = '0';
      successModal.style.bottom = '0';
      successModal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      successModal.style.display = 'flex';
      successModal.style.justifyContent = 'center';
      successModal.style.alignItems = 'center';
      successModal.style.zIndex = '10000';
      successModal.style.backdropFilter = 'blur(4px)';

      const messageBox = document.createElement('div');
      messageBox.style.backgroundColor = isDarkMode ? '#2d2d2d' : '#ffffff';
      messageBox.style.padding = '30px';
      messageBox.style.borderRadius = '12px';
      messageBox.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
      messageBox.style.textAlign = 'center';
      messageBox.style.maxWidth = '400px';
      messageBox.style.width = '90%';
      messageBox.style.border = `2px solid ${colors.success}`;
      messageBox.style.animation = 'fadeIn 0.5s ease-out forwards';

      const iconContainer = document.createElement('div');
      iconContainer.innerHTML = '✓';
      iconContainer.style.fontSize = '64px';
      iconContainer.style.marginBottom = '15px';
      iconContainer.style.color = colors.success;
      iconContainer.style.animation = 'pop 0.5s ease-out';

      const title = document.createElement('h3');
      title.innerText = '¡Cuenta Eliminada con Éxito!';
      title.style.fontSize = '20px';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '15px';
      title.style.color = isDarkMode ? '#ffffff' : '#333333';

      const message = document.createElement('p');
      message.innerText = 'Tu cuenta ha sido eliminada exitosamente. Serás redirigido a la página de inicio de sesión.';
      message.style.fontSize = '16px';
      message.style.marginBottom = '0';
      message.style.color = isDarkMode ? '#cccccc' : '#666666';
      message.style.lineHeight = '1.5';

      // Añadir animaciones CSS
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `;

      // Añadir elementos al DOM
      messageBox.appendChild(iconContainer);
      messageBox.appendChild(title);
      messageBox.appendChild(message);
      successModal.appendChild(messageBox);
      document.body.appendChild(style);
      document.body.appendChild(successModal);

      // Cerrar sesión
      logout();

      // Redireccionar después de mostrar el mensaje por 2.5 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 2500);

    } catch (error) {
      // Manejar error
      console.error('Error al eliminar cuenta:', error);
      setError(error.message || 'Error al eliminar la cuenta');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Header />
      <main style={styles.container}>
        <h1 style={styles.title}>Configuración</h1>

        {/* Notificaciones */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Notificaciones</h2>
          <div style={styles.optionContainer}>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Nuevas publicaciones</div>
                <div style={styles.optionDescription}>Recibe notificaciones cuando se publiquen nuevos posts</div>
              </div>
              <Switch
                isOn={settings.notifications.newPosts}
                onToggle={() => handleSettingChange('notifications', 'newPosts')}
              />
            </div>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Comentarios</div>
                <div style={styles.optionDescription}>Notificaciones de respuestas a tus comentarios</div>
              </div>
              <Switch
                isOn={settings.notifications.comments}
                onToggle={() => handleSettingChange('notifications', 'comments')}
              />
            </div>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Newsletter</div>
                <div style={styles.optionDescription}>Recibe nuestro boletín semanal</div>
              </div>
              <Switch
                isOn={settings.notifications.newsletter}
                onToggle={() => handleSettingChange('notifications', 'newsletter')}
              />
            </div>
          </div>
        </section>

        {/* Privacidad */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Privacidad</h2>
          <div style={styles.optionContainer}>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Mostrar perfil público</div>
                <div style={styles.optionDescription}>Tu perfil será visible para otros usuarios</div>
              </div>
              <Switch
                isOn={settings.privacy.showProfile}
                onToggle={() => handleSettingChange('privacy', 'showProfile')}
              />
            </div>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Mostrar email</div>
                <div style={styles.optionDescription}>Tu email será visible en tu perfil público</div>
              </div>
              <Switch
                isOn={settings.privacy.showEmail}
                onToggle={() => handleSettingChange('privacy', 'showEmail')}
              />
            </div>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Permitir comentarios</div>
                <div style={styles.optionDescription}>Otros usuarios podrán comentar en tus posts</div>
              </div>
              <Switch
                isOn={settings.privacy.allowComments}
                onToggle={() => handleSettingChange('privacy', 'allowComments')}
              />
            </div>
          </div>
        </section>

        {/* Visualización */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Visualización</h2>
          <div style={styles.optionContainer}>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Tamaño de fuente</div>
                <div style={styles.optionDescription}>Ajusta el tamaño del texto en los posts</div>
              </div>
              <select
                style={styles.select}
                value={settings.display.fontSize}
                onChange={(e) => handleSelectChange('display', 'fontSize', e.target.value)}
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Mostrar autor</div>
                <div style={styles.optionDescription}>Muestra el autor en las previsualizaciones</div>
              </div>
              <Switch
                isOn={settings.display.showAuthor}
                onToggle={() => handleSettingChange('display', 'showAuthor')}
              />
            </div>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Mostrar fecha</div>
                <div style={styles.optionDescription}>Muestra la fecha de publicación</div>
              </div>
              <Switch
                isOn={settings.display.showDate}
                onToggle={() => handleSettingChange('display', 'showDate')}
              />
            </div>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Tiempo de lectura</div>
                <div style={styles.optionDescription}>Muestra el tiempo estimado de lectura</div>
              </div>
              <Switch
                isOn={settings.display.showReadTime}
                onToggle={() => handleSettingChange('display', 'showReadTime')}
              />
            </div>
          </div>
        </section>

        {/* Preferencias de Email */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Preferencias de Email</h2>
          <div style={styles.optionContainer}>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Frecuencia de emails</div>
                <div style={styles.optionDescription}>¿Con qué frecuencia quieres recibir emails?</div>
              </div>
              <select
                style={styles.select}
                value={settings.email.frequency}
                onChange={(e) => handleSelectChange('email', 'frequency', e.target.value)}
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="never">Nunca</option>
              </select>
            </div>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Resumen de actividad</div>
                <div style={styles.optionDescription}>Recibe un resumen de la actividad del blog</div>
              </div>
              <Switch
                isOn={settings.email.digest}
                onToggle={() => handleSettingChange('email', 'digest')}
              />
            </div>
            <div style={styles.option}>
              <div>
                <div style={styles.optionLabel}>Emails promocionales</div>
                <div style={styles.optionDescription}>Recibe información sobre ofertas y novedades</div>
              </div>
              <Switch
                isOn={settings.email.marketing}
                onToggle={() => handleSettingChange('email', 'marketing')}
              />
            </div>
          </div>
        </section>

        {/* Sección de eliminar cuenta */}
        <section style={{
          ...styles.section,
          borderColor: '#ff3333',
          borderWidth: '2px',
          borderStyle: 'solid',
          backgroundColor: isDarkMode ? '#2d2d2d' : colors.white
        }}>
          <h2 style={{
            ...styles.sectionTitle,
            color: '#cc0000'
          }}>Zona Peligrosa</h2>
          <div style={styles.optionContainer}>
            <div style={{
              ...styles.option,
              backgroundColor: isDarkMode ? '#3d3d3d' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#4d4d4d' : colors.gray200}`
            }}>
              <div>
                <div style={{
                  ...styles.optionLabel,
                  color: '#cc0000',
                  fontWeight: typography.fontWeight.bold
                }}>Eliminar Cuenta</div>
                <div style={{
                  ...styles.optionDescription,
                  color: isDarkMode ? '#ff9999' : '#990000'
                }}>Esta acción es permanente y no se puede deshacer. Se perderán todos tus datos.</div>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{
                  padding: `${spacing.sm} ${spacing.xl}`,
                  backgroundColor: '#ff3333',
                  color: colors.white,
                  border: 'none',
                  borderRadius: borderRadius.md,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: typography.fontWeight.bold
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff0000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff3333';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </section>

        {/* Botón Guardar */}
        <button
          style={styles.saveButton}
          onClick={() => {
            // Aquí iría la lógica para guardar las configuraciones
            alert('Configuraciones guardadas correctamente');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.primaryDark;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Guardar cambios
        </button>
      </main>

      {/* Modal de confirmación para eliminar cuenta */}
      <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={{
            ...styles.modalHeader,
            backgroundColor: '#ff3333'
          }}>
            <span style={styles.modalWarningIcon}>⚠️</span>
            <h3 style={styles.modalTitle}>Eliminar Cuenta</h3>
          </div>
          <div style={{
            ...styles.modalBody,
            backgroundColor: isDarkMode ? '#331111' : '#fff0f0'
          }}>
            <p>¿Estás seguro de que deseas eliminar tu cuenta de <strong>EducStation</strong>?</p>
            <p>Esta acción es permanente y no se puede deshacer. Se perderán todos tus datos, incluyendo:</p>
            <ul style={{
              textAlign: 'left',
              color: isDarkMode ? '#ff9999' : '#cc0000',
              backgroundColor: isDarkMode ? '#441111' : '#ffe0e0',
              padding: spacing.lg,
              borderRadius: borderRadius.md,
              border: '1px solid #ff3333'
            }}>
              <li>Tu perfil y configuraciones</li>
              <li>Tus publicaciones y comentarios</li>
              <li>Tu historial de actividad</li>
              <li>Tus datos guardados</li>
            </ul>
          </div>
          <div style={{
            ...styles.modalFooter,
            backgroundColor: isDarkMode ? '#331111' : '#fff0f0',
            borderTop: `1px solid #ff3333`
          }}>
            <button
              style={styles.cancelButton}
              onClick={() => setShowDeleteModal(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#441111' : '#ffe0e0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#331111' : '#fff0f0';
              }}
            >
              Cancelar
            </button>
            <button
              style={{
                ...styles.confirmDeleteButton,
                backgroundColor: isDeleting ? '#999999' : '#ff3333',
                fontWeight: typography.fontWeight.bold,
                cursor: isDeleting ? 'not-allowed' : 'pointer'
              }}
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.currentTarget.style.backgroundColor = '#ff0000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeleting) {
                  e.currentTarget.style.backgroundColor = '#ff3333';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
            </button>
          </div>
        </div>
      </div>

      {/* Botón de éxito después de eliminar cuenta */}
      {showSuccessButton && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#2d2d2d' : colors.white,
            padding: spacing.xl,
            borderRadius: borderRadius.lg,
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
            boxShadow: shadows.xl,
            animation: 'modalFadeIn 0.3s ease-out forwards',
            border: `2px solid ${colors.success}`,
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: spacing.md,
              color: colors.success,
              animation: 'successIconPop 0.5s ease-out'
            }}>✓</div>
            <h3 style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              marginBottom: spacing.md,
              color: isDarkMode ? colors.white : colors.textPrimary
            }}>¡Cuenta Eliminada con Éxito!</h3>
            <p style={{
              fontSize: typography.fontSize.md,
              marginBottom: spacing.xl,
              color: isDarkMode ? colors.gray300 : colors.textSecondary,
              lineHeight: '1.6'
            }}>
              Tu cuenta ha sido eliminada exitosamente. Gracias por haber sido parte de nuestra comunidad. Esperamos verte pronto.
            </p>
            <button
              onClick={handleReturnHome}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                backgroundColor: colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: borderRadius.md,
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )}

      {/* Animaciones CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
      @keyframes modalFadeIn {
        0% { transform: scale(0.9); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes successIconPop {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
    `
      }} />
      <Footer />
    </>
  );
};

export default SettingsPage;