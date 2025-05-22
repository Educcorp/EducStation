import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaEdit, FaTrash, FaUserCircle, FaCheck, FaTimes } from 'react-icons/fa';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ComentarioItem = ({ comentario, onDelete, onUpdate, currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comentario.contenido);
    const { isDarkMode } = useTheme();
    const isOwner = currentUser && currentUser.id === comentario.usuarioId;
    
    // Asegurarse de que tengamos un nombre para mostrar
    const authorName = comentario.usuarioNombre || comentario.nickname || "Usuario";
    
    // Obtener las iniciales para el avatar si no hay imagen
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };
    
    const initials = getInitials(authorName);

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
            await onDelete(comentario.id);
        }
    };

    const handleUpdate = async () => {
        if (editedContent.trim() !== '') {
            await onUpdate(comentario.id, editedContent);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedContent(comentario.contenido);
        setIsEditing(false);
    };

    const bounceTransition = 'transform 0.18s cubic-bezier(.39,.575,.56,1.000), box-shadow 0.18s cubic-bezier(.39,.575,.56,1.000), background 0.18s cubic-bezier(.39,.575,.56,1.000)';
    const styles = {
        container: {
            backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
            borderRadius: '2.5rem',
            padding: spacing.xl,
            marginBottom: spacing.md,
            boxShadow: shadows.lg,
            border: `2.5px solid ${isDarkMode ? 'rgba(255,255,255,0.13)' : colors.primary}22`,
            transition: bounceTransition,
            position: 'relative',
            overflow: 'hidden',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.md,
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.white,
            fontWeight: typography.fontWeight.bold,
            fontSize: typography.fontSize.md,
            boxShadow: shadows.md,
        },
        userIcon: {
            color: colors.primary,
            fontSize: '2.2rem',
        },
        userDetails: {
            display: 'flex',
            flexDirection: 'column',
        },
        userName: {
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            fontWeight: typography.fontWeight.bold,
            fontSize: typography.fontSize.lg,
        },
        date: {
            color: isDarkMode ? colors.textLightSecondary : colors.textSecondary,
            fontSize: typography.fontSize.sm,
        },
        content: {
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            fontSize: typography.fontSize.md,
            lineHeight: 1.6,
            marginBottom: spacing.sm,
            padding: spacing.md,
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: borderRadius.lg,
        },
        editTextarea: {
            width: '100%',
            minHeight: '100px',
            padding: spacing.md,
            borderRadius: borderRadius.lg,
            border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.13)' : colors.primary}33`,
            backgroundColor: isDarkMode ? colors.backgroundDark : colors.white,
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            fontSize: typography.fontSize.md,
            resize: 'vertical',
            marginBottom: spacing.md,
            boxShadow: 'none',
            outline: 'none',
            transition: bounceTransition,
            '&:focus': {
                boxShadow: `0 0 0 2px ${colors.primary}55`,
                border: `2px solid ${colors.primary}`,
            }
        },
        actions: {
            display: 'flex',
            gap: spacing.sm,
            marginTop: spacing.md,
            justifyContent: 'flex-end',
        },
        button: {
            padding: `${spacing.sm} ${spacing.lg}`,
            borderRadius: borderRadius.lg,
            border: 'none',
            fontSize: typography.fontSize.md,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            boxShadow: shadows.md,
            transition: bounceTransition,
            outline: 'none',
        },
        editButton: {
            backgroundColor: colors.primary + 'ee',
            color: colors.white,
        },
        deleteButton: {
            backgroundColor: colors.error + 'ee',
            color: colors.white,
        },
        saveButton: {
            backgroundColor: colors.success + 'ee',
            color: colors.white,
        },
        cancelButton: {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            color: isDarkMode ? colors.textLight : colors.textPrimary,
        },
        timeAgo: {
            position: 'absolute',
            top: spacing.md,
            right: spacing.md,
            fontSize: typography.fontSize.xs,
            color: isDarkMode ? colors.textLightSecondary : colors.textSecondary,
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.lg,
        }
    };

    // Función para formatear la fecha de forma amigable
    const formatTimeAgo = (date) => {
        const now = new Date();
        const commentDate = new Date(date);
        const diffInSeconds = Math.floor((now - commentDate) / 1000);
        
        if (diffInSeconds < 60) {
            return 'hace un momento';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
        } else {
            return format(commentDate, "d 'de' MMMM 'de' yyyy", { locale: es });
        }
    };

    return (
        <motion.div
            style={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ 
                y: -5, 
                boxShadow: shadows.xl,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : colors.background
            }}
            layout
        >
            <div style={styles.header}>
                <div style={styles.userInfo}>
                    {comentario.avatarUrl ? (
                        <img 
                            src={comentario.avatarUrl} 
                            alt={authorName}
                            style={{ ...styles.avatar, objectFit: 'cover' }}
                        />
                    ) : comentario.usuarioId ? (
                        <div style={styles.avatar}>
                            {initials}
                        </div>
                    ) : (
                        <FaUserCircle style={styles.userIcon} />
                    )}
                    <div style={styles.userDetails}>
                        <span style={styles.userName}>{authorName}</span>
                        <span style={styles.date}>
                            {format(new Date(comentario.fechaCreacion), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </span>
                    </div>
                </div>
            </div>

            <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.span 
                    style={styles.timeAgo}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {formatTimeAgo(comentario.fechaCreacion)}
                </motion.span>

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="editing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <textarea
                                style={styles.editTextarea}
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                autoFocus
                            />
                            <div style={styles.actions}>
                                <motion.button
                                    style={{ ...styles.button, ...styles.cancelButton }}
                                    onClick={handleCancel}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaTimes /> Cancelar
                                </motion.button>
                                <motion.button
                                    style={{ ...styles.button, ...styles.saveButton }}
                                    onClick={handleUpdate}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaCheck /> Guardar
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="viewing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div 
                                style={styles.content}
                                whileHover={{ 
                                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'
                                }}
                            >
                                {comentario.contenido}
                            </motion.div>
                            {isOwner && (
                                <div style={styles.actions}>
                                    <motion.button
                                        style={{ ...styles.button, ...styles.editButton }}
                                        onClick={() => setIsEditing(true)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaEdit /> Editar
                                    </motion.button>
                                    <motion.button
                                        style={{ ...styles.button, ...styles.deleteButton }}
                                        onClick={handleDelete}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaTrash /> Eliminar
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default ComentarioItem; 