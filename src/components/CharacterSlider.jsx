// components/CharacterSlider.jsx

import React, { useRef, useState } from 'react';
import CharacterCard from './CharacterCard';
import { characters } from '../assets/data'; // Import your data

const CharacterSlider = () => {
  const sliderRef = useRef(null);
  // State to track the ID of the currently selected/clicked card
  const [selectedCardId, setSelectedCardId] = useState(characters[1].id); 
  const cardWidth = 384; 

  const scroll = (direction) => {
    if (sliderRef.current) {
      const currentScroll = sliderRef.current.scrollLeft;
      const gap = 32; 
      const targetScroll = direction === 'next'
        ? currentScroll + cardWidth + gap
        : currentScroll - cardWidth - gap;

      sliderRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
      
      // Optional: You might want to update the highlight on scroll if it's meant to visually track the center card, but 
      // based on your request, we only update it on click. We'll leave the state management purely for clicks.
    }
  };
  
  // New click handler to update the selected ID
  const handleCardClick = (id) => {
    setSelectedCardId(id);
  };

  return (
    <div className="bg-black py-16 px-4 sm:px-8 lg:px-16 w-full">
      {/* Header and Controls */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="text-left">
          <h2 className="text-4xl sm:text-5xl font-light text-white mb-2">
            Over 3000 people have brought their vision to life using Mugafi Ved and built 
          </h2>
          <p className="text-5xl sm:text-6xl font-extrabold text-white">
            100+ characters.
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => scroll('prev')}
            className="w-12 h-12 border border-gray-700 text-white text-xl hover:bg-gray-800 transition-colors"
          >
            &lt;
          </button>
          <button
            onClick={() => scroll('next')}
            className="w-12 h-12 border border-gray-700 text-white text-xl hover:bg-gray-800 transition-colors"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Slider Content */}
      <div
        ref={sliderRef}
        className="flex overflow-x-scroll snap-x snap-mandatory space-x-8 pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style>{`
          .overflow-x-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {characters.map((character) => (
          <div key={character.id} className="snap-start" onClick={() => handleCardClick(character.id)}>
            <CharacterCard 
              character={character} 
              // Check if the current card's ID matches the selected ID
              isHighlighted={character.id === selectedCardId} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSlider;