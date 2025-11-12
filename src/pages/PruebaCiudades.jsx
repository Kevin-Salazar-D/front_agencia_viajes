import { useEffect, useState } from "react";
import { getCities } from "../services/cities";

export default function PruebaCities() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getCities()
      .then(res => setCities(res.data))
      .catch(err => console.error("Error al obtener ciudades:", err));
  }, []);

  return (
    <div>
      <h1>Ciudades disponibles</h1>
      {cities.length === 0 ? (
        <p>Cargando ciudades...</p>
      ) : (
        <ul>
          {cities.map(c => (
            <li key={c.id}>{c.nombre}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

