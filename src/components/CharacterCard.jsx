// components/CharacterCard.jsx

import React from 'react';

const CharacterCard = ({ character, isHighlighted }) => {
  return (
    // Note: The click handler is now on the wrapper in CharacterSlider.jsx
    <div
      className={`
        flex-shrink-0 w-[24rem] h-[34rem] bg-black p-6 border-2 relative cursor-pointer transition-all duration-300
        ${isHighlighted ? 'border-pink-600 shadow-2xl shadow-pink-900/50' : 'border-gray-800'}
      `}
      style={{
        // Custom background gradient for the highlighted state
        backgroundImage: isHighlighted
          ? 'linear-gradient(180deg, rgba(255, 75, 110, 0.2) 0%, rgba(0, 0, 0, 0) 25%)'
          : 'none',
      }}
    >
      {/* Character Image */}
      <div className="h-48 mb-6 overflow-hidden flex items-center justify-center">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Text Content */}
      <h3 className="text-white text-2xl font-semibold mb-2">{character.name}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{character.description}</p>
      
      {/* Chats Count */}
      <div className="text-sm text-gray-500 border-t border-gray-800 pt-4">
        {character.chats}
      </div>

      {/* Button & Border Effect */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          className={`
            w-full py-3 text-sm font-bold tracking-widest transition-all duration-300 relative
            ${isHighlighted
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                // For unselected cards, the button is darker
                : 'bg-black text-gray-500 border border-gray-700 hover:text-white hover:border-pink-600'
            }
          `}
        >
          CHAT NOW
        </button>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800"></div>
      </div>
    </div>
  );
};

export default CharacterCard;