import { useEffect, useState } from "react"; // Importamos el hook useEffect para manejar los efectos secundarios, como la carga de datos cuando el municipio cambia, y useState para manejar el estado de los datos, la carga y los errores.
import { iconoEstadoCielo } from "../iconosEstadoCielo"; // Importamos función para que se añadan los iconos.

// Función que muestra los resultados meteorológicos para el municipio seleccionado, recibe como prop el municipio seleccionado para cargar los datos correspondientes.
function Resultados({municipio}) {
    //
    const [datos, setDatos] = useState(null); // Estado para almacenar los datos meteorológicos cargados desde el backend. En null porque aun no tiene datos.
    const [cargando, setCargando] = useState(false); // Estado para indicar si estamos cargando los datos, inicialmente false porque no estamos cargando nada.
    const [error, setError] = useState(null); // Estado para almacenar cualquier error que ocurra durante la carga de datos, inicialmente null porque no hay errores.

    // useEffect para cargar los datos cada vez que el municipio seleccionado cambie. 
    useEffect(() => {
        if (!municipio) return; // si no hay municipio, no hacemos nada

        // Función asíncrona para cargar los datos desde el backend. La hacemos asíncrona porque vamos a usar fetch, que es una operación asíncrona.
        async function cargarDatos() {
            setCargando(true); // Mientras cargamos los datos, ponemos cargando a true para mostrar el mensaje de carga.
            setError(null); // Reseteamos el error a null cada vez que intentamos cargar datos para que si antes hubo un error, al intentar cargar de nuevo se borre el mensaje de error.

            // Hacemos la petición al backend usando fetch, pasando el municipio seleccionado en la URL. Usamos try/catch para manejar cualquier error que pueda ocurrir durante la petición.
            try {
                const res = await fetch(`http://localhost:3000/api/tiempo/${municipio}`); // await para asegurarnos de que sigue cargando hasta que nos de un resultado.
                if (!res.ok) throw new Error("Error en el servidor"); // Si la respuesta no es ok, lanzamos un error para que se maneje en el catch.
                
                // Si la respuesta es ok, convertimos la respuesta a JSON y guardamos los datos en el estado.
                const json = await res.json(); 
                setDatos(json.data); // Metemos en setDatos el json.data ya que el backend devuelve { success, data }.
            } catch (err) {
                setError("No se pudieron cargar los datos"); // Si ocurre un error, guardamos el mensaje de error.
            } finally {
                setCargando(false); // Cuando termina la carga, ya sea con éxito o con error, ponemos cargando a false para que deje de mostrar el mensaje de carga.
            }
        }
        // Llamamos a la función para cargar los datos.
        cargarDatos();
    }, [municipio]); // El efecto se ejecuta cada vez que el municipio cambia.

    // Mensajes de estado para que el usuario sepa que está pasando.
    // Si no hay municipio seleccionado, mostramos un mensaje para que el usuario sepa que tiene que seleccionar un municipio para ver los resultados.
    if (!municipio) return <p>Selecciona un municipio para ver el tiempo.</p>;
    if (cargando) return <p>Cargando datos...</p>; // Si estamos cargando los datos, mostramosmos el mensaje de carga.
    if (error) return <p>{error}</p>; // Si hay un error, mostramos el mensaje de error. El mensaje de error se guarda en el estado cuando ocurre un error durante la carga de datos.
    if (!datos) return null; // Si no hay datos, no mostramos nada. Esto es para evitar que intente mostrar los resultados antes de que se hayan cargado los datos, ya que al principio el estado de datos es null.

    // Datos reales de AEMET.
    const dias = datos.prediccion.dia;

    // Retornamos el JSX para mostrar los resultados meteorológicos. 
    return (
        <>  
        <h2>Datos meteorológicos</h2>
            <div className="resultados">
            {/* Hacemos un map para iterar más días, no solo el primero */}
                <div className="tarjetas-dia">
                    {dias.map((dia, index) => (
                        <div key={index} className="dia">
                            {/* Mostramos la fecha, el estado del cielo con su icono, la temperatura máxima y mínima, la probabilidad de precipitación y el viento extrayendo los datos de la AEMET, fijándonos en donde están localizados los datos con ayuda de las pruebas en el backend sabemos que parte tenemos que devolver para cada cosa. */}
                            <p><strong>Fecha del pronóstico: </strong><br/>{dia.fecha}</p>
                            {/* Para mostrar el icono del estado del cielo, usamos la función iconoEstadoCielo que importamos al principio*/}
                            <p className="iconos">
                                {iconoEstadoCielo(dia.estadoCielo[0].descripcion)}
                            </p>
                            <p><strong>Estado del cielo: </strong>{dia.estadoCielo[0].descripcion}</p>
                            <p><strong>Temperatura máxima: </strong>{dia.temperatura.maxima}ºC</p>
                            <p><strong>Temperatura mínima: </strong>{dia.temperatura.minima}ºC</p>
                            <p><strong>Probabilidad precipitación: </strong>{dia.probPrecipitacion[0].value}%</p>
                            <p><strong>Viento: </strong>{dia.viento[0].velocidad}km/h</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default Resultados // Exportamos el componente Resultados para importarlo en App.jsx y que todo funcione.