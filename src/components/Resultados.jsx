import { useEffect, useState } from "react";

function Resultados({municipio}) {

    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!municipio) return; // si no hay municipio, no hacemos nada

        async function cargarDatos() {
            setCargando(true);
            setError(null);

            try {
                const res = await fetch(`http://localhost:3000/api/tiempo/${municipio}`);
                if (!res.ok) throw new Error("Error en el servidor");

                const json = await res.json();
                setDatos(json.data); // recuerda que tu backend devuelve { success, data }
            } catch (err) {
                setError("No se pudieron cargar los datos");
            } finally {
                setCargando(false);
            }
        }

        cargarDatos();
    }, [municipio]);

    // Mensajes de estado
    if (!municipio) return <p>Selecciona un municipio para ver el tiempo.</p>;
    if (cargando) return <p>Cargando datos...</p>;
    if (error) return <p>{error}</p>;
    if (!datos) return null;

    // Datos reales de AEMET del primer día que aparece en el array (hoy)
    const dia = datos.prediccion.dia[0];

    return (
        <>
            <div className="resultados">
                <h2>Datos meteorológicos</h2>
                <div className="datos">
                    <p><strong>Fecha del pronóstico: </strong>{dia.fecha}</p>
                    <p><strong>Estado del cielo: </strong>{dia.estadoCielo[0].descripcion}</p>
                    <p><strong>Temperatura máxima: </strong>{dia.temperatura.maxima}ºC</p>
                    <p><strong>Temperatura mínima: </strong>{dia.temperatura.minima}ºC</p>
                    <p><strong>Probabilidad de precipitación: </strong>{dia.probPrecipitacion[0].value}%</p>
                    <p><strong>Viento: </strong>{dia.viento[0].velocidad}km/h</p>
                </div>
            </div>
        </>
    )
}
export default Resultados