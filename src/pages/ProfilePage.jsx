import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { getUserProfile, updateUserAvatar } from '../services/userService';

const ProfilePage = () => {
  const { user, isAuth } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!isAuth) {
          window.location.href = '/login';
          return;
        }
        
        // Utilizamos el servicio para obtener los datos reales del usuario
        const userData = await getUserProfile();
        
        // Verificar si hay un avatar guardado localmente
        const localAvatar = localStorage.getItem('userAvatar');
        
        // Formatear la fecha de registro
        const joinDate = new Date(userData.date_joined || new Date()).toLocaleDateString();
        
        // Crear objeto de perfil con datos reales y algunos predeterminados para campos aún no implementados
        setUserProfile({
          firstName: userData.first_name || 'Usuario',
          lastName: userData.last_name || '',
          username: userData.username || 'usuario',
          email: userData.email || 'usuario@ejemplo.com',
          role: userData.is_superuser ? 'Administrador' : 'Estudiante',
          joinDate: joinDate,
          avatar: localAvatar || userData.avatar || '/assets/images/logoBN.png'
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        setErrorMessage('No se pudo cargar el perfil. Por favor, intenta nuevamente.');
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuth]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        console.log('Procesando archivo:', file.name, 'tipo:', file.type, 'tamaño:', Math.round(file.size/1024), 'KB');
        setIsUploading(true);
        setErrorMessage('');
        setSuccessMessage('');
        
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          try {
            console.log('Imagen convertida a base64, preparando envío al servidor');
            
            // Almacenar la imagen en localStorage como respaldo
            localStorage.setItem('userAvatar', reader.result);
            
            try {
              // Intentar actualizar en el servidor
              await updateUserAvatar(reader.result);
              setSuccessMessage('Avatar actualizado exitosamente en el servidor.');
            } catch (serverError) {
              console.error('No se pudo guardar en el servidor, usando versión local:', serverError);
              setSuccessMessage('Tu avatar ha sido actualizado localmente. No se pudo guardar en el servidor, pero será visible en esta sesión.');
            }
            
            // Actualizar en el estado local de todas formas
            setUserProfile(prev => ({
              ...prev,
              avatar: reader.result
            }));
            
            console.log('Avatar actualizado correctamente en frontend');
            setIsUploading(false);
          } catch (error) {
            console.error('Error al actualizar el avatar:', error);
            setErrorMessage(`Error al actualizar el avatar: ${error.message}`);
            setIsUploading(false);
          }
        };

        reader.onerror = (error) => {
          console.error('Error en FileReader:', error);
          setErrorMessage('Error al procesar la imagen. Por favor, intenta con otra imagen.');
          setIsUploading(false);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error al procesar la imagen:', error);
        setIsUploading(false);
        setErrorMessage('Error al procesar la imagen. Por favor, intenta de nuevo.');
      }
    }
  };

  // Estilos
  const styles = {
    container: {
      backgroundColor: isDarkMode ? '#1a2e2d' : colors.background,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    content: {
      flex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${spacing.xl} ${spacing.md}`,
      width: '100%'
    },
    card: {
      backgroundColor: isDarkMode ? '#0a1919' : colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.md,
      overflow: 'hidden',
      marginBottom: spacing.xl
    },
    profileHeader: {
      backgroundColor: isDarkMode ? colors.primaryDark : colors.primary,
      padding: `${spacing.xl} ${spacing.xl}`,
      color: colors.white,
      display: 'flex',
      alignItems: 'center',
      position: 'relative'
    },
    avatarContainer: {
      position: 'relative',
      cursor: 'pointer',
      '&:hover .avatarOverlay': {
        opacity: 1
      }
    },
    avatar: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      border: `4px solid ${colors.white}`,
      backgroundColor: colors.white,
      boxShadow: shadows.md,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    avatarImg: {
      width: '85%',
      height: '85%',
      objectFit: 'contain',
      borderRadius: '50%'
    },
    avatarOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    uploadIcon: {
      color: colors.white,
      fontSize: '24px'
    },
    fileInput: {
      display: 'none'
    },
    userInfo: {
      marginLeft: spacing.xl
    },
    name: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.xs
    },
    username: {
      fontSize: typography.fontSize.md,
      opacity: 0.9,
      marginBottom: spacing.md
    },
    role: {
      display: 'inline-block',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm
    },
    profileContent: {
      padding: spacing.xl,
      color: isDarkMode ? colors.white : colors.textPrimary,
    },
    sectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: isDarkMode ? colors.white : colors.primary,
      marginBottom: spacing.md,
      borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.gray200}`,
      paddingBottom: spacing.sm
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: spacing.lg,
      marginBottom: spacing.xl
    },
    infoItem: {
      marginBottom: spacing.md
    },
    infoLabel: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? colors.gray300 : colors.textSecondary,
      marginBottom: spacing.xs
    },
    infoValue: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontSize: typography.fontSize.lg,
      color: isDarkMode ? colors.white : colors.primary
    },
    placeholder: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.gray100,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      textAlign: 'center',
      fontSize: typography.fontSize.md,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary,
      marginTop: spacing.xl
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.content}>
          <div style={styles.loading}>
            Cargando perfil...
            <div 
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: `3px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : colors.gray200}`,
                borderTop: `3px solid ${isDarkMode ? colors.white : colors.primary}`,
                marginLeft: spacing.md,
                animation: 'spin 1s linear infinite'
              }}
            ></div>
          </div>
        </div>
        <Footer />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        {errorMessage && (
          <div style={{
            backgroundColor: colors.error,
            color: colors.white,
            padding: spacing.md,
            borderRadius: borderRadius.md,
            marginBottom: spacing.xl,
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div style={{
            backgroundColor: colors.success,
            color: colors.white,
            padding: spacing.md,
            borderRadius: borderRadius.md,
            marginBottom: spacing.xl,
            textAlign: 'center'
          }}>
            {successMessage}
          </div>
        )}
        <div style={styles.card}>
          <div style={styles.profileHeader}>
            <div 
              style={styles.avatarContainer}
              onClick={handleImageClick}
            >
              <div style={styles.avatar}>
                <img 
                  src={userProfile?.avatar || '/assets/images/logoBN.png'} 
                  alt="Avatar" 
                  style={styles.avatarImg} 
                />
                {isUploading && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: colors.white
                  }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: `3px solid ${colors.white}`,
                      borderTop: `3px solid transparent`,
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  </div>
                )}
              </div>
              <div className="avatarOverlay" style={styles.avatarOverlay}>
                <span style={styles.uploadIcon}>📷</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={styles.fileInput}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div style={styles.userInfo}>
              <h1 style={styles.name}>{userProfile.firstName} {userProfile.lastName}</h1>
              <div style={styles.username}>@{userProfile.username}</div>
              <div style={styles.role}>{userProfile.role}</div>
            </div>
          </div>
          
          <div style={styles.profileContent}>
            <h2 style={styles.sectionTitle}>Información personal</h2>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Email</div>
                <div style={styles.infoValue}>{userProfile.email}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Rol</div>
                <div style={styles.infoValue}>{userProfile.role}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Miembro desde</div>
                <div style={styles.infoValue}>{userProfile.joinDate}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.card}>
          <div style={styles.profileContent}>
            <h2 style={styles.sectionTitle}>Actividad reciente</h2>
            <div style={styles.placeholder}>
              Aquí se mostrará la actividad reciente del usuario cuando esta funcionalidad esté disponible.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage; 