import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import ComentarioForm from './ComentarioForm';

const ComentarioItem = ({ comentario, onDelete, onUpdate, currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const isOwner = currentUser && currentUser.id === comentario.usuarioId;

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
            await onDelete(comentario.id);
        }
    };

    const handleUpdate = async (nuevoContenido) => {
        await onUpdate(comentario.id, nuevoContenido);
        setIsEditing(false);
    };

    return (
        <div className="comentario-item">
            <div className="comentario-header">
                <div className="usuario-info">
                    <FaUser className="usuario-icon" />
                    <span className="usuario-nombre">{comentario.usuarioNombre}</span>
                </div>
                <span className="fecha">
                    {format(new Date(comentario.fechaCreacion), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                </span>
            </div>

            {isEditing ? (
                <ComentarioForm
                    comentarioInicial={comentario}
                    onSubmit={handleUpdate}
                />
            ) : (
                <div className="comentario-contenido">
                    {comentario.contenido}
                </div>
            )}

            {isOwner && !isEditing && (
                <div className="comentario-acciones">
                    <button
                        className="btn-editar"
                        onClick={() => setIsEditing(true)}
                    >
                        <FaEdit /> Editar
                    </button>
                    <button
                        className="btn-eliminar"
                        onClick={handleDelete}
                    >
                        <FaTrash /> Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

export default ComentarioItem; 