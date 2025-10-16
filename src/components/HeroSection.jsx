// components/HeroSection.jsx
import React from 'react';
import TryVedButton from './TryVedButton'; // Assuming you'll create/update this

const HeroSection = () => {
  const handleTryVedClick = () => {
    // Implement what should happen when "TRY VED" is clicked
    // e.g., smooth scroll to the next section, or navigate
    console.log("TRY VED button clicked!");
    // Example: Scroll to the next section
    document.querySelector('.main-scroll-container').scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
    });
  };

  // Path to your arrow image
  const arrowImagePath = "/model/arrow.webp"; // **UPDATE THIS PATH if your arrow.png is elsewhere**

  return (
    <section className="scroll-section snap-start h-screen flex flex-col items-center justify-center relative p-6 mb-56">
      {/* Main Title */}
      <div className="text-center text-white max-w-4xl px-6 mb-12 relative z-10">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-wide">
          Turn Ideas Into <br /> Multi-Format Universes
        </h2>
        {/*
          The original prompt had a subtitle "Scroll to explore different dimensions"
          but the new screenshot doesn't show it. Removing for "ditto" match.
        */}
      </div>

      {/* TRY VED Button */}
      <div className="mb-52 relative z-10">
        <TryVedButton 
          onClick={handleTryVedClick} 
          arrowImageSrc={arrowImagePath} 
        />
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white z-10">
        {/* This creates the semicircle/arc */}
        <div className="relative w-20 h-10 border-t-2 border-l-2 border-r-2 border-gray-500 rounded-t-full flex items-end justify-center pb-1 animate-bounce">
          {/* Inner arrows (using a simple SVG for flexibility, or you can use an image) */}
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
          <svg
            className="w-6 h-6 text-gray-400 absolute top-1/2" // Slightly offset second arrow
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </div>

      {/* This dark red-to-black gradient is shown in the screenshot.
          You might have this as a global background or specific to this section.
          If it's global, you can remove this div. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(at top left, rgba(139,0,0,0.3) 0%, rgba(0,0,0,1) 70%)',
          filter: 'blur(50px) opacity(0.8)' // Adding some blur to match the atmospheric look
        }}
      ></div>
       <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(at top right, rgba(139,0,0,0.3) 0%, rgba(0,0,0,1) 70%)',
          filter: 'blur(50px) opacity(0.8)' // Adding some blur to match the atmospheric look
        }}
      ></div>
    </section>
  );
};

export default HeroSection;