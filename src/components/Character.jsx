/**
 * @fileoverview Character display component for showing basic character information
 * @author Eloi Viciana Gómez
 */

/**
 * Character component that displays basic character information including name, image, and optional description
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.info - Character information object
 * @param {string} props.info.name - Character name (will be capitalized)
 * @param {string} props.info.image - URL of the character image
 * @param {string} [props.description] - Optional character description text
 * 
 * @returns {JSX.Element} A div containing character name, image, and optional description
 * 
 * @example
 * <Character 
 *   info={{ name: 'pikachu', image: 'https://example.com/pikachu.png' }}
 *   description="An electric-type Pokémon"
 * />
 */
export default function Character({ info, description }) {
  return (
    <div className="character-info">
      <h2 className="character-info__name">{info.name.charAt(0).toUpperCase() + info.name.slice(1)}</h2>
      <img className="character-info__img" src={info.image} alt={info.name} />
      {description && <p className="character-info__info">{description}</p>}
    </div>
  );
} 