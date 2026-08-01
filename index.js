const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Inicialización de la Tabla de Base de Datos
const initDb = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      precio NUMERIC(10, 2) NOT NULL,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log('✅ Tabla "productos" verificada/creada correctamente.');
  } catch (err) {
    console.error('⚠️ Error al inicializar la base de datos:', err.message);
  }
};

initDb();

// ------------------- ENDPOINTS ------------------- //

// 1. Endpoint Raíz
app.get('/', (req, res) => {
  res.json({
    mensaje: '🚀 API REST DevOps en Producción',
    estudiante: 'Gustavo Palacios',
    estado: 'Operativo',
    monitoreo: '/health'
  });
});

// 2. Endpoint de Monitoreo / Health Check (Rúbrica - Requisito 5)
app.get('/health', async (req, res) => {
  let dbStatus = 'Desconectado';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'Conectado';
  } catch (error) {
    dbStatus = 'Error: ' + error.message;
  }

  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    base_de_datos: dbStatus,
    servicio: 'devops-api-express'
  });
});

// 3. Endpoint GET - Obtener productos (Rúbrica - Requisito 2)
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY id DESC');
    res.json({ ok: true, total: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 4. Endpoint POST - Crear un producto (Rúbrica - Requisito 2)
app.post('/api/productos', async (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ ok: false, mensaje: 'Nombre y precio son obligatorios.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO productos (nombre, precio) VALUES ($1, $2) RETURNING *',
      [nombre, precio]
    );
    res.status(201).json({ ok: true, mensaje: 'Producto registrado', producto: result.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});