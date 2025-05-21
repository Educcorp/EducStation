// Configuración global de la aplicación
const config = {
  // API URL basada en el entorno
  apiUrl: process.env.REACT_APP_API_URL || 
          (process.env.NODE_ENV === 'production' 
          ? (window.location.origin.includes('localhost') 
             ? 'http://localhost:5000' 
             : window.location.origin + '/api')
          : 'http://localhost:5000'),
  
  // Otras configuraciones
  authTokenName: 'token',
  appName: 'EducStation',
  
  // Opciones de Avatar
  defaultAvatar: '/assets/images/logoBN.png',
  
  // Tiempo de expiración del token (24 horas en milisegundos)
  tokenExpiration: 24 * 60 * 60 * 1000
};

export default config; 