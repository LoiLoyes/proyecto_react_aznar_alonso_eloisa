import { useState } from "react";
import './App.css'
import Cabecera from './components/cabecera'
import logo from './assets/logo.svg'
import Formulario from './components/Formulario'
import Resultados from './components/Resultados'
const apiKey = import.meta.env.VITE_APIKEY;

function App() {

  const [municipio, setMunicipio] = useState("")

  return (
    <>
      <Cabecera logo={logo} titulo="App Meteorológica React"/>
      <body className="body">
        <h2>Consulta el tiempo en tu municipio</h2>
        <Formulario setMunicipio={setMunicipio}/>
        <Resultados municipio={municipio}/>
        <footer className="footer">
          <p>Desarrollado por Eloisa Aznar Alonso 2ºDAW</p>
        </footer>
      </body>
      
    </>
  )
}

export default App
