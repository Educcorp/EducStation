import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const ComentarioForm = ({ onSubmit, comentarioInicial = null, icon }) => {
    const [contenido, setContenido] = useState(comentarioInicial?.contenido || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isDarkMode } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!contenido.trim()) {
            toast.error('El comentario no puede estar vacío');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({ contenido });
            setContenido('');
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
        },
        textareaContainer: {
            position: 'relative',
        },
        textarea: {
            width: '100%',
            minHeight: '100px',
            padding: spacing.md,
            border: `1.5px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : colors.gray200}`,
            borderRadius: borderRadius.md,
            backgroundColor: isDarkMode ? colors.backgroundDark : colors.white,
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            fontSize: typography.fontSize.md,
            resize: 'vertical',
            transition: 'all 0.3s ease',
            '&:focus': {
                outline: 'none',
                borderColor: colors.primary,
                boxShadow: `0 0 0 2px ${colors.primary}20`,
            }
        },
        charCount: {
            position: 'absolute',
            bottom: spacing.xs,
            right: spacing.xs,
            color: isDarkMode ? colors.textLightSecondary : colors.textSecondary,
            fontSize: typography.fontSize.sm,
        },
        submitButton: {
            alignSelf: 'flex-end',
            backgroundColor: colors.primary,
            color: colors.white,
            border: 'none',
            borderRadius: borderRadius.md,
            padding: `${spacing.sm} ${spacing.md}`,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.medium,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: colors.primaryDark,
                transform: 'translateY(-2px)',
            },
            '&:disabled': {
                backgroundColor: colors.gray400,
                cursor: 'not-allowed',
                transform: 'none',
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.textareaContainer}>
                <textarea
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    style={styles.textarea}
                    rows="3"
                    maxLength="500"
                />
                <div style={styles.charCount}>
                    {500 - contenido.length} caracteres restantes
                </div>
            </div>
            <button 
                type="submit" 
                style={styles.submitButton}
                disabled={isSubmitting || !contenido.trim()}
                aria-label="Enviar comentario"
            >
                {icon}
            </button>
        </form>
    );
};

export default ComentarioForm; 