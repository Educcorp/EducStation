import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ComentarioForm = ({ onSubmit, comentarioInicial = null, icon }) => {
    const [contenido, setContenido] = useState(comentarioInicial?.contenido || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!contenido.trim()) {
            toast.error('El comentario no puede estar vacío');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({ contenido });
            setContenido('');
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comentario-form">
            <div className="form-group">
                <textarea
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    className="comentario-textarea"
                    rows="1"
                    maxLength="500"
                />
                <div className="caracteres-restantes">
                    {500 - contenido.length} caracteres restantes
                </div>
            </div>
            <button 
                type="submit" 
                className="btn-comentar"
                disabled={isSubmitting || !contenido.trim()}
                aria-label="Enviar comentario"
            >
                {icon}
            </button>
        </form>
    );
};

export default ComentarioForm; 