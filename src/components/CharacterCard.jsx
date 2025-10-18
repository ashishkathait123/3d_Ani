import React from 'react';

const BracketButtonStyles = () => (
  <style>{`
    .bracket-button-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 48px; 
      padding: 0 16px;
      transition: all 0.3s ease;
    }

    .bracket-button-text-container {
      position: relative;
      z-index: 10;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .bracket-button-wrapper::before,
    .bracket-button-wrapper::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 15px;
      height: 100%;
      border-color: #ff4b6e;
      border-style: solid;
      border-width: 0;
      transition: all 0.3s ease;
      z-index: 5;
      pointer-events: none;
    }

    .bracket-button-wrapper::before { left: 0; border-left-width:1px; border-top-width:1px; border-bottom-width:1px; }
    .bracket-button-wrapper::after { right: 0; border-right-width:1px; border-top-width:1px; border-bottom-width:1px; }

    .bracket-button-wrapper.is-highlighted {
      padding: 0;
    }
    .bracket-button-wrapper.is-highlighted::before,
    .bracket-button-wrapper.is-highlighted::after {
      opacity: 0;
      visibility: hidden;
    }

    .character-card:hover {
      box-shadow: 0 0 30px rgba(255, 75, 110, 0.4);
      background-image: linear-gradient(180deg, rgba(255, 75, 110, 0.1) 0%, rgba(0,0,0,0) 25%);
      border-color: #ff4b6e;
    }

    .character-card:hover .bracket-button-text-container {
      background-color: #ff4b6e;
      color: white;
    }

    .character-card:hover .bracket-button-wrapper::before,
    .character-card:hover .bracket-button-wrapper::after {
      opacity: 0;
      visibility: hidden;
    }
  `}</style>
);

const CharacterCard = ({ character, isHighlighted }) => {
  const displayCharacter = character || {
    name: "Placeholder",
    description: "A description of the character goes here. It should wrap nicely.",
    chats: "0.0K CHATS",
    image: "https://via.placeholder.com/280x280.png?text=VED+Character",
  };

  const highlightStyle = isHighlighted 
    ? { 
        backgroundImage: 'linear-gradient(180deg, rgba(255, 75, 110, 0.1) 0%, rgba(0, 0, 0, 0) 25%)',
        boxShadow: '0 0 30px rgba(255, 75, 110, 0.4)',
      }
    : {};

  return (
    <div
      className={`character-card bg-black p-4 relative transition-all duration-300 flex flex-col text-white text-left
        ${isHighlighted ? 'border-pink-600 border' : 'border-gray-800 border'}`}
      style={{
        width: '100%',
        maxWidth: '280px',
        aspectRatio: '280 / 440',
        ...highlightStyle
      }}
    >
      <BracketButtonStyles />
      
      {/* Character Image */}
      <div className="w-full flex justify-center items-start relative mb-4 h-[40%] sm:h-[45%] md:h-[50%]">
        <div className="w-full h-full overflow-hidden rounded-md">
          <img src={displayCharacter.image} alt={displayCharacter.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-[-16px] left-0 w-full h-px bg-gray-700"></div>
      </div>

      {/* Text */}
      <div className="flex flex-col flex-grow mt-4 sm:mt-6">
        <h3 className="text-white text-xl sm:text-2xl font-semibold mb-2">{displayCharacter.name}</h3>
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 mb-2">{displayCharacter.description}</p>
        <div className="text-gray-400 text-xs sm:text-sm mt-auto mb-4 font-normal">{displayCharacter.chats}</div>
      </div>

      {/* CHAT NOW Button */}
      <div className="mt-auto relative w-full">
        <div className={`bracket-button-wrapper ${isHighlighted ? 'is-highlighted' : ''}`}>
          <button
            className={`bracket-button-text-container w-full py-2 sm:py-3 font-bold tracking-widest transition-all duration-300
              ${isHighlighted ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-black hover:text-pink-600'}`}
          >
            CHAT NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
