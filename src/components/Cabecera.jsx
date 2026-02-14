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