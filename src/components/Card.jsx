/**
 * @fileoverview Interactive card component for displaying character information with selection functionality
 * @author Eloi Viciana Gómez
 */

import { Link } from 'react-router-dom';
import Character from './Character';

/**
 * Card component that displays character information with interactive selection and navigation features
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.info - Character information object containing id, type, and other character data
 * @param {string} props.info.id - Unique identifier for the character
 * @param {string} props.info.type - Character type (used for styling)
 * @param {boolean} props.selected - Whether the card is currently selected
 * @param {Function} props.onSelect - Callback function called when the select/unselect button is clicked
 * @param {Object} props.onSelect.info - Character info object passed to the callback
 * 
 * @returns {JSX.Element} A card element with character display, navigation link, and selection button
 * 
 * @example
 * <Card 
 *   info={{ id: '1', type: 'Fire', name: 'Charizard' }}
 *   selected={false}
 *   onSelect={(character) => console.log('Selected:', character)}
 * />
 */
export default function Card({ info, selected, onSelect }) {
  return (
    <div className={`character ${info.type.toLowerCase()} ${selected ? 'selected' : ''}`}>
      <Character info={info} />
      <button onClick={() => onSelect(info)}>{selected ? 'Unselect' : 'Select'}</button>
      <Link className="more-info" to={`/characters/${info.id}`}>More Info</Link>
    </div>
  );
}