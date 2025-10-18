// WelcomeSection.jsx
import React from 'react';

const welcomeData = {
  title: "Welcome to the\nFuture of Storytelling",
  description: "A growing creative playground for imaginators and fans. Build scripts, design characters, and create worlds that live beyond the page, on screens and in memories.",
  button1: "CREATE WITH VED",
  button2: "GET IN TOUCH",
};

const WelcomeSection = () => {
  return (
    <div className="scroll-section snap-start h-screen w-full flex items-center justify-center relative ">
      
      {/* Text Content Wrapper */}
      <div 
        className="absolute top-[35%] md:top-[30%] text-center text-white max-w-xl sm:max-w-2xl lg:max-w-3xl px-4 sm:px-6"
        style={{ transform: 'translateY(-50%)' }} 
      >
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 whitespace-pre-line leading-snug sm:leading-tight">
          {welcomeData.title}
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-80 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
          {welcomeData.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-3 sm:space-y-0 pt-2 sm:pt-4">
          
          {/* Button 1 */}
          <button className="text-xs sm:text-sm font-mono tracking-widest text-white/90 border border-white/70 px-4 py-2 hover:border-red-500 transition-colors">
            [ {welcomeData.button1} <span>›</span> ]
          </button>
          
          {/* Button 2 */}
          <button className="text-xs sm:text-sm font-mono tracking-widest text-white/70 hover:text-red-500 transition-colors flex items-center justify-center">
            <span className="inline-block h-1 w-1 rounded-full bg-white/70 mr-2"></span> 
            {welcomeData.button2}
          </button>
        </div>
      </div>

      {/* Planet graphic handled via Three.js Canvas in App.jsx */}
    </div>
  );
};

export default WelcomeSection;
