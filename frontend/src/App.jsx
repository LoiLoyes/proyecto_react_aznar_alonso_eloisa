import { useState } from "react"; // Importamos el hook useState para manejar el estado del municipio seleccionado
import './App.css'  // Importamos los estilos para la aplicación
// Importamos los componentes y elementos necesarios para la aplicación:
import Cabecera from './components/Cabecera' 
import logo from './assets/logo.svg'
import Formulario from './components/Formulario'
import Resultados from './components/Resultados'
import Historial from './components/Historial'

// Función principal de la aplicación que renderiza los componentes.
function App() {
  // Constante con el estado del municipio seleccionado, inicialmente vacío.
  const [municipio, setMunicipio] = useState("");
  
  return (
    <>
      {/* Renderizamos el componente Cabecera y le pasamos el logo y el título de la aplicación como props */}
      <Cabecera logo={logo} titulo="App Meteorológica React"/>

      <h2>Consulta el tiempo en tu municipio</h2>
      {/* Renderizamos el componente Formulario y le pasamos la función setMunicipio para actualizar el estado del municipio seleccionado por el usuario*/}
      <Formulario setMunicipio={setMunicipio}/>
      {/* Renderizamos el componente Resultados y le pasamos el municipio seleccionado para mostrar los resultados meteorológicos correspondientes */}
      <Resultados municipio={municipio}/>
      
      {/* Renderizamos el componente Historial para visualizar las búsquedas guardadas en Supabase */}
      <Historial triggerRefresh={municipio} />
    </>
  )
}

export default App // Exportamos el componente App para importarlo en el main y que todo funcione.