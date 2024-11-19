import { useEffect, useState } from "react";
import Character from "./Character";

function CharacterList() {
    const [characters, setCharacters] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Implementar debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000); // Tiempo de debounce
        return () => clearTimeout(handler); // Limpiar el timeout anterior
    }, [search]);

    // Llamar a la API cuando cambie debouncedSearch
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `https://rickandmortyapi.com/api/character?name=${debouncedSearch}`
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setCharacters(data.results || []); // Si no hay resultados, establece un array vacío
            } catch (error) {
                setError("No se encontraron personajes.");
                setCharacters([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [debouncedSearch]);

    return (
        <div>
            <input
                type="text"
                placeholder="Buscar personajes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
            />

            {loading && <p>Cargando personajes...</p>}
            {error && <p>{error}</p>}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {characters.map((character) => (
                    <Character key={character.id} character={character} />
                ))}
            </div>
        </div>
    );
}

export default CharacterList;
