// src/services/authService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Export the functions explicitly with named exports
export const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include' // Añadir esto para manejar cookies si es necesario
      });
    
// Obtener los datos JSON independientemente del éxito o fracaso
const data = await response.json();
    
if (!response.ok) {
  // Manejar tanto formatos de error de array como de mensaje único
  if (data.errors) {
    throw new Error(data.errors.map(err => err.msg).join(', '));
  } else if (data.detail) {
    throw new Error(data.detail);
  } else {
    throw new Error('Error en el registro');
  }
}

return data;
} catch (error) {
console.error('Error en el registro:', error);
throw error;
}
};
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.email,
        password: credentials.password,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error en el inicio de sesión');
    }
    
    const data = await response.json();
    
    // Guardar tokens en localStorage
    localStorage.setItem('userToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    
    // Obtener información del usuario
    const userResponse = await fetch(`${API_URL}/auth/user/`, {
      headers: {
        'Authorization': `Bearer ${data.access}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Error al obtener información del usuario');
    }
    
    const userData = await userResponse.json();
    localStorage.setItem('userName', `${userData.first_name} ${userData.last_name}`);
    
    return {
      user: userData,
      token: data.access,
      refresh: data.refresh,
    };
  } catch (error) {
    console.error('Error en el login:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userName');
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No hay token de refresco');
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Token de refresco inválido');
    }
    
    const data = await response.json();
    localStorage.setItem('userToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    
    return data.access;
  } catch (error) {
    console.error('Error al refrescar token:', error);
    logout();
    throw error;
  }
};

// Also provide default exports for backward compatibility
export default {
  register,
  login,
  logout,
  refreshToken
};