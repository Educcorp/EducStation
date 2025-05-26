const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Cache y throttling para optimizar rendimiento
const cache = new Map();
const pendingRequests = new Map();
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutos
const REQUEST_TIMEOUT = 10000; // 10 segundos

// Función para crear clave de cache
const createCacheKey = (endpoint, params = {}) => {
  const paramsString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${endpoint}?${paramsString}`;
};

// Función para verificar si el cache es válido
const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_DURATION;
};

// Función optimizada para hacer requests con cache y throttling
const fetchWithOptimizations = async (url, options = {}) => {
  const cacheKey = url;
  
  // Verificar cache primero
  const cachedData = cache.get(cacheKey);
  if (isCacheValid(cachedData)) {
    console.log(`📦 Cache hit: ${cacheKey}`);
    return cachedData.data;
  }
  
  // Verificar si ya hay una request pendiente para esta URL
  if (pendingRequests.has(cacheKey)) {
    console.log(`⏳ Request pendiente: ${cacheKey}`);
    return pendingRequests.get(cacheKey);
  }
  
  // Crear nueva request con timeout
  const requestPromise = Promise.race([
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
    )
  ]).then(async response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Guardar en cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }).finally(() => {
    // Limpiar request pendiente
    pendingRequests.delete(cacheKey);
  });
  
  // Guardar request pendiente
  pendingRequests.set(cacheKey, requestPromise);
  
  return requestPromise;
};

// Obtener todas las publicaciones (OPTIMIZADO)
export const getAllPublicaciones = async (limite = 20, offset = 0, estado = null) => {
    try {
        console.log(`🚀 getAllPublicaciones: limite=${limite}, offset=${offset}, estado=${estado}`);
        
        // Obtener el token de autenticación
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        // Verificar si el usuario es administrador para usar la ruta correcta
        const isSuperUser = localStorage.getItem('isSuperUser') === 'true';
        
        if (isSuperUser && token) {
            // Para administradores, usar la ruta /all que incluye todas las publicaciones
            try {
                const adminUrl = `${API_URL}/api/publicaciones/all?limite=${limite}&offset=${offset}`;
                console.log("🔒 Admin cargando con endpoint /all");
                
                const data = await fetchWithOptimizations(adminUrl, { headers });
                console.log(`✅ Obtenidas ${data.length} publicaciones como administrador`);
                return data;
            } catch (adminError) {
                console.error("❌ Error en endpoint admin:", adminError);
                // Continuar con métodos alternativos
            }
        }
        
        // Método optimizado para usuarios normales
        try {
            let url = `${API_URL}/api/publicaciones?limite=${limite}&offset=${offset}`;
            if (estado) {
                url += `&estado=${estado}`;
            }
            
            console.log("📊 Cargando con endpoint principal optimizado");
            
            const data = await fetchWithOptimizations(url, { headers });
            console.log(`✅ Obtenidas ${data.length} publicaciones correctamente`);
            return data;
        } catch (fetchError) {
            console.error("❌ Error en la petición principal:", fetchError);
            
            // Método alternativo: endpoint latest (más rápido)
            console.log("🔄 Intentando método alternativo latest...");
            const fallbackUrl = `${API_URL}/api/publicaciones/latest?limite=${limite}`;
            
            const fallbackData = await fetchWithOptimizations(fallbackUrl, { headers });
            console.log(`🆘 Obtenidas ${fallbackData.length} publicaciones mediante método alternativo`);
            return fallbackData;
        }
    } catch (error) {
        console.error('❌ Error final en getAllPublicaciones:', error);
        // Limpiar cache en caso de error
        cache.clear();
        return [];
    }
};

// Función para limpiar cache manualmente
export const clearCache = () => {
    cache.clear();
    pendingRequests.clear();
    console.log('🧹 Cache y requests pendientes limpiados');
};

// Obtener publicación por ID (OPTIMIZADO)
export const getPublicacionById = async (id) => {
  try {
    const cacheKey = `publicacion_${id}`;
    const cachedData = cache.get(cacheKey);
    
    if (isCacheValid(cachedData)) {
      console.log(`📦 Cache hit: publicación ${id}`);
      return cachedData.data;
    }
    
    const response = await fetch(`${API_URL}/api/publicaciones/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener la publicación');
    }
    
    const data = await response.json();
    
    // Guardar en cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error('Error en getPublicacionById:', error);
    return null;
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