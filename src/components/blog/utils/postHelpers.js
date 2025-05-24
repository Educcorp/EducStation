/**
 * Utilidades para el manejo de posts
 * Este archivo contiene funciones auxiliares reutilizables para el manejo de publicaciones
 */

/**
 * Formatea una fecha al formato español legible
 * @param {string} dateString - Fecha en formato ISO string
 * @returns {string} Fecha formateada en español
 */
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'America/Mexico_City' // Ajustar según la zona horaria del proyecto
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

/**
 * Formatea una fecha con hora incluida
 * @param {string} dateString - Fecha en formato ISO string
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Mexico_City'
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

/**
 * Extrae un resumen del contenido HTML
 * @param {string} content - Contenido HTML del post
 * @param {number} maxLength - Longitud máxima del resumen (default: 150)
 * @returns {string} Resumen del contenido sin etiquetas HTML
 */
export const extractSummary = (content, maxLength = 150) => {
  if (!content) return '';
  
  // Crear un elemento temporal para decodificar HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Obtener el texto plano
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Eliminar espacios extra, saltos de línea y caracteres especiales
  const cleanText = plainText
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
    .replace(/[\r\n\t]/g, ' ') // Reemplazar saltos de línea y tabs
    .replace(/&nbsp;/g, ' ') // Reemplazar entidades HTML de espacio
    .replace(/&amp;/g, '&') // Reemplazar entidades HTML de ampersand
    .replace(/&lt;/g, '<') // Reemplazar entidades HTML de menor que
    .replace(/&gt;/g, '>') // Reemplazar entidades HTML de mayor que
    .replace(/&quot;/g, '"') // Reemplazar entidades HTML de comillas
    .replace(/&#39;/g, "'") // Reemplazar entidades HTML de apostrofe
    .trim();
  
  return cleanText.length > maxLength
    ? cleanText.substring(0, maxLength) + '...'
    : cleanText;
};

/**
 * Renderiza HTML de imagen de forma segura
 * @param {string} html - HTML de la imagen
 * @returns {Object} Objeto con propiedades para dangerouslySetInnerHTML
 */
export const renderImageHTML = (html) => {
  if (!html) return null;
  
  // Modificar el HTML para aplicar estilos a la imagen
  const modifiedHTML = html.replace('<img', '<img style="width:100%;height:100%;object-fit:cover;"');
  
  return {
    __html: modifiedHTML
  };
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