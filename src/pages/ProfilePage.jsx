import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { getUserProfile, updateUserAvatar } from '../services/userService';
import { getAllPublicaciones } from '../services/publicacionesService';
import { deleteAccount } from '../services/authService';

const ProfilePage = () => {
  const { user, isAuth, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Recarga forzada al entrar (solo una vez por sesión)
  useEffect(() => {
    if (location.state && location.state.forceReload) {
      // Verificar si ya se realizó la recarga en esta sesión de navegación
      if (!sessionStorage.getItem('profilepage-reloaded')) {
        // Marcar que se va a realizar la recarga
        sessionStorage.setItem('profilepage-reloaded', 'true');
        // Limpiar el estado para evitar bucles infinitos
        window.history.replaceState(null, '', window.location.pathname);
        // Realizar la recarga
        window.location.reload();
      }
    } else {
      // Limpiar la marca de recarga si no hay forceReload
      sessionStorage.removeItem('profilepage-reloaded');
    }
  }, [location]);

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

        // Formatear la fecha de registro con hora incluida
        let joinDate;
        if (userData.date_joined) {
          const date = new Date(userData.date_joined);
          joinDate = date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        } else {
          joinDate = new Date().toLocaleDateString();
        }

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

          console.log(`Imagen comprimida: Original ${Math.round(file.size / 1024)}KB, Comprimida ${Math.round(dataUrl.length / 1024)}KB`);
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
        console.log('Procesando archivo:', file.name, 'tipo:', file.type, 'tamaño:', Math.round(file.size / 1024), 'KB');
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

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);

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
      setDeleteError(error.message || 'Error al eliminar la cuenta');
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

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Función robusta para obtener el avatar o el placeholder
  const getAvatarSrc = (avatar) => {
    if (!avatar || avatar === "" || avatar === "null" || avatar.length < 30) {
      return '/assets/images/logoBN.png';
    }
    return avatar.startsWith('data:image') ? avatar : `data:image/jpeg;base64,${avatar}`;
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
      backgroundColor: colors.white,
      padding: `${spacing.xl} ${spacing.xl}`,
      color: colors.primary,
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
      border: `4px solid ${colors.primary}`,
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
                  src={getAvatarSrc(userProfile?.avatar)}
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
                <div style={styles.infoValue} title="Fecha y hora exacta de registro">{userProfile.joinDate}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.profileContent}>
            <h2 style={styles.sectionTitle}>Frase del momento</h2>
            <div style={styles.placeholder}>
              {obtenerFraseAleatoria()}
            </div>
          </div>
        </div>

        {/* Sección de Eliminar Cuenta */}
        <div style={{
          ...styles.card,
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
      <Footer />

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

              {deleteError && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#ffebee',
                  color: '#d32f2f',
                  borderRadius: '8px',
                  marginTop: '16px',
                  fontSize: '0.9rem',
                  border: '1px solid #ffcdd2'
                }}>
                  {deleteError}
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
          
          @media (max-width: 600px) {
            .btn-delete-account {
              width: 100%;
              margin-top: 16px;
            }
          }
        `
      }} />
    </div>
  );
};

export default ProfilePage; 