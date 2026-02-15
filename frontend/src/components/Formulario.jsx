// Importamos useState para manejar el estado de la provincia y municipio.
import { useState } from "react"
// Importamos los datos de provincias y municipios desde los archivos JSON que hemos incluido en la carpeta data.
import provincias from "../data/provincias.json"
import municipiosData from "../data/municipios.json"

// Función que muestra el formulario para seleccionar la provincia y el municipio, recibe como prop la función setMunicipio para actualizar el estado del municipio seleccionado en App.jsx.
function Formulario({setMunicipio}) {
    // Constantes de estado para almacenar la provincia y el municipio seleccionados con useState. Inicialmente están vacíos ya que vamos a almacenar ahí lo que seleccionemos en el formulario
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("")
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState("")

    // Buscar con .find el objeto de municipios que corresponde a la provincia seleccionada, hacemos esto ya que el json de municipios tiene un formato diferente al de provincias, el json de municipios tiene un array de objetos, cada objeto tiene un id de provincia y un array de municipios, por lo que tenemos que buscar el objeto que corresponde a la provincia seleccionada para poder mostrar los municipios correspondientes. 
    const provinciaMunicipios = municipiosData.find(
        (p) => p.cod_provincia === provinciaSeleccionada
    )

    // Si existe, usamos su array "municipios", si no, un array vacío
    const municipiosFiltrados = provinciaMunicipios ? provinciaMunicipios.municipios : []

    // Retornamos el formulario con dos select, uno para la provincia y otro para el municipio.
    return (
        <form className="formulario">
            {/* For para iterar sobre las provincias */}
            <label htmlFor="provincia">Provincia:</label>
            <select
                id="provincia"
                value={provinciaSeleccionada}
                onChange={(e) => {
                    setProvinciaSeleccionada(e.target.value) // actualiza el estado de la provincia seleccionada
                    setMunicipioSeleccionado("") // resetea el municipio seleccionado al cambiar de provincia para evitar que el municipio seleccionado no corresponda a la provincia seleccionada
                }}
            >   {/* Opción por defecto para que el usuario sepa que tiene que seleccionar una provincia */}
                <option value="">Selecciona una provincia</option>
                {/* Iteramos sobre el array de provincias para mostrar las opciones en el select, cada opción tiene como valor el id de la provincia y como texto el nombre de la provincia */}
                {provincias.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.nombre}
                    </option>
                ))}
            </select>
            
            <br/> {/* Salto de línea para separar los dos select */}

            {/* For para iterar sobre los municipios filtrados por la provincia seleccionada */}
            <label htmlFor="municipio">Municipio:</label>
            <select
                id="municipio"
                value={municipioSeleccionado}
                onChange={(e) => {
                    setMunicipio(e.target.value) // avisamos a App.jsx del municipio seleccionado para que pueda mostrar los resultados correspondientes
                    setMunicipioSeleccionado(e.target.value)  // actualiza el estado del municipio seleccionado 
                }}
                disabled={!provinciaSeleccionada}  // deshabilitamos el select de municipios si no hay provincia seleccionada
            >
                {/* Opción por defecto para que el usuario sepa que tiene que seleccionar un municipio, esta opción se muestra siempre, incluso si no hay provincia seleccionada, para que el usuario sepa que tiene que seleccionar un municipio después de seleccionar una provincia */}
                <option value="">Selecciona un municipio</option>
                {/* Iteramos sobre el array de municipios filtrados para mostrar las opciones de municiìos correspondiente a la provincia seleccionadaen el select */}
                {municipiosFiltrados.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.nombre}
                    </option>
                ))}
            </select>
        </form>
    )
}

export default Formulario // Exportamos el componente Formulario para importarlo en App.jsx y que todo funcione.