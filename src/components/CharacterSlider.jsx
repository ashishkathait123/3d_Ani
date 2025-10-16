// components/CharacterSlider.jsx

import React, { useRef, useState } from 'react';
import CharacterCard from './CharacterCard';
import { characters } from '../assets/data'; // Import your data

const CARD_WIDTH = 280; // Must match the fixed width in CharacterCard.jsx ('280px')

const CharacterSlider = () => {
  const sliderRef = useRef(null);
  // Default to the first element's ID if the array is not empty
  const [selectedCardId, setSelectedCardId] = useState(characters[0]?.id); 
  
  const scroll = (direction) => {
    if (sliderRef.current) {
      const currentScroll = sliderRef.current.scrollLeft;
      const gap = 32; // space-x-8 is 32px
      const targetScroll = direction === 'next'
        ? currentScroll + CARD_WIDTH + gap
        : currentScroll - CARD_WIDTH - gap;

      sliderRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };
  
  const handleCardClick = (id) => {
    setSelectedCardId(id);
    const cardIndex = characters.findIndex(c => c.id === id);
    if (sliderRef.current && cardIndex !== -1) {
        const gap = 32;
        // Scroll to position the clicked card near the left edge
        sliderRef.current.scrollTo({
            left: cardIndex * (CARD_WIDTH + gap),
            behavior: 'smooth',
        });
    }
  };

  return (
    <div className=" py-16 px-4 sm:px-8 lg:px-16 w-full">
      {/* Header and Controls - Assuming previous styling is correct for the header */}
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-12">
       <div className="text-left max-w-2xl">
  <h2 className="text-3xl sm:text-4xl font-normal text-white leading-snug">
    <span className="block text-4xl sm:text-5xl font-light mb-2">
      Over 3000 people have brought their
    </span>
    <span className="block text-4xl sm:text-5xl font-light mb-2">
      vision to life using Mugafi Ved and built
    </span>
    <span className="block text-4xl sm:text-5xl font-light">
      100+ characters.
    </span>
  </h2>
</div>

        
        {/* Navigation Buttons */}
        <div className="flex space-x-4 mb-2">
          <button
            onClick={() => scroll('prev')}
            className="w-10 h-10 border border-gray-700 text-white text-lg hover:border-pink-600 transition-colors"
          >
            &lt;
          </button>
          <button
            onClick={() => scroll('next')}
            className="w-10 h-10 border border-gray-700 text-white text-lg hover:border-pink-600 transition-colors"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Slider Content */}
      <div
        ref={sliderRef}
        className="flex overflow-x-scroll snap-x snap-mandatory space-x-8 pb-4"
      >
        <style>{`
          /* Hide scrollbar for a cleaner look */
          .overflow-x-scroll::-webkit-scrollbar { display: none; }
          .overflow-x-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        
        {characters.map((character) => (
          <div 
            key={character.id} 
            className="snap-start" 
            onClick={() => handleCardClick(character.id)}
          >
            <CharacterCard 
              character={character} 
              isHighlighted={character.id === selectedCardId} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSlider;