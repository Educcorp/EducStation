import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Asegúrate de que la ruta sea correcta
import axios from 'axios'; // Asegúrate de tener axios instalado

const CommentSection = ({ publicacionId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const { isAuth, user } = useContext(AuthContext); // Usar el contexto de autenticación existente

  const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

  useEffect(() => {
    if (publicacionId) {
      fetchComments();
    }
  }, [publicacionId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/comentarios/publicacion/${publicacionId}`);
      setComments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
      setError('No se pudieron cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  const validateComment = (text) => {
    const errors = {};
    
    if (!text.trim()) {
      errors.comment = 'El comentario no puede estar vacío';
    } else if (text.length < 3) {
      errors.comment = 'El comentario debe tener al menos 3 caracteres';
    } else if (text.length > 1000) {
      errors.comment = 'El comentario no puede exceder los 1000 caracteres';
    }
    
    return errors;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    // Validación del lado del cliente
    const errors = validateComment(comment);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    
    if (!isAuth) {
      setError('Debes iniciar sesión para comentar');
      return;
    }
    
    try {
      const token = localStorage.getItem('userToken');
      
      const response = await axios.post(
        `${API_URL}/api/comentarios/publicacion/${publicacionId}`,
        { contenido: comment },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Añadir el nuevo comentario a la lista
      setComments([response.data, ...comments]);
      setComment('');
      setError(null);
    } catch (err) {
      console.error('Error al enviar comentario:', err);
      
      if (err.response && err.response.data && err.response.data.errors) {
        // Manejar errores de validación del servidor
        const serverErrors = {};
        err.response.data.errors.forEach(error => {
          serverErrors[error.param] = error.msg;
        });
        setValidationErrors(serverErrors);
      } else {
        setError('No se pudo enviar el comentario');
      }
    }
  };

  const handleDeleteComment = async (comentarioId) => {
    try {
      const token = localStorage.getItem('userToken');
      
      await axios.delete(`${API_URL}/api/comentarios/${comentarioId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Eliminar el comentario de la lista
      setComments(comments.filter(c => c.ID_comentario !== comentarioId));
    } catch (err) {
      console.error('Error al eliminar comentario:', err);
      setError('No se pudo eliminar el comentario');
    }
  };

  // Mantener tus estilos originales
  const styles = {
    container: {
      marginTop: '20px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
    },
    title: {
      fontSize: '1.5em',
      marginBottom: '10px',
    },
    textarea: {
      width: '100%',
      height: '80px',
      borderRadius: '4px',
      border: validationErrors.comment ? '1px solid #dc3545' : '1px solid #ccc',
      padding: '10px',
      marginBottom: '10px',
      fontSize: '1em',
      resize: 'none',
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 15px',
      cursor: 'pointer',
      fontSize: '1em',
    },
    commentList: {
      listStyleType: 'none',
      padding: '0',
    },
    commentItem: {
      padding: '15px',
      marginBottom: '10px',
      borderBottom: '1px solid #ddd',
      backgroundColor: 'white',
      borderRadius: '4px',
    },
    commentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
    },
    commentAuthor: {
      fontWeight: 'bold',
      color: '#333',
    },
    commentDate: {
      fontSize: '0.8em',
      color: '#666',
    },
    commentContent: {
      margin: '0',
      lineHeight: '1.5',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '5px 10px',
      cursor: 'pointer',
      fontSize: '0.8em',
      marginTop: '8px',
    },
    error: {
      color: '#dc3545',
      marginBottom: '10px',
      fontSize: '0.9em',
    },
    loginMessage: {
      backgroundColor: '#f8d7da',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '10px',
      color: '#721c24',
    },
    charCount: {
      fontSize: '0.8em',
      color: '#666',
      textAlign: 'right',
      marginBottom: '5px',
    },
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Comentarios</h3>
      
      {error && <div style={styles.error}>{error}</div>}
      
      {isAuth ? (
        <form onSubmit={handleCommentSubmit}>
          <div style={styles.charCount}>
            {comment.length}/1000 caracteres
          </div>
          <textarea
            style={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu comentario aquí..."
          />
          {validationErrors.comment && (
            <div style={styles.error}>{validationErrors.comment}</div>
          )}
          <button type="submit" style={styles.button}>Enviar</button>
        </form>
      ) : (
        <div style={styles.loginMessage}>
          Debes iniciar sesión para comentar.
        </div>
      )}
      
      {loading ? (
        <p>Cargando comentarios...</p>
      ) : (
        <ul style={styles.commentList}>
          {comments.length > 0 ? (
            comments.map((c) => (
              <li key={c.ID_comentario} style={styles.commentItem}>
                <div style={styles.commentHeader}>
                  <div style={styles.commentAuthor}>{c.Nickname}</div>
                  <div style={styles.commentDate}>{formatDate(c.Fecha_publicacion)}</div>
                </div>
                <p style={styles.commentContent}>{c.Contenido}</p>
                {isAuth && user && c.ID_Usuario === user.id && (
                  <button 
                    style={styles.deleteButton}
                    onClick={() => handleDeleteComment(c.ID_comentario)}
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))
          ) : (
            <p>No hay comentarios. ¡Sé el primero en comentar!</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;
