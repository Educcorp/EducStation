import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import { FaPaperPlane } from 'react-icons/fa';

const ComentarioForm = ({ onSubmit, comentarioInicial = null, icon }) => {
    const [contenido, setContenido] = useState(comentarioInicial?.contenido || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const { isDarkMode } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!contenido.trim()) {
            toast.error('El comentario no puede estar vacío');
            return;
        }

        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 180);
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

    const bounceTransition = 'transform 0.18s cubic-bezier(.39,.575,.56,1.000), box-shadow 0.18s cubic-bezier(.39,.575,.56,1.000), background 0.18s cubic-bezier(.39,.575,.56,1.000)';
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
            padding: spacing.lg,
            border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.13)' : colors.primary}33`,
            borderRadius: borderRadius.xl,
            backgroundColor: isDarkMode ? colors.backgroundDark : colors.white,
            color: isDarkMode ? colors.textLight : colors.textPrimary,
            fontSize: typography.fontSize.md,
            resize: 'vertical',
            boxShadow: shadows.sm,
            transition: bounceTransition,
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
            borderRadius: borderRadius.lg,
            padding: `${spacing.md} ${spacing.xl}`,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            boxShadow: shadows.md,
            transition: bounceTransition,
            outline: 'none',
            ...(isHover ? {
                backgroundColor: colors.primaryDark,
                transform: 'translateY(-4px) scale(1.04)',
                boxShadow: shadows.xl,
            } : {}),
            ...(isClicked ? {
                transform: 'scale(1.13)',
                boxShadow: `0 0 0 4px ${colors.primary}55, ${shadows.xl}`,
                backgroundColor: colors.primary,
            } : {})
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
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {icon || <FaPaperPlane />}
            </button>
        </form>
    );
};

export default ComentarioForm; 