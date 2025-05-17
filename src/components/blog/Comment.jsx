import React from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';
import { formatDate } from '../../utils/dateUtils';

const Comment = ({ comment, canDelete, onDelete }) => {
  const { ID_comentario, Nickname, Contenido, Fecha_publicacion } = comment;
  
  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      onDelete(ID_comentario);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.authorInfo}>
          <span style={styles.author}>{Nickname}</span>
          <span style={styles.date}>{formatDate(Fecha_publicacion)}</span>
        </div>
        {canDelete && (
          <button 
            style={styles.deleteButton} 
            onClick={handleDelete}
            aria-label="Eliminar comentario"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        )}
      </div>
      <div style={styles.content}>
        {Contenido}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    border: `1px solid ${colors.gray200}`,
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  author: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary,
  },
  date: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: colors.error,
    border: 'none',
    borderRadius: borderRadius.sm,
    padding: `${spacing.xs} ${spacing.sm}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default Comment; 