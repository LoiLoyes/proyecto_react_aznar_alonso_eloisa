import { useEffect, useState } from "react";

function Resultados() {
    return (
        <>
            <div className="resultados">
                <h2>Datos meteorológicos</h2>
                <div className="datos">
                    <p>Estado del cielo: Nublado</p>
                    <p>Temperatura máxima: 20ºC</p>
                    <p>Temperatura mínima: 10ºC</p>
                    <p>Probabilidad de precipitación: 20%</p>
                    <p>Viento: 10 km/h</p>
                    <p>Fecha del pronóstico: 2024-06-01</p>
                </div>
            </div>
        </>
    )
}
export default Resultados