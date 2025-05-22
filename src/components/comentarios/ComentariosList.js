import React, { useState, useEffect } from 'react';
import { comentariosService } from '../../services/comentariosService';
import ComentarioForm from './ComentarioForm';
import ComentarioItem from './ComentarioItem';
import { toast } from 'react-toastify';
import '../../styles/comentarios.css';

const ComentariosList = ({ publicacionId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarComentarios = async () => {
    try {
      setIsLoading(true);
      const data = await comentariosService.getComentariosByPublicacion(publicacionId);
      setComentarios(data);
      setError(null);
    } catch (error) {
      setError('Error al cargar los comentarios');
      toast.error('Error al cargar los comentarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Cargando comentarios para publicacionId:', publicacionId);
    cargarComentarios();
  }, [publicacionId]);

  const handleComentarioCreado = (nuevoComentario) => {
    setComentarios(prevComentarios => [nuevoComentario, ...prevComentarios]);
  };

  const handleComentarioEliminado = (comentarioId) => {
    setComentarios(prevComentarios => 
      prevComentarios.filter(comentario => comentario.ID_comentario !== comentarioId)
    );
  };

  return (
    <div style={{
      background: 'transparent',
      boxShadow: 'none',
      borderRadius: 0,
      padding: 0,
      margin: 0,
      width: '100%'
    }}>
      {/* Línea divisoria sutil */}
      <div style={{
        borderTop: '1.5px solid rgba(0,0,0,0.08)',
        margin: '2rem 0 1.5rem 0',
        width: '100%'
      }} />
      <ComentarioForm 
        publicacionId={publicacionId} 
        onComentarioCreado={handleComentarioCreado} 
      />
      <div className="comentarios-lista">
        {isLoading ? (
          <div className="comentarios-cargando">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="comentarios-error">{error}</div>
        ) : comentarios.length === 0 ? (
          <p className="comentarios-vacios">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        ) : (
          comentarios.map(comentario => (
            <ComentarioItem
              key={comentario.ID_comentario}
              comentario={comentario}
              onComentarioEliminado={handleComentarioEliminado}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ComentariosList; 