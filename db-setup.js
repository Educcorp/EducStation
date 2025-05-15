// src/db-setup.js
const { pool } = require('./config/database');

async function setupDatabase() {
  try {
    console.log('Configurando tablas de la base de datos...');
    
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
    
    // Crear tabla categorias si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        descripcion TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla publicaciones si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS publicaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        contenido LONGTEXT NOT NULL,
        imagen_portada VARCHAR(500),
        fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        ultima_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        estado ENUM('borrador', 'publicado') DEFAULT 'borrador',
        autor_id INT,
        categoria_id INT,
        FOREIGN KEY (autor_id) REFERENCES auth_user(id) ON DELETE SET NULL,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
      )
    `);
    
    // Crear tabla etiquetas si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS etiquetas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE
      )
    `);
    
    // Crear tabla de relación entre publicaciones y etiquetas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS publicaciones_etiquetas (
        publicacion_id INT,
        etiqueta_id INT,
        PRIMARY KEY (publicacion_id, etiqueta_id),
        FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
        FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE
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
    
    // Insertar categorías predeterminadas si no existen
    const categorias = [
      { nombre: 'Noticias', slug: 'noticias', descripcion: 'Noticias y actualizaciones' },
      { nombre: 'Técnicas de Estudio', slug: 'tecnicas-de-estudio', descripcion: 'Técnicas y métodos para estudiar mejor' },
      { nombre: 'Problemáticas', slug: 'problematicas', descripcion: 'Análisis de problemáticas educativas' },
      { nombre: 'Educación de Calidad', slug: 'educacion-de-calidad', descripcion: 'Recursos para una educación de calidad' },
      { nombre: 'Herramientas', slug: 'herramientas', descripcion: 'Herramientas útiles para la educación' },
      { nombre: 'Desarrollo Docente', slug: 'desarrollo-docente', descripcion: 'Recursos para el desarrollo profesional docente' },
      { nombre: 'Comunidad', slug: 'comunidad', descripcion: 'Recursos para la comunidad educativa' }
    ];
    
    for (const categoria of categorias) {
      try {
        await pool.query(`
          INSERT IGNORE INTO categorias (nombre, slug, descripcion)
          VALUES (?, ?, ?)
        `, [categoria.nombre, categoria.slug, categoria.descripcion]);
      } catch (error) {
        console.log(`La categoría ${categoria.nombre} ya existe.`);
      }
    }
    
    console.log('¡Configuración de base de datos completada!');
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
  }
}

setupDatabase().then(() => {
  pool.end(); // Cerrar conexión al finalizar
});