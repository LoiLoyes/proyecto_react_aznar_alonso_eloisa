import { useState } from "react";
import './App.css'
import Cabecera from './components/cabecera'
import logo from './assets/logo.svg'
import Formulario from './components/Formulario'
import Resultados from './components/Resultados'

function App() {

  const [municipio, setMunicipio] = useState("");
  
  return (
    <>
      <Cabecera logo={logo} titulo="App Meteorológica React"/>

      <h2>Consulta el tiempo en tu municipio</h2>

      <Formulario setMunicipio={setMunicipio}/>

      <Resultados municipio={municipio}/>
    </>
  )
}

export default App