
const express = require('express');
const cors = require('cors');

// =====================================
// PERUFARMA - SERVIDOR BACKEND
// Node.js + Express
// =====================================

const app = express();
const PORT = 3001;

// Permitir solicitudes desde React y Angular
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4200',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4200'
  ]
}));

// Permitir recibir datos JSON
app.use(express.json({ limit: '1mb' }));

// =====================================
// RUTA PRINCIPAL
// =====================================

app.get('/', (req, res) => {
  res.json({
    proyecto: 'PeruFarma',
    mensaje: 'Bienvenido al servidor de PeruFarma',
    estado: 'Activo'
  });
});

// =====================================
// VERIFICAR ESTADO DEL SERVIDOR
// =====================================

app.get('/api/salud', (req, res) => {
  res.json({
    ok: true,
    sistema: 'PeruFarma',
    mensaje: 'Backend funcionando correctamente',
    fecha: new Date().toISOString()
  });
});

// =====================================
// INICIAR SERVIDOR
// =====================================

app.listen(PORT, '127.0.0.1', () => {
  console.log('====================================');
  console.log('    PERUFARMA - BACKEND ACTIVO');
  console.log('====================================');
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log('Estado: funcionando correctamente');
  console.log('====================================');
});
