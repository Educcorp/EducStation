import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import ComentarioForm from './ComentarioForm';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const ComentarioItem = ({ comentario, onDelete, onUpdate, currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
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

    const styles = {
        container: {
            backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.md,
            boxShadow: shadows.sm,
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : colors.gray200}`,
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: shadows.md,
                transform: 'translateY(-2px)',
            }
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
            fontSize: typography.fontSize.lg,
        },
        userName: {
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            fontWeight: typography.fontWeight.medium,
            fontSize: typography.fontSize.md,
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
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.md,
            border: 'none',
            fontSize: typography.fontSize.sm,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            transition: 'all 0.3s ease',
        },
        editButton: {
            backgroundColor: colors.primary + '20',
            color: colors.primary,
            '&:hover': {
                backgroundColor: colors.primary,
                color: colors.white,
            }
        },
        deleteButton: {
            backgroundColor: colors.error + '20',
            color: colors.error,
            '&:hover': {
                backgroundColor: colors.error,
                color: colors.white,
            }
        }
    };

    return (
        <div style={styles.container}>
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
                                style={{...styles.button, ...styles.editButton}}
                                onClick={() => setIsEditing(true)}
                            >
                                <FaEdit /> Editar
                            </button>
                            <button
                                style={{...styles.button, ...styles.deleteButton}}
                                onClick={handleDelete}
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