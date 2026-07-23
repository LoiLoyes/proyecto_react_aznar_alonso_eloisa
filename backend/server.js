// Importar dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar cliente Supabase (si las variables existen)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('tu-proyecto')) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('⚡ Supabase cliente listo para guardar historial');
} else {
  console.warn('⚠️ Supabase no está configurado en backend/.env');
}

// Middlewares
app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(express.json()); // Parsear JSON en el body de las peticiones

// Ruta principal de bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API Backend',
    endpoints: {
      '/api/tiempo/:idMunicipio': 'Obtiene predicción de AEMET y guarda en Supabase',
      '/api/historial': 'Obtiene las últimas búsquedas guardadas en Supabase'
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
      const primerDia = meteorologia[0]?.prediccion?.dia?.[0];

      // Si Supabase está activo, guardamos la consulta en la base de datos de manera transparente
      if (supabase && meteorologia[0]) {
        try {
          await supabase.from('historial_meteorologico').insert([
            {
              municipio: meteorologia[0].nombre || `Municipio ${idMunicipio}`,
              provincia: meteorologia[0].provincia || '',
              temp_max: primerDia?.temperatura?.maxima ? parseInt(primerDia.temperatura.maxima) : null,
              temp_min: primerDia?.temperatura?.minima ? parseInt(primerDia.temperatura.minima) : null,
              estado_cielo: primerDia?.estadoCielo?.[0]?.descripcion || primerDia?.estadoCielo?.[0]?.value || 'Desconocido'
            }
          ]);
          console.log(`✅ Registro guardado en Supabase para: ${meteorologia[0].nombre}`);
        } catch (dbErr) {
          console.error('⚠️ No se pudo guardar en Supabase:', dbErr.message);
        }
      }

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

// Ruta para obtener el historial guardado en Supabase
app.get('/api/historial', async (req, res) => {
  if (!supabase) {
    return res.json({
      success: false,
      error: 'Supabase aún no está configurado en backend/.env',
      data: []
    });
  }

  try {
    const { data, error } = await supabase
      .from('historial_meteorologico')
      .select('*')
      .order('fecha_consulta', { ascending: false })
      .limit(10);

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error al consultar historial Supabase:', error.message);
    res.status(500).json({
      success: false,
      error: `Error Supabase: ${error.message}`
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