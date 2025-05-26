/**
 * Utilidades para optimización de imágenes
 */

/**
 * Comprime una imagen base64 reduciendo su calidad
 * @param {string} base64Image - La imagen en formato base64
 * @param {number} quality - Calidad de la imagen (0-1)
 * @returns {Promise<string>} - Imagen comprimida en formato base64
 */
export const compressBase64Image = async (base64Image, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    try {
      // Verificar que sea una imagen base64 válida
      if (!base64Image || typeof base64Image !== 'string' || !base64Image.startsWith('data:image')) {
        return resolve(base64Image);
      }
      
      // Crear una imagen desde el base64
      const img = new Image();
      img.onload = () => {
        // Crear un canvas para la compresión
        const canvas = document.createElement('canvas');
        
        // Calcular dimensiones máximas (limitar a 1200px de ancho máximo)
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar la imagen en el canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con la calidad especificada
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Liberar memoria
        canvas.width = 0;
        canvas.height = 0;
        
        resolve(compressedBase64);
      };
      
      img.onerror = () => {
        console.error('Error al cargar la imagen para compresión');
        resolve(base64Image); // Devolver la original si hay error
      };
      
      img.src = base64Image;
    } catch (error) {
      console.error('Error al comprimir imagen:', error);
      resolve(base64Image); // Devolver la original si hay error
    }
  });
};

/**
 * Optimiza una URL de imagen para carga rápida
 * @param {string} imageUrl - URL de la imagen
 * @returns {string} - URL optimizada
 */
export const optimizeImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return imageUrl;
  
  // Si es una imagen base64, devolverla tal cual
  if (imageUrl.startsWith('data:')) return imageUrl;
  
  // Si es una URL externa, intentar optimizarla
  try {
    const url = new URL(imageUrl);
    
    // Si es una imagen de un CDN conocido, aplicar parámetros de optimización
    if (url.hostname.includes('cloudinary.com')) {
      // Aplicar transformaciones de Cloudinary
      if (!url.pathname.includes('/upload/')) {
        return imageUrl;
      }
      return imageUrl.replace('/upload/', '/upload/q_auto,f_auto,w_800/');
    }
    
    if (url.hostname.includes('imgix.net')) {
      // Aplicar parámetros de imgix
      const separator = url.search ? '&' : '?';
      return `${imageUrl}${separator}auto=compress,format&w=800`;
    }
    
    if (url.hostname.includes('images.unsplash.com')) {
      // Optimizar imágenes de Unsplash
      const separator = url.search ? '&' : '?';
      return `${imageUrl}${separator}q=80&w=800&auto=format`;
    }
  } catch (error) {
    console.error('Error al optimizar URL de imagen:', error);
  }
  
  return imageUrl;
};

/**
 * Optimiza el HTML de un post para mejorar el rendimiento
 * @param {string} html - Contenido HTML del post
 * @returns {string} - HTML optimizado
 */
export const optimizePostHTML = (html) => {
  if (!html) return '';
  
  try {
    // Crear un DOM temporal para manipular el HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Optimizar imágenes
    const images = doc.querySelectorAll('img');
    images.forEach(img => {
      // Añadir atributos para carga perezosa
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      
      // Optimizar URL de la imagen si es posible
      if (img.src && !img.src.startsWith('data:')) {
        img.src = optimizeImageUrl(img.src);
      }
      
      // Asegurar que las imágenes tengan alt
      if (!img.alt) {
        img.alt = 'Imagen del artículo';
      }
    });
    
    // Optimizar iframes (videos, etc.)
    const iframes = doc.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      iframe.setAttribute('loading', 'lazy');
      
      // Si es un video de YouTube, usar la versión lite
      if (iframe.src && (iframe.src.includes('youtube.com') || iframe.src.includes('youtu.be'))) {
        iframe.src = iframe.src.replace('youtube.com', 'youtube-nocookie.com');
      }
    });
    
    // Serializar el DOM de vuelta a string
    return new XMLSerializer().serializeToString(doc.body).replace('<body>', '').replace('</body>', '');
  } catch (error) {
    console.error('Error al optimizar HTML:', error);
    return html;
  }
};

/**
 * Precarga recursos críticos para mejorar el rendimiento
 * @param {string} postId - ID del post
 */
export const preloadCriticalResources = (postId) => {
  if (!postId) return;
  
  // Crear un link de precarga para el post
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.href = `${process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app'}/api/publicaciones/${postId}`;
  preloadLink.as = 'fetch';
  preloadLink.crossOrigin = 'anonymous';
  
  document.head.appendChild(preloadLink);
  
  // Limpiar después de 10 segundos
  setTimeout(() => {
    if (document.head.contains(preloadLink)) {
      document.head.removeChild(preloadLink);
    }
  }, 10000);
};

export default {
  compressBase64Image,
  optimizeImageUrl,
  optimizePostHTML,
  preloadCriticalResources
}; 