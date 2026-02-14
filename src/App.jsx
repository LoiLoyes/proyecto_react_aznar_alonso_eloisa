import './App.css'
import Cabecera from './components/cabecera'
import logo from './assets/logo.svg'
import Formulario from './components/Formulario'


function App() {

  return (
    <>
      <Cabecera logo={logo} titulo="App Meteorológica React"></Cabecera>
      <Formulario></Formulario>
    </>
  )
}

export default App