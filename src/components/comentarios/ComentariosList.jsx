import React, { useState, useEffect } from 'react';
import { comentarioService } from '../../services/comentarioService';
import { toast } from 'react-toastify';
import ComentarioItem from './ComentarioItem';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext';
import { FaSync, FaSpinner, FaPaperPlane, FaExclamationTriangle, FaSignInAlt, FaSort } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AnimatedButton } from '../utils';
import './Comentarios.css';

const ComentariosList = ({ postId: propPostId, publicacionId: propPublicacionId }) => {
  // Usar el ID proporcionado, ya sea postId o publicacionId
  const postId = propPostId || propPublicacionId;
  
  console.log('ComentariosList - ID del post usado:', {
    propPostId,
    propPublicacionId,
    postId
  });
  
  const [comentarios, setComentarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comentarioText, setComentarioText] = useState('');
  const [orden, setOrden] = useState('reciente'); // 'reciente' o 'antiguo'
  
  const { isAuthenticated, user } = useAuth();
  
  const cargarComentarios = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!postId) {
        console.error('Error: No se proporcionó ID de post para cargar comentarios');
        setError('No se pudo identificar la publicación');
        setIsLoading(false);
        return;
      }
      
      console.log('Cargando comentarios para el post:', postId);
      const data = await comentarioService.getComentariosByPost(postId);
      setComentarios(data || []);
      console.log('Comentarios cargados:', data);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setError('No se pudieron cargar los comentarios.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (postId) {
      cargarComentarios();
    } else {
      setComentarios([]);
    }
  }, [postId]);
  
  const handleCrearComentario = async (e) => {
    e.preventDefault();
    
    console.log('Intentando crear comentario con texto:', comentarioText);
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comentar');
      return;
    }
    
    if (!comentarioText.trim()) {
      console.log('Texto del comentario vacío, cancelando envío');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!postId) {
        toast.error('Error al identificar la publicación');
        return;
      }
      
      const nuevoComentario = {
        contenido: comentarioText,
        publicacionId: postId,
        postId: postId // Para compatibilidad con ambas formas de pasar el ID
      };
      
      console.log('Enviando comentario al servidor:', nuevoComentario);
      
      await comentarioService.createComentario(nuevoComentario);
      setComentarioText('');
      toast.success('Comentario publicado exitosamente');
      cargarComentarios();
    } catch (error) {
      console.error('Error detallado al crear comentario:', error);
      toast.error('Error al publicar el comentario: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEliminarComentario = async (id) => {
    try {
      await comentarioService.deleteComentario(id);
      toast.success('Comentario eliminado exitosamente');
      cargarComentarios();
    } catch (error) {
      toast.error('Error al eliminar el comentario');
    }
  };
  
  const handleActualizarComentario = async (id, contenido) => {
    try {
      await comentarioService.updateComentario(id, { contenido });
      toast.success('Comentario actualizado exitosamente');
      cargarComentarios();
    } catch (error) {
      toast.error('Error al actualizar el comentario');
    }
  };

  // Ordenar comentarios según el filtro seleccionado
  const comentariosOrdenados = [...comentarios].sort((a, b) => {
    const fechaA = new Date(a.fechaCreacion || a.Fecha_publicacion);
    const fechaB = new Date(b.fechaCreacion || b.Fecha_publicacion);
    
    if (orden === 'reciente') {
      return fechaB - fechaA;
    } else {
      return fechaA - fechaB;
    }
  });

  return (
    <div className="comentarios-container">
      <h2 className="comentarios-title">Comentarios</h2>
      
      {isAuthenticated ? (
        <form className="comentarios-form" onSubmit={(e) => e.preventDefault()}>
          <textarea
            className="comentarios-textarea"
            placeholder="Escribe tu comentario..."
            required
            value={comentarioText}
            onChange={(e) => setComentarioText(e.target.value)}
            disabled={isSubmitting}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <AnimatedButton
              onClick={handleCrearComentario}
              backgroundColor="rgba(8, 44, 44, 0.8)"
              hoverBackgroundColor="#082c2c"
              padding="10px 20px"
              borderRadius="8px"
              style={{
                opacity: isSubmitting || !comentarioText.trim() ? 0.7 : 1,
                cursor: isSubmitting || !comentarioText.trim() ? 'not-allowed' : 'pointer',
              }}
              disabled={isSubmitting || !comentarioText.trim()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSubmitting ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaPaperPlane />}
                <span>{isSubmitting ? 'Publicando...' : 'Publicar comentario'}</span>
              </div>
            </AnimatedButton>
          </div>
        </form>
      ) : (
        <div className="comentarios-login-message">
          <p>Inicia sesión para dejar un comentario</p>
          <AnimatedButton
            to="/login"
            backgroundColor="rgba(8, 44, 44, 0.8)"
            hoverBackgroundColor="#082c2c"
            padding="10px 20px"
            borderRadius="8px"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaSignInAlt />
              <span>Iniciar sesión</span>
            </div>
          </AnimatedButton>
        </div>
      )}
      
      {error && (
        <div className="comentarios-error">
          <FaExclamationTriangle />
          <p>{error}</p>
        </div>
      )}
      
      {comentarios.length > 0 && (
        <div className="comentarios-filter">
          <span className="comentarios-filter-label">Ordenar por:</span>
          <select
            className="comentarios-filter-select"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="reciente">Más recientes</option>
            <option value="antiguo">Más antiguos</option>
          </select>
          
          <button
            onClick={cargarComentarios}
            className="comentario-btn comentario-btn-refresh"
          >
            <FaSync /> Actualizar
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="comentarios-loading">
          <FaSpinner />
          <p>Cargando comentarios...</p>
        </div>
      ) : comentariosOrdenados.length > 0 ? (
        <ul className="comentarios-list">
          {comentariosOrdenados.map((comentario) => (
            <ComentarioItem
              key={comentario.ID_comentario || comentario.id}
              comentario={comentario}
              onDelete={handleEliminarComentario}
              onUpdate={handleActualizarComentario}
            />
          ))}
        </ul>
      ) : (
        <div className="comentarios-empty">
          <p>Aún no hay comentarios. ¡Sé el primero en comentar!</p>
        </div>
      )}
    </div>
  );
};

export default ComentariosList; 