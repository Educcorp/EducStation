// Test API URL construction
const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app/api';

// Function to get proper API URL
const getApiUrl = () => {
  if (API_URL.endsWith('/api')) {
    return API_URL;
  }
  return `${API_URL}/api`;
};

console.log('API_URL from env:', API_URL);
const publicacionId = 55;
console.log('GET comments endpoint should be:', `${getApiUrl()}/comentarios/publicacion/${publicacionId}`);
console.log('POST comments endpoint should be:', `${getApiUrl()}/comentarios/publicacion/${publicacionId}`);

// Export for potential use in other files
export { getApiUrl }; 