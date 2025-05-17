/**
 * Formatea una fecha a formato legible en español
 * @param {string} dateString - Fecha en formato ISO o cualquier formato válido para Date
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    // Opciones para formatear la fecha en español
    const options = { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    // Formatear la fecha usando el locale es-ES (español de España)
    return date.toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
};

/**
 * Calcula el tiempo transcurrido desde una fecha hasta ahora
 * @param {string} dateString - Fecha en formato ISO o cualquier formato válido para Date
 * @returns {string} Tiempo transcurrido en formato relativo
 */
export const getTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Hace algún tiempo';
    }
    
    const seconds = Math.floor((now - date) / 1000);
    
    // Menos de un minuto
    if (seconds < 60) {
      return 'Hace un momento';
    }
    
    // Minutos
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    // Horas
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    
    // Días
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
    
    // Semanas
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }
    
    // Meses
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    
    // Años
    const years = Math.floor(days / 365);
    return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
  } catch (error) {
    console.error('Error al calcular tiempo transcurrido:', error);
    return 'Hace algún tiempo';
  }
}; 