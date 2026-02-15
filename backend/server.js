// Importar dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(express.json()); // Parsear JSON en el body de las peticiones

// Ruta principal de bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API Backend',
    endpoints: {
      '/api/ejemplo': 'Obtiene datos de ejemplo de una API externa',
      '/api/usuarios': 'Obtiene lista de usuarios de ejemplo',
      '/api/usuario/:id': 'Obtiene un usuario específico por ID'
    }
  });
});

// Usando el ejemplo del README.md hacemos la llamada a la API de AEMET, en mi caso por municipio.
app.get('/api/tiempo/:idMunicipio', async (req, res) => {
  try {
    const { idMunicipio } = req.params;
    const API_KEY = process.env.AEMET_APIKEY; // Ponemos el nombre de la variable donde hemos alojado la APIKEY en .env

    // 1ª llamada: obtener URL de datos, la URL que usamos para esta llamada la sacamos de la propia AEMET.
    const response = await fetch(
      `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${idMunicipio}?api_key=${API_KEY}`
    );

    // Si no hay respuesta se manda el Error.
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Si hay respuesta se almacena en esta variable convertida a json.
    const data = await response.json();

    // 2ª llamada: obtener datos reales, metemos la data y si tiene datos esperamos a que nos devuelva esos datos la API
    if (data.datos) {
      const datosResponse = await fetch(data.datos);
      const meteorologia = await datosResponse.json(); // Convertimos esos datos a json

      res.json({
        success: true,
        data: meteorologia[0]   // AEMET devuelve un array, cogemos el primer día
      });
    } else {
      res.json({
        success: false,
        error: "AEMET no devolvió datos"
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos meteorológicos'
    });
  }
});

// Ruta para manejar endpoints no encontrados
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Documentación disponible en http://localhost:${PORT}`);
});