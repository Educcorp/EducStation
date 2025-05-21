import React, { useState } from 'react';
import { comentariosService } from '../../services/comentariosService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/comentarios.css';

const ComentarioForm = ({ publicacionId, onComentarioCreado }) => {
  const [contenido, setContenido] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comentar');
      return;
    }

    if (contenido.trim().length < 3) {
      toast.error('El comentario debe tener al menos 3 caracteres');
      return;
    }

    try {
      setIsSubmitting(true);
      const nuevoComentario = await comentariosService.createComentario(publicacionId, contenido);
      setContenido('');
      onComentarioCreado(nuevoComentario);
      toast.success('Comentario publicado exitosamente');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al publicar el comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comentario-form">
      <textarea
        placeholder="Escribe tu comentario..."
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        disabled={!isAuthenticated || isSubmitting}
      />
      {isAuthenticated && (
        <button
          type="submit"
          disabled={isSubmitting || contenido.trim().length < 3}
        >
          {isSubmitting ? 'Publicando...' : 'Publicar comentario'}
        </button>
      )}
    </form>
  );
};

export default ComentarioForm; 