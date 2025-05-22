// This script can be pasted into the browser console to fix the comment system
// by overriding the comentarioService methods with corrected versions.

// Only run if comentarioService exists
if (typeof comentarioService !== 'undefined') {
  console.log('Applying comentarioService fix...');
  
  // Store the original functions for reference
  const originalGet = comentarioService.getComentariosByPost;
  const originalCreate = comentarioService.createComentario;
  
  // Override with fixed versions
  comentarioService.getComentariosByPost = async (publicacionId) => {
    try {
      if (!publicacionId) {
        console.error('Error: ID de publicación no proporcionado para obtener comentarios');
        return [];
      }
      
      console.log('Obteniendo comentarios para la publicación:', publicacionId);
      const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app/api';
      const endpoint = `${API_URL}/comentarios/publicacion/${publicacionId}`;
      console.log('Endpoint de comentarios (FIXED):', endpoint);
      
      const response = await axios.get(endpoint);
      console.log('Respuesta de comentarios recibida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      console.error('Detalles del error:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estatus: error.response?.status
      });
      throw error.response?.data || error.message;
    }
  };
  
  comentarioService.createComentario = async (comentarioData) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No se encontró token de autenticación');
        throw new Error('No hay token de autenticación');
      }
      
      const { publicacionId, postId, contenido, usuarioId, nickname } = comentarioData;
      
      const idToUse = publicacionId || postId;
      if (!idToUse) {
        console.error('Error: No se proporcionó ID de publicación para crear comentario');
        throw new Error('ID de publicación no válido');
      }
      
      if (!contenido || !contenido.trim()) {
        console.error('Error: Contenido de comentario vacío');
        throw new Error('El contenido del comentario no puede estar vacío');
      }
      
      console.log('Datos del comentario a enviar:', {
        id: idToUse,
        contenido,
        usuarioId,
        nickname,
        token: token ? `${token.substring(0, 10)}...` : null
      });
      
      const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app/api';
      const endpoint = `${API_URL}/comentarios/publicacion/${idToUse}`;
      console.log('Endpoint para crear comentario (FIXED):', endpoint);
      
      const payload = {
        contenido,
        usuarioId,
        nickname
      };
      
      console.log('Payload enviado:', payload);
      
      const response = await axios.post(
        endpoint, 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Respuesta del servidor al crear comentario:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear comentario:', error);
      console.error('Detalles del error:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estatus: error.response?.status,
        headers: error.response?.headers
      });
      throw error.response?.data || error.message;
    }
  };
  
  console.log('✅ Comment system fix applied! The backend API endpoints have been corrected.');
  console.log('Try adding a comment now.');
} else {
  console.error('❌ comentarioService not found in the global scope. This fix can only be applied on pages with the comment system loaded.');
} 