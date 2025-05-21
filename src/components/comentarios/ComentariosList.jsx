import React, { useState, useEffect } from 'react';
import { comentarioService } from '../../services/comentarioService';
import { useAuth } from '../../context/AuthContext';
import ComentarioForm from './ComentarioForm';
import ComentarioItem from './ComentarioItem';
import { toast } from 'react-toastify';
import './Comentarios.css';
import { FaRegComments } from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa';
import { BiMessageSquareDots } from 'react-icons/bi';

const ComentariosList = ({ postId }) => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const cargarComentarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await comentarioService.getComentariosByPost(postId);
            setComentarios(data);
        } catch (error) {
            setError('No se pudieron cargar los comentarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarComentarios();
    }, [postId]);

    const handleCrearComentario = async (nuevoComentario) => {
        try {
            await comentarioService.createComentario({
                ...nuevoComentario,
                postId
            });
            toast.success('Comentario creado exitosamente');
            cargarComentarios();
        } catch (error) {
            toast.error('Error al crear el comentario');
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

    return (
        <div className="comentarios-container">
            <div className="comentarios-header">
                <span className="comentarios-header-icon">
                    <FaRegComments />
                </span>
                <span className="comentarios-header-title">Comentarios&nbsp;{comentarios.length}</span>
                <span className="comentarios-header-line"></span>
            </div>
            {user && (
                <ComentarioForm 
                    onSubmit={handleCrearComentario}
                    postId={postId}
                    icon={<FaPaperPlane />}
                />
            )}
            {loading ? (
                <div className="comentarios-loading">Cargando comentarios...</div>
            ) : error ? (
                <div className="comentarios-error">
                    {error}
                    <br />
                    <button className="btn-reintentar" onClick={cargarComentarios}>Reintentar</button>
                </div>
            ) : (
                <div className="comentarios-list">
                    {comentarios.length === 0 ? (
                        <div className="no-comentarios">
                            <span className="no-comentarios-icon"><BiMessageSquareDots /></span>
                            No hay comentarios todavía. ¡Sé el primero en comentar!
                        </div>
                    ) : (
                        comentarios.map(comentario => (
                            <ComentarioItem
                                key={comentario.id}
                                comentario={comentario}
                                onDelete={handleEliminarComentario}
                                onUpdate={handleActualizarComentario}
                                currentUser={user}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ComentariosList; 