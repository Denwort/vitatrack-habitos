// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Controllers
const creacionController = require("./controllers/creacionController");
const edicionController = require("./controllers/edicionController");
const eliminacionController = require("./controllers/eliminacionController");
const visualizacionController = require("./controllers/visualizacionController");
const registroController = require("./controllers/registroController");

// Scheduler
require("./services/habitScheduler");

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.post('/habito/crear', creacionController.crear);
app.post('/habito/editar', edicionController.editar);
app.post('/habito/eliminar', eliminacionController.eliminar);
app.post('/habito/ver', visualizacionController.obtenerPorId);
app.post('/habito/todos', visualizacionController.obtenerTodos);
app.post('/habito/hoy', visualizacionController.obtenerHoy);
app.post('/habito/marcar', registroController.marcarProgreso);

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
  });