// src/services/authService.js - Actualizado

// Obtener la URL base de la API desde variables de entorno o usar una predeterminada
const API_URL = process.env.REACT_APP_API_URL || 'https://educstation-backend-production.up.railway.app';

// Verificar disponibilidad del nombre de usuario
export const checkUsernameAvailability = async (username) => {
  try {
    // Agregar logs para depuración
    console.log('Verificando disponibilidad de username:', username);

    const response = await fetch(`${API_URL}/api/auth/user/${username}/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log de la respuesta para depuración
    console.log('Status de respuesta:', response.status);

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    // Si la API responde con un error específico
    if (!response.ok) {
      console.error('Error API:', data);
      throw new Error(data.detail || 'Error al verificar el nombre de usuario');
    }

    // Verificar explícitamente la disponibilidad
    if (data.hasOwnProperty('available')) {
      if (!data.available) {
        throw new Error(data.message || 'El nombre de usuario ya está en uso');
      }
      return data;
    } else {
      console.error('Respuesta inesperada de la API:', data);
      // Si la respuesta no tiene el campo 'available', asumimos que está disponible
      // para evitar bloquear el registro injustamente
      return { available: true, message: 'Nombre de usuario disponible (asumido)' };
    }
  } catch (error) {
    console.error('Error al verificar nombre de usuario:', error);
    throw error;
  }
};

// Registro de usuario - Actualizado para incluir username
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username.toLowerCase(),
        email: userData.email,
        password: userData.password,
        password2: userData.password2,
        first_name: userData.first_name,
        last_name: userData.last_name
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si hay un error específico del backend, lo lanzamos
      if (data.detail) {
        throw new Error(data.detail);
      }
      // Si hay errores de validación, los formateamos
      if (data.errors) {
        const errorMessage = Object.values(data.errors).join(', ');
        throw new Error(errorMessage);
      }
      // Si hay un error de usuario existente
      if (data.username) {
        throw new Error('El nombre de usuario ya está en uso');
      }
      if (data.email) {
        throw new Error('El correo electrónico ya está en uso');
      }
      throw new Error('Error en el registro');
    }

    return data;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
};

// Inicio de sesión de usuario - Actualizado para aceptar username o email
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username || credentials.email, // Acepta username o email
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
    const userResponse = await fetch(`${API_URL}/api/auth/user/`, {
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

// Cerrar sesión - limpiar datos de usuario del almacenamiento local
export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userName');
};

// Refrescar el token de acceso
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No hay token de refresco');
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/token/refresh/`, {
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

// Solicitar restablecimiento de contraseña
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/password-reset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al solicitar el restablecimiento de contraseña');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    throw error;
  }
};

// Verificar token de restablecimiento de contraseña
export const verifyResetToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/password-reset/verify/${token}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Token inválido o expirado');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al verificar token de restablecimiento:', error);
    throw error;
  }
};

// Establecer nueva contraseña
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/password-reset/confirm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        password: newPassword,
        password2: newPassword
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al restablecer la contraseña');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    throw error;
  }
};

// Exportación predeterminada para compatibilidad con versiones anteriores
export default {
  register,
  login,
  logout,
  refreshToken,
  requestPasswordReset,
  verifyResetToken,
  resetPassword
};