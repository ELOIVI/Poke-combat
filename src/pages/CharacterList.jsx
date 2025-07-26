/**
 * @fileoverview Character selection page for Pokémon combat application
 * @author Eloi Viciana Gómez
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { getCharacters } from '../services/api';

/**
 * CharacterList page component that displays a list of Pokémon and allows user to select fighters for combat
 * 
 * This page handles:
 * - Fetching Pokémon data from the API with pagination
 * - Managing character selection state (max 2 characters)
 * - Loading more Pokémon on demand
 * - Navigation to combat page when 2 characters are selected
 * - Loading state display
 * 
 * @component
 * @returns {JSX.Element} A page with character grid, selection display, load more functionality, and combat navigation
 * 
 * @example
 * // This component is typically used as a route
 * <Route path="/" element={<CharacterList />} />
 */
export default function CharacterList() {
  // State management for the component
  const [characters, setCharacters] = useState([]); // List of all available Pokémon
  const [selectedCharacters, setSelectedCharacters] = useState([]); // Currently selected fighters (max 2)
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for load more button
  const [offset, setOffset] = useState(0); // Offset for pagination
  const navigate = useNavigate(); // React Router navigation hook

  // Fetch Pokémon data on component mount
  useEffect(() => {
    getCharacters(20, 0).then(data => {
      setCharacters(data);
      setLoading(false);
      setOffset(20); // Set initial offset for next load
    });
  }, []);

  /**
   * Loads more Pokémon when the "Load More" button is clicked
   * Appends new Pokémon to the existing list
   */
  const loadMorePokemon = async () => {
    setLoadingMore(true);
    try {
      const newPokemon = await getCharacters(20, offset);
      setCharacters(prevCharacters => [...prevCharacters, ...newPokemon]);
      setOffset(prevOffset => prevOffset + 20);
    } catch (error) {
      console.error('Error loading more Pokémon:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * Handles character selection/deselection logic
   * - If character is already selected, remove it from selection
   * - If character is not selected and less than 2 are selected, add it
   * - Maximum of 2 characters can be selected at once
   * 
   * @param {Object} character - The character object to select/deselect
   */
  const handleSelect = (character) => {
    if (selectedCharacters.includes(character)) {
      // Remove character from selection
      setSelectedCharacters(selectedCharacters.filter(c => c.id !== character.id));
    } else if (selectedCharacters.length < 2) {
      // Add character to selection (if under limit)
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  /**
   * Navigates to combat page with selected fighters
   * Only available when exactly 2 characters are selected
   */
  const startCombat = () => {
    navigate('/combat', { state: { fighters: selectedCharacters } });
  };

  // Show loading state while fetching data
  if (loading) return <div>Loading Pokémon...</div>;

  return (
    <div>
      <h1>Pokémon Fighters</h1>
      <div>
        <h3>Selected: {selectedCharacters.map(c => c.name.charAt(0).toUpperCase() + c.name.slice(1)).join(', ')}</h3>
        {selectedCharacters.length === 2 && (
          <button onClick={startCombat}>Start Combat</button>
        )}
      </div>
      <div className="character-list">
        {characters.map(character => (
          <Card
            key={character.id}
            info={character}
            selected={selectedCharacters.includes(character)}
            onSelect={handleSelect}
          />
        ))}
      </div>
      
      {/* Load More Button */}
      <div className="load-more-container">
        <button 
          className="load-more-btn" 
          onClick={loadMorePokemon}
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading more Pokémon...' : 'Load More Pokémon'}
        </button>
        <p style={{ color: '#666', marginTop: '1rem', fontSize: '0.9rem' }}>
          Currently showing {characters.length} Pokémon
        </p>
      </div>
    </div>
  );
}