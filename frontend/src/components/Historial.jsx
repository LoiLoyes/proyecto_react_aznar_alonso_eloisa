import { useEffect, useState } from "react";

function Historial({ triggerRefresh }) {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensajeSupabase, setMensajeSupabase] = useState("");

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const response = await fetch("http://localhost:3000/api/historial");
      const data = await response.json();

      if (data.success) {
        setHistorial(data.data || []);
        setMensajeSupabase("");
      } else {
        setMensajeSupabase(data.error || "No se pudo cargar el historial.");
      }
    } catch (error) {
      console.error("Error al conectar con la API de historial:", error);
      setMensajeSupabase("Asegúrate de que el servidor backend (Node) esté corriendo.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, [triggerRefresh]);

  return (
    <div style={{
      marginTop: "40px",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      color: "#333"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h3 style={{ margin: 0, color: "#028d8d" }}>⚡ Historial de Búsquedas (Guardado en Supabase)</h3>
        <button
          onClick={cargarHistorial}
          style={{
            padding: "8px 16px",
            backgroundColor: "#028d8d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {cargando ? "Cargando..." : "Actualizar Historial"}
        </button>
      </div>

      {mensajeSupabase && (
        <div style={{ padding: "10px", backgroundColor: "#fff3cd", color: "#856404", borderRadius: "6px", marginBottom: "15px" }}>
          ℹ️ {mensajeSupabase}
        </div>
      )}

      {historial.length === 0 && !mensajeSupabase ? (
        <p>Aún no hay registros en la base de datos de Supabase. Haz una consulta en el formulario superior.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "2px solid #ccc" }}>
                <th style={{ padding: "10px" }}>Fecha</th>
                <th style={{ padding: "10px" }}>Municipio</th>
                <th style={{ padding: "10px" }}>Provincia</th>
                <th style={{ padding: "10px" }}>Temp. Máx</th>
                <th style={{ padding: "10px" }}>Temp. Mín</th>
                <th style={{ padding: "10px" }}>Estado Cielo</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((reg) => (
                <tr key={reg.id || Math.random()} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px", fontSize: "0.9em" }}>
                    {reg.fecha_consulta ? new Date(reg.fecha_consulta).toLocaleString("es-ES") : "-"}
                  </td>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>{reg.municipio}</td>
                  <td style={{ padding: "10px" }}>{reg.provincia || "-"}</td>
                  <td style={{ padding: "10px", color: "#d32f2f", fontWeight: "bold" }}>
                    {reg.temp_max !== null ? `${reg.temp_max} °C` : "-"}
                  </td>
                  <td style={{ padding: "10px", color: "#1976d2", fontWeight: "bold" }}>
                    {reg.temp_min !== null ? `${reg.temp_min} °C` : "-"}
                  </td>
                  <td style={{ padding: "10px" }}>{reg.estado_cielo || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Historial;
