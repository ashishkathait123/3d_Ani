import React, { useRef, useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import { characters } from '../assets/data';

const CharacterSlider = () => {
  const sliderRef = useRef(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cardWidth, setCardWidth] = useState(280);
  const gap = 16; // smaller gap on mobile

  // Responsive card width
  useEffect(() => {
    const updateWidth = () => {
      if (!sliderRef.current) return;
      const containerWidth = sliderRef.current.offsetWidth;
      let responsiveWidth = containerWidth * 0.8;
      if (containerWidth > 640) responsiveWidth = Math.min(280, containerWidth * 0.6);
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
    setSelectedCardId(id);
    const cardIndex = characters.findIndex((c) => c.id === id);
    if (sliderRef.current && cardIndex !== -1) {
      sliderRef.current.scrollTo({
        left: cardIndex * (cardWidth + gap),
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="py-12 px-4 sm:px-8 lg:px-16 w-full mb-32 mt-56">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-extrabold mb-8 md:mb-12 max-w-4xl mx-auto md:mx-0">
        Over 3000 people have brought their vision to life using Mugafi Ved and built{' '}
        <span className="">100+ characters</span>.
      </h1>

      {/* Wrapper for slider + controls */}
      <div className="flex flex-col md:flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* ✅ Slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto snap-x snap-mandatory space-x-4 sm:space-x-6 md:space-x-8 pb-4 scrollbar-none flex-1"
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

        {/* ✅ Arrows */}
        <div className="flex justify-center lg:justify-end gap-3 sm:gap-4 mt-6 lg:mt-0">
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
    </div>
  );
};

export default CharacterSlider;
