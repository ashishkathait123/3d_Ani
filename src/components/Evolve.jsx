// components/Evolve.jsx

import React from 'react';
// import NavOverlay from './NavOverlay'; // Assuming you have a NavOverlay component

const Evolve = () => {
  return (
    <section className="relative w-screen h-screen overflow-hidden bg-black">
      
      {/* 1. Background Image Container */}
      {/* NOTE: You MUST replace '/images/hero_bg.jpg' with the actual path to your combined image. */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/model/hero.png')", 
          backgroundPosition: "object-fit"
          // Custom style to mimic the fixed, full-bleed background
        }}
      >
        {/* 2. Dark/Red Gradient Overlay for text readability */}
        <div className="absolute inset-0"
             style={{
               background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(200, 0, 40, 0.4) 30%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0.9) 100%)'
             }}>
        </div>
      </div>
      
      {/* 3. Fixed Nav Overlay (assuming it's fixed/overlayed) */}
    

      {/* 4. Text Content (Centered) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-8">
        <h1 className="text-5xl sm:text-7xl font-bold text-white max-w-4xl leading-tight mb-6">
          Evolve Your Stories Into Cinematic Universes
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl font-light">
          At Mugafi, guidance and studio expertise sculpt stories into films, microdramas, and multi-format universes, bringing visionary ideas to life at global scale.
        </p>
      </div>
    </section>
  );
};

export default Evolve;