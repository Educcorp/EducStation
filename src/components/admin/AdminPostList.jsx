import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../styles/theme';
import { getAllPublicaciones } from '../../services/publicacionesService';

const AdminPostList = ({ 
  searchTerm, 
  filter = 'all', 
  sortOrder = 'recientes',
  onDelete,
  className 
}) => {
  const { colors, isDarkMode } = useTheme();
  
  // Estados locales
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar publicaciones
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('AdminPostList: Cargando publicaciones...');
        
        const data = await getAllPublicaciones(100, 0, null);
        console.log('AdminPostList: Datos recibidos:', data);
        
        if (data && Array.isArray(data)) {
          setPosts(data);
          console.log(`AdminPostList: ${data.length} publicaciones cargadas`);
        } else {
          console.error('AdminPostList: Datos no válidos recibidos:', data);
          setPosts([]);
        }
      } catch (error) {
        console.error('AdminPostList: Error al cargar publicaciones:', error);
        setError('Error al cargar las publicaciones');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtrar y ordenar posts
  const getFilteredAndSortedPosts = () => {
    let result = [...posts];
    
    // Filtrar por término de búsqueda
    if (searchTerm && searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.Titulo?.toLowerCase().includes(searchTermLower) || 
        post.Resumen?.toLowerCase().includes(searchTermLower) ||
        post.Contenido?.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filtrar por estado
    if (filter !== 'all') {
      const estado = filter === 'published' ? 'publicado' : 'borrador';
      result = result.filter(post => post.Estado === estado);
    }
    
    // Ordenar
    switch (sortOrder) {
      case 'recientes':
        result.sort((a, b) => {
          const dateA = a.Fecha_modificacion ? new Date(a.Fecha_modificacion) : new Date(a.Fecha_creacion);
          const dateB = b.Fecha_modificacion ? new Date(b.Fecha_modificacion) : new Date(b.Fecha_creacion);
          return dateB - dateA;
        });
        break;
      case 'antiguos':
        result.sort((a, b) => {
          const dateA = a.Fecha_modificacion ? new Date(a.Fecha_modificacion) : new Date(a.Fecha_creacion);
          const dateB = b.Fecha_modificacion ? new Date(b.Fecha_modificacion) : new Date(b.Fecha_creacion);
          return dateA - dateB;
        });
        break;
      case 'alfabetico':
        result.sort((a, b) => a.Titulo.localeCompare(b.Titulo));
        break;
      default:
        break;
    }
    
    return result;
  };

  const displayPosts = getFilteredAndSortedPosts();

  // Estilos para el componente
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${spacing.md}`,
    },
    postsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: spacing.lg,
      marginBottom: spacing.xl
    },
    errorMessage: {
      backgroundColor: colors.error,
      color: colors.white,
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      textAlign: 'center',
      marginBottom: spacing.xl
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: typography.fontSize.lg,
      color: colors.textSecondary
    },
    emptyState: {
      textAlign: 'center',
      padding: spacing.xxl,
      color: colors.textSecondary
    },
    postCard: {
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      boxShadow: shadows.md,
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
    },
    postImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.backgroundLight
    },
    postContent: {
      padding: spacing.lg,
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
      color: isDarkMode ? colors.white : colors.textPrimary,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    postExcerpt: {
      fontSize: typography.fontSize.md,
      color: isDarkMode ? colors.textLight : colors.textSecondary,
      marginBottom: spacing.md,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    postMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
      paddingTop: spacing.md,
      borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
    },
    postDate: {
      fontSize: typography.fontSize.sm,
      color: isDarkMode ? colors.textLight : colors.textSecondary
    },
    postStatus: {
      display: 'inline-block',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium
    },
    actionsContainer: {
      display: 'flex',
      gap: spacing.sm,
      marginTop: spacing.md,
      justifyContent: 'flex-end'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    editButton: {
      backgroundColor: isDarkMode ? colors.warningDark : colors.warning,
      color: isDarkMode ? colors.black : colors.white
    },
    viewButton: {
      backgroundColor: isDarkMode ? colors.infoDark : colors.info,
      color: colors.white
    },
    deleteButton: {
      backgroundColor: isDarkMode ? colors.errorDark : colors.error,
      color: colors.white
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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
    if (!imageData) return '/assets/images/logoBN.png';
    
    if (typeof imageData === 'string') {
      // Si ya es una URL completa (http/https)
      if (imageData.startsWith('http')) {
        return imageData;
      }
      // Si es una ruta de assets
      if (imageData.startsWith('/assets')) {
        return imageData;
      }
      // Si ya es una imagen base64 completa
      if (imageData.startsWith('data:image')) {
        return imageData;
      }
      // Si es solo el contenido base64 sin el prefijo
      if (imageData.length > 100 && !imageData.includes('<')) {
        return `data:image/jpeg;base64,${imageData}`;
      }
      // Si es una etiqueta HTML img, extraer el src
      if (imageData.includes('<img') && imageData.includes('src=')) {
        const srcMatch = imageData.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          return srcMatch[1];
        }
      }
    }
    
    return '/assets/images/logoBN.png';
  };

  // Procesar resumen para mostrar texto limpio
  const getCleanSummary = (post) => {
    // Prioridad 1: Usar el campo Resumen si existe y no está vacío
    if (post.Resumen && post.Resumen.trim() !== '') {
      // Si el resumen contiene HTML, extraer solo el texto
      if (post.Resumen.includes('<') && post.Resumen.includes('>')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.Resumen;
        const cleanText = tempDiv.textContent || tempDiv.innerText || '';
        return cleanText.trim() || 'Sin resumen disponible';
      }
      return post.Resumen;
    }
    
    // Prioridad 2: Si no hay resumen, extraer del contenido
    if (post.Contenido && post.Contenido.trim() !== '') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post.Contenido;
      const cleanText = tempDiv.textContent || tempDiv.innerText || '';
      
      // Truncar a 150 caracteres máximo
      if (cleanText.length > 150) {
        return cleanText.substring(0, 150).trim() + '...';
      }
      return cleanText.trim() || 'Sin contenido disponible';
    }
    
    return 'Sin resumen disponible';
  };

  if (loading) {
    return (
      <div style={styles.loadingSpinner}>
        Cargando publicaciones...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorMessage}>
        {error}
      </div>
    );
  }

  if (displayPosts.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h3>No se encontraron publicaciones</h3>
        <p>
          {searchTerm || filter !== 'all' 
            ? 'No hay publicaciones que coincidan con los criterios de búsqueda.'
            : 'No hay publicaciones disponibles.'}
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container} className={className}>
      <div style={styles.postsGrid}>
        {displayPosts.map((post) => {
          const statusColors = getStatusColor(post.Estado);
          return (
            <div key={post.ID_publicaciones} style={styles.postCard}>
              <img
                src={getImageUrl(post.Imagen_portada)}
                alt={post.Titulo}
                style={styles.postImage}
                onError={(e) => {
                  e.target.src = '/assets/images/logoBN.png';
                }}
              />
              
              <div style={styles.postContent}>
                <h3 style={styles.postTitle}>{post.Titulo}</h3>
                <p style={styles.postExcerpt}>{getCleanSummary(post)}</p>
                
                <div style={styles.postMeta}>
                  <span style={styles.postDate}>
                    {formatDate(post.Fecha_modificacion || post.Fecha_creacion)}
                  </span>
                  <span
                    style={{
                      ...styles.postStatus,
                      backgroundColor: statusColors.bg,
                      color: statusColors.text
                    }}
                  >
                    {post.Estado}
                  </span>
                </div>
                
                <div style={styles.actionsContainer}>
                  <Link
                    to={`/blog/${post.ID_publicaciones}`}
                    style={{...styles.actionButton, ...styles.viewButton}}
                    title="Ver publicación"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/admin/post/edit/${post.ID_publicaciones}`}
                    style={{...styles.actionButton, ...styles.editButton}}
                    title="Editar publicación"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    style={{...styles.actionButton, ...styles.deleteButton}}
                    onClick={() => onDelete && onDelete(post.ID_publicaciones)}
                    title="Eliminar publicación"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPostList; 