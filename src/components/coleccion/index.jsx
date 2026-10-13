import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Coleccion() {
  const [pokemones, setPokemones] = useState([]);
  const totalPokes = pokemones.length;
  const [listaCapturados, setListaCapturados] = useState(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem('misNumeros') || '[]');
      return Array.isArray(guardados) ? [...new Set(guardados.map(Number))] : [];
    } catch {
      return [];
    }
  });
  
  const [nuevos, setNuevos] = useState([]);
  const navigate = useNavigate();
  const espacio = Array.from({ length: totalPokes }, (_, i) => i + 1);

  useEffect(() => {
    fetch('https://thronesapi.com/api/v2/Characters')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('No se pudo consultar la API');
        }
        return respuesta.json();
      })
      .then((datos) => {
        setPokemones(datos);
        console.log('Personajes de Game of Thrones:', datos);
      })
      .catch((error) => console.error('Error al cargar personajes:', error));
}, []);

const capturarAleatorios = () => {
  if (pokemones.length === 0) return;

  const seleccionados = Array.from(
    { length: 4 },
    () => pokemones[Math.floor(Math.random() * pokemones.length)].id
  );
    const vistos = new Set(listaCapturados);
    const resultados = seleccionados.map((id) => {
      const repetido = vistos.has(id);
      vistos.add(id);
      return { id, repetido };
    });
    const actualizados = [...vistos];

    setListaCapturados(actualizados);
    setNuevos(resultados);
    localStorage.setItem('misNumeros', JSON.stringify(actualizados));
  };

  return (
    <main className="coleccion">
      <h1 className="coleccion-titulo">Colección</h1>
      <p className="coleccion-contador">{listaCapturados.length} <span>/ {totalPokes}</span></p>
      <button
        className="coleccion-boton"
        onClick={capturarAleatorios}
        disabled={listaCapturados.length >= totalPokes}
      >
        4 nuevos
      </button>

      {nuevos.length > 0 && <h2 className="coleccion-subtitulo">Tus nuevos Pokémon</h2>}
      <section className="coleccion-nuevos">
        {nuevos.map(({ id, repetido }, indice) => (
          <div
            key={`${id}-${indice}`}
            className={repetido ? 'coleccion-nuevo repetido' : 'coleccion-nuevo'}
            onClick={() => navigate(`/pokemon/${id}`)}
          >
            <p>{id}</p>
            <img
              src={pokemones.find(personaje => personaje.id === id)?.imageUrl}
              alt={pokemones.find(personaje => personaje.id === id)?.fullName}
              width="60"
              height="60"
            />
            <p>{pokemones.find(personaje => personaje.id === id)?.fullName}</p>
          </div>
        ))}
      </section>

      <section className="coleccion-album">
        {espacio.map((id) => {
          const capturado = listaCapturados.includes(id);
          return (
            <div
              key={id}
              className={capturado ? 'coleccion-pokemon capturado' : 'coleccion-pokemon'}
              onClick={() => capturado && navigate(`/pokemon/${id}`)}
            >
              {capturado && (
                <img
                  src={pokemones.find(personaje => personaje.id === id)?.imageUrl}
                  width="45"
                  height="45"
                  loading="lazy"
                  alt={pokemones.find(personaje => personaje.id === id)?.fullName || 'Personaje'}
                />
              )}
              <p>{id}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Coleccion;
