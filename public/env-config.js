// Este archivo permite configurar variables de entorno en tiempo de ejecución
// en entornos de producción como Docker sin necesidad de reconstruir la aplicación
window._env_ = {
  REACT_APP_API_URL: '/api',
  REACT_APP_ENV: 'production'
}; 