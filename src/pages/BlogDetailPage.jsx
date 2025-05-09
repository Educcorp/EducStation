// src/pages/BlogDetailPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostCard from '../components/blog/PostCard';
import { spacing, typography, shadows, borderRadius, transitions } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

const BlogDetailPage = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { colors } = useTheme(); // Obtenemos los colores del tema actual
  
  // Simulación de post detallado
  const post = {
    id: 1,
    title: 'Herramientas Tecnológicas para la Educación',
    image: '/api/placeholder/1200/600',
    category: 'herramientas',
    time: '4 horas atrás',
    author: {
      name: 'María Rodríguez',
      avatar: '/api/placeholder/60/60',
      role: 'Docente de Educación Superior'
    },
    publishDate: '26 de febrero, 2025',
    content: `
      <p>La incorporación de la tecnología en el aula se ha vuelto indispensable en la era digital. Sin embargo, muchos educadores enfrentan desafíos al intentar integrarla de manera efectiva en sus métodos pedagógicos. Este artículo explora estrategias prácticas para optimizar el uso de herramientas tecnológicas y maximizar su impacto en el aprendizaje.</p>
      
      <h2>Identificando las necesidades específicas</h2>
      
      <p>Antes de implementar cualquier herramienta tecnológica, es crucial evaluar las necesidades específicas de los estudiantes y los objetivos educativos. No toda tecnología es adecuada para todos los contextos o materias.</p>
      
      <p>Considere estas preguntas antes de incorporar una nueva herramienta:</p>
      
      <ul>
        <li>¿Qué habilidades específicas necesitan desarrollar mis estudiantes?</li>
        <li>¿Cómo puede esta tecnología facilitar el aprendizaje de conceptos complejos?</li>
        <li>¿Está esta herramienta alineada con los objetivos curriculares?</li>
        <li>¿Es accesible para todos mis estudiantes?</li>
      </ul>
      
      <h2>Integrando la tecnología de manera significativa</h2>
      
      <p>La tecnología debe servir como un medio para potenciar el aprendizaje, no como un fin en sí mismo. Los educadores efectivos integran herramientas digitales de manera que complementen y enriquezcan sus estrategias de enseñanza existentes.</p>
      
      <p>El modelo SAMR (Sustitución, Aumento, Modificación, Redefinición) proporciona un marco útil para evaluar cómo la tecnología está transformando las experiencias educativas:</p>
      
      <blockquote>
        "La verdadera transformación ocurre cuando la tecnología permite nuevas tareas que antes eran inconcebibles, no cuando simplemente reemplaza métodos tradicionales sin añadir valor."
      </blockquote>
      
      <h2>Capacitación continua y comunidades de práctica</h2>
      
      <p>El panorama tecnológico evoluciona rápidamente, y mantenerse actualizado puede resultar abrumador. Establecer comunidades de práctica entre colegas puede facilitar el intercambio de conocimientos y experiencias.</p>
      
      <p>Además, muchas plataformas educativas ofrecen recursos gratuitos para la formación docente. Invertir tiempo en desarrollar competencias digitales no solo beneficia a los estudiantes, sino que también puede revitalizar la pasión por la enseñanza.</p>
      
      <h2>Conclusión</h2>
      
      <p>La optimización del uso de tecnología en el aula no se trata de utilizar las herramientas más avanzadas o numerosas, sino de seleccionar e implementar aquellas que genuinamente mejoran el proceso de aprendizaje. Con un enfoque reflexivo y centrado en el estudiante, la tecnología puede convertirse en un poderoso aliado para los educadores comprometidos con ofrecer experiencias educativas significativas y relevantes.</p>
    `,
    tags: ['Tecnología Educativa', 'Innovación Pedagógica', 'Educación Digital', 'Recursos Didácticos'],
    relatedPosts: [
      {
        id: 2,
        title: 'Comunidad y Colaboración en la Educación',
        image: '/api/placeholder/150/100',
        category: 'herramientas',
        time: '2 días atrás',
        number: '03',
        likes: 95
      },
      {
        id: 3,
        title: 'Problemas a enfrentar en la actualidad',
        image: '/api/placeholder/150/100',
        category: 'técnicas de estudio',
        time: '3 días atrás',
        number: '04',
        likes: 87
      },
      {
        id: 4,
        title: 'Desarrollo Profesional Docente',
        image: '/api/placeholder/150/100',
        category: 'tendencias',
        time: '1 semana atrás',
        number: '05',
        likes: 112
      }
    ]
  };

  // Manejar el botón de like
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prevCount => prevCount - 1);
    } else {
      setLikeCount(prevCount => prevCount + 1);
    }
    setIsLiked(!isLiked);
  };
  
  // Estilos CSS
  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: `0 ${spacing.md}`
    },
    breadcrumb: {
      margin: `${spacing.lg} 0`,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      display: "flex",
      alignItems: "center",
      gap: spacing.sm
    },
    breadcrumbLink: {
      color: colors.textSecondary,
      textDecoration: "none",
      transition: transitions.default,
      '&:hover': {
        color: colors.primary
      }
    },
    articleHeader: {
      marginBottom: spacing.xxl
    },
    category: {
      display: "inline-block",
      color: colors.white,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      backgroundColor: colors.primary,
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      textTransform: "capitalize",
      marginBottom: spacing.md
    },
    title: {
      fontSize: typography.fontSize.xxxl,
      color: colors.textPrimary,
      fontWeight: typography.fontWeight.bold,
      lineHeight: 1.2,
      marginBottom: spacing.xl
    },
    meta: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: spacing.lg
    },
    author: {
      display: "flex",
      alignItems: "center",
      gap: spacing.md
    },
    avatar: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      overflow: "hidden",
      border: `3px solid ${colors.white}`,
      boxShadow: shadows.md
    },
    authorInfo: {
      display: "flex",
      flexDirection: "column"
    },
    authorName: {
      fontWeight: typography.fontWeight.semiBold,
      fontSize: typography.fontSize.md,
      color: colors.textPrimary
    },
    authorRole: {
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm
    },
    postDetails: {
      display: "flex",
      alignItems: "center",
      gap: spacing.lg,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: spacing.xs
    },
    featuredImage: {
      width: "100%",
      height: "auto",
      maxHeight: "600px",
      objectFit: "cover",
      borderRadius: borderRadius.lg,
      marginBottom: spacing.xl,
      boxShadow: shadows.md
    },
    content: {
      lineHeight: 1.8,
      color: colors.textPrimary,
      fontSize: typography.fontSize.md,
      '& p': {
        marginBottom: spacing.lg
      },
      '& h2': {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semiBold,
        marginTop: spacing.xl,
        marginBottom: spacing.md,
        color: colors.textPrimary
      },
      '& ul': {
        paddingLeft: spacing.xl,
        marginBottom: spacing.lg
      },
      '& li': {
        marginBottom: spacing.sm
      },
      '& blockquote': {
        borderLeft: `4px solid ${colors.primary}`,
        padding: `${spacing.md} ${spacing.lg}`,
        backgroundColor: colors.gray100,
        fontStyle: "italic",
        margin: `${spacing.lg} 0`,
        borderRadius: `0 ${borderRadius.md} ${borderRadius.md} 0`
      }
    },
    tagsSection: {
      marginTop: spacing.xxl,
      marginBottom: spacing.xl
    },
    tagsTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.md
    },
    tagsList: {
      display: "flex",
      flexWrap: "wrap",
      gap: spacing.sm
    },
    tag: {
      backgroundColor: colors.gray100,
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.round,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      transition: transitions.default,
      cursor: "pointer",
      '&:hover': {
        backgroundColor: colors.primary,
        color: colors.white
      }
    },
    shareSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `${spacing.lg} 0`,
      borderTop: `1px solid ${colors.gray200}`,
      borderBottom: `1px solid ${colors.gray200}`,
      marginBottom: spacing.xxl
    },
    actions: {
      display: "flex",
      gap: spacing.md
    },
    actionButton: {
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.round,
      cursor: "pointer",
      transition: transitions.default,
      border: "none",
      backgroundColor: "transparent",
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      '&:hover': {
        backgroundColor: colors.gray100
      }
    },
    likeButton: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.round,
      cursor: "pointer",
      transition: transitions.default,
      border: "none",
      backgroundColor: active ? colors.primary + '15' : "transparent",
      color: active ? colors.primary : colors.textSecondary,
      fontSize: typography.fontSize.sm,
      '&:hover': {
        backgroundColor: active ? colors.primary + '30' : colors.gray100
      }
    }),
    bookmarkButton: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.round,
      cursor: "pointer",
      transition: transitions.default,
      border: "none",
      backgroundColor: active ? colors.primary + '15' : "transparent",
      color: active ? colors.primary : colors.textSecondary,
      fontSize: typography.fontSize.sm,
      '&:hover': {
        backgroundColor: active ? colors.primary + '30' : colors.gray100
      }
    }),
    shareButtons: {
      display: "flex",
      gap: spacing.sm
    },
    shareButton: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.gray100,
      color: colors.textSecondary,
      transition: transitions.default,
      cursor: "pointer",
      '&:hover': {
        backgroundColor: colors.primary,
        color: colors.white
      }
    },
    relatedSection: {
      marginBottom: spacing.xxl
    },
    sectionTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.xl,
      position: "relative",
      paddingBottom: spacing.sm,
      '&:after': {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "60px",
        height: "3px",
        backgroundColor: colors.primary
      }
    },
    relatedPosts: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: spacing.lg
    }
  };

  return (
    <div style={{ fontFamily: typography.fontFamily, backgroundColor: colors.background }}>
      <Header />
      
      <main>
        <div style={styles.container}>
          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            <a 
              href="/"
              style={styles.breadcrumbLink}
              onMouseEnter={(e) => e.target.style.color = colors.primary} 
              onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
            >Inicio</a>
            <span style={{color: colors.gray300, fontSize: '10px'}}>►</span>
            <a 
              href="/blog"
              style={styles.breadcrumbLink}
              onMouseEnter={(e) => e.target.style.color = colors.primary} 
              onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
            >Blog</a>
            <span style={{color: colors.gray300, fontSize: '10px'}}>►</span>
            <span>Artículo</span>
          </div>
          
          {/* Article Header */}
          <header style={styles.articleHeader}>
            <div style={styles.category}>{post.category}</div>
            <h1 style={styles.title}>{post.title}</h1>
            
            <div style={styles.meta}>
              <div style={styles.author}>
                <div style={styles.avatar}>
                  <img src={post.author.avatar} alt={post.author.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
                <div style={styles.authorInfo}>
                  <div style={styles.authorName}>{post.author.name}</div>
                  <div style={styles.authorRole}>{post.author.role}</div>
                </div>
              </div>
              
              <div style={styles.postDetails}>
                <div style={styles.detailItem}>
                  <span style={{color: colors.gray300}}>📅</span> {post.publishDate}
                </div>
                <div style={styles.detailItem}>
                  <span style={{color: colors.gray300}}>⏱</span> {post.time}
                </div>
                <div style={styles.detailItem}>
                  <span style={{color: colors.error}}>♥</span> {likeCount} likes
                </div>
              </div>
            </div>
          </header>
          
          {/* Featured Image */}
          <img src={post.image} alt={post.title} style={styles.featuredImage} />
          
          {/* Article Content */}
          <article 
            style={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Tags */}
          <div style={styles.tagsSection}>
            <h3 style={styles.tagsTitle}>Etiquetas</h3>
            <div style={styles.tagsList}>
              {post.tags.map((tag, index) => (
                <div 
                  key={index} 
                  style={styles.tag}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.primary;
                    e.target.style.color = colors.white;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.gray100;
                    e.target.style.color = colors.textSecondary;
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          
          {/* Share and Actions */}
          <div style={styles.shareSection}>
            <div style={styles.actions}>
              <button 
                style={styles.likeButton(isLiked)}
                onClick={handleLike}
                onMouseEnter={(e) => {
                  if (!isLiked) {
                    e.target.style.backgroundColor = colors.gray100;
                  } else {
                    e.target.style.backgroundColor = colors.primary + '30';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLiked) {
                    e.target.style.backgroundColor = 'transparent';
                  } else {
                    e.target.style.backgroundColor = colors.primary + '15';
                  }
                }}
              >
                <span style={{color: isLiked ? colors.error : 'inherit'}}>♥</span> 
                {isLiked ? 'Te gusta' : 'Me gusta'}
              </button>
              
              <button 
                style={styles.bookmarkButton(isBookmarked)}
                onClick={() => setIsBookmarked(!isBookmarked)}
                onMouseEnter={(e) => {
                  if (!isBookmarked) {
                    e.target.style.backgroundColor = colors.gray100;
                  } else {
                    e.target.style.backgroundColor = colors.primary + '30';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isBookmarked) {
                    e.target.style.backgroundColor = 'transparent';
                  } else {
                    e.target.style.backgroundColor = colors.primary + '15';
                  }
                }}
              >
                <span>🔖</span> 
                {isBookmarked ? 'Guardado' : 'Guardar'}
              </button>
              
              <button 
                style={styles.actionButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.gray100}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span>💬</span> Comentar
              </button>
            </div>
            
            <div style={styles.shareButtons}>
              <div 
                style={styles.shareButton}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.primary;
                  e.target.style.color = colors.white;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.gray100;
                  e.target.style.color = colors.textSecondary;
                }}
              >f</div>
              <div 
                style={styles.shareButton}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.primary;
                  e.target.style.color = colors.white;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.gray100;
                  e.target.style.color = colors.textSecondary;
                }}
              >t</div>
              <div 
                style={styles.shareButton}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.primary;
                  e.target.style.color = colors.white;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.gray100;
                  e.target.style.color = colors.textSecondary;
                }}
              >in</div>
            </div>
          </div>
          
          {/* Related Posts */}
          <div style={styles.relatedSection}>
            <h2 style={styles.sectionTitle}>Artículos Relacionados</h2>
            <div style={styles.relatedPosts}>
              {post.relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogDetailPage;

