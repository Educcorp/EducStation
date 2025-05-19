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
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'
    });

    // Log de la respuesta para depuración
    console.log('Status de respuesta:', response.status);

    // Si hay error en la respuesta, no interrumpir el flujo
    if (!response.ok) {
      console.error('Error en respuesta checkUsername, asumiendo disponible');
      return { available: true, message: 'Nombre de usuario disponible (por error de red)' };
    }

    try {
      const data = await response.json();
      console.log('Respuesta del servidor:', data);

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
    } catch (jsonError) {
      console.error('Error al procesar respuesta JSON:', jsonError);
      return { available: true, message: 'Nombre de usuario disponible (error en respuesta)' };
    }
  } catch (error) {
    console.error('Error al verificar nombre de usuario:', error);
    // En caso de error de red, permitir continuar el registro
    return { available: true, message: 'Nombre de usuario disponible (por error de red)' };
  }
};

// Registro de usuario - Actualizado para incluir username y mejorar depuración
export const register = async (userData) => {
  try {
    console.log('Enviando solicitud de registro con datos:', {
      username: userData.username,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      // No mostrar contraseñas para seguridad
    });

    // Convertir username a minúsculas antes de enviar al servidor
    const usernameToSend = userData.username.toLowerCase();

    console.log('URL de API:', API_URL);

    const response = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        username: usernameToSend,
        email: userData.email,
        password: userData.password,
        password2: userData.password2,
        first_name: userData.first_name,
        last_name: userData.last_name
      }),
    });

    console.log('Respuesta del servidor status:', response.status);

    let data;
    try {
      data = await response.json();
      console.log('Respuesta del servidor data:', data);
    } catch (jsonError) {
      console.error('Error al procesar la respuesta JSON:', jsonError);
      // Si hay error al procesar JSON pero la respuesta fue exitosa, asumimos éxito
      if (response.ok) {
        return { success: true, message: "Registro exitoso (sin datos)" };
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    }

    if (!response.ok) {
      // Si hay un error específico del backend, lo lanzamos
      if (data?.detail) {
        console.error('Error específico del backend:', data.detail);
        throw new Error(data.detail);
      }
      // Si hay errores de validación, los formateamos
      if (data?.errors) {
        const errorMessage = Array.isArray(data.errors)
          ? data.errors.map(err => err.msg || JSON.stringify(err)).join(', ')
          : Object.values(data.errors).join(', ');
        console.error('Errores de validación:', errorMessage);
        throw new Error(errorMessage);
      }
      // Si hay un error de usuario existente
      if (data?.username) {
        console.error('Error de usuario existente:', data.username);
        throw new Error('El nombre de usuario ya está en uso');
      }
      if (data?.email) {
        console.error('Error de email existente:', data.email);
        throw new Error('El correo electrónico ya está en uso');
      }
      console.error('Error general de registro:', data);
      throw new Error('Error en el registro');
    }

    console.log('Registro exitoso, datos del usuario:', data);
    return data;
  } catch (error) {
    console.error('Error en el registro:', error);
    // Si es un error de red, dar un mensaje más claro
    if (error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    }
    throw error;
  }
};

// Inicio de sesión de usuario - Actualizado para aceptar username o email y manejar superusuarios
export const login = async (credentials) => {
  try {
    // Verificar si parece un email (tiene @ y un punto después)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.username);

    console.log('Iniciando sesión con:', isEmail ? 'email' : 'username', credentials.username);

    const response = await fetch(`${API_URL}/api/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username, // Enviamos tal cual - el backend ya verificará username o email
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error en el inicio de sesión');
    }

    const data = await response.json();
    console.log('Respuesta de inicio de sesión:', data);

    // Limpiar el localStorage antes de guardar nuevos valores
    // para evitar contaminación con datos anteriores
    localStorage.removeItem('userToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('isSuperUser');

    // Guardar tokens en localStorage
    localStorage.setItem('userToken', data.access);
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);

    // Guardar nombre de usuario si está disponible
    if (data.username) {
      localStorage.setItem('userName', data.username);
    }

    // Guardar explícitamente el estado de superusuario
    // Asegurarse de que se convierte a string 'true' o 'false'
    const isSuperUser = !!data.is_superuser;
    localStorage.setItem('isSuperUser', isSuperUser ? 'true' : 'false');

    console.log('Estado de superusuario guardado:', {
      rawValue: data.is_superuser,
      processed: isSuperUser,
      stored: localStorage.getItem('isSuperUser')
    });

    // Obtener información completa del usuario si es necesario
    let userData = {
      username: data.username,
      is_superuser: isSuperUser
    };

    // Si falta información del usuario, obtenerla del servidor
    if (!data.username) {
      try {
        const userResponse = await fetch(`${API_URL}/api/auth/user/`, {
          headers: {
            'Authorization': `Bearer ${data.access}`,
          },
        });

        if (userResponse.ok) {
          userData = await userResponse.json();
          console.log('Información adicional del usuario:', userData);

          // Actualizar localStorage con información completa
          localStorage.setItem('userName', `${userData.first_name} ${userData.last_name}`);
          localStorage.setItem('isSuperUser', userData.is_superuser ? 'true' : 'false');

          console.log('LocalStorage actualizado con datos del usuario:', {
            userName: localStorage.getItem('userName'),
            isSuperUser: localStorage.getItem('isSuperUser')
          });
        } else {
          console.warn('No se pudo obtener información adicional del usuario');
        }
      } catch (error) {
        console.error('Error al obtener datos adicionales del usuario:', error);
        // No lanzamos el error para no interrumpir el login
      }
    }

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
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('isSuperUser');

  console.log('Sesión cerrada, localStorage limpiado:', {
    userToken: localStorage.getItem('userToken'),
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    userName: localStorage.getItem('userName'),
    isSuperUser: localStorage.getItem('isSuperUser')
  });
};

// Nueva función para actualizar el estado de superusuario desde el servidor
export const updateSuperUserStatus = async () => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('accessToken');

  if (!token) {
    console.warn('No hay token de acceso para actualizar el estado de superusuario');
    return false;
  }

  try {
    console.log('Actualizando estado de superusuario desde el servidor...');
    const response = await fetch(`${API_URL}/api/auth/user/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener información del usuario');
    }

    const userData = await response.json();
    const isSuperUser = userData.is_superuser === true;

    // Actualizar en localStorage para mantener consistencia
    localStorage.setItem('isSuperUser', isSuperUser ? 'true' : 'false');
    localStorage.setItem('userToken', token); // Asegurarnos de que también se guarde como userToken

    console.log('Estado de superusuario actualizado:', {
      isSuperUser,
      userData
    });

    return isSuperUser;
  } catch (error) {
    console.error('Error al actualizar estado de superusuario:', error);
    return false;
  }
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
    localStorage.setItem('accessToken', data.access);
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

    const data = await response.json();

    if (!response.ok) {
      // Manejar específicamente el error 404 (correo no encontrado)
      if (response.status === 404) {
        throw new Error(data.detail || 'No existe ninguna cuenta con este correo electrónico.');
      }
      // Otros errores
      throw new Error(data.detail || 'Error al solicitar el restablecimiento de contraseña');
    }

    return data;
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
    // Asegurar que el token sea un string
    const tokenString = String(token).trim();

    console.log('Intentando restablecer contraseña:');
    console.log('- Token (primeros 15 caracteres):', tokenString.substring(0, 15) + '...');
    console.log('- Longitud del token:', tokenString.length);

    const response = await fetch(`${API_URL}/api/auth/password-reset/confirm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: tokenString,
        password: newPassword,
        password2: newPassword
      }),
    });

    // Registrar para depuración
    console.log('Respuesta del servidor reset password:');
    console.log('- Status:', response.status);
    console.log('- StatusText:', response.statusText);

    // Intentar leer la respuesta
    let responseBody;
    try {
      responseBody = await response.json();
      console.log('- Cuerpo de respuesta:', responseBody);
    } catch (e) {
      console.error('- No se pudo leer el cuerpo de la respuesta:', e);
      responseBody = { detail: 'No se pudo leer la respuesta del servidor' };
    }

    if (!response.ok) {
      // Intentar leer el cuerpo del error
      let errorMessage = 'Error al restablecer la contraseña';
      if (responseBody && responseBody.detail) {
        errorMessage = responseBody.detail;
      }

      throw new Error(errorMessage);
    }

    return responseBody;
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    throw error;
  }
};

// Función para eliminar cuenta
export const deleteAccount = async () => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/user/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al eliminar la cuenta');
    }

    // Si la eliminación fue exitosa, limpiamos localStorage
    localStorage.clear();
    sessionStorage.clear();

    return await response.json();
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
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