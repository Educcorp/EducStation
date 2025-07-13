// Test file to log the API URL
console.log('Testing API URL construction');

const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app/api';
console.log('API_URL from env:', API_URL);

// Log the endpoints that should be used
console.log('GET comments endpoint should be:', `${API_URL}/comentarios/publicacion/55`);
console.log('POST comments endpoint should be:', `${API_URL}/comentarios/publicacion/55`);

// Export dummy function to avoid unused variable warnings
export const testApiUrl = () => {
  return API_URL;
}; 