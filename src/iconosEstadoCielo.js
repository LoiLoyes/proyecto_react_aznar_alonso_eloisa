export function iconoEstadoCielo(descripcion) {
    const texto = descripcion.toLowerCase(); // Pasamos a minúsculas.

    // Si el texto extraído incluye una determinada palabra retorna el icono que hemos elegido.
    if (texto.includes("despejado")) return "☀️";
    if (texto.includes("poco nuboso")) return "🌤️";
    if (texto.includes("lluvia") || texto.includes("chubascos")) return "🌧️";
    if (texto.includes("nubes")) return "☁️";
    if (texto.includes("nuboso")) return "☁️";
    if (texto.includes("cubierto")) return "🌥️";
    if (texto.includes("tormenta")) return "⛈️";

    return "🌈"; // icono por defecto
}
