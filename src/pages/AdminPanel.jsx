import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colors, spacing, typography, shadows, borderRadius } from '../styles/theme';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext';
import { deletePublicacion } from '../services/publicacionesService';
import { toast } from 'react-toastify';
import { useAdminPosts } from '../components/admin/utils/useAdminPosts';

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuth, isSuperUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft'
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Usar el hook personalizado para cargar los posts del administrador
  const { 
    posts, 
    loading: isLoading, 
    error,
    refreshPosts,
    removePost
  } = useAdminPosts({ 
    adminId: user?.id, 
    searchTerm, 
    filter 
  });

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!isSuperUser) {
      navigate('/');
      toast.error('Acceso denegado. Se requieren privilegios de administrador.');
      return;
    }
  }, [isAuth, isSuperUser, navigate]);

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  // Ocultar notificación después de 3 segundos
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Manejar eliminación de publicación
  const handleDeletePost = async (postId) => {
    try {
      await deletePublicacion(postId);
      removePost(postId); // Eliminar del estado local
      toast.success('Publicación eliminada correctamente');
      setConfirmDelete(null);
      showNotification('Publicación eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      toast.error('Error al eliminar la publicación');
    }
  };

  // Manejar edición de publicación
  const handleEditPost = (postId) => {
    showNotification('Preparando publicación para editar...', 'info');
    navigate(`/admin/post/edit/${postId}`);
  };

  // Manejar visualización de publicación
  const handleViewPost = (postId) => {
    navigate(`/blog/post/${postId}`);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'publicado': return { bg: isDarkMode ? '#1b4d3e' : '#e6f7ef', text: isDarkMode ? '#4ade80' : '#166534' };
      case 'borrador': return { bg: isDarkMode ? '#3b3054' : '#f3e8ff', text: isDarkMode ? '#c084fc' : '#7e22ce' };
      default: return { bg: isDarkMode ? '#374151' : '#f3f4f6', text: isDarkMode ? '#9ca3af' : '#4b5563' };
    }
  };

  // Procesar imagen de portada
  const getImageUrl = (imageData) => {
    if (!imageData) return '/assets/images/placeholder.jpg';
    
    // Si ya es una URL o un string de base64, devolverlo tal cual
    if (typeof imageData === 'string') {
      return imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`;
    }
    
    // Si es un objeto, intentar convertirlo a string
    try {
      if (typeof imageData === 'object') {
        const imgString = JSON.stringify(imageData);
        console.warn('Imagen en formato objeto:', imgString);
      }
    } catch (e) {
      console.error('Error al procesar imagen:', e);
    }
    
    return '/assets/images/placeholder.jpg';
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
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
      flexWrap: 'wrap',
      gap: spacing.md
    },
    title: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      margin: 0
    },
    pageTitle: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.primary,
      margin: `${spacing.xl} 0`,
      textAlign: 'center',
      borderBottom: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.primary}`,
      paddingBottom: spacing.md
    },
    createButton: {
      backgroundColor: isDarkMode ? colors.primaryDark : colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: borderRadius.md,
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      boxShadow: shadows.sm
    },
    filters: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
      flexWrap: 'wrap',
      gap: spacing.md
    },
    searchContainer: {
      position: 'relative',
      flex: 1,
      maxWidth: '400px'
    },
    searchInput: {
      width: '100%',
      padding: `${spacing.sm} ${spacing.xl} ${spacing.sm} ${spacing.xl}`,
      borderRadius: borderRadius.md,
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.gray200}`,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white,
      color: isDarkMode ? colors.white : colors.textPrimary,
      fontSize: typography.fontSize.md,
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    searchIcon: {
      position: 'absolute',
      left: spacing.sm,
      top: '50%',
      transform: 'translateY(-50%)',
      color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : colors.textSecondary
    },
    filterButtons: {
      display: 'flex',
      gap: spacing.sm
    },
    filterButton: (isActive) => ({
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.md,
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.gray200}`,
      backgroundColor: isActive 
        ? (isDarkMode ? colors.primaryDark : colors.primary) 
        : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.white),
      color: isActive 
        ? colors.white 
        : (isDarkMode ? colors.white : colors.textPrimary),
      fontSize: typography.fontSize.sm,
      fontWeight: isActive ? typography.fontWeight.semiBold : typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }),
    postsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.md
    },
    postCard: {
      backgroundColor: isDarkMode ? '#0a1919' : colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.gray200}`,
      '&:hover': {
        boxShadow: shadows.md,
        transform: 'translateY(-2px)'
      }
    },
    postHeader: {
      display: 'flex',
      padding: spacing.md,
      borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.gray200}`,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(31, 78, 78, 0.02)'
    },
    postImageContainer: {
      width: '120px',
      height: '80px',
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#121212' : colors.gray100,
      flexShrink: 0
    },
    postImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    postInfo: {
      flex: 1,
      marginLeft: spacing.md,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.textPrimary,
      marginBottom: spacing.xs
    },
    postMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? colors.gray300 : colors.textSecondary
    },
    postDate: {
      display: 'flex',
      alignItems: 'center'
    },
    postStatus: (status) => ({
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      backgroundColor: getStatusColor(status).bg,
      color: getStatusColor(status).text,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold
    }),
    postContent: {
      padding: spacing.md
    },
    postExcerpt: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary,
      marginBottom: spacing.md,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    postActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: spacing.sm
    },
    actionButton: (type) => {
      let bgColor, hoverBgColor, color;
      
      switch (type) {
        case 'edit':
          bgColor = isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)';
          hoverBgColor = isDarkMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)';
          color = isDarkMode ? '#60a5fa' : '#2563eb';
          break;
        case 'delete':
          bgColor = isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)';
          hoverBgColor = isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)';
          color = isDarkMode ? '#f87171' : '#dc2626';
          break;
        case 'view':
          bgColor = isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)';
          hoverBgColor = isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)';
          color = isDarkMode ? '#34d399' : '#059669';
          break;
        default:
          bgColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
          hoverBgColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
          color = isDarkMode ? colors.white : colors.textPrimary;
      }
      
      return {
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: bgColor,
        color: color,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: hoverBgColor,
          color: type === 'edit' ? '#4CAF50' : type === 'delete' ? '#F44336' : color,
          transform: 'translateY(-2px)',
          boxShadow: type === 'edit' ? '0 4px 8px rgba(76, 175, 80, 0.3)' : 
                    type === 'delete' ? '0 4px 8px rgba(244, 67, 54, 0.3)' : 'none'
        }
      };
    },
    emptyState: {
      textAlign: 'center',
      padding: `${spacing.xl} ${spacing.md}`,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.gray100,
      borderRadius: borderRadius.lg,
      color: isDarkMode ? colors.gray300 : colors.textSecondary
    },
    loadingState: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: `${spacing.xl} ${spacing.md}`,
      color: isDarkMode ? colors.white : colors.primary
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: `4px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(31, 78, 78, 0.1)'}`,
      borderRadius: '50%',
      borderTop: `4px solid ${isDarkMode ? colors.white : colors.primary}`,
      animation: 'spin 1s linear infinite'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: confirmDelete ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#0a1919' : colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      maxWidth: '500px',
      width: '90%',
      boxShadow: shadows.lg
    },
    modalTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.white : colors.textPrimary,
      marginBottom: spacing.md
    },
    modalText: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.gray300 : colors.textSecondary,
      marginBottom: spacing.xl
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: spacing.md
    },
    cancelButton: {
      padding: `${spacing.sm} ${spacing.lg}`,
      borderRadius: borderRadius.md,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.gray200,
      color: isDarkMode ? colors.white : colors.textPrimary,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    deleteButton: {
      padding: `${spacing.sm} ${spacing.lg}`,
      borderRadius: borderRadius.md,
      backgroundColor: colors.error,
      color: colors.white,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    notification: {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      minWidth: '300px',
      maxWidth: '90%',
      backgroundColor: notification.type === 'success' 
        ? 'rgba(76, 175, 80, 0.9)' 
        : (notification.type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 'rgba(33, 150, 243, 0.9)'),
      color: colors.white,
      padding: `${spacing.md} ${spacing.xl}`,
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
      zIndex: 9999,
      textAlign: 'center',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      display: notification.show ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      animation: notification.show ? 'fadeInUp 0.3s forwards' : 'none',
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>Panel de Administración</h1>
        <div style={styles.header} className="header">
          <h2 style={styles.title}>Gestión de Publicaciones</h2>
          <button 
            onClick={() => {
              // Navigate to create post page with instant reload
              if(location.pathname === '/admin/post') {
                window.location.reload();
              } else {
                window.location.href = '/admin/post';
              }
            }}
            style={styles.createButton} 
            className="createButton"
          >
            <FaPlus /> Crear Nueva Publicación
          </button>
        </div>

        <div style={styles.filters} className="filters">
          <div style={styles.searchContainer} className="searchContainer">
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={styles.filterButtons} className="filterButtons">
            <button
              style={styles.filterButton(filter === 'all')}
              onClick={() => setFilter('all')}
            >
              Todos
            </button>
            <button
              style={styles.filterButton(filter === 'published')}
              onClick={() => setFilter('published')}
            >
              Publicados
            </button>
            <button
              style={styles.filterButton(filter === 'draft')}
              onClick={() => setFilter('draft')}
            >
              Borradores
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner}></div>
          </div>
        ) : posts.length > 0 ? (
          <div style={styles.postsContainer}>
            {posts.map(post => (
              <div key={post.ID_publicaciones} style={styles.postCard} className="postCard">
                <div style={styles.postHeader} className="postHeader">
                  <div style={styles.postImageContainer} className="postImageContainer">
                    <img
                      src={getImageUrl(post.Imagen_portada)}
                      alt={post.Titulo}
                      style={styles.postImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div style={styles.postInfo} className="postInfo">
                    <div style={styles.postTitle}>{post.Titulo}</div>
                    <div style={styles.postMeta}>
                      <div style={styles.postDate}>
                        {formatDate(post.Fecha_modificacion || post.Fecha_creacion)}
                      </div>
                      <div style={styles.postStatus(post.Estado)}>
                        {post.Estado === 'publicado' ? 'Publicado' : 'Borrador'}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={styles.postContent}>
                  {post.Resumen && (
                    <div style={styles.postExcerpt}>{post.Resumen}</div>
                  )}
                  <div style={styles.postActions}>
                    <button
                      style={styles.actionButton('view')}
                      onClick={() => handleViewPost(post.ID_publicaciones)}
                      title="Ver publicación"
                    >
                      <FaEye />
                    </button>
                    <button
                      style={styles.actionButton('edit')}
                      onClick={() => handleEditPost(post.ID_publicaciones)}
                      title="Editar publicación"
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={styles.actionButton('delete')}
                      onClick={() => setConfirmDelete(post.ID_publicaciones)}
                      title="Eliminar publicación"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <h3>No se encontraron publicaciones</h3>
            <p>No hay publicaciones asociadas a tu cuenta de administrador (ID: {user?.id || 'desconocido'}).</p>
            <p>Esto puede deberse a una de las siguientes razones:</p>
            <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto', paddingLeft: '20px' }}>
              <li>Aún no has creado ninguna publicación</li>
              <li>Tus publicaciones están asociadas a un ID de administrador diferente</li>
              <li>Hay un problema de conexión con el servidor</li>
            </ul>
            <div style={{ marginTop: '20px', backgroundColor: isDarkMode ? '#1a2e2d' : '#f0f7f7', padding: '15px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Información de depuración:</h4>
              <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '14px' }}>
                ID de usuario: {user?.id || 'No disponible'}
              </p>
              <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '14px' }}>
                Nombre de usuario: {user?.username || 'No disponible'}
              </p>
              <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '14px' }}>
                Es superusuario: {isSuperUser ? 'Sí' : 'No'}
              </p>
              {error && (
                <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '14px', color: 'red' }}>
                  Error: {error}
                </p>
              )}
            </div>
            <p style={{ marginTop: '20px' }}>Puedes intentar:</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => refreshPosts()} 
                style={{
                  padding: '8px 16px',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Recargar publicaciones
              </button>
              <button 
                onClick={() => {
                  // Navigate to create post page with instant reload
                  if(location.pathname === '/admin/post') {
                    window.location.reload();
                  } else {
                    window.location.href = '/admin/post';
                  }
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isDarkMode ? colors.primaryDark : colors.primary,
                  color: 'white',
                  textDecoration: 'none',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Crear una publicación
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      {confirmDelete && (
        <div style={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Confirmar eliminación</h3>
            <p style={styles.modalText}>
              ¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.
            </p>
            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => handleDeletePost(confirmDelete)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        /* Media queries para responsividad */
        @media (max-width: 768px) {
          .postCard {
            flex-direction: column;
          }
          .postImageContainer {
            width: 100% !important;
            height: 120px !important;
            margin-bottom: 10px;
          }
          .postInfo {
            margin-left: 0 !important;
            margin-top: 10px;
          }
          .postHeader {
            flex-direction: column;
          }
          .filters {
            flex-direction: column;
            align-items: stretch !important;
          }
          .searchContainer {
            max-width: 100% !important;
            margin-bottom: 10px;
          }
          .filterButtons {
            justify-content: space-between;
          }
          .header {
            flex-direction: column;
            align-items: stretch !important;
          }
          .createButton {
            width: 100%;
            justify-content: center;
            margin-top: 10px;
          }
          .pageTitle {
            font-size: 1.8rem !important;
          }
        }
      `}</style>
      
      {/* Notificación */}
      {notification.show && (
        <div style={styles.notification}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 