const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
    }
    
    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
      }
      
      // Buscar al usuario en la base de datos
      const [users] = await pool.query(
        'SELECT id, username, email, first_name, last_name, is_staff, is_superuser FROM auth_user WHERE id = ?',
        [decoded.userId]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      // Si todo está bien, almacenar los datos del usuario en el objeto request
      req.user = users[0];
      next();
    });
  } catch (error) {
    console.error('Error en la autenticación:', error);
    res.status(500).json({ message: 'Error en la autenticación' });
  }
};

module.exports = {
  authenticateToken
}; 