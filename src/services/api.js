/**
 * @fileoverview API service functions for fetching Pokémon data from PokéAPI
 * @author Eloi Viciana Gómez
 */

// Used to successfully make HTTP requests
import axios from "axios";

/** @constant {string} BASE_URL - Base URL for the PokéAPI */
const BASE_URL = "https://pokeapi.co/api/v2/";

/**
 * Fetches a list of Pokémon from the PokéAPI with detailed information
 * 
 * This function performs two API calls:
 * 1. Gets a list of Pokémon names and URLs
 * 2. Fetches detailed data for each Pokémon in parallel
 * 
 * @async
 * @function getCharacters
 * @param {number} [limit=20] - Maximum number of Pokémon to fetch
 * @param {number} [offset=0] - Number of Pokémon to skip (for pagination)
 * @returns {Promise<Array<Object>>} Array of Pokémon objects with id, name, attack, type, and image
 * @returns {Promise<Array>} Empty array if error occurs
 * 
 * @example
 * // Get first 20 Pokémon
 * const pokemon = await getCharacters(20, 0);
 * 
 * // Get next 20 Pokémon (pagination)
 * const morePokemon = await getCharacters(20, 20);
 */
export const getCharacters = async (limit = 20, offset = 0) => {
    try {
        //makes a GET request for /pokemon with query parameters
        const response = await axios.get(`${BASE_URL}pokemon?limit=${limit}&offset=${offset}`)
        
        //Uses the list from the previous request and for each Pokemon,
        //makes an individual request so it can obtain all the details.
        //Promise.all executes all the requests at the same time
        const detailedPokemons = await Promise.all(
            response.data.results.map(async (pokemon)=> {
                const res = await axios.get(pokemon.url);
                return res.data;
            })
        );
        return detailedPokemons.map (pokemon => ({
          id: pokemon.id,
          name: pokemon.name,
          attack: pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat,
          type: pokemon.types [0].type.name,
          image: pokemon.sprites.front_default
        }));

    } catch (error) {
    console.error("Error fetching Pokémon:", error.message);
    return[];
    }
};

/**
 * Fetches detailed information for a single Pokémon by ID
 * 
 * @async
 * @function getSingleCharacter
 * @param {string|number} id - The Pokémon ID or name to fetch
 * @returns {Promise<Object|null>} Pokémon object with id, name, attack, type, and image, or null if error
 * 
 * @example
 * // Get Pikachu by ID
 * const pikachu = await getSingleCharacter(25);
 * 
 * // Get Charizard by name
 * const charizard = await getSingleCharacter('charizard');
 */
export const getSingleCharacter = async (id) => {
  try {
    // Makes a GET request to obtain all the data from a specific Pokémon
    const response = await axios.get(`${BASE_URL}/pokemon/${id}`);
    const pokemon = response.data;
    
    // Return formatted Pokémon data
    return {
      id: pokemon.id,
      name: pokemon.name,
      attack: pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat,
      type: pokemon.types[0].type.name,
      image: pokemon.sprites.front_default
    };
  } catch (error) {
    console.error('Error fetching Pokémon by ID:', error.message);
    return null;
  }
};