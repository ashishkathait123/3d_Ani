import React, { useState } from "react";

const AIWritingHero = ({ onSubmit }) => {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(idea);
  };

  return (
    <section className="relative flex flex-col items-center justify-center h-screen text-white px-6">
      
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
        India’s First <br /> AI Writing Tool
      </h1>

      {/* Subtitle */}
      <p className="text-center text-lg md:text-xl opacity-80 max-w-2xl mb-12">
        Enter your story idea, and watch VED shape it into a plan you can build on for movies, books, comics, and beyond.
      </p>

      {/* Input + Button Container (The "Box" from the image) */}
      {/* The original box dimensions w: 611 h: 193 are achieved by the max-w-xl and padding/content */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl p-4 md:p-6 rounded-xl border border-gray-700 bg-black relative"
          style={{
    height: '193px',
    boxShadow: `
      0 0 15px 10px pink,
      0 0 30px 17px red,
      0 0 50px 10px yellow
    `,
  }}
      >
        {/* Input Field - Styled to be the main text area */}
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Feed your idea - start Brainstorming with VED..."
          // Removed flex-1 and adjusted padding for a smaller height
          className="w-full px-0 py-2 bg-transparent text-white placeholder-gray-500 text-base border-none focus:outline-none focus:ring-0"
        />

        {/* Button - Positioned absolutely inside the container */}
        <button
          type="submit"
          className="absolute bottom-4 right-4 px-4 py-2 bg-transparent border border-pink-600 hover:border-pink-500 rounded-lg font-semibold text-pink-600 hover:text-pink-500 transition-colors duration-300 text-sm flex items-center"
        >
          BRAINSTORM WITH VED <span className="ml-1 text-xl leading-none">&gt;</span>
        </button>
      </form>

      {/* Optional glow (moved outside the form, subtle pink glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none z-0" />
    </section>
  );
};

export default AIWritingHero;