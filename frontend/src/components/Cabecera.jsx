// Componente sencillo para la cabecera de la aplicación que muestra el logo y el título.
function Cabecera({logo, titulo}) {
    return (
        <>
            <head className="head">
                <img className="logo" src={logo} alt="logo"/>
                <h1>{titulo}</h1>
            </head>
        </>  
    )
}

export default Cabecera