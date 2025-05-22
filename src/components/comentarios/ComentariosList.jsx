import React, { useState, useEffect } from 'react';
import { comentarioService } from '../../services/comentarioService';
import { useAuth } from '../../hooks/useAuth';
import ComentarioItem from './ComentarioItem';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';
import { BiMessageSquareDots } from 'react-icons/bi';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ComentariosList = ({ postId }) => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orden, setOrden] = useState('reciente');
    const [comentarioText, setComentarioText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const { isDarkMode } = useTheme();

    const cargarComentarios = async () => {
        if (!postId) {
            setError('ID de publicación no válido');
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            console.log('Cargando comentarios para el post:', postId);
            const data = await comentarioService.getComentariosByPost(postId);
            setComentarios(data);
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
            setError('No se pudieron cargar los comentarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            cargarComentarios();
        }
    }, [postId]);

    const handleCrearComentario = async (e) => {
        e.preventDefault();
        if (!comentarioText.trim()) return;
        if (!postId) {
            toast.error('ID de publicación no válido');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await comentarioService.createComentario({
                contenido: comentarioText,
                publicacionId: postId,
                usuarioId: user.id,
                nickname: user.username || user.name || 'Usuario'
            });
            setComentarioText('');
            toast.success('Comentario publicado exitosamente');
            cargarComentarios();
        } catch (error) {
            console.error('Error al crear comentario:', error);
            toast.error('Error al publicar el comentario');
        } finally {
            setIsSubmitting(false);
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
            borderRadius: '2.5rem',
        },
        formContainer: {
            display: 'flex',
            alignItems: 'flex-end',
            gap: spacing.sm,
            backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
            borderRadius: '2.5rem',
            padding: spacing.lg,
            boxShadow: shadows.lg,
            marginBottom: spacing.md,
            border: `2.5px solid ${isDarkMode ? 'rgba(255,255,255,0.13)' : colors.primary}22`,
            transition: bounceTransition,
            overflow: 'hidden',
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
            position: 'relative',
            overflow: 'hidden',
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
        <motion.div 
            style={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {user && (
                <motion.form 
                    style={styles.formContainer}
                    onSubmit={handleCrearComentario}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                >
                    <textarea
                        style={styles.textarea}
                        placeholder="Escribe tu comentario..."
                        maxLength={500}
                        value={comentarioText}
                        onChange={(e) => setComentarioText(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <motion.button 
                        type="submit" 
                        style={styles.submitButton}
                        aria-label="Enviar comentario"
                        disabled={isSubmitting || !comentarioText.trim()}
                        whileHover={{ 
                            scale: 1.05,
                            backgroundColor: colors.primaryDark 
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPaperPlane />
                    </motion.button>
                </motion.form>
            )}
            
            <motion.div 
                style={styles.filterContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
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
            </motion.div>

            {loading ? (
                <motion.div 
                    style={styles.loadingMessage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    Cargando comentarios...
                </motion.div>
            ) : error ? (
                <motion.div 
                    style={styles.errorMessage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {error}
                    <br />
                    <motion.button 
                        style={styles.retryButton} 
                        onClick={cargarComentarios}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Reintentar
                    </motion.button>
                </motion.div>
            ) : comentarios.length === 0 ? (
                <motion.div 
                    style={styles.noComments}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                    >
                        <BiMessageSquareDots size={32} />
                    </motion.div>
                    <p>No hay comentarios todavía. ¡Sé el primero en comentar!</p>
                </motion.div>
            ) : (
                <AnimatePresence>
                    {comentariosOrdenados.map((comentario, index) => (
                        <motion.div
                            key={comentario.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                            <ComentarioItem
                                comentario={comentario}
                                onDelete={handleEliminarComentario}
                                onUpdate={handleActualizarComentario}
                                currentUser={user}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </motion.div>
    );
};

export default ComentariosList; 