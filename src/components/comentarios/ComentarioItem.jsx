import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import ComentarioForm from './ComentarioForm';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const ComentarioItem = ({ comentario, onDelete, onUpdate, currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [isEditHover, setIsEditHover] = useState(false);
    const [isDeleteHover, setIsDeleteHover] = useState(false);
    const [isEditClicked, setIsEditClicked] = useState(false);
    const [isDeleteClicked, setIsDeleteClicked] = useState(false);
    const { isDarkMode } = useTheme();
    const isOwner = currentUser && currentUser.id === comentario.usuarioId;

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
            await onDelete(comentario.id);
        }
    };

    const handleUpdate = async (nuevoContenido) => {
        await onUpdate(comentario.id, nuevoContenido);
        setIsEditing(false);
    };

    const bounceTransition = 'transform 0.18s cubic-bezier(.39,.575,.56,1.000), box-shadow 0.18s cubic-bezier(.39,.575,.56,1.000), background 0.18s cubic-bezier(.39,.575,.56,1.000)';
    const styles = {
        container: {
            backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
            borderRadius: borderRadius.xl,
            padding: spacing.xl,
            marginBottom: spacing.md,
            boxShadow: shadows.lg,
            border: `2.5px solid ${isDarkMode ? 'rgba(255,255,255,0.13)' : colors.primary}22`,
            transition: bounceTransition,
            ...(isHover ? {
                boxShadow: shadows.xl,
                transform: 'translateY(-4px) scale(1.03)',
                backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
            } : {})
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.sm,
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
        },
        userIcon: {
            color: colors.primary,
            fontSize: typography.fontSize.xl,
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
        },
        actions: {
            display: 'flex',
            gap: spacing.sm,
            marginTop: spacing.sm,
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
            ...(isEditHover ? {
                backgroundColor: colors.primaryDark,
                transform: 'translateY(-3px) scale(1.04)',
                boxShadow: shadows.xl,
            } : {}),
            ...(isEditClicked ? {
                transform: 'scale(1.13)',
                boxShadow: `0 0 0 4px ${colors.primary}55, ${shadows.xl}`,
                backgroundColor: colors.primary,
            } : {})
        },
        deleteButton: {
            backgroundColor: colors.error + 'ee',
            color: colors.white,
            ...(isDeleteHover ? {
                backgroundColor: colors.error,
                transform: 'translateY(-3px) scale(1.04)',
                boxShadow: shadows.xl,
            } : {}),
            ...(isDeleteClicked ? {
                transform: 'scale(1.13)',
                boxShadow: `0 0 0 4px ${colors.error}55, ${shadows.xl}`,
                backgroundColor: colors.error,
            } : {})
        }
    };

    return (
        <div
            style={styles.container}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div style={styles.header}>
                <div style={styles.userInfo}>
                    <FaUser style={styles.userIcon} />
                    <span style={styles.userName}>{comentario.usuarioNombre}</span>
                </div>
                <span style={styles.date}>
                    {format(new Date(comentario.fechaCreacion), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                </span>
            </div>

            {isEditing ? (
                <ComentarioForm
                    comentarioInicial={comentario}
                    onSubmit={handleUpdate}
                />
            ) : (
                <>
                    <div style={styles.content}>
                        {comentario.contenido}
                    </div>
                    {isOwner && (
                        <div style={styles.actions}>
                            <button
                                style={{ ...styles.button, ...styles.editButton }}
                                onClick={() => {
                                    setIsEditClicked(true);
                                    setTimeout(() => setIsEditClicked(false), 180);
                                    setIsEditing(true);
                                }}
                                onMouseEnter={() => setIsEditHover(true)}
                                onMouseLeave={() => setIsEditHover(false)}
                            >
                                <FaEdit /> Editar
                            </button>
                            <button
                                style={{ ...styles.button, ...styles.deleteButton }}
                                onClick={() => {
                                    setIsDeleteClicked(true);
                                    setTimeout(() => setIsDeleteClicked(false), 180);
                                    handleDelete();
                                }}
                                onMouseEnter={() => setIsDeleteHover(true)}
                                onMouseLeave={() => setIsDeleteHover(false)}
                            >
                                <FaTrash /> Eliminar
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ComentarioItem; 