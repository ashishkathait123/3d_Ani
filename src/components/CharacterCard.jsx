// components/CharacterCard.jsx

import React from 'react';

// Adjusted dimensions for a better design replica
const CARD_WIDTH = '280px'; 
const CARD_HEIGHT = '440px'; // Slightly adjusted height

// Custom CSS for the bracket effect
const BracketButtonStyles = () => (
  <style>{`
    /* Wrapper for the button and brackets */
    .bracket-button-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 48px; 
      padding: 0 16px; /* Padding for the brackets to have room on the sides of the card body */
    }
    
    /* The actual button element */
    .bracket-button-text-container {
      position: relative;
      z-index: 10;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      /* Ensure the button text is always white/gray unless highlighted */
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px; /* text-sm */
    }

    /* Bracket Lines */
    .bracket-button-wrapper::before,
    .bracket-button-wrapper::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%); 
      
      width: 15px; 
      height: 100%; 
      border-color: #ff4b6e; /* Pink color */
      border-style: solid;
      border-width: 0;
      transition: all 0.3s ease;
      z-index: 5; 
      pointer-events: none; 
    }
    
    /* Left Bracket */
    .bracket-button-wrapper::before {
      left: 0;
      border-left-width: 1px;
      border-top-width: 1px;
      border-bottom-width: 1px;
      border-right-width: 0;
    }

    /* Right Bracket */
    .bracket-button-wrapper::after {
      right: 0;
      border-right-width: 1px;
      border-top-width: 1px;
      border-bottom-width: 1px;
      border-left-width: 0;
    }

    /* Highlighted (Pink Solid) State */
    .bracket-button-wrapper.is-highlighted {
        padding: 0; /* Remove padding when button is solid pink */
    }
    .bracket-button-wrapper.is-highlighted::before,
    .bracket-button-wrapper.is-highlighted::after {
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
  
  // Custom styling for the highlighted state (border and gradient glow)
  const highlightStyle = isHighlighted 
    ? { 
        backgroundImage: 'linear-gradient(180deg, rgba(255, 75, 110, 0.1) 0%, rgba(0, 0, 0, 0) 25%)',
        boxShadow: '0 0 30px rgba(255, 75, 110, 0.4)',
      }
    : {};

  return (
    <div
      className={`
        flex-shrink-0 bg-black p-4 relative transition-all duration-300
        flex flex-col text-white text-left
        ${isHighlighted ? 'border-pink-600 border' : 'border-gray-800 border'}
      `}
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT, ...highlightStyle }}
    >
      <BracketButtonStyles />
      
      {/* 1. Character Image Container */}
      {/* The image container should be wide and tall, centered, and have a clear separation line */}
      <div className="w-full h-40 flex justify-center items-start relative mb-4">
          <div className="w-full h-full overflow-hidden rounded-md">
             <img
              src={displayCharacter.image}
              alt={displayCharacter.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Top Separator Line */}
          <div className="absolute bottom-[-16px] left-0 w-full h-px bg-gray-700"></div>
      </div>
      
      {/* 2. Text Content Container - Starts below the line (adjusted by margin) */}
      <div className="flex flex-col flex-grow mt-6">
          
          {/* Name - Matches design typography */}
          <h3 className="text-white text-2xl font-semibold mb-2">{displayCharacter.name}</h3> 
          
          {/* Description - Smaller, lighter, tightly packed */}
          <p className="text-gray-400 text-sm line-clamp-3 mb-2">{displayCharacter.description}</p>
          
          {/* Chats Count - Smallest, regular white/gray text, pushed down */}
          <div className="text-gray-400 text-sm mt-auto mb-4 font-normal">
            {displayCharacter.chats} CHATS
          </div>
      </div>

      {/* 3. Button with Brackets */}
      <div className="mt-auto relative w-full">
        <div className={`
            bracket-button-wrapper 
            ${isHighlighted ? 'is-highlighted' : ''}
          `}
        >
            <button
              className={`
                bracket-button-text-container w-full py-3 font-bold tracking-widest transition-all duration-300
                ${isHighlighted
                  // Highlighted: Pink solid background, White text
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  // Unhighlighted: Black background, Gray/White text
                  : 'bg-black hover:text-pink-600'
                }
              `}
            >
              CHAT NOW
            </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;