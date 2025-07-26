/**
 * @fileoverview Character detail page for displaying individual Pokémon information
 * @author Eloi Viciana Gómez
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Character from '../components/Character';
import { getSingleCharacter } from '../services/api';

/**
 * CharacterDetail page component that displays detailed information about a specific Pokémon
 * 
 * This page:
 * - Extracts character ID from URL parameters
 * - Fetches detailed character data from the API
 * - Displays character info including stats and type
 * - Handles loading and error states
 * 
 * @component
 * @returns {JSX.Element} A page with detailed character information including stats
 * 
 * @example
 * // This component is used as a route with dynamic ID
 * <Route path="/characters/:id" element={<CharacterDetail />} />
 */
export default function CharacterDetail() {
  // Extract character ID from URL parameters
  const { id } = useParams();
  
  // State management
  const [character, setCharacter] = useState(null); // Character data from API
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch character data when component mounts or ID changes
  useEffect(() => {
    getSingleCharacter(id).then(data => {
      setCharacter(data);
      setLoading(false);
    });
  }, [id]); // Re-run effect when ID changes

  // Handle loading state
  if (loading) return <div>Loading Pokémon...</div>;
  
  // Handle error state (character not found)
  if (!character) return <div>Pokémon not found.</div>;

  return (
    <div className="character-detail">
      {/* Back button */}
      <a href="/" className="back-button">Back to Pokémon List</a>
      
      <h1>Pokémon Details</h1>
      
      {/* Display basic character info using Character component */}
      <Character info={character} />
      
      {/* Display additional stats in cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Attack Power</h3>
          <p>{character.attack}</p>
        </div>
        <div className="stat-card">
          <h3>Type</h3>
          <p>{character.type.charAt(0).toUpperCase() + character.type.slice(1)}</p>
        </div>
        <div className="stat-card">
          <h3>Pokédex Nº</h3>
          <p>#{character.id.toString().padStart(3, '0')}</p>
        </div>
      </div>
    </div>
  );
}