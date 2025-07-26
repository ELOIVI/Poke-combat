/**
 * @fileoverview Combat page for displaying Pokémon battle results
 * @author Eloi Viciana Gómez
 */

import { useLocation } from 'react-router-dom';
import CombatResult from '../components/CombatResult';

/**
 * Combat page component that handles the battle between selected Pokémon fighters
 * 
 * This page:
 * - Receives fighter data from navigation state (passed from CharacterList)
 * - Delegates combat logic and display to CombatResult component
 * - Provides fallback for missing or invalid fighter data
 * 
 * @component
 * @returns {JSX.Element} A page displaying the combat result between fighters
 * 
 * @example
 * // This component is navigated to with state
 * navigate('/combat', { state: { fighters: [pokemon1, pokemon2] } });
 */
export default function Combat() {
  // Extract navigation state containing fighter data
  const { state } = useLocation();
  
  // Destructure fighters from state with fallback to empty array, just for protection if anyone goes directly to /combat
  const { fighters } = state || { fighters: [] };

  // Delegate combat display to CombatResult component
  return <CombatResult fighters={fighters} />;
}