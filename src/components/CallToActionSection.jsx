// CallToActionSection.jsx
import React from 'react';

// Data for this section
const callToActionData = {
  question: "Ready to Step Into a Creative\nPlayground Where Ideas\nBecome Universes?",
  buttons: [
    { text: "EXPLORE VED", link: "#explore-ved" },
    { text: "CREATIVE STUDIOS", link: "#creative-studios" },
    { text: "INVEST", link: "#invest" },
  ],
};

// --- Button Component with Bracket Style ---
const BracketButton = ({ text, link }) => (
  <a 
    href={link} 
    className="text-sm md:text-base font-mono tracking-widest text-white/90 
               px-6 py-3 mx-2 my-2 
               hover:border-red-500 hover:text-red-500 transition-colors duration-300
               flex items-center justify-center whitespace-nowrap"
  >
    {/* Explicitly adding brackets to match the design */}
    [ {text} ]
  </a>
);

// --------------------------------------------------------------------------------------
// --- Main Component: CallToActionSection ----------------------------------------------
// --------------------------------------------------------------------------------------
const CallToActionSection = () => {
  return (
    // This container is designed to be one of the full-screen sections in your App.jsx
    <div className="scroll-section snap-start h-screen w-full flex items-center justify-center relative mt-28s ">
      
     

      {/* Content Wrapper: Centered vertically and horizontally */}
      <div className="relative z-20 text-center text-white max-w-4xl px-6 py-12">
        
        {/* Main Question */}
        <h2 className="text-4xl md:text-5xl font-bold mb-16 whitespace-pre-line leading-tight">
          {callToActionData.question}
        </h2>
        
        {/* Buttons */}
        <div className="flex flex-wrap justify-center items-center mt-8">
          {callToActionData.buttons.map((button, index) => (
            <BracketButton key={index} text={button.text} link={button.link} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;