/* --------------------------------------------------------------------------------------------
--------------------------------            POKEDEX            --------------------------------
--------------------------------------------------------------------------------------------- */

/* ********************************************************************************************
1. OBTENER lista de Pokemon de la API `https://pokeapi.co/api/v2/pokemon`
    2. MOSTRAR lista de Pokemons
3. OBTENER detalle de Pokemon individual 
    4. MOSTRAR Pokemon individual
5. NAVEGAR Gestiona la paginación para mostrar diferentes conjuntos de Pokémon. De 10 en 10. 
    - añadir esto a la url más otras cosas puede limitar la cantidad `?limit=`
6. BUSCAR Permite la búsqueda de Pokémon por nombre (consultar en la documentación). 
    - Si no exite, "pokemon no encontrado".
    - Muestra detalle más específico de cada uno.
7. Botón RESET

** Maneja eventos de botones y actualiza dinámicamente la interfaz. pokémon **
********************************************************************************************* */

let paginaActual = 1;

const prevPagBtn = document.getElementById('prevBtn');
const nextPagBtn = document.getElementById('nextBtn');
const botonResetear = document.getElementById('resetBtn');
const botonBuscarPokemon = document.getElementById('searchBtn');
const pokemonInput = document.getElementById('searchInput');
const listaPokemons = document.getElementById('app');


/****************************
1. OBTENER lista de Pokemons
*****************************/
const obtenerlistaPokemons = async (paginaActual) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(paginaActual - 1) * 10}`); 
        if (!response.ok) {
            throw new Error('🔴 Ha surgido un error: ', response.status);
        }

        const data = await response.json(); 
         /* ***** */ console.log('🟩 Respuesta después json()', data); // muestra array con los 10 primeros
         await mostrarListaPokemons(data.results);

        

    } catch (error) {
        console.error('🔴 Error al obtener los datos:', error.message); 
    }
};

obtenerlistaPokemons();


/****************************
2. MOSTRAR lista de Pokemons
*****************************/
const mostrarListaPokemons = async (pokemons) => {
    /* ***** */ console.log('🟦 ¿Se muestra la lista de Pokemons?', pokemons); 
    listaPokemons.innerHTML = ''; 
    
    pokemons.forEach(async(pokemon) =>  {

        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        /* ***** */ console.log('🟦 ¿Response?', pokemonData);
        
        const contenedorPokemon = document.createElement('li');
        contenedorPokemon.classList.add('pokemon');
        contenedorPokemon.innerHTML = `
            <h2>${pokemon.name}</h2>
            <img class = "imagenPerdida" src= "${pokemonData.sprites.front_default}" alt= "${pokemon.name}"/>`;

        listaPokemons.appendChild(contenedorPokemon);

        // evento para ver detalle de un Pokemon desde la lista
        contenedorPokemon.addEventListener('click', () => {
            obtenerDetallePokemon(pokemon.name);
        });
    })
};

/****************************
3. OBTENER detalle cada Pokemon
*****************************/
const obtenerDetallePokemon = async (nombrePokemon) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);
        if (!response.ok) {
            console.log('🔴 Pokemon no encontrado.');
            return;
        }

        const pokemon = await response.json();
        /* ***** */ console.log('🟨 Pokemon encontrado:', pokemon);

        mostrarDetallePokemon(pokemon); // ventana emergente

    } catch (error) {
        console.error("Error al obtener detalles del Pokémon:", error);
    }
};

obtenerDetallePokemon();

/****************************
4. MOSTRAR detalle cada Pokemon
*****************************/
const mostrarDetallePokemon = (pokemon) => {
    /* ***** */ console.log('🟢 Detalle pokemon ventana flotante', pokemon); 

    const ventanaFlotante = document.createElement('div');
    ventanaFlotante.classList.add('ventana-flotante');
    ventanaFlotante.innerHTML = `
        <div class="detalle-pokemon">
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" width="150"> 
            <p><b>Altura:</b> ${pokemon.height / 10} m</p>
            <p><b>Peso:</b> ${pokemon.weight / 10} kg</p>
            <button class="cerrar-pokemon">Cerrar</button>
        </div>
    `;

    document.body.appendChild(ventanaFlotante);

    const botonCerrar = ventanaFlotante.querySelector('.cerrar-pokemon');
    botonCerrar.addEventListener('click', () => {
        document.body.removeChild(ventanaFlotante);
    });
};


/****************************
5. NAVEGAR por paginación
*****************************/
prevPagBtn.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        obtenerlistaPokemons(paginaActual);
    }
});

nextPagBtn.addEventListener('click', () => {
    paginaActual++;
    obtenerlistaPokemons(paginaActual);
});

resetBtn.addEventListener('click', () => {
    paginaActual = 1;
    obtenerlistaPokemons(paginaActual);
});


/****************************
6. BUSCAR por nombre 
*****************************/
botonBuscarPokemon.addEventListener('click', async () => {
    const buscarPokemon = pokemonInput.value.trim().toLowerCase();
    obtenerDetallePokemon(buscarPokemon);  
});


/****************************
7. Botón RESET
*****************************/
botonResetear.addEventListener('click', async () => {
    location.reload();
});