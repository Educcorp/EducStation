// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Probar conexión a la base de datos
testConnection().then(success => {
  if (!success) {
    console.error('No se pudo conectar a la base de datos. El servidor continuará, pero pueden ocurrir errores.');
  }
});

// Rutas
const publicacionesRoutes = require('./routes/publicaciones');
const categoriasRoutes = require('./routes/categorias');
const authRoutes = require('./routes/auth');

app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/auth', authRoutes);

// Ruta principal para React en producción
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Si es un error de Multer para tamaño de archivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'El archivo es demasiado grande. Máximo 5MB' });
  }
  
  res.status(500).json({ message: 'Ha ocurrido un error en el servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Presiona Ctrl+C para detener');
}); 