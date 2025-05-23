import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius } from '../../styles/theme';

const ComentarioItem = ({ comentario, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comentario.contenido || comentario.Contenido || '');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    // Verificar si el comentario pertenece al usuario actual
    if (user && comentario) {
      const comentarioUserId = comentario.ID_Usuario;
      const currentUserId = user.id;
      setIsCurrentUser(comentarioUserId === currentUserId);
    }
  }, [comentario, user]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha desconocida';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(comentario.contenido || comentario.Contenido || '');
  };

  const handleSave = () => {
    onUpdate(comentario.ID_comentario || comentario.id, editedContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      onDelete(comentario.ID_comentario || comentario.id);
    }
  };

  const styles = {
    comentarioItem: {
      padding: spacing.md,
      marginBottom: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    usuario: {
      fontWeight: typography.fontWeight.bold,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
    },
    fecha: {
      fontSize: typography.fontSize.xs,
      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : colors.textSecondary,
    },
    contenido: {
      fontSize: typography.fontSize.md,
      lineHeight: 1.5,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    textarea: {
      width: '100%',
      minHeight: '80px',
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : colors.gray300}`,
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : colors.white,
      color: isDarkMode ? colors.textLight : colors.textPrimary,
      fontSize: typography.fontSize.md,
      resize: 'vertical',
      marginBottom: spacing.sm,
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      border: 'none',
      cursor: 'pointer',
      fontSize: typography.fontSize.sm,
      transition: 'all 0.2s ease',
    },
    editButton: {
      backgroundColor: colors.info,
      color: colors.white,
    },
    deleteButton: {
      backgroundColor: colors.error,
      color: colors.white,
    },
    saveButton: {
      backgroundColor: colors.success,
      color: colors.white,
    },
    cancelButton: {
      backgroundColor: colors.gray500,
      color: colors.white,
    },
  };

  return (
    <div style={styles.comentarioItem}>
      <div style={styles.header}>
        <div style={styles.usuario}>
          {comentario.usuarioNombre || comentario.Nickname || 'Usuario'}
        </div>
        <div style={styles.fecha}>
          {formatDate(comentario.Fecha_publicacion || comentario.fechaCreacion || new Date())}
        </div>
      </div>

      {isEditing ? (
        <>
          <textarea
            style={styles.textarea}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            autoFocus
          />
          <div style={styles.actions}>
            <button
              style={{ ...styles.actionButton, ...styles.saveButton }}
              onClick={handleSave}
              disabled={!editedContent.trim()}
            >
              <FaSave /> Guardar
            </button>
            <button
              style={{ ...styles.actionButton, ...styles.cancelButton }}
              onClick={handleCancel}
            >
              <FaTimes /> Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={styles.contenido}>
            {comentario.contenido || comentario.Contenido}
          </div>
          {isCurrentUser && (
            <div style={styles.actions}>
              <button
                style={{ ...styles.actionButton, ...styles.editButton }}
                onClick={handleEdit}
              >
                <FaEdit /> Editar
              </button>
              <button
                style={{ ...styles.actionButton, ...styles.deleteButton }}
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