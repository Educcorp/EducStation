const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM categorias
      ORDER BY nombre ASC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});

// GET - Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM categorias
      WHERE id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ message: 'Error al obtener categoría' });
  }
});

// GET - Obtener una categoría por slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM categorias
      WHERE slug = ?
    `, [req.params.slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ message: 'Error al obtener categoría' });
  }
});

// GET - Obtener publicaciones por categoría
router.get('/:id/publicaciones', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre, 
             CONCAT(u.first_name, ' ', u.last_name) as autor_nombre
      FROM publicaciones p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN auth_user u ON p.autor_id = u.id
      WHERE p.categoria_id = ? AND p.estado = 'publicado'
      ORDER BY p.fecha_publicacion DESC
    `, [req.params.id]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener publicaciones por categoría:', error);
    res.status(500).json({ message: 'Error al obtener publicaciones de la categoría' });
  }
});

// POST - Crear una nueva categoría (solo admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (!req.user.is_staff) {
      return res.status(403).json({ message: 'No tienes permiso para crear categorías' });
    }
    
    const { nombre, descripcion } = req.body;
    
    // Validar campos requeridos
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
    }
    
    // Crear slug a partir del nombre
    const slug = nombre
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    
    // Verificar si el slug ya existe
    const [existingSlugs] = await pool.query(
      'SELECT slug FROM categorias WHERE slug = ?', 
      [slug]
    );
    
    if (existingSlugs.length > 0) {
      return res.status(400).json({ message: 'Ya existe una categoría con un nombre similar' });
    }
    
    // Insertar la categoría
    const [result] = await pool.query(
      `INSERT INTO categorias (nombre, slug, descripcion)
       VALUES (?, ?, ?)`,
      [nombre, slug, descripcion || null]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      nombre,
      slug,
      descripcion,
      message: 'Categoría creada correctamente'
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ message: 'Error al crear la categoría' });
  }
});

// PUT - Actualizar una categoría (solo admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (!req.user.is_staff) {
      return res.status(403).json({ message: 'No tienes permiso para modificar categorías' });
    }
    
    const { nombre, descripcion } = req.body;
    const categoriaId = req.params.id;
    
    // Verificar si la categoría existe
    const [existingCategory] = await pool.query(
      'SELECT * FROM categorias WHERE id = ?',
      [categoriaId]
    );
    
    if (existingCategory.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    // Preparar datos para actualizar
    const updateData = {};
    if (nombre) {
      updateData.nombre = nombre;
      
      // Si el nombre cambió, actualizar el slug
      if (nombre !== existingCategory[0].nombre) {
        const newSlug = nombre
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-');
        
        // Verificar si el nuevo slug ya existe
        const [existingSlugs] = await pool.query(
          'SELECT slug FROM categorias WHERE slug = ? AND id != ?', 
          [newSlug, categoriaId]
        );
        
        if (existingSlugs.length > 0) {
          return res.status(400).json({ message: 'Ya existe una categoría con un nombre similar' });
        }
        
        updateData.slug = newSlug;
      }
    }
    
    if (descripcion !== undefined) {
      updateData.descripcion = descripcion;
    }
    
    // Actualizar la categoría
    if (Object.keys(updateData).length > 0) {
      const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      
      await pool.query(
        `UPDATE categorias SET ${fields} WHERE id = ?`,
        [...values, categoriaId]
      );
    }
    
    res.json({ 
      id: categoriaId,
      message: 'Categoría actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ message: 'Error al actualizar la categoría' });
  }
});

// DELETE - Eliminar una categoría (solo admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (!req.user.is_staff) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar categorías' });
    }
    
    const categoriaId = req.params.id;
    
    // Verificar si hay publicaciones asociadas a esta categoría
    const [publicaciones] = await pool.query(
      'SELECT COUNT(*) as count FROM publicaciones WHERE categoria_id = ?',
      [categoriaId]
    );
    
    if (publicaciones[0].count > 0) {
      return res.status(400).json({ 
        message: `No se puede eliminar esta categoría porque tiene ${publicaciones[0].count} publicaciones asociadas`
      });
    }
    
    // Eliminar la categoría
    await pool.query(
      'DELETE FROM categorias WHERE id = ?',
      [categoriaId]
    );
    
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ message: 'Error al eliminar la categoría' });
  }
});

module.exports = router; 