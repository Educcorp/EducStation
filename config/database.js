const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración del pool de conexiones MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'educstation',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para prueba de conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos exitosa');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
}; 