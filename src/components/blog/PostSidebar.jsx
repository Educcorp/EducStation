import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius } from '../../styles/theme';
import { getPublicacionesByCategoria, getAllCategorias } from '../../services/categoriasServices';
import './PostSidebar.css';

const PostSidebar = ({ currentPost }) => {
    const { colors, isDarkMode } = useTheme();
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
 
    // Colores específicos para cada categoría (igual que CategoryPage)
    const categoryColors = {
        1: '#FF6B6B', // Noticias
        2: '#4ECDC4', // Técnicas de Estudio
        3: '#FFD166', // Problemáticas en el Estudio
        4: '#6A0572', // Educación de Calidad
        5: '#1A936F', // Herramientas Tecnológicas
        6: '#3D5A80', // Desarrollo Profesional Docente
        7: '#F18F01', // Comunidad y Colaboración
        'todos': '#6b7280',
        'problematicas': '#FFD166',
        'tecnicas': '#4ECDC4',
        'default': '#6b7280'
    };

    // Función para obtener el color de una categoría (igual que CategoryPage)
    const getCategoryColor = (categoryId) => {
        return categoryColors[categoryId] || categoryColors.default;
    };

    // Función para generar color de fondo suave (igual que CategoryPage)
    const getSoftBackground = (color, opacity = 0.1) => {
        // Convierte el color hex a rgba
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                setLoading(true);

                // Obtener todas las categorías
                const allCategories = await getAllCategorias();
                
                // Categorías adicionales que faltan
                const additionalCategories = [
                    {
                        ID_categoria: 'todos',
                        Nombre_categoria: 'Todos',
                        Descripcion: 'Explora todo nuestro contenido educativo'
                    },
                    {
                        ID_categoria: 'problematicas',
                        Nombre_categoria: 'Problemáticas en el Estudio',
                        Descripcion: 'Soluciones a desafíos comunes del aprendizaje'
                    },
                    {
                        ID_categoria: 'tecnicas',
                        Nombre_categoria: 'Técnicas de Estudio',
                        Descripcion: 'Métodos efectivos para optimizar el aprendizaje'
                    }
                ];

                // Combinar categorías existentes con las adicionales
                const combinedCategories = [...additionalCategories, ...(allCategories || [])];
                setCategories(combinedCategories);

                // Si el post actual tiene categorías, obtener posts relacionados
                if (currentPost?.categorias && currentPost.categorias.length > 0) {
                    const categoryId = currentPost.categorias[0].ID_categoria;
                    const related = await getPublicacionesByCategoria(categoryId);

                    // Filtrar el post actual y limitar a 4 posts relacionados
                    const filteredRelated = (related || [])
                        .filter(post => post.ID_publicaciones !== currentPost.ID_publicaciones)
                        .slice(0, 4);

                    setRelatedPosts(filteredRelated);
                }
            } catch (error) {
                console.error('Error al cargar datos del sidebar:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentPost) {
            fetchSidebarData();
        }
    }, [currentPost]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const truncateText = (text, maxLength = 80) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Función para extraer imagen de portada
    const getPostImage = (post) => {
        if (!post) return 'https://via.placeholder.com/60x60?text=Post';

        // Si tiene imagen_portada como Base64
        if (post.Imagen_portada && post.Imagen_portada.startsWith('data:image')) {
            return post.Imagen_portada;
        }

        // Si tiene imagen_portada como HTML img tag
        if (post.Imagen_portada && post.Imagen_portada.includes('<img')) {
            const srcMatch = post.Imagen_portada.match(/src="([^"]+)"/);
            if (srcMatch && srcMatch[1]) {
                return srcMatch[1];
            }
        }

        // Si tiene imagen_portada como URL
        if (post.Imagen_portada && !post.Imagen_portada.includes('<')) {
            return post.Imagen_portada;
        }

        // Si tiene Imagen_destacada_ID
        if (post.Imagen_destacada_ID) {
            return `${process.env.REACT_APP_API_URL}/api/imagenes/${post.Imagen_destacada_ID}`;
        }

        // Imagen por defecto
        return 'https://via.placeholder.com/60x60?text=Post';
    };

    // Función para manejar el clic en post relacionado con scroll hacia arriba
    const handlePostClick = (postId) => {
        // Hacer scroll hacia arriba inmediatamente
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });

        // Fallback para asegurar que funcione
        setTimeout(() => {
            window.scrollTo(0, 0);
            if (document.body) {
                document.body.scrollTop = 0;
            }
            if (document.documentElement) {
                document.documentElement.scrollTop = 0;
            }
        }, 100);
    };

    // Función para manejar el clic en categoría con scroll hacia arriba
    const handleCategoryClick = (categoryId) => {
        // Hacer scroll hacia arriba inmediatamente
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });

        // Fallback para asegurar que funcione
        setTimeout(() => {
            window.scrollTo(0, 0);
            if (document.body) {
                document.body.scrollTop = 0;
            }
            if (document.documentElement) {
                document.documentElement.scrollTop = 0;
            }
        }, 100);

        // Manejar navegación especial para categorías adicionales
        if (categoryId === 'todos') {
            // Redirigir al blog principal
            window.location.href = '/blog';
        } else if (categoryId === 'problematicas') {
            // Redirigir a la categoría de Problemáticas en el Estudio (ID: 3)
            window.location.href = '/categoria/3';
        } else if (categoryId === 'tecnicas') {
            // Redirigir a la categoría de Técnicas de Estudio (ID: 2)
            window.location.href = '/categoria/2';
        }
    };

    const styles = {
        sidebar: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg,
            // Removidas todas las propiedades sticky y scroll:
            // position: 'sticky',
            // top: '20px',
            // maxHeight: 'calc(100vh - 40px)',
            // overflowY: 'auto',
            // overflowX: 'hidden',
            // scrollbarWidth: 'thin',
            // scrollbarColor: `${colors.secondary} transparent`,
            // '&::-webkit-scrollbar': {...},
        },
        section: {
            backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        },
        sectionTitle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: isDarkMode ? colors.textLight : colors.primary,
            marginBottom: spacing.md,
            borderBottom: `2px solid ${colors.secondary}`,
            paddingBottom: spacing.xs,
        },
        postsContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xs, // Reducido de spacing.sm a spacing.xs
        },
        postItem: {
            display: 'flex',
            gap: spacing.sm,
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.sm,
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            textDecoration: 'none',
            color: 'inherit',
            // backgroundColor eliminado completamente
            border: 'none', // Eliminado el borde
            boxShadow: 'none', // Eliminada la sombra
            animation: 'fadeInUp 0.6s ease forwards',
            opacity: 0,
            animationFillMode: 'forwards',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 'auto',
            alignItems: 'center', // Cambiado de '' a 'center' para centrado vertical
        },
        postImageContainer: {
            position: 'relative',
            flexShrink: 0,
            borderRadius: borderRadius.sm,
            overflow: 'hidden',
        },
        postImage: {
            width: '50px', // Reducido de 60px a 50px
            height: '50px', // Reducido de 60px a 50px
            borderRadius: borderRadius.sm,
            objectFit: 'cover',
            transition: 'all 0.3s ease',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        postContent: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: 0,
            minWidth: 0,
            // backgroundColor eliminado completamente
            padding: '9px', // Cambiado de 30px a 9px
            paddingTop: '2px', // Mantener alineación con la imagen
            marginBottom: '0px', // Cambiado de 30px a 0px
        },
        postTitle: {
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            lineHeight: '1.2', // Reducido de 1.3 a 1.2 para más compacto
            margin: 0,
            marginBottom: '2px', // Reducido el margen
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'all 0.3s ease',
        },
        postDate: {
            fontSize: '10px', // Reducido aún más
            color: colors.textSecondary,
            fontWeight: typography.fontWeight.normal,
            margin: 0,
            lineHeight: '1.2',
        },
        postMeta: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '4px', // Reducido el margen
        },
        readMore: {
            fontSize: '9px', // Reducido aún más
            color: colors.secondary,
            fontWeight: typography.fontWeight.medium,
            opacity: 0,
            transform: 'translateX(-10px)',
            transition: 'all 0.3s ease',
        },
        categoryItem: {
            display: 'block',
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            borderRadius: borderRadius.sm,
            textDecoration: 'none',
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            marginBottom: spacing.sm,
            transition: 'all 0.3s ease',
            border: `1px solid transparent`,
            position: 'relative', // Para mejor posicionamiento del contenido expandido
            minHeight: '60px', // Altura mínima para evitar saltos
        },
        categoryName: {
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            marginBottom: spacing.xs,
            lineHeight: '1.3',
        },
        categoryDescription: {
            fontSize: typography.fontSize.xs,
            color: colors.textSecondary,
            lineHeight: '1.4',
            transition: 'all 0.3s ease',
        },
        aboutSection: {
            textAlign: 'center',
        },
        aboutText: {
            fontSize: typography.fontSize.sm,
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            lineHeight: '1.6',
            marginBottom: spacing.md,
        },
        aboutButton: {
            display: 'inline-block',
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.secondary,
            color: colors.white,
            borderRadius: borderRadius.sm,
            textDecoration: 'none',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            transition: 'all 0.3s ease',
        },
        loadingText: {
            color: colors.textSecondary,
            fontSize: typography.fontSize.sm,
            textAlign: 'center',
            padding: spacing.md,
        },
        noRelatedPosts: {
            textAlign: 'center',
            padding: spacing.md,
        },
        noRelatedPostsText: {
            color: colors.textSecondary,
            fontSize: typography.fontSize.sm,
            marginBottom: spacing.sm,
            fontStyle: 'italic',
        },
        exploreBlogLink: {
            color: colors.secondary,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
        },
    };

    if (loading) {
        return (
            <div className="post-sidebar" style={styles.sidebar}>
                <div className="sidebar-section" style={styles.section}>
                    <div className="loading-text" style={styles.loadingText}>
                        Cargando contenido relacionado...
                    </div>
                </div>
            </div>
        );
    }

    // Al final del componente, antes del export
    const animationStyles = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .post-item:hover .post-image {
            transform: scale(1.1);
            filter: brightness(1.1);
        }
        
        .post-item:hover .read-more {
            opacity: 1 !important;
            transform: translateX(0) !important;
        }
    `;

    return (
        <>
            <style>{animationStyles}</style>
            <div className="post-sidebar" style={styles.sidebar}>
                {/* Posts Relacionados */}
                <div className="sidebar-section" style={styles.section}>
                    <h3 className="sidebar-section-title" style={styles.sectionTitle}>
                        Posts Relacionados
                    </h3>
                    {relatedPosts.length > 0 ? (
                        <div style={{...styles.postsContainer, gap: spacing.xs}}>
                            {relatedPosts.map((post, index) => (
                                <Link
                                    key={post.ID_publicaciones}
                                    to={`/blog/${post.ID_publicaciones}`}
                                    className="post-item"
                                    style={{
                                        ...styles.postItem,
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                    title={post.Titulo}
                                    onMouseEnter={(e) => {
                                        // Solo efectos en la imagen y texto, sin fondos
                                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                                        
                                        // Animar la imagen
                                        const img = e.currentTarget.querySelector('.post-image');
                                        if (img) {
                                            img.style.transform = 'scale(1.05)';
                                            img.style.filter = 'brightness(1.05)';
                                        }

                                        // Mostrar título completo
                                        const titleElement = e.currentTarget.querySelector('.post-title');
                                        if (titleElement && post.Titulo) {
                                            titleElement.textContent = post.Titulo;
                                            titleElement.style.whiteSpace = 'normal';
                                            titleElement.style.overflow = 'visible';
                                            titleElement.style.textOverflow = 'unset';
                                            titleElement.style.color = colors.primary;
                                            titleElement.style.fontWeight = '600';
                                        }

                                        // Mostrar "Leer más"
                                        const readMoreElement = e.currentTarget.querySelector('.read-more');
                                        if (readMoreElement) {
                                            readMoreElement.style.opacity = '1';
                                            readMoreElement.style.transform = 'translateX(0)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        // Restaurar solo transformaciones, sin fondos
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        
                                        // Restaurar imagen
                                        const img = e.currentTarget.querySelector('.post-image');
                                        if (img) {
                                            img.style.transform = 'scale(1)';
                                            img.style.filter = 'brightness(1)';
                                        }

                                        // Volver a truncar título
                                        const titleElement = e.currentTarget.querySelector('.post-title');
                                        if (titleElement && post.Titulo) {
                                            titleElement.textContent = truncateText(post.Titulo, 45);
                                            titleElement.style.whiteSpace = 'nowrap';
                                            titleElement.style.overflow = 'hidden';
                                            titleElement.style.textOverflow = 'ellipsis';
                                            titleElement.style.color = isDarkMode ? colors.textLight : colors.textPrimary;
                                            titleElement.style.fontWeight = typography.fontWeight.medium;
                                        }

                                        // Ocultar "Leer más"
                                        const readMoreElement = e.currentTarget.querySelector('.read-more');
                                        if (readMoreElement) {
                                            readMoreElement.style.opacity = '0';
                                            readMoreElement.style.transform = 'translateX(-10px)';
                                        }
                                    }}
                                    onClick={() => handlePostClick(post.ID_publicaciones)}
                                >
                                    <div style={styles.postImageContainer}>
                                        <img
                                            src={getPostImage(post)}
                                            alt={post.Titulo}
                                            className="post-image"
                                            style={styles.postImage}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/60x60?text=Post';
                                            }}
                                        />
                                    </div>
                                    <div className="post-content" style={styles.postContent}>
                                        <h4 className="post-title" style={styles.postTitle}>
                                            {truncateText(post.Titulo, 45)}
                                        </h4>
                                        <span className="post-date" style={styles.postDate}>
                                            {formatDate(post.Fecha_creacion)}
                                        </span>
                                        <div style={styles.postMeta}>
                                            <span className="read-more" style={styles.readMore}>Leer más →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={styles.noRelatedPosts}>
                            <p style={styles.noRelatedPostsText}>
                                No hay posts relacionados disponibles en este momento.
                            </p>
                            <Link 
                                to="/blog" 
                                style={styles.exploreBlogLink}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = colors.primary;
                                    e.currentTarget.style.textDecoration = 'underline';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = colors.secondary;
                                    e.currentTarget.style.textDecoration = 'none';
                                }}
                            >
                                Explorar más posts →
                            </Link>
                        </div>
                    )}
                </div>

                {/* Explorar Categorías */}
                {categories.length > 0 && (
                    <div className="sidebar-section" style={styles.section}>
                        <h3 className="sidebar-section-title" style={styles.sectionTitle}>
                            Explorar Categorías
                        </h3>
                        {categories.slice(0, 8).map(category => {
                            // Determinar la ruta según el tipo de categoría
                            let linkTo = `/categoria/${category.ID_categoria}`;
                            if (category.ID_categoria === 'todos') {
                                linkTo = '/blog';
                            } else if (category.ID_categoria === 'problematicas') {
                                linkTo = '/categoria/3';
                            } else if (category.ID_categoria === 'tecnicas') {
                                linkTo = '/categoria/2';
                            }

                            const categoryColor = getCategoryColor(category.ID_categoria);

                            return (
                                <Link
                                    key={category.ID_categoria}
                                    to={linkTo}
                                    className="category-item"
                                    style={{
                                        ...styles.categoryItem,
                                        background: `linear-gradient(to right, ${getSoftBackground(categoryColor, 0.03)}, ${getSoftBackground(categoryColor, 0.06)})`,
                                        border: `1px solid ${getSoftBackground(categoryColor, 0.2)}`,
                                        boxShadow: `0 2px 8px ${getSoftBackground(categoryColor, 0.12)}`
                                    }}
                                    title={category.Descripcion || category.Nombre_categoria}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = `linear-gradient(135deg, ${categoryColor}, ${categoryColor}90)`;
                                        e.currentTarget.style.color = '#ffffff';
                                        e.currentTarget.style.transform = 'translateX(5px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = `0 8px 20px ${getSoftBackground(categoryColor, 0.3)}`;
                                        e.currentTarget.style.borderColor = categoryColor;
                                        
                                        // Mostrar descripción completa al hacer hover
                                        const descriptionElement = e.currentTarget.querySelector('.category-description');
                                        if (descriptionElement && category.Descripcion) {
                                            descriptionElement.textContent = category.Descripcion;
                                            descriptionElement.style.whiteSpace = 'normal';
                                            descriptionElement.style.overflow = 'visible';
                                            descriptionElement.style.textOverflow = 'unset';
                                            descriptionElement.style.fontSize = typography.fontSize.xs;
                                            descriptionElement.style.lineHeight = '1.4';
                                            descriptionElement.style.maxHeight = 'none';
                                            descriptionElement.style.transition = 'all 0.3s ease';
                                            descriptionElement.style.color = '#ffffff';
                                        }

                                        // Cambiar color del nombre también
                                        const nameElement = e.currentTarget.querySelector('.category-name');
                                        if (nameElement) {
                                            nameElement.style.color = '#ffffff';
                                            nameElement.style.fontWeight = '600';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = `linear-gradient(to right, ${getSoftBackground(categoryColor, 0.03)}, ${getSoftBackground(categoryColor, 0.06)})`;
                                        e.currentTarget.style.color = isDarkMode ? colors.textLight : colors.textPrimary;
                                        e.currentTarget.style.transform = 'translateX(0) scale(1)';
                                        e.currentTarget.style.boxShadow = `0 2px 8px ${getSoftBackground(categoryColor, 0.12)}`;
                                        e.currentTarget.style.borderColor = getSoftBackground(categoryColor, 0.2);
                                        
                                        // Volver a truncar la descripción y restaurar colores
                                        const descriptionElement = e.currentTarget.querySelector('.category-description');
                                        if (descriptionElement && category.Descripcion) {
                                            descriptionElement.textContent = truncateText(category.Descripcion, 50);
                                            descriptionElement.style.whiteSpace = 'nowrap';
                                            descriptionElement.style.overflow = 'hidden';
                                            descriptionElement.style.textOverflow = 'ellipsis';
                                            descriptionElement.style.color = colors.textSecondary;
                                        }

                                        // Restaurar color del nombre
                                        const nameElement = e.currentTarget.querySelector('.category-name');
                                        if (nameElement) {
                                            nameElement.style.color = categoryColor;
                                            nameElement.style.fontWeight = typography.fontWeight.medium;
                                        }
                                    }}
                                    onClick={() => handleCategoryClick(category.ID_categoria)}
                                >
                                    <div 
                                        className="category-name" 
                                        style={{
                                            ...styles.categoryName,
                                            color: categoryColor,
                                            fontWeight: typography.fontWeight.medium
                                        }}
                                    >
                                        {category.Nombre_categoria}
                                    </div>
                                    {category.Descripcion && (
                                        <div 
                                            className="category-description" 
                                            style={{
                                                ...styles.categoryDescription,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {truncateText(category.Descripcion, 50)}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Sección Conocernos */}
                <div className="sidebar-section" style={styles.section}>
                    <h3 className="sidebar-section-title" style={styles.sectionTitle}>
                        Conoce EducStation
                    </h3>
                    <div className="about-section" style={styles.aboutSection}>
                        <p className="about-text" style={styles.aboutText}>
                            Descubre nuestra plataforma educativa innovadora que está transformando
                            la manera de aprender y enseñar en el mundo digital.
                        </p>
                        <Link
                            to="/about"
                            className="about-button"
                            style={styles.aboutButton}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.secondaryDark;
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = colors.secondary;
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Conocer Más
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostSidebar;