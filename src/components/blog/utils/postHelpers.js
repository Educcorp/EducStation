/**
 * Utilidades para el manejo de posts
 * Este archivo contiene funciones auxiliares reutilizables para el manejo de publicaciones
 */

// Cache para evitar procesar múltiples veces el mismo contenido
const summaryCache = new Map();
const imageCache = new Map();

/**
 * Formatea una fecha al formato español legible
 * @param {string} dateString - Fecha en formato ISO string
 * @returns {string} Fecha formateada en español
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'America/Mexico_City' // Ajustar según la zona horaria del proyecto
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha no disponible';
  }
};

/**
 * Formatea una fecha con hora incluida
 * @param {string} dateString - Fecha en formato ISO string
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Mexico_City'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error);
    return 'Fecha no disponible';
  }
};

/**
 * Extrae un resumen del contenido HTML con caché
 * @param {string} content - Contenido HTML del post
 * @param {number} maxLength - Longitud máxima del resumen (default: 150)
 * @returns {string} Resumen del contenido sin etiquetas HTML
 */
export const extractSummary = (content, maxLength = 150) => {
  if (!content) return '';
  
  // Verificar si ya existe en caché
  const cacheKey = `${content.substring(0, 100)}_${maxLength}`;
  if (summaryCache.has(cacheKey)) {
    return summaryCache.get(cacheKey);
  }
  
  // Crear un elemento temporal para decodificar HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Obtener el texto plano
  let plainText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Limpiar y normalizar el texto de manera más completa
  plainText = plainText
    // Reemplazar múltiples espacios en blanco con uno solo
    .replace(/\s+/g, ' ')
    // Reemplazar saltos de línea y tabs
    .replace(/[\r\n\t]/g, ' ')
    // Limpiar entidades HTML comunes
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '...')
    // Eliminar caracteres de control y caracteres especiales problemáticos
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Limpiar espacios extra al principio y final
    .trim()
    // Eliminar puntos suspensivos múltiples
    .replace(/\.{4,}/g, '...')
    // Normalizar espacios alrededor de signos de puntuación
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([,.;:!?])\s+/g, '$1 ');
  
  // Verificar si el texto resultante está vacío o solo tiene espacios
  if (!plainText || plainText.trim().length === 0) {
    return 'Sin contenido disponible...';
  }
  
  // Truncar manteniendo palabras completas
  let result;
  if (plainText.length <= maxLength) {
    result = plainText;
  } else {
    // Encontrar el último espacio antes del límite
    let truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    // Si encontramos un espacio y no está muy cerca del inicio
    if (lastSpace > maxLength * 0.6) {
      truncated = truncated.substring(0, lastSpace);
    }
    
    // Asegurar que no termine con signos de puntuación problemáticos
    truncated = truncated.replace(/[,;:\-–—]$/, '');
    
    result = truncated + '...';
  }
  
  // Guardar en caché
  summaryCache.set(cacheKey, result);
  
  return result;
};

/**
 * Renderiza HTML de imagen de forma segura y optimizada
 * @param {string} html - HTML de la imagen
 * @returns {Object} Objeto con propiedades para dangerouslySetInnerHTML
 */
export const renderImageHTML = (html) => {
  if (!html) return null;
  
  // Verificar caché
  if (imageCache.has(html)) {
    return imageCache.get(html);
  }
  
  // Modificar el HTML para aplicar estilos a la imagen y optimizar carga
  const modifiedHTML = html
    .replace('<img', '<img loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;"')
    // Añadir atributos para mejorar rendimiento
    .replace(/(<img[^>]*)>/, '$1 fetchpriority="low">');
  
  const result = { __html: modifiedHTML };
  
  // Guardar en caché
  imageCache.set(html, result);
  
  return result;
};

/**
 * Extrae la primera imagen de un contenido HTML
 * @param {string} htmlContent - Contenido HTML
 * @returns {string|null} URL de la primera imagen encontrada o null
 */
export const extractFirstImage = (htmlContent) => {
  if (!htmlContent) return null;
  
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/i;
  const match = htmlContent.match(imgRegex);
  
  return match ? match[1] : null;
};

/**
 * Extrae todas las imágenes de un contenido HTML
 * @param {string} htmlContent - Contenido HTML
 * @returns {Array} Array de URLs de imágenes
 */
export const extractAllImages = (htmlContent) => {
  if (!htmlContent) return [];
  
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
  const matches = htmlContent.matchAll(imgRegex);
  
  return Array.from(matches, match => match[1]);
};

/**
 * Valida si una imagen es base64
 * @param {string} imageData - Datos de la imagen
 * @returns {boolean} True si es base64, false en caso contrario
 */
export const isBase64Image = (imageData) => {
  if (!imageData) return false;
  return imageData.startsWith('data:image');
};

/**
 * Valida si una imagen es HTML
 * @param {string} imageData - Datos de la imagen
 * @returns {boolean} True si es HTML, false en caso contrario
 */
export const isHTMLImage = (imageData) => {
  if (!imageData) return false;
  return imageData.includes('<img') && imageData.includes('src=');
};

/**
 * Calcula el tamaño estimado de una imagen base64 en MB
 * @param {string} base64String - String base64 de la imagen
 * @returns {number} Tamaño estimado en MB
 */
export const calculateBase64Size = (base64String) => {
  if (!base64String) return 0;
  
  // El tamaño real es aproximadamente 3/4 del tamaño del string base64
  return (base64String.length * 0.75) / (1024 * 1024);
};

/**
 * Trunca un texto manteniendo palabras completas
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

/**
 * Genera un slug URL-friendly a partir de un título
 * @param {string} title - Título del post
 * @returns {string} Slug generado
 */
export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres unicode
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .trim('-'); // Remover guiones al inicio y final
};

/**
 * Formatea el número de visualizaciones
 * @param {number} views - Número de visualizaciones
 * @returns {string} Número formateado (ej: 1.2K, 1.5M)
 */
export const formatViews = (views) => {
  if (!views || views === 0) return '0';
  
  if (views < 1000) return views.toString();
  if (views < 1000000) return (views / 1000).toFixed(1) + 'K';
  return (views / 1000000).toFixed(1) + 'M';
};

/**
 * Calcula el tiempo de lectura estimado
 * @param {string} content - Contenido del post
 * @param {number} wordsPerMinute - Palabras por minuto (default: 200)
 * @returns {string} Tiempo de lectura formateado
 */
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  if (!content) return '1 min';
  
  // Remover HTML y contar palabras
  const plainText = content.replace(/<[^>]+>/g, '');
  const wordCount = plainText.trim().split(/\s+/).length;
  
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return minutes === 1 ? '1 min' : `${minutes} min`;
};

/**
 * Procesa el HTML del post para optimizar imágenes y mejorar rendimiento
 * @param {string} htmlContent - Contenido HTML del post
 * @returns {string} HTML optimizado
 */
export const processPostHTML = (htmlContent) => {
  if (!htmlContent) return '';
  
  return htmlContent
    // Optimizar carga de imágenes
    .replace(/<img/g, '<img loading="lazy" decoding="async"')
    // Añadir atributos para mejorar rendimiento
    .replace(/(<img[^>]*)>/g, '$1 fetchpriority="low">')
    // Añadir width y height a iframes si no los tienen
    .replace(/<iframe([^>]*)(?!width|height)>/g, '<iframe$1 width="100%" height="315">')
    // Añadir loading lazy a iframes
    .replace(/<iframe/g, '<iframe loading="lazy"');
};

/**
 * Verifica si el contenido es un documento HTML completo
 * @param {string} content - Contenido a verificar
 * @returns {boolean} True si es un documento HTML completo
 */
export const isFullHTML = (content) => {
  if (!content) return false;
  return content.includes('<!DOCTYPE') || 
         (content.includes('<html') && content.includes('</html>'));
};

/**
 * Limpia la caché de imágenes y resúmenes
 * Útil para liberar memoria cuando ya no se necesitan
 */
export const clearCaches = () => {
  summaryCache.clear();
  imageCache.clear();
};

/**
 * Optimiza imágenes en el DOM para mejorar rendimiento
 * @param {HTMLElement} container - Contenedor donde buscar imágenes
 */
export const optimizeImages = (container) => {
  if (!container) return;
  
  const images = container.querySelectorAll('img');
  
  images.forEach(img => {
    // Añadir atributos para carga optimizada
    img.loading = 'lazy';
    img.decoding = 'async';
    
    // Añadir manejo de errores
    img.onerror = () => {
      img.style.display = 'none';
    };
    
    // Establecer dimensiones si no las tiene
    if (!img.width && !img.height) {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    }
  });
}; 