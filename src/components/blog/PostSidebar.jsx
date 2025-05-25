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

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                setLoading(true);

                // Obtener todas las categorías
                const allCategories = await getAllCategorias();
                setCategories(allCategories || []);

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
    };

    const styles = {
        sidebar: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg,
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
        postItem: {
            display: 'flex',
            gap: spacing.sm,
            marginBottom: spacing.md,
            padding: spacing.sm,
            borderRadius: borderRadius.sm,
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            color: 'inherit',
        },
        postImage: {
            width: '60px',
            height: '60px',
            borderRadius: borderRadius.sm,
            objectFit: 'cover',
            flexShrink: 0,
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        postContent: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xs,
        },
        postTitle: {
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            lineHeight: '1.3',
            margin: 0,
        },
        postDate: {
            fontSize: typography.fontSize.xs,
            color: colors.textSecondary,
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
        },
        categoryName: {
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            marginBottom: spacing.xs,
        },
        categoryDescription: {
            fontSize: typography.fontSize.xs,
            color: colors.textSecondary,
            lineHeight: '1.4',
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

    return (
        <div className="post-sidebar" style={styles.sidebar}>
            {/* Posts Relacionados */}
            {relatedPosts.length > 0 && (
                <div className="sidebar-section" style={styles.section}>
                    <h3 className="sidebar-section-title" style={styles.sectionTitle}>
                        Posts Relacionados
                    </h3>
                    {relatedPosts.map(post => (
                        <Link
                            key={post.ID_publicaciones}
                            to={`/blog/${post.ID_publicaciones}`}
                            className="post-item"
                            style={styles.postItem}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            onClick={() => handlePostClick(post.ID_publicaciones)}
                        >
                            <img
                                src={getPostImage(post)}
                                alt={post.Titulo}
                                className="post-image"
                                style={styles.postImage}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/60x60?text=Post';
                                }}
                            />
                            <div className="post-content" style={styles.postContent}>
                                <h4 className="post-title" style={styles.postTitle}>
                                    {truncateText(post.Titulo, 60)}
                                </h4>
                                <span className="post-date" style={styles.postDate}>
                                    {formatDate(post.Fecha_creacion)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Explorar Categorías */}
            {categories.length > 0 && (
                <div className="sidebar-section" style={styles.section}>
                    <h3 className="sidebar-section-title" style={styles.sectionTitle}>
                        Explorar Categorías
                    </h3>
                    {categories.slice(0, 5).map(category => (
                        <Link
                            key={category.ID_categoria}
                            to={`/categoria/${category.ID_categoria}`}
                            className="category-item"
                            style={styles.categoryItem}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.secondary;
                                e.currentTarget.style.color = colors.white;
                                e.currentTarget.style.transform = 'translateX(5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                                e.currentTarget.style.color = isDarkMode ? colors.textLight : colors.textPrimary;
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}
                            onClick={() => handleCategoryClick(category.ID_categoria)}
                        >
                            <div className="category-name" style={styles.categoryName}>
                                {category.Nombre_categoria}
                            </div>
                            {category.Descripcion && (
                                <div className="category-description" style={styles.categoryDescription}>
                                    {truncateText(category.Descripcion, 50)}
                                </div>
                            )}
                        </Link>
                    ))}
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
    );
};

export default PostSidebar; 