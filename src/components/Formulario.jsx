import { useState } from "react"
import provincias from "../data/provincias.json"
import municipiosData from "../data/municipios.json"

function Formulario({setMunicipio}) {
    // Constantes de estado para almacenar la provincia y el municipio seleccionados con useState.
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("")
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState("")

    // Buscar con .find el objeto de municipios que corresponde a la provincia seleccionada, hacemos esto ya que el json de municipios tiene un formato diferente al de provincias, el json de municipios tiene un array de objetos, cada objeto tiene un id de provincia y un array de municipios, por lo que tenemos que buscar el objeto que corresponde a la provincia seleccionada para poder mostrar los municipios correspondientes. 
    const provinciaMunicipios = municipiosData.find(
        (p) => p.cod_provincia === provinciaSeleccionada
    )

    // Si existe, usamos su array "municipios", si no, un array vacío
    const municipiosFiltrados = provinciaMunicipios ? provinciaMunicipios.municipios : []

    return (
        <form className="formulario">
            <label htmlFor="provincia">Provincia:</label>
            <select
                id="provincia"
                value={provinciaSeleccionada}
                onChange={(e) => {
                    setProvinciaSeleccionada(e.target.value)
                    setMunicipioSeleccionado("") // resetear municipio
                }}
            >
                <option value="">Selecciona una provincia</option>
                {provincias.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.nombre}
                    </option>
                ))}
            </select>
            
            <br/>

            <label htmlFor="municipio">Municipio:</label>
            <select
                id="municipio"
                value={municipioSeleccionado}
                onChange={(e) => {
                    setMunicipio(e.target.value) // avisamos a App.jsx del municipio seleccionado para que pueda mostrar los resultados correspondientes
                    setMunicipioSeleccionado(e.target.value)   
                }}
                disabled={!provinciaSeleccionada}  // deshabilitar si no hay provincia seleccionada
            >
                <option value="">Selecciona un municipio</option>
                {municipiosFiltrados.map((m) => (
                    <option key={m.id} value={m.nombre}>
                        {m.nombre}
                    </option>
                ))}
            </select>

            <br/>

            <button type="submit">Consultar tiempo</button>
        </form>
    )
}

export default Formulario
