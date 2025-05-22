import React, { useState, useEffect } from 'react';
import { comentarioService } from '../../services/comentarioService';
import { useAuth } from '../../context/AuthContext';
import ComentarioForm from './ComentarioForm';
import ComentarioItem from './ComentarioItem';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';
import { BiMessageSquareDots } from 'react-icons/bi';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const ComentariosList = ({ postId }) => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orden, setOrden] = useState('reciente');
    const { user } = useAuth();
    const { isDarkMode } = useTheme();

    const cargarComentarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await comentarioService.getComentariosByPost(postId);
            setComentarios(data);
        } catch (error) {
            setError('No se pudieron cargar los comentarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarComentarios();
    }, [postId]);

    const handleCrearComentario = async (nuevoComentario) => {
        try {
            await comentarioService.createComentario({
                ...nuevoComentario,
                postId
            });
            toast.success('Comentario creado exitosamente');
            cargarComentarios();
        } catch (error) {
            toast.error('Error al crear el comentario');
        }
    };

    const handleEliminarComentario = async (id) => {
        try {
            await comentarioService.deleteComentario(id);
            toast.success('Comentario eliminado exitosamente');
            cargarComentarios();
        } catch (error) {
            toast.error('Error al eliminar el comentario');
        }
    };

    const handleActualizarComentario = async (id, contenido) => {
        try {
            await comentarioService.updateComentario(id, { contenido });
            toast.success('Comentario actualizado exitosamente');
            cargarComentarios();
        } catch (error) {
            toast.error('Error al actualizar el comentario');
        }
    };

    // Ordenar comentarios según el filtro seleccionado
    const comentariosOrdenados = [...comentarios].sort((a, b) => {
        if (orden === 'reciente') {
            return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
        } else {
            return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
        }
    });

    const bounceTransition = 'transform 0.18s cubic-bezier(.39,.575,.56,1.000), box-shadow 0.18s cubic-bezier(.39,.575,.56,1.000), background 0.18s cubic-bezier(.39,.575,.56,1.000)';
    const styles = {
        container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
            marginTop: '2.5rem',
        },
        formContainer: {
            display: 'flex',
            alignItems: 'flex-end',
            gap: spacing.sm,
            backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            boxShadow: shadows.lg,
            marginBottom: spacing.md,
            border: `2.5px solid ${isDarkMode ? 'rgba(255,255,255,0.13)' : colors.primary}22`,
            transition: bounceTransition,
        },
        textarea: {
            flex: 1,
            minHeight: '60px',
            maxHeight: '120px',
            border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.13)' : colors.primary}33`,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            fontSize: typography.fontSize.md,
            backgroundColor: isDarkMode ? colors.backgroundDark : colors.white,
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            resize: 'vertical',
            boxShadow: shadows.sm,
            transition: bounceTransition,
        },
        submitButton: {
            backgroundColor: colors.primary,
            color: colors.white,
            border: 'none',
            borderRadius: borderRadius.lg,
            padding: `${spacing.md} ${spacing.xl}`,
            fontSize: typography.fontSize.xl,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: shadows.md,
            transition: bounceTransition,
            outline: 'none',
        },
        submitButtonHover: {
            backgroundColor: colors.primaryDark,
            transform: 'translateY(-4px) scale(1.04)',
            boxShadow: shadows.xl,
        },
        filterContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            marginBottom: spacing.md,
        },
        filterLabel: {
            color: isDarkMode ? colors.textLight : colors.textSecondary,
            fontSize: typography.fontSize.sm,
        },
        filterSelect: {
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.md,
            border: `1.5px solid ${isDarkMode ? 'rgba(255,255,255,0.13)' : colors.primary}33`,
            backgroundColor: isDarkMode ? colors.backgroundDark : colors.white,
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            fontSize: typography.fontSize.sm,
            boxShadow: shadows.xs,
            transition: bounceTransition,
        },
        loadingMessage: {
            textAlign: 'center',
            color: isDarkMode ? colors.textLight : colors.textSecondary,
            padding: spacing.lg,
            fontSize: typography.fontSize.md,
        },
        errorMessage: {
            textAlign: 'center',
            color: colors.error,
            padding: spacing.lg,
            fontSize: typography.fontSize.md,
        },
        retryButton: {
            backgroundColor: colors.primary,
            color: colors.white,
            border: 'none',
            borderRadius: borderRadius.lg,
            padding: `${spacing.sm} ${spacing.md}`,
            fontSize: typography.fontSize.sm,
            cursor: 'pointer',
            marginTop: spacing.sm,
            boxShadow: shadows.md,
            transition: bounceTransition,
            outline: 'none',
        },
        retryButtonHover: {
            backgroundColor: colors.primaryDark,
            transform: 'translateY(-3px) scale(1.04)',
            boxShadow: shadows.xl,
        },
        noComments: {
            textAlign: 'center',
            color: isDarkMode ? colors.textLight : colors.textSecondary,
            padding: spacing.xl,
            fontSize: typography.fontSize.md,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.sm,
        }
    };

    return (
        <div style={styles.container}>
            {user && (
                <div style={styles.formContainer}>
                    <textarea
                        style={styles.textarea}
                        placeholder="Escribe tu comentario..."
                        maxLength={500}
                    />
                    <button 
                        type="submit" 
                        style={styles.submitButton}
                        aria-label="Enviar comentario"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            )}
            
            <div style={styles.filterContainer}>
                <label style={styles.filterLabel} htmlFor="ordenComentarios">Ordenar por:</label>
                <select
                    id="ordenComentarios"
                    value={orden}
                    onChange={e => setOrden(e.target.value)}
                    style={styles.filterSelect}
                >
                    <option value="reciente">Más reciente</option>
                    <option value="antiguo">Más antiguo</option>
                </select>
            </div>

            {loading ? (
                <div style={styles.loadingMessage}>Cargando comentarios...</div>
            ) : error ? (
                <div style={styles.errorMessage}>
                    {error}
                    <br />
                    <button 
                        style={styles.retryButton} 
                        onClick={cargarComentarios}
                    >
                        Reintentar
                    </button>
                </div>
            ) : comentarios.length === 0 ? (
                <div style={styles.noComments}>
                    <BiMessageSquareDots size={32} />
                    <p>No hay comentarios todavía. ¡Sé el primero en comentar!</p>
                </div>
            ) : (
                comentarios.map(comentario => (
                    <ComentarioItem
                        key={comentario.id}
                        comentario={comentario}
                        onDelete={handleEliminarComentario}
                        onUpdate={handleActualizarComentario}
                        currentUser={user}
                    />
                ))
            )}
        </div>
    );
};

export default ComentariosList; 