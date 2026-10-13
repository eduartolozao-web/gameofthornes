import { useParams } from "react-router-dom"; 
import { useState, useEffect } from 'react'
import './style.css'

function Pokemon() {
    const { name } = useParams(); 
    const [datapoke, setDatapoke] = useState([]);
    const [favoritos, setFavoritos] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('favoritos') || '[]');
        } catch {
            return [];
        }
    });
    const esFavorito = favoritos.some(p => p.id === datapoke.id);


    useEffect(() => {
    fetch(`https://thronesapi.com/api/v2/Characters/${name}`)
      .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener el personaje');
        }
        return response.json();
       })
      .then(responseData => setDatapoke(responseData))
      .catch(error => console.error("Error:", error));
    }, [name]); 

    const toggleFavorito = () => {
        let nuevosFavoritos;
        if (esFavorito) {
        nuevosFavoritos = favoritos.filter(p => p.id !== datapoke.id);
        } else {
        nuevosFavoritos = [...favoritos, {
            id: datapoke.id,
            nombre: datapoke.fullName,
            imagen: datapoke.imageUrl
        }];
        }
        setFavoritos(nuevosFavoritos);
        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
    };
    
    if (!datapoke || !datapoke.id) return <p>Cargando...</p>;
    return (
        <div>
        <p>{datapoke.id}</p>
        <h1>{datapoke.fullname}</h1>
        <img 
            src={datapoke.imageUrl} 
            alt={datapoke.fullName} 
            width="200"
        />

        <p>Título: {datapoke.title}</p>
        <p>Familia: {datapoke.family}</p>

        


            <button onClick={toggleFavorito}>
            {esFavorito ? '❤️' : '🤍'}
            </button>
        </div>
    )
}

export default Pokemon
