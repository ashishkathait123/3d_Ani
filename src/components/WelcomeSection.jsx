// WelcomeSection.jsx
import React from 'react';

// Data for this section (based on image_97861e.jpg)
const welcomeData = {
  title: "Welcome to the\nFuture of Storytelling",
  description: "A growing creative playground for imaginators and fans. Build scripts, design characters, and create worlds that live beyond the page, on screens and in memories.",
  button1: "CREATE WITH VED",
  button2: "GET IN TOUCH",
};

// --------------------------------------------------------------------------------------
// --- Main Component: Welcome Section (For App.jsx Scroll Section) ---------------------
// --------------------------------------------------------------------------------------
const WelcomeSection = () => {
  return (
    // This container is designed to be one of the full-screen sections in your App.jsx
    <div className="scroll-section snap-start h-screen w-full flex items-center justify-center relative">
      
      {/* Text Content Wrapper: 
        We use 'absolute bottom-1/2' and translateY to push the content up 
        so it sits right above the planet graphic, matching the design.
      */}
      <div 
        className="absolute top-[35%] lg:top-[30%] text-center text-white max-w-3xl px-6"
        // This translation helps fine-tune the vertical placement visually
        style={{ transform: 'translateY(-50%)' }} 
      >
        
        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-bold mb-6 whitespace-pre-line leading-tight">
          {welcomeData.title}
        </h2>
        
        {/* Description */}
        <p className="text-base md:text-xl opacity-80 mb-10 leading-relaxed">
          {welcomeData.description}
        </p>
        
        {/* Actions/Buttons */}
        <div className="flex justify-center items-center space-x-6 pt-4">
          
          {/* Button 1: Boxed Style with Brackets */}
          <button className="text-sm font-mono tracking-widest text-white/90 border border-white/70 px-4 py-2 hover:border-red-500 transition-colors">
            [ {welcomeData.button1} <span>›</span> ]
          </button>
          
          {/* Button 2: Dot and Text Style */}
          <button className="text-sm font-mono tracking-widest text-white/70 hover:text-red-500 transition-colors">
            <span className="inline-block h-1 w-1 rounded-full bg-white/70 mr-2"></span> 
            {welcomeData.button2}
          </button>
        </div>
      </div>
      
      {/* NOTE: The planet graphic is rendered by the Three.js Canvas in App.jsx */}

    </div>
  );
};

export default WelcomeSection;