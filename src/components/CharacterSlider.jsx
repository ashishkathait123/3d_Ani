import React, { useRef, useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import { characters } from '../assets/data';

const CharacterSlider = () => {
  const sliderRef = useRef(null);
  const [selectedCardId, setSelectedCardId] = useState(null); // ❌ no card selected initially
  const [cardWidth, setCardWidth] = useState(280);
  const gap = 32;

  // Update card width responsively
  useEffect(() => {
    const updateWidth = () => {
      if (!sliderRef.current) return;
      const containerWidth = sliderRef.current.offsetWidth;
      const responsiveWidth = Math.min(280, containerWidth * 0.6);
      setCardWidth(responsiveWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const currentScroll = sliderRef.current.scrollLeft;
      const targetScroll =
        direction === 'next'
          ? currentScroll + cardWidth + gap
          : currentScroll - cardWidth - gap;

      sliderRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const handleCardClick = (id) => {
    setSelectedCardId(id); // 🔥 highlight only when clicked
    const cardIndex = characters.findIndex((c) => c.id === id);
    if (sliderRef.current && cardIndex !== -1) {
      sliderRef.current.scrollTo({
        left: cardIndex * (cardWidth + gap),
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-16 w-full mb-32 mt-32">
      {/* Header + Controls */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
        {/* <div className="text-left max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-light text-white leading-snug">
            Over <span className="font-semibold text-pink-500">3000 people</span> have brought their<br />
            vision to life using Mugafi Ved and built<br />
            <span className="font-semibold text-pink-500">100+ characters</span>.
          </h2>
        </div> */}

        <div className="flex space-x-4 mt-4 lg:mt-0">
          <button
            onClick={() => scroll('prev')}
            className="w-10 h-10 border border-gray-700 text-white text-lg hover:border-pink-600 transition-colors rounded"
          >
            &lt;
          </button>
          <button
            onClick={() => scroll('next')}
            className="w-10 h-10 border border-gray-700 text-white text-lg hover:border-pink-600 transition-colors rounded"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory space-x-4 sm:space-x-6 md:space-x-8 pb-4 scrollbar-none"
      >
        <style>{`
          .overflow-x-auto::-webkit-scrollbar { display: none; }
          .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {characters.map((character) => (
          <div
            key={character.id}
            className="snap-start cursor-pointer flex-shrink-0"
            style={{ width: cardWidth }}
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
