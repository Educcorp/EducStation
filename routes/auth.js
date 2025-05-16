// routes/auth.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

// Generar tokens JWT
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your_jwt_refresh_secret',
    { expiresIn: '7d' }
  );
  
  return { access: accessToken, refresh: refreshToken };
};

// POST - Registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, password2, first_name, last_name } = req.body;
    
    // Validación básica
    if (!username || !email || !password || !password2 || !first_name || !last_name) {
      return res.status(400).json({ detail: 'Todos los campos son requeridos' });
    }
    
    if (password !== password2) {
      return res.status(400).json({ detail: 'Las contraseñas no coinciden' });
    }
    
    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.query(
      'SELECT * FROM auth_user WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      if (existingUsers[0].username === username) {
        return res.status(400).json({ username: 'El nombre de usuario ya está en uso' });
      }
      if (existingUsers[0].email === email) {
        return res.status(400).json({ email: 'El correo electrónico ya está en uso' });
      }
    }
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insertar nuevo usuario
    const [result] = await pool.query(
      `INSERT INTO auth_user 
       (username, email, password, first_name, last_name, is_staff, is_active, is_superuser)
       VALUES (?, ?, ?, ?, ?, FALSE, TRUE, FALSE)`,
      [username, email, hashedPassword, first_name, last_name]
    );
    
    // Generar tokens
    const tokens = generateTokens(result.insertId);
    
    res.status(201).json({ 
      user: {
        id: result.insertId,
        username,
        email,
        first_name,
        last_name,
        is_staff: false,
        is_superuser: false
      },
      ...tokens
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ detail: 'Error en el servidor' });
  }
});

// POST - Login
router.post('/token', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ detail: 'Usuario/email y contraseña son requeridos' });
    }
    
    // Buscar usuario por username o email
    const [users] = await pool.query(
      'SELECT * FROM auth_user WHERE username = ? OR email = ?',
      [username, username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ detail: 'Credenciales inválidas' });
    }
    
    const user = users[0];
    
    // Verificar si la cuenta está activa
    if (!user.is_active) {
      return res.status(401).json({ detail: 'Esta cuenta está desactivada' });
    }
    
    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ detail: 'Credenciales inválidas' });
    }
    
    // Generar tokens
    const tokens = generateTokens(user.id);
    
    res.json(tokens);
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ detail: 'Error en el servidor' });
  }
});

// POST - Refrescar token
router.post('/token/refresh', async (req, res) => {
  try {
    const { refresh } = req.body;
    
    if (!refresh) {
      return res.status(400).json({ detail: 'Token de refresco requerido' });
    }
    
    // Verificar token de refresco
    jwt.verify(
      refresh, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your_jwt_refresh_secret',
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ detail: 'Token de refresco inválido o expirado' });
        }
        
        // Verificar si el usuario existe
        const [users] = await pool.query(
          'SELECT id FROM auth_user WHERE id = ?',
          [decoded.userId]
        );
        
        if (users.length === 0) {
          return res.status(401).json({ detail: 'Usuario no encontrado' });
        }
        
        // Generar nuevos tokens
        const tokens = generateTokens(decoded.userId);
        
        res.json(tokens);
      }
    );
  } catch (error) {
    console.error('Error al refrescar token:', error);
    res.status(500).json({ detail: 'Error en el servidor' });
  }
});

// GET - Obtener información del usuario
router.get('/user', authenticateToken, async (req, res) => {
  try {
    // La información del usuario ya está en req.user gracias al middleware authenticateToken
    const user = { ...req.user };
    
    // No enviar la contraseña al cliente
    delete user.password;
    
    res.json(user);
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    res.status(500).json({ detail: 'Error en el servidor' });
  }
});

// GET - Verificar disponibilidad de username
router.get('/user/:username/check', async (req, res) => {
  try {
    const username = req.params.username;
    
    // Buscar el username en la base de datos
    const [users] = await pool.query(
      'SELECT id FROM auth_user WHERE username = ?',
      [username]
    );
    
    // Si no hay resultados, el username está disponible
    res.json({
      available: users.length === 0,
      message: users.length === 0 ? 'Nombre de usuario disponible' : 'Nombre de usuario no disponible'
    });
  } catch (error) {
    console.error('Error al verificar disponibilidad de username:', error);
    res.status(500).json({ detail: 'Error en el servidor' });
  }
});

// POST - Solicitar restablecimiento de contraseña
router.post('/password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ detail: 'Email requerido' });
    }
    
    // Buscar usuario por email
    const [users] = await pool.query(
      'SELECT id FROM auth_user WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ detail: 'No existe ninguna cuenta con este correo electrónico' });
    }
    
    // Generar token para restablecimiento
    const resetToken = jwt.sign(
      { userId: users[0].id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    // En producción, aquí enviaríamos un correo con el token
    // Por ahora, solo devolvemos el token para pruebas
    res.json({ 
      message: 'Se ha enviado un enlace de restablecimiento a tu correo electrónico',
      token: resetToken // En producción no enviaríamos el token en la respuesta
    });
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    res.status(500).json({ detail: 'Error en el servidor' });
  }
});

// GET - Verificar token de restablecimiento
router.get('/password-reset/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verificar token
    jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_jwt_secret',
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ detail: 'Token inválido o expirado' });
        }
        
        // Verificar si el usuario existe
        const [users] = await pool.query(
          'SELECT id FROM auth_user WHERE id = ?',
          [decoded.userId]
        );
        
        if (users.length === 0) {
          return res.status(404).json({ detail: 'Usuario no encontrado' });
        }
        
        res.json({ valid: true });
      }
    );
  } catch (error) {
    console.error('Error al verificar token de restablecimiento:', error);
    res.status(500).json({ detail: 'Error en el servidor' });
  }
});

// POST - Confirmar restablecimiento de contraseña
router.post('/password-reset/confirm', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ detail: 'Token y nueva contraseña son requeridos' });
    }
    
    // Verificar token
    jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_jwt_secret',
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ detail: 'Token inválido o expirado' });
        }
        
        // Encriptar nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Actualizar contraseña
        await pool.query(
          'UPDATE auth_user SET password = ? WHERE id = ?',
          [hashedPassword, decoded.userId]
        );
        
        res.json({ message: 'Contraseña actualizada correctamente' });
      }
    );
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ detail: 'Error en el servidor' });
  }
});

module.exports = router; 