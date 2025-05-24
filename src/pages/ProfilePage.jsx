import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { getUserProfile, updateUserAvatar } from '../services/userService';
import { getAllPublicaciones } from '../services/publicacionesService';

const ProfilePage = () => {
  const { user, isAuth } = useAuth();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Frases motivadoras sobre la educación
  const frasesMotivadoras = [
    "La educación es el arma más poderosa que puedes usar para cambiar el mundo. — Nelson Mandela",
    "La educación no cambia el mundo, cambia a las personas que van a cambiar el mundo. — Paulo Freire",
    "El aprendizaje es un tesoro que seguirá a su dueño a todas partes. — Proverbio chino",
    "La educación es el pasaporte hacia el futuro, el mañana pertenece a quienes se preparan para él hoy. — Malcolm X",
    "La raíz de la educación es amarga, pero su fruto es dulce. — Aristóteles",
    "La mente no es un vaso por llenar, sino una lámpara por encender. — Plutarco",
    "La educación ayuda a la persona a aprender a ser lo que es capaz de ser. — Hesíodo",
    "La educación es el movimiento de la oscuridad a la luz. — Allan Bloom",
    "El objetivo de la educación es la virtud y el deseo de convertirse en un buen ciudadano. — Platón",
    "La educación es el desarrollo en el hombre de toda la perfección de que su naturaleza es capaz. — Kant"
  ];

  function obtenerFraseAleatoria() {
    const idx = Math.floor(Math.random() * frasesMotivadoras.length);
    return frasesMotivadoras[idx];
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!isAuth) {
          window.location.href = '/login';
          return;
        }
        
        // Utilizamos el servicio para obtener los datos reales del usuario
        const userData = await getUserProfile();
        
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
          avatar: userData.avatar
            ? (userData.avatar.startsWith('data:image') ? userData.avatar : `data:image/jpeg;base64,${userData.avatar}`)
            : '/assets/images/logoBN.png'
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

  // Efecto para cargar las publicaciones del usuario
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!isAuth) return;
      
      try {
        setIsLoadingPosts(true);
        const posts = await getAllPublicaciones(20, 0, 'publicado');
        setUserPosts(posts);
      } catch (error) {
        console.error('Error al cargar publicaciones del usuario:', error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [isAuth]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Función para comprimir la imagen
  const compressImage = (file, maxSizeKB = 500) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calcular nuevas dimensiones manteniendo la relación de aspecto
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Ajustar calidad basada en el tamaño del archivo
          let quality = 0.7;
          if (file.size > 1024 * 1024) {
            quality = 0.5; // Para archivos mayores a 1MB
          }
          
          // Convertir a JPEG para reducir tamaño
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          
          console.log(`Imagen comprimida: Original ${Math.round(file.size/1024)}KB, Comprimida ${Math.round(dataUrl.length/1024)}KB`);
          resolve(dataUrl);
        };
        
        img.onerror = (error) => {
          reject(error);
        };
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        console.log('Procesando archivo:', file.name, 'tipo:', file.type, 'tamaño:', Math.round(file.size/1024), 'KB');
        setIsUploading(true);
        setErrorMessage('');
        
        // Comprimir la imagen antes de enviarla
        const compressedImage = await compressImage(file);
        
          try {
          console.log('Imagen comprimida, preparando envío al servidor');
            
            // Enviar directamente al servidor
          const result = await updateUserAvatar(compressedImage);
            
            // Actualizar el avatar en la interfaz con la respuesta del servidor
            setUserProfile(prev => ({
              ...prev,
            avatar: compressedImage // Usamos la imagen comprimida para mostrarla de inmediato
            }));
            
            console.log('Avatar actualizado correctamente en el servidor');
            setIsUploading(false);
          } catch (error) {
            console.error('Error al actualizar el avatar:', error);
            setErrorMessage(`Error al actualizar el avatar: ${error.message}`);
            setIsUploading(false);
          }
      } catch (error) {
        console.error('Error al procesar la imagen:', error);
        setIsUploading(false);
        setErrorMessage('Error al procesar la imagen. Por favor, intenta con otra imagen.');
      }
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
    },
    postsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.md,
      marginTop: spacing.md
    },
    postCard: {
      display: 'flex',
      flexDirection: 'row',
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      boxShadow: shadows.sm,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.gray200}`,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: shadows.md
      }
    },
    postImageContainer: {
      width: '120px',
      minWidth: '120px',
      height: '120px',
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#121212' : colors.gray100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    postImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    postContent: {
      padding: spacing.md,
      flex: 1
    },
    postTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.xs,
      color: isDarkMode ? colors.white : colors.textPrimary
    },
    postLink: {
      color: 'inherit',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
        color: colors.primary
      }
    },
    postMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? colors.gray300 : colors.textSecondary,
      marginBottom: spacing.xs
    },
    postDate: {
      fontSize: typography.fontSize.xs
    },
    postStatus: {
      display: 'flex',
      alignItems: 'center',
      fontSize: typography.fontSize.xs
    },
    postExcerpt: {
      fontSize: typography.fontSize.sm,
      marginBottom: spacing.xs,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    postCategories: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing.xs
    },
    categoryTag: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.secondary,
      color: isDarkMode ? colors.white : colors.primary,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium
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

  console.log('Publicaciones del usuario (userPosts):', userPosts);

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
              {obtenerFraseAleatoria()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage; 