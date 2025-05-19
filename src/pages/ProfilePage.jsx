import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Obtener los datos del usuario real del backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/current`, {
            headers: {
              'x-auth-token': token
            }
          });
          
          const userData = response.data;
          setUserProfile({
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            username: userData.username,
            bio: 'Esta es tu biografía. Edita tu perfil para cambiarla.',
            role: userData.is_staff ? 'Administrador' : 'Estudiante',
            joinDate: new Date().toLocaleDateString(),
            avatar: userData.avatar || '/assets/images/logoBN.png',
            interests: ['Educación', 'Tecnología', 'Ciencia'],
            socialLinks: {
              twitter: 'https://twitter.com/',
              linkedin: 'https://linkedin.com/',
              github: 'https://github.com/'
            }
          });
        } else {
          // Fallback a datos de ejemplo si no hay token
          setUserProfile({
            firstName: localStorage.getItem('userName')?.split(' ')[0] || 'Usuario',
            lastName: localStorage.getItem('userName')?.split(' ')[1] || '',
            email: 'usuario@example.com',
            username: 'usuario123',
            bio: 'Esta es una página de perfil de ejemplo. Aquí puedes ver y editar tu información personal.',
            role: 'Estudiante',
            joinDate: '01/01/2023',
            avatar: '/assets/images/logoBN.png',
            interests: ['Educación', 'Tecnología', 'Ciencia'],
            socialLinks: {
              twitter: 'https://twitter.com/',
              linkedin: 'https://linkedin.com/',
              github: 'https://github.com/'
            }
          });
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        // Fallback a datos de ejemplo en caso de error
        setUserProfile({
          firstName: localStorage.getItem('userName')?.split(' ')[0] || 'Usuario',
          lastName: localStorage.getItem('userName')?.split(' ')[1] || '',
          email: 'usuario@example.com',
          username: 'usuario123',
          bio: 'Esta es una página de perfil de ejemplo. Aquí puedes ver y editar tu información personal.',
          role: 'Estudiante',
          joinDate: '01/01/2023',
          avatar: '/assets/images/logoBN.png',
          interests: ['Educación', 'Tecnología', 'Ciencia'],
          socialLinks: {
            twitter: 'https://twitter.com/',
            linkedin: 'https://linkedin.com/',
            github: 'https://github.com/'
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const fileType = file.type;
    if (!fileType.match(/image\/(jpeg|jpg|png|gif)/)) {
      alert('Por favor selecciona una imagen válida (JPEG, PNG, GIF)');
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen es demasiado grande. El tamaño máximo permitido es 2MB.');
      return;
    }

    try {
      setUploading(true);
      
      // Convertir archivo a base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Data = reader.result;
        
        // Actualizar avatar en el backend
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await axios.put(
              `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/avatar`,
              { avatarData: base64Data },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': token
                }
              }
            );
            
            if (response.status === 200) {
              // Actualizar estado local
              setUserProfile({
                ...userProfile,
                avatar: base64Data
              });
              
              // También actualizar el contexto de autenticación si es necesario
              if (setUser && user) {
                setUser({
                  ...user,
                  avatar: base64Data
                });
              }
              
              console.log('Avatar actualizado con éxito');
            }
          } catch (error) {
            console.error('Error al actualizar avatar:', error);
            alert('Hubo un problema al actualizar tu avatar. Por favor intenta de nuevo.');
          }
        } else {
          // Si no hay token, solo actualizar la interfaz
          setUserProfile({
            ...userProfile,
            avatar: base64Data
          });
        }
        
        setUploading(false);
      };
      
      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
        setUploading(false);
        alert('Hubo un problema al procesar la imagen. Por favor intenta de nuevo.');
      };
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setUploading(false);
      alert('Hubo un problema al subir la imagen. Por favor intenta de nuevo.');
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
      alignItems: 'center',
      cursor: 'pointer',
      position: 'relative'
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
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      borderRadius: '50%',
      color: colors.white,
      fontWeight: typography.fontWeight.bold
    },
    uploadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '50%',
      color: colors.white
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
    editButton: {
      position: 'absolute',
      top: spacing.xl,
      right: spacing.xl,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: colors.white,
      border: 'none',
      borderRadius: borderRadius.md,
      padding: `${spacing.sm} ${spacing.md}`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s ease'
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
    bio: {
      marginBottom: spacing.xl,
      lineHeight: 1.6
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
    interestTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.md
    },
    interestTag: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.background,
      color: isDarkMode ? colors.white : colors.primary,
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm
    },
    socialLinks: {
      display: 'flex',
      gap: spacing.md,
      marginTop: spacing.md
    },
    socialLink: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isDarkMode ? colors.white : colors.primary,
      textDecoration: 'none',
      transition: 'all 0.3s ease'
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
    },
    fileInput: {
      display: 'none'
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
        <div style={styles.card}>
          <div style={styles.profileHeader}>
            <div 
              style={styles.avatar} 
              onClick={handleAvatarClick}
              onMouseEnter={(e) => {
                const overlay = e.currentTarget.querySelector('#avatarOverlay');
                if (overlay) overlay.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                const overlay = e.currentTarget.querySelector('#avatarOverlay');
                if (overlay) overlay.style.opacity = 0;
              }}
            >
              <img src={userProfile.avatar} alt="Avatar" style={styles.avatarImg} />
              {!uploading && (
                <div id="avatarOverlay" style={styles.avatarOverlay}>
                  Cambiar
                </div>
              )}
              {uploading && (
                <div style={styles.uploadingOverlay}>
                  <div 
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderTop: '2px solid white',
                      animation: 'spin 1s linear infinite'
                    }}
                  ></div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                style={styles.fileInput} 
                accept="image/jpeg, image/png, image/gif"
                onChange={handleFileChange}
              />
            </div>
            <div style={styles.userInfo}>
              <h1 style={styles.name}>{userProfile.firstName} {userProfile.lastName}</h1>
              <div style={styles.username}>@{userProfile.username}</div>
              <div style={styles.role}>{userProfile.role}</div>
            </div>
            <button 
              style={styles.editButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ✏️ Editar perfil
            </button>
          </div>
          
          <div style={styles.profileContent}>
            <h2 style={styles.sectionTitle}>Acerca de mí</h2>
            <div style={styles.bio}>{userProfile.bio}</div>
            
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
            
            <h2 style={styles.sectionTitle}>Intereses</h2>
            <div style={styles.interestTags}>
              {userProfile.interests.map((interest, index) => (
                <div key={index} style={styles.interestTag}>{interest}</div>
              ))}
            </div>
            
            <h2 style={styles.sectionTitle}>Redes sociales</h2>
            <div style={styles.socialLinks}>
              <a 
                href={userProfile.socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.socialLink}
                title="Twitter"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : colors.secondary;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.background;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🐦
              </a>
              <a 
                href={userProfile.socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.socialLink}
                title="LinkedIn"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : colors.secondary;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.background;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🔗
              </a>
              <a 
                href={userProfile.socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.socialLink}
                title="GitHub"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : colors.secondary;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.background;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🐱
              </a>
            </div>
          </div>
        </div>
        
        <div style={styles.card}>
          <div style={styles.profileContent}>
            <h2 style={styles.sectionTitle}>Actividad reciente</h2>
            <div style={styles.placeholder}>
              ¡Esta es una página de perfil de placeholder! Aquí se mostraría la actividad reciente del usuario.
            </div>
          </div>
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
};

export default ProfilePage; 