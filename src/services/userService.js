import axios from 'axios';

// Forzamos la URL local para pruebas
const API_URL = 'http://localhost:5000';

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Error en el registro';
  }
};

// Login de usuario
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Error en el inicio de sesión';
  }
};

// Obtener usuario actual
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    const response = await axios.get(`${API_URL}/api/users/current`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Error al obtener usuario actual';
  }
};

// Actualizar avatar del usuario
export const updateUserAvatar = async (avatarData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    console.log('Enviando avatar a:', `${API_URL}/api/users/avatar`);
    console.log('Token:', token);
    
    const response = await axios.put(
      `${API_URL}/api/users/avatar`,
      { avatarData },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error completo:', error);
    throw new Error('Error al actualizar avatar: ' + (error.response?.data?.msg || error.message));
  }
};

// Cerrar sesión
export const logoutUser = () => {
  localStorage.removeItem('token');
}; 