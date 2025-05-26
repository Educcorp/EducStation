import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes, FaUser, FaReply } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext';
import { AnimatedButton } from '../utils';
import './Comentarios.css';

const ComentarioItem = ({ comentario, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comentario.contenido || comentario.Contenido || '');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

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

  // Obtener iniciales para avatar de fallback
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Procesar avatar para asegurar que tiene el formato correcto
  const processAvatar = (avatarData) => {
    if (!avatarData) return null;
    return avatarData.startsWith('data:image') ? avatarData : `data:image/jpeg;base64,${avatarData}`;
  };
  
  // Determinar si hay una imagen de avatar disponible
  const userNickname = comentario.usuarioNombre || comentario.Nickname || 'Usuario';
  
  // Intentar obtener el avatar del comentario primero
  let avatarUrl = null;
  
  // Si el comentario tiene avatar, usarlo
  if (comentario.avatar) {
    avatarUrl = processAvatar(comentario.avatar);
  } 
  // Si es el usuario actual y tiene avatar, usarlo
  else if (user && isCurrentUser && user.avatar) {
    avatarUrl = processAvatar(user.avatar);
  }
  
  const hasAvatar = !!avatarUrl;
  const userInitials = getInitials(userNickname);

  return (
    <div className="comentario-item">
      <div className="comentario-header">
        <div className="comentario-avatar">
          {hasAvatar ? (
            <img src={avatarUrl} alt={`Avatar de ${userNickname}`} />
          ) : (
            userInitials
          )}
        </div>
        <div className="comentario-info">
          <div className="comentario-author">
            {userNickname}
          </div>
          <div className="comentario-date">
            {formatDate(comentario.Fecha_publicacion || comentario.fechaCreacion || new Date())}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="comentario-edit-form">
          <textarea
            className="comentario-edit-textarea"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Editar comentario..."
            autoFocus
          />
          <div className="comentario-edit-btns">
            <AnimatedButton
              onClick={handleSave}
              backgroundColor="rgba(8, 44, 44, 0.6)"
              hoverBackgroundColor="#082c2c"
              padding="8px 16px"
              borderRadius="6px"
              style={{ marginRight: '10px' }}
              disabled={!editedContent.trim()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaSave />
                <span>Guardar</span>
              </div>
            </AnimatedButton>
            <AnimatedButton
              onClick={handleCancel}
              backgroundColor="rgba(220, 53, 69, 0.6)"
              hoverBackgroundColor="#dc3545"
              padding="8px 16px"
              borderRadius="6px"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaTimes />
                <span>Cancelar</span>
              </div>
            </AnimatedButton>
          </div>
        </div>
      ) : (
        <>
          <div className="comentario-content">
            {comentario.contenido || comentario.Contenido}
          </div>
          <div className="comentario-actions">
            {isCurrentUser && (
              <>
                <button
                  onClick={handleEdit}
                  className="comentario-btn comentario-btn-edit"
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="comentario-btn comentario-btn-delete"
                >
                  <FaTrash /> Eliminar
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ComentarioItem; 