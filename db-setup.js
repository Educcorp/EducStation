// src/db-setup.js
const { pool } = require('./config/database');

async function setupDatabase() {
  try {
    console.log('Configurando tabla auth_user...');
    
    // Crear tabla auth_user si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS auth_user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        is_staff BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        date_joined DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_superuser BOOLEAN DEFAULT FALSE
      )
    `);
    
    // Verificar si ya tenemos usuarios
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM auth_user');
    
    // Crear un usuario admin si no existen usuarios
    if (userCount[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await pool.query(`
        INSERT INTO auth_user 
        (username, email, password, first_name, last_name, is_staff, is_active, is_superuser)
        VALUES
        ('admin@educstation.com', 'admin@educstation.com', ?, 'Admin', 'Usuario', TRUE, TRUE, TRUE)
      `, [hashedPassword]);
      
      console.log('Usuario administrador creado: admin@educstation.com (contraseña: admin123)');
    }
    
    console.log('¡Configuración de base de datos completada!');
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();