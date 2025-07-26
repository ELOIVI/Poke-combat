/**
 * @fileoverview Combat Result display component with animated battle sequences
 * @author Eloi Viciana Gómez
 */

import { useState, useEffect } from 'react';

/**
 * CombatResult component that handles animated combat logic and displays the battle result between two Pokémon
 * 
 * The component shows an animated battle sequence with:
 * - Fighter cards that attack and take damage
 * - Combat log showing attack moves
 * - Victory animation for the winner
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Array<Object>} props.fighters - Array containing the two Pokémon fighters
 * @param {string} props.fighters[].name - Name of the Pokémon fighter
 * @param {number} props.fighters[].attack - Attack stat of the Pokémon (used to determine winner)
 * @param {string} props.fighters[].id - Unique identifier of the Pokémon
 * @param {string} props.fighters[].image - Image URL of the Pokémon
 * 
 * @returns {JSX.Element} Animated combat arena showing the battle sequence and winner
 * 
 * @example
 * <CombatResult 
 *   fighters={[
 *     { name: 'pikachu', attack: 55, id: '25', image: 'url' },
 *     { name: 'charizard', attack: 84, id: '6', image: 'url' }
 *   ]}
 * />
 */
export default function CombatResult({ fighters }) {
  // Validation: Ensure exactly 2 Pokémon are selected for combat
  if (fighters.length !== 2) return <div>Please select two Pokémon.</div>;

  const [combatLog, setCombatLog] = useState([]);
  const [currentAttacker, setCurrentAttacker] = useState(0);
  const [combatFinished, setCombatFinished] = useState(false);
  const [winner, setWinner] = useState(null);
  const [fighterStates, setFighterStates] = useState([
    { ...fighters[0], isAttacking: false, isHit: false },
    { ...fighters[1], isAttacking: false, isHit: false }
  ]);

  // Pokémon attack moves based on type
  const attackMoves = {
    fire: ['Flamethrower', 'Fire Blast', 'Ember', 'Fire Punch'],
    water: ['Water Gun', 'Hydro Pump', 'Bubble Beam', 'Surf'],
    grass: ['Vine Whip', 'Solar Beam', 'Leaf Blade', 'Petal Dance'],
    electric: ['Thunderbolt', 'Thunder', 'Thunder Shock', 'Quick Attack'],
    normal: ['Tackle', 'Body Slam', 'Quick Attack', 'Hyper Beam'],
    default: ['Tackle', 'Scratch', 'Quick Attack', 'Body Slam']
  };

  const getRandomMove = (type) => {
    const moves = attackMoves[type] || attackMoves.default;
    return moves[Math.floor(Math.random() * moves.length)];
  };

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    // Start combat animation after a short delay
    const startCombat = setTimeout(() => {
      simulateCombat();
    }, 1000);

    return () => clearTimeout(startCombat);
  }, []);

  const simulateCombat = () => {
    let attacker = 0;
    let round = 1;
    const maxRounds = 5;

    const combatInterval = setInterval(() => {
      const attackerPokemon = fighters[attacker];
      const defenderPokemon = fighters[1 - attacker];
      const move = getRandomMove(attackerPokemon.type);

      // Animate attacker
      setFighterStates(prev => prev.map((fighter, index) => ({
        ...fighter,
        isAttacking: index === attacker,
        isHit: index === (1 - attacker)
      })));

      // Add to combat log
      setCombatLog(prev => [...prev, 
        `${capitalizeFirst(attackerPokemon.name)} uses ${move}!`
      ]);

      // Reset animations after a short delay
      setTimeout(() => {
        setFighterStates(prev => prev.map(fighter => ({
          ...fighter,
          isAttacking: false,
          isHit: false
        })));
      }, 1000);

      // Check if combat should end
      if (round >= maxRounds) {
        clearInterval(combatInterval);
        
        // Determine winner after animations
        setTimeout(() => {
          const combatWinner = fighters[0].attack > fighters[1].attack ? fighters[0] : fighters[1];
          setWinner(combatWinner);
          setCombatFinished(true);
          setCombatLog(prev => [...prev, 
            `${capitalizeFirst(combatWinner.name)} wins the battle!`
          ]);
        }, 1500);
      }

      // Switch attacker
      attacker = 1 - attacker;
      round++;
    }, 2500); // Each attack every 2.5 seconds
  };

  const restartCombat = () => {
    setCombatLog([]);
    setCurrentAttacker(0);
    setCombatFinished(false);
    setWinner(null);
    setFighterStates([
      { ...fighters[0], isAttacking: false, isHit: false },
      { ...fighters[1], isAttacking: false, isHit: false }
    ]);
    
    setTimeout(() => {
      simulateCombat();
    }, 500);
  };

  return (
    <div className="combat-arena">
      <h1> Pokémon Combat Arena </h1>
      
      <div className="fighters-container">
        {/* Fighter 1 */}
        <div className={`fighter ${fighterStates[0].isAttacking ? 'attacking' : ''} ${fighterStates[0].isHit ? 'hit' : ''} ${winner && winner.id === fighters[0].id ? 'winner' : ''}`}>
          <img src={fighters[0].image} alt={fighters[0].name} />
          <h3>{capitalizeFirst(fighters[0].name)}</h3>
          <div className="attack-stat">ATK: {fighters[0].attack}</div>
        </div>

        {/* VS Indicator */}
        <div className="vs-indicator">VS</div>

        {/* Fighter 2 */}
        <div className={`fighter ${fighterStates[1].isAttacking ? 'attacking' : ''} ${fighterStates[1].isHit ? 'hit' : ''} ${winner && winner.id === fighters[1].id ? 'winner' : ''}`}>
          <img src={fighters[1].image} alt={fighters[1].name} />
          <h3>{capitalizeFirst(fighters[1].name)}</h3>
          <div className="attack-stat">ATK: {fighters[1].attack}</div>
        </div>
      </div>

      {/* Combat Log */}
      <div className="combat-log">
        <h3>Combat Log</h3>
        {combatLog.map((entry, index) => (
          <div key={index} className="log-entry">
            {entry}
          </div>
        ))}
        {combatLog.length === 0 && (
          <div className="log-entry">The battle is about to begin...</div>
        )}
      </div>

      {/* Winner Announcement */}
      {combatFinished && winner && (
        <div className="winner-announcement">
          <h2> {capitalizeFirst(winner.name)} Wins! 🏆</h2>
          <button className="restart-button" onClick={restartCombat}>
             Battle Again
          </button>
        </div>
      )}
    </div>
  );
}