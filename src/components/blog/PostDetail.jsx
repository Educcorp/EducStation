import React from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius } from '../../styles/theme';
import ComentariosList from '../comentarios/ComentariosList';

const PostDetail = ({ post }) => {
  const { colors, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  // Extraer el ID del post directamente de los parámetros de la URL
  const { id: urlId } = useParams();
  
  // Asegurarse de que tenemos un ID válido, sea del objeto post o de la URL
  const postId = post?.ID_post || urlId;
  
  console.log('ID del post para comentarios:', {
    fromPost: post?.ID_post,
    fromURL: urlId,
    finalId: postId
  });

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para renderizar la imagen de portada (Base64 o HTML)
  const renderFeaturedImage = () => {
    // Prioridad 1: Imagen en Base64 desde Imagen_portada
    if (post.Imagen_portada) {
      // Verificar primero si Imagen_portada es un string
      if (typeof post.Imagen_portada !== 'string') {
        console.error("Error: Imagen_portada no es un string", post.Imagen_portada);
        return (
          <img 
            src="https://via.placeholder.com/800x400?text=Error+de+imagen"
            alt={post.Titulo} 
            style={styles.featuredImage}
          />
        );
      }
      
      console.log("Tipo de imagen detectado:", 
        post.Imagen_portada.startsWith('data:image') ? 'Base64' : 'HTML');

      // Verificar si es Base64
      if (post.Imagen_portada.startsWith('data:image')) {
        return (
          <img 
            src={post.Imagen_portada} 
            alt={post.Titulo} 
            style={styles.featuredImage}
          />
        );
      } else if (post.Imagen_portada.includes('<img')) {
        // Si es etiqueta HTML img, renderizarla como tal
        return (
          <div 
            style={styles.featuredImageContainer}
            dangerouslySetInnerHTML={{ __html: post.Imagen_portada }}
          />
        );
      } else {
        // Si no es Base64 ni etiqueta img, intentar renderizar como URL
        return (
          <img 
            src={post.Imagen_portada} 
            alt={post.Titulo} 
            style={styles.featuredImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x400?text=Error+al+cargar+imagen';
            }}
          />
        );
      }
    }
    
    // Prioridad 2: Imagen desde Imagen_destacada_ID
    if (post.Imagen_destacada_ID) {
      return (
        <img 
          src={`${process.env.REACT_APP_API_URL}/api/imagenes/${post.Imagen_destacada_ID}`} 
          alt={post.Titulo} 
          style={styles.featuredImage}
        />
      );
    }
    
    // Si no hay imagen, no mostrar nada
    return null;
  };

  // Función para navegar de vuelta al blog con recarga
  const navigateToBlог = () => {
    navigate('/blog', { state: { forceReload: true } });
  };

  // Estilos para el componente
  const styles = {
    article: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: spacing.lg,
      backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
      borderRadius: borderRadius.md,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
      marginBottom: spacing.xl,
    },
    title: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.textLight : colors.primary,
      marginBottom: spacing.md,
    },
    meta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
    },
    featuredImage: {
      width: '100%',
      maxHeight: '400px',
      objectFit: 'cover',
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
    },
    featuredImageContainer: {
      width: '100%',
      maxHeight: '400px',
      overflow: 'hidden',
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
      '& img': {
        width: '100%',
        objectFit: 'cover',
      }
    },
    content: {
      fontSize: typography.fontSize.md,
      lineHeight: '1.7',
      color: isDarkMode ? colors.textLight : colors.textPrimary,
    },
    categories: {
      display: 'flex',
      gap: spacing.sm,
      marginTop: spacing.lg,
      flexWrap: 'wrap',
    },
    category: {
      display: 'inline-block',
      padding: `${spacing.xs} ${spacing.sm}`,
      backgroundColor: colors.secondary,
      color: colors.white,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      textDecoration: 'none',
    },
    backLink: {
      display: 'inline-block',
      marginTop: spacing.xl,
      color: colors.secondary,
      textDecoration: 'none',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
    },
  };

  if (!post) {
    return null;
  }

  return (
    <article style={styles.article}>
      <header style={styles.header}>
        <h1 style={styles.title}>{post.Titulo}</h1>
        <div style={styles.meta}>
          <span>Por {post.NombreAdmin || 'Admin'}</span>
          <span>{formatDate(post.Fecha_creacion)}</span>
        </div>
        {renderFeaturedImage()}
      </header>
      
      <div 
        style={styles.content}
        dangerouslySetInnerHTML={{ __html: post.Contenido }}
      />
      
      {post.categorias && post.categorias.length > 0 && (
        <div style={styles.categories}>
          <span>Categorías: </span>
          {post.categorias.map(cat => (
            <Link 
              key={cat.ID_categoria} 
              to={`/categoria/${cat.ID_categoria}`} 
              style={styles.category}
            >
              {cat.Nombre_categoria}
            </Link>
          ))}
        </div>
      )}
      
      {/* Separador visual antes de los comentarios */}
      <div className="comentarios-separador" style={{
        borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        margin: '2rem 0',
        width: '100%'
      }}></div>
      
      {/* Sección de comentarios */}
      <ComentariosList postId={postId} />
      
      <button 
        onClick={navigateToBlог}
        style={{
          ...styles.backLink,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontFamily: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit'
        }}
      >
        ← Volver al blog
      </button>
    </article>
  );
};

export default PostDetail;
