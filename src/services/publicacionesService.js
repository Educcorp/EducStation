const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Obtener todas las publicaciones
export const getAllPublicaciones = async (limite = 10, offset = 0, estado = null) => {
    try {
        // Obtener el token de autenticación
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        // Verificar si el usuario es administrador para usar la ruta correcta
        const isSuperUser = localStorage.getItem('isSuperUser') === 'true';
        
        if (isSuperUser && token) {
            // Para administradores, usar la ruta /all que incluye todas las publicaciones
            try {
                const adminUrl = `${API_URL}/api/publicaciones/all?limite=${limite}&offset=${offset}`;
                console.log("Admin cargando con endpoint /all:", adminUrl);
                
                const adminResponse = await fetch(adminUrl, { headers });
                if (adminResponse.ok) {
                    const adminData = await adminResponse.json();
                    console.log(`Obtenidas ${adminData.length} publicaciones como administrador`);
                    return adminData;
                } else {
                    console.log(`Error en endpoint admin: ${adminResponse.status}. Intentando alternativas...`);
                    throw new Error(`Error en endpoint admin: ${adminResponse.status}`);
                }
            } catch (adminError) {
                console.error("Error en endpoint admin:", adminError);
                // Continuar con métodos alternativos
            }
        }
        
        // Método estándar para usuarios normales o fallback para administradores
        try {
            let url = `${API_URL}/api/publicaciones?limite=${limite}&offset=${offset}`;
            if (estado) {
                url += `&estado=${estado}`;
            }
            
            console.log("Cargando con endpoint principal:", url);
            
            const response = await fetch(url, { headers });
            if (!response.ok) {
                console.error(`Error al obtener publicaciones: ${response.status} ${response.statusText}`);
                throw new Error(`Error al obtener las publicaciones: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`Obtenidas ${data.length} publicaciones correctamente`);
            return data;
        } catch (fetchError) {
            console.error("Error en la petición principal:", fetchError);
            
            // Método alternativo: endpoint latest
            console.log("Intentando método alternativo para cargar publicaciones...");
            const fallbackUrl = `${API_URL}/api/publicaciones/latest?limite=${limite}`;
            console.log("URL alternativa:", fallbackUrl);
            
            const fallbackResponse = await fetch(fallbackUrl, { headers });
            if (!fallbackResponse.ok) {
                throw new Error("No se pudieron cargar las publicaciones después de múltiples intentos");
            }
            
            const fallbackData = await fallbackResponse.json();
            console.log(`Obtenidas ${fallbackData.length} publicaciones mediante método alternativo`);
            return fallbackData;
        }
    } catch (error) {
        console.error('Error final en getAllPublicaciones:', error);
        // Devolver array vacío en lugar de lanzar error
        return [];
    }
};

// Obtener una publicación por ID
export const getPublicacionById = async (id) => {
    try {
        console.log(`getPublicacionById: Obteniendo publicación con ID ${id}`);
        const response = await fetch(`${API_URL}/api/publicaciones/${id}`);
        
        if (!response.ok) {
            console.error(`getPublicacionById: Error en la respuesta - ${response.status} ${response.statusText}`);
            throw new Error('Error al obtener la publicación');
        }
        
        const data = await response.json();
        console.log(`getPublicacionById: Publicación obtenida con éxito, propiedades:`, Object.keys(data));
        
        // Verificar si el contenido está presente
        if (!data.contenido) {
            console.warn(`getPublicacionById: El campo 'contenido' no está presente en la respuesta`);
            
            // Intentar encontrar el contenido en otras propiedades
            if (data.Contenido) {
                console.log('getPublicacionById: Usando campo Contenido (mayúscula)');
                data.contenido = data.Contenido;
            } else if (data.content) {
                console.log('getPublicacionById: Usando campo content (inglés)');
                data.contenido = data.content;
            } else if (data.htmlContent) {
                console.log('getPublicacionById: Usando campo htmlContent');
                data.contenido = data.htmlContent;
            }
        } else {
            console.log(`getPublicacionById: Contenido encontrado, longitud: ${data.contenido.length}`);
        }
        
        return data;
    } catch (error) {
        console.error('Error en getPublicacionById:', error);
        throw error;
    }
};

// Crear una nueva publicación
export const createPublicacion = async (publicacionData) => {
    try {
        // Clonar los datos para no modificar el objeto original
        const formattedData = { ...publicacionData };
        
        // Si el campo Imagen_portada existe, moverlo a Imagen_portada
        if ('Imagen_portada' in formattedData) {
            // Ya está con el nombre correcto, no necesitamos renombrarlo
        }
        
        console.log("Datos enviados al backend:", JSON.stringify(formattedData, null, 2));
        console.log("URL de la API:", `${API_URL}/api/publicaciones`);
        
        // Si no se proporcionó una imagen, intentar extraerla del contenido HTML
        if (!formattedData.Imagen_portada) {
            // Extraer la primera imagen del contenido HTML para la portada si existe
            const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/i;
            const match = formattedData.contenido.match(imgRegex);
            
            if (match && match.length > 0) {
                formattedData.Imagen_portada = match[0]; // Guardar la etiqueta img completa
                console.log("Imagen portada detectada del contenido HTML:", formattedData.Imagen_portada);
            }
        } else {
            console.log("Usando imagen portada proporcionada");
        }
        
        const token = localStorage.getItem('userToken');
        console.log("Token de autenticación disponible:", !!token);
        
        const response = await fetch(`${API_URL}/api/publicaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formattedData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(e => ({ detail: 'Error al procesar la respuesta' }));
            console.error("Respuesta del servidor:", response.status, errorData);
            
            // Detectar error específico de tamaño de imagen
            if (errorData.sqlMessage && errorData.sqlMessage.includes('Data too long for column')) {
                // Calcular tamaño de la imagen en MB para mostrar al usuario
                const imageSizeMB = formattedData.Imagen_portada ? 
                    (formattedData.Imagen_portada.length * 0.75 / 1024 / 1024).toFixed(2) : 
                    'desconocido';
                
                throw new Error(`La imagen es demasiado grande (${imageSizeMB} MB). El límite recomendado es de 4MB. Por favor, usa una imagen más pequeña o redúcela antes de subirla.`);
            }
            
            throw new Error(errorData.detail || `Error del servidor: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en createPublicacion:', error);
        throw error;
    }
};

// Crear una publicación desde HTML (método específico para el editor HTML)
export const createPublicacionFromHTML = async (publicacionData) => {
    try {
        // Clonar los datos para no modificar el objeto original
        const formattedData = { ...publicacionData };
        
        // Si el campo Imagen_portada existe, moverlo a Imagen_portada
        if ('Imagen_portada' in formattedData) {
            // Ya está con el nombre correcto, no necesitamos renombrarlo
        }
        
        // Validación básica del contenido HTML
        if (!formattedData.htmlContent || formattedData.htmlContent.trim() === '') {
            throw new Error('El contenido HTML no puede estar vacío');
        }

        // Verificar que el contenido tenga etiquetas HTML válidas
        if (!formattedData.htmlContent.includes("<") || !formattedData.htmlContent.includes(">")) {
            console.warn("El contenido no parece contener etiquetas HTML válidas");
        }

        // Asegurar que existe un resumen o usar los primeros caracteres del título
        if (!formattedData.resumen) {
            formattedData.resumen = formattedData.titulo.substring(0, Math.min(150, formattedData.titulo.length));
        }
        
        // Si no se proporcionó una imagen, intentar extraerla del contenido HTML
        if (!formattedData.Imagen_portada) {
            // Extraer la primera imagen del contenido HTML para la portada si existe
            const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/i;
            const match = formattedData.htmlContent.match(imgRegex);
            
            if (match && match.length > 0) {
                formattedData.Imagen_portada = match[0]; // Guardar la etiqueta img completa
                console.log("Imagen portada detectada desde HTML:", formattedData.Imagen_portada);
            }
        } else {
            console.log("Usando imagen portada proporcionada");
        }

        // Enviamos los datos al backend
        const response = await fetch(`${API_URL}/api/publicaciones/from-html`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify(formattedData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            
            // Detectar error específico de tamaño de imagen
            if (errorData.sqlMessage && errorData.sqlMessage.includes('Data too long for column')) {
                // Calcular tamaño de la imagen en MB para mostrar al usuario
                const imageSizeMB = formattedData.Imagen_portada ? 
                    (formattedData.Imagen_portada.length * 0.75 / 1024 / 1024).toFixed(2) : 
                    'desconocido';
                
                throw new Error(`La imagen es demasiado grande (${imageSizeMB} MB). El límite recomendado es de 4MB. Por favor, usa una imagen más pequeña o redúcela antes de subirla.`);
            }
            
            throw new Error(errorData.detail || 'Error al crear la publicación desde HTML');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en createPublicacionFromHTML:', error);
        throw error;
    }
};

// Actualizar una publicación existente
export const updatePublicacion = async (id, publicacionData) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify(publicacionData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al actualizar la publicación');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en updatePublicacion:', error);
        throw error;
    }
};

// Eliminar una publicación
export const deletePublicacion = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/publicaciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al eliminar la publicación');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en deletePublicacion:', error);
        throw error;
    }
};

// Obtener publicaciones del usuario autenticado
export const getUserPublicaciones = async (limite = 5, offset = 0) => {
  try {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }
    
    const response = await fetch(`${API_URL}/api/publicaciones/user/me?limite=${limite}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener las publicaciones del usuario');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getUserPublicaciones:', error);
    return []; // Devolver array vacío en caso de error
  }
};

// Obtener publicaciones del administrador autenticado
export const getAdminPublicaciones = async (limite = 100, offset = 0) => {
  try {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      console.error('Error: No hay token de autenticación');
      throw new Error('Usuario no autenticado');
    }
    
    console.log(`Solicitando publicaciones de administrador con limite=${limite}, offset=${offset}`);
    
    const url = `${API_URL}/api/publicaciones/admin/me?limite=${limite}&offset=${offset}`;
    console.log('URL de solicitud:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(e => ({ detail: 'Error al procesar la respuesta' }));
      console.error('Error en respuesta del servidor:', response.status, errorData);
      throw new Error(errorData.detail || 'Error al obtener las publicaciones del administrador');
    }
    
    const data = await response.json();
    console.log(`Recibidas ${data.length} publicaciones del administrador`);
    return data;
  } catch (error) {
    console.error('Error en getAdminPublicaciones:', error);
    // Devolver array vacío en lugar de lanzar error
    return [];
  }
};

// Obtener información de depuración del administrador
export const getAdminDebugInfo = async () => {
  try {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      console.error('Error: No hay token de autenticación');
      throw new Error('Usuario no autenticado');
    }
    
    const url = `${API_URL}/api/publicaciones/admin/debug`;
    console.log('URL de solicitud debug:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(e => ({ detail: 'Error al procesar la respuesta' }));
      console.error('Error en respuesta del servidor debug:', response.status, errorData);
      throw new Error(errorData.detail || 'Error al obtener información de depuración');
    }
    
    const data = await response.json();
    console.log('Información de depuración del administrador:', data);
    return data;
  } catch (error) {
    console.error('Error en getAdminDebugInfo:', error);
    return null;
  }
};

export default {
    getAllPublicaciones,
    getPublicacionById,
    createPublicacion,
    createPublicacionFromHTML,
    updatePublicacion,
    deletePublicacion,
    getUserPublicaciones,
    getAdminPublicaciones,
    getAdminDebugInfo
}; 