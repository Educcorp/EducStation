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
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Encontrar el último espacio antes del límite
  let truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // Si encontramos un espacio y no está muy cerca del inicio
  if (lastSpace > maxLength * 0.6) {
    truncated = truncated.substring(0, lastSpace);
  }
  
  // Asegurar que no termine con signos de puntuación problemáticos
  truncated = truncated.replace(/[,;:\-–—]$/, '');
  
  return truncated + '...';
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

/**
 * Procesa el contenido HTML para corregir problemas de layout y imágenes
 * @param {string} htmlContent - Contenido HTML del post
 * @returns {string} Contenido HTML procesado y corregido
 */
export const processPostHTML = (htmlContent) => {
  if (!htmlContent) return '';
  
  let processedContent = htmlContent;
  
  // Corregir contenedor principal para evitar restricciones de ancho
  processedContent = processedContent.replace(
    /<div class="post-container"([^>]*)>/g,
    '<div class="post-container"$1 style="max-width: none !important; width: 100% !important; margin: 0 auto !important; box-sizing: border-box !important;">'
  );
  
  // Mejorar el manejo de imágenes preservando estilos originales
  processedContent = processedContent.replace(
    /<img([^>]*?)>/g,
    (match, attributes) => {
      const hasStyle = attributes.includes('style=');
      const hasMaxWidth = attributes.includes('max-width');
      
      if (hasStyle) {
        const styleMatch = attributes.match(/style="([^"]*)"/);
        if (styleMatch) {
          let existingStyle = styleMatch[1];
          
          // Solo agregar max-width si no está presente
          if (!hasMaxWidth) {
            existingStyle = existingStyle.endsWith(';') ? existingStyle : existingStyle + ';';
            existingStyle += ' max-width: 100%; height: auto; display: block; margin: 0 auto;';
          }
          
          // Mejorar calidad de imagen
          existingStyle += ' image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; object-fit: contain; vertical-align: middle;';
          
          return match.replace(styleMatch[0], `style="${existingStyle}"`);
        }
      } else {
        return `<img${attributes} style="max-width: 100%; height: auto; display: block; margin: 0 auto; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; object-fit: contain; vertical-align: middle;">`;
      }
      
      return match;
    }
  );
  
  // Corregir contenedores de imagen centrada
  processedContent = processedContent.replace(
    /<div([^>]*?)style="([^"]*?text-align:\s*center[^"]*?)"([^>]*)>/g,
    '<div$1style="$2; width: 100%; box-sizing: border-box; margin: 25px auto; clear: both;"$3>'
  );
  
  // Mejorar contenedores flex para múltiples imágenes
  processedContent = processedContent.replace(
    /<div([^>]*?)style="([^"]*?display:\s*flex[^"]*?)"([^>]*)>/g,
    '<div$1style="$2; width: 100% !important; max-width: none !important; box-sizing: border-box !important; margin: 30px auto !important; flex-wrap: wrap !important;"$3>'
  );
  
  // Corregir elementos con ancho del 48% para layout flex
  processedContent = processedContent.replace(
    /style="([^"]*?)width:\s*48%([^"]*?)"/g,
    'style="$1width: calc(48% - 10px); min-width: 250px; flex: 0 0 calc(48% - 10px); box-sizing: border-box; margin-bottom: 20px;$2"'
  );
  
  // Asegurar que elementos como stat-box, highlight-box, etc. mantengan su estructura
  processedContent = processedContent.replace(
    /<div class="(stat-box|highlight-box|news-card)"([^>]*)>/g,
    '<div class="$1"$2 style="max-width: none !important; width: 100% !important; box-sizing: border-box !important;">'
  );
  
  // Corregir contenedores con posición relativa
  processedContent = processedContent.replace(
    /<div([^>]*?)style="([^"]*?position:\s*relative[^"]*?)"([^>]*)>/g,
    '<div$1style="$2; width: 100% !important; box-sizing: border-box !important;"$3>'
  );
  
  return processedContent;
}; 