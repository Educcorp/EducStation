// routes/publicaciones.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/publicaciones');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: function (req, file, cb) {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Función para crear un slug desde un título
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

// GET - Obtener todas las publicaciones
router.get('/', async (req, res) => {
  try {
    // Consulta con JOIN para incluir el nombre de la categoría y el autor
    const [rows] = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre, 
             CONCAT(u.first_name, ' ', u.last_name) as autor_nombre
      FROM publicaciones p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN auth_user u ON p.autor_id = u.id
      WHERE p.estado = 'publicado'
      ORDER BY p.fecha_publicacion DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ message: 'Error al obtener publicaciones' });
  }
});

// GET - Obtener una publicación por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre, 
             CONCAT(u.first_name, ' ', u.last_name) as autor_nombre
      FROM publicaciones p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN auth_user u ON p.autor_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    
    // Obtener las etiquetas relacionadas con la publicación
    const [etiquetas] = await pool.query(`
      SELECT e.id, e.nombre, e.slug
      FROM etiquetas e
      INNER JOIN publicaciones_etiquetas pe ON e.id = pe.etiqueta_id
      WHERE pe.publicacion_id = ?
    `, [req.params.id]);
    
    const publicacion = rows[0];
    publicacion.etiquetas = etiquetas;
    
    res.json(publicacion);
  } catch (error) {
    console.error('Error al obtener publicación:', error);
    res.status(500).json({ message: 'Error al obtener publicación' });
  }
});

// POST - Crear una nueva publicación
router.post('/', authenticateToken, upload.single('imagen'), async (req, res) => {
  let connection;
  
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const { titulo, contenido, categoria_id, estado = 'borrador', tags = '' } = req.body;
    
    // Validar campos requeridos
    if (!titulo || !contenido) {
      return res.status(400).json({ message: 'Título y contenido son requeridos' });
    }
    
    // Crear slug a partir del título
    const slug = createSlug(titulo);
    
    // Verificar si el slug ya existe
    const [existingSlugs] = await connection.query(
      'SELECT slug FROM publicaciones WHERE slug = ?', 
      [slug]
    );
    
    // Si el slug existe, agregar un sufijo numérico
    let finalSlug = slug;
    if (existingSlugs.length > 0) {
      finalSlug = `${slug}-${Date.now()}`;
    }
    
    // Ruta de la imagen si se subió una
    const imagen_portada = req.file 
      ? `/uploads/publicaciones/${req.file.filename}` 
      : null;
    
    // Insertar la publicación
    const [result] = await connection.query(
      `INSERT INTO publicaciones 
       (titulo, slug, contenido, imagen_portada, estado, autor_id, categoria_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titulo, finalSlug, contenido, imagen_portada, estado, req.user.id, categoria_id || null]
    );
    
    const publicacionId = result.insertId;
    
    // Procesar etiquetas si existen
    if (tags && tags.trim() !== '') {
      const etiquetasArray = tags.split(',').map(tag => tag.trim());
      
      for (const tagName of etiquetasArray) {
        if (tagName === '') continue;
        
        // Crear slug para la etiqueta
        const tagSlug = createSlug(tagName);
        
        // Insertar etiqueta si no existe
        let etiquetaId;
        
        // Buscar si ya existe la etiqueta
        const [existingTag] = await connection.query(
          'SELECT id FROM etiquetas WHERE nombre = ?',
          [tagName]
        );
        
        if (existingTag.length > 0) {
          etiquetaId = existingTag[0].id;
        } else {
          // Crear nueva etiqueta
          const [newTag] = await connection.query(
            'INSERT INTO etiquetas (nombre, slug) VALUES (?, ?)',
            [tagName, tagSlug]
          );
          etiquetaId = newTag.insertId;
        }
        
        // Relacionar etiqueta con la publicación
        await connection.query(
          'INSERT INTO publicaciones_etiquetas (publicacion_id, etiqueta_id) VALUES (?, ?)',
          [publicacionId, etiquetaId]
        );
      }
    }
    
    await connection.commit();
    
    res.status(201).json({ 
      id: publicacionId,
      message: 'Publicación creada correctamente'
    });
  } catch (error) {
    if (connection) await connection.rollback();
    
    console.error('Error al crear publicación:', error);
    res.status(500).json({ message: 'Error al crear la publicación' });
  } finally {
    if (connection) connection.release();
  }
});

// PUT - Actualizar una publicación existente
router.put('/:id', authenticateToken, upload.single('imagen'), async (req, res) => {
  let connection;
  
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const { titulo, contenido, categoria_id, estado, tags } = req.body;
    const publicacionId = req.params.id;
    
    // Verificar si la publicación existe y pertenece al usuario
    const [existingPost] = await connection.query(
      'SELECT * FROM publicaciones WHERE id = ?',
      [publicacionId]
    );
    
    if (existingPost.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    
    // Solo permitir actualizar si es el autor o es administrador
    if (existingPost[0].autor_id !== req.user.id && !req.user.is_staff) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta publicación' });
    }
    
    // Preparar datos para actualizar
    const updateData = {};
    if (titulo) {
      updateData.titulo = titulo;
      // Si el título cambió, actualizar el slug
      if (titulo !== existingPost[0].titulo) {
        const newSlug = createSlug(titulo);
        
        // Verificar si el nuevo slug ya existe
        const [existingSlugs] = await connection.query(
          'SELECT slug FROM publicaciones WHERE slug = ? AND id != ?', 
          [newSlug, publicacionId]
        );
        
        updateData.slug = existingSlugs.length > 0 ? `${newSlug}-${Date.now()}` : newSlug;
      }
    }
    
    if (contenido) updateData.contenido = contenido;
    if (categoria_id) updateData.categoria_id = categoria_id;
    if (estado) updateData.estado = estado;
    
    // Si se subió una nueva imagen
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (existingPost[0].imagen_portada) {
        const oldImagePath = path.join(__dirname, '../public', existingPost[0].imagen_portada);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      updateData.imagen_portada = `/uploads/publicaciones/${req.file.filename}`;
    }
    
    // Actualizar la publicación
    if (Object.keys(updateData).length > 0) {
      const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      
      await connection.query(
        `UPDATE publicaciones SET ${fields} WHERE id = ?`,
        [...values, publicacionId]
      );
    }
    
    // Actualizar etiquetas si existen
    if (tags !== undefined) {
      // Eliminar relaciones anteriores
      await connection.query(
        'DELETE FROM publicaciones_etiquetas WHERE publicacion_id = ?',
        [publicacionId]
      );
      
      // Procesar nuevas etiquetas
      if (tags && tags.trim() !== '') {
        const etiquetasArray = tags.split(',').map(tag => tag.trim());
        
        for (const tagName of etiquetasArray) {
          if (tagName === '') continue;
          
          // Crear slug para la etiqueta
          const tagSlug = createSlug(tagName);
          
          // Insertar etiqueta si no existe
          let etiquetaId;
          
          // Buscar si ya existe la etiqueta
          const [existingTag] = await connection.query(
            'SELECT id FROM etiquetas WHERE nombre = ?',
            [tagName]
          );
          
          if (existingTag.length > 0) {
            etiquetaId = existingTag[0].id;
          } else {
            // Crear nueva etiqueta
            const [newTag] = await connection.query(
              'INSERT INTO etiquetas (nombre, slug) VALUES (?, ?)',
              [tagName, tagSlug]
            );
            etiquetaId = newTag.insertId;
          }
          
          // Relacionar etiqueta con la publicación
          await connection.query(
            'INSERT INTO publicaciones_etiquetas (publicacion_id, etiqueta_id) VALUES (?, ?)',
            [publicacionId, etiquetaId]
          );
        }
      }
    }
    
    await connection.commit();
    
    res.json({ 
      id: publicacionId,
      message: 'Publicación actualizada correctamente'
    });
  } catch (error) {
    if (connection) await connection.rollback();
    
    console.error('Error al actualizar publicación:', error);
    res.status(500).json({ message: 'Error al actualizar la publicación' });
  } finally {
    if (connection) connection.release();
  }
});

// DELETE - Eliminar una publicación
router.delete('/:id', authenticateToken, async (req, res) => {
  let connection;
  
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const publicacionId = req.params.id;
    
    // Verificar si la publicación existe y pertenece al usuario
    const [existingPost] = await connection.query(
      'SELECT * FROM publicaciones WHERE id = ?',
      [publicacionId]
    );
    
    if (existingPost.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    
    // Solo permitir eliminar si es el autor o es administrador
    if (existingPost[0].autor_id !== req.user.id && !req.user.is_staff) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
    }
    
    // Eliminar imagen si existe
    if (existingPost[0].imagen_portada) {
      const imagePath = path.join(__dirname, '../public', existingPost[0].imagen_portada);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Eliminar relaciones con etiquetas
    await connection.query(
      'DELETE FROM publicaciones_etiquetas WHERE publicacion_id = ?',
      [publicacionId]
    );
    
    // Eliminar la publicación
    await connection.query(
      'DELETE FROM publicaciones WHERE id = ?',
      [publicacionId]
    );
    
    await connection.commit();
    
    res.json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    if (connection) await connection.rollback();
    
    console.error('Error al eliminar publicación:', error);
    res.status(500).json({ message: 'Error al eliminar la publicación' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router; 