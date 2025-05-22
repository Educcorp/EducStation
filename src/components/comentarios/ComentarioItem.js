import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { comentariosService } from '../../services/comentariosService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/comentarios.css';

const ComentarioItem = ({ comentario, onComentarioEliminado }) => {
  const { user } = useAuth();
  const isOwner = user && user.id === comentario.ID_Usuario;

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      return;
    }

    try {
      await comentariosService.deleteComentario(comentario.ID_comentario);
      onComentarioEliminado(comentario.ID_comentario);
      toast.success('Comentario eliminado exitosamente');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar el comentario');
    }
  };

  return (
    <div className="comentario-item">
      <div className="comentario-header">
        <div>
          <span className="comentario-usuario">{comentario.Nickname}</span>
          <span className="comentario-fecha">
            {format(new Date(comentario.Fecha_publicacion), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
          </span>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="comentario-eliminar"
          >
            Eliminar
          </button>
        )}
      </div>
      <p className="comentario-contenido">{comentario.Contenido}</p>
    </div>
  );
};

export default ComentarioItem; 