// src/components/common/CategoryFilter.jsx
import React, { useState, useEffect } from 'react';
import { getAllCategorias } from '../../services/categoriasService';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, transitions } from '../../styles/theme';

const CategoryFilter = ({ onCategorySelect, selectedCategory = null }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const { colors } = useTheme();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getAllCategorias();

                // Agregar categoría "Todos" al inicio
                const allCategories = [
                    { ID_categoria: 'all', Nombre_categoria: 'Todos', Descripcion: 'Ver todas las categorías' },
                    ...data
                ];

                setCategories(allCategories);
                setError(null);
            } catch (err) {
                setError('Error al cargar categorías');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const styles = {
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.sm,
            background: colors.white,
            padding: `${spacing.md} ${spacing.xl}`,
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(11, 68, 68, 0.08)',
            marginBottom: spacing.xl,
            position: 'relative',
            zIndex: 1,
            animation: 'slideInUp 0.6s ease-out'
        },
        category: (isActive, isHovered) => ({
            padding: `${spacing.sm} ${spacing.lg}`,
            background: isActive
                ? `linear-gradient(135deg, ${colors.primary} 60%, ${colors.primaryLight} 100%)`
                : isHovered ? 'rgba(11, 68, 68, 0.05)' : 'none',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: isActive ? colors.white : isHovered ? colors.primary : colors.textPrimary,
            transition: transitions.default,
            boxShadow: isActive ? '0 4px 12px rgba(11, 68, 68, 0.15)' : 'none',
            transform: isHovered && !isActive ? 'translateY(-2px)' : 'translateY(0)'
        }),
        loading: {
            textAlign: 'center',
            padding: spacing.md,
            color: colors.textSecondary
        },
        error: {
            textAlign: 'center',
            padding: spacing.md,
            color: colors.error
        }
    };

    if (loading) {
        return <div style={styles.loading}>Cargando categorías...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            {categories.map(category => (
                <button
                    key={category.ID_categoria}
                    style={styles.category(
                        selectedCategory === category.ID_categoria,
                        hoveredCategory === category.ID_categoria
                    )}
                    onClick={() => onCategorySelect(category.ID_categoria)}
                    onMouseEnter={() => setHoveredCategory(category.ID_categoria)}
                    onMouseLeave={() => setHoveredCategory(null)}
                >
                    {category.Nombre_categoria}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;