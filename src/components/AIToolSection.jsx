// AIToolSection.jsx (Corresponds to Section 0 / Index 0)
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AIToolSection = () => {
  const contentRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    // GSAP animation for the content and box appearance
    const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });

    // Initial state: hide everything
    gsap.set(contentRef.current, { opacity: 0, y: 20 });
    gsap.set(boxRef.current, { opacity: 0, y: 20, scaleY: 0.1, transformOrigin: 'bottom' });

    // Sequence:
    // 1. Text fades in slightly delayed from the initial planet appearance
    tl.to(contentRef.current, { opacity: 1, y: 0, duration: 1.2 }, 0.5) 
      // 2. Input box slides up and scales in immediately after
      .to(boxRef.current, { opacity: 1, y: 0, scaleY: 1, duration: 0.8 }, 0.8);

    return () => tl.kill();
  }, []);

  return (
    <div className="scroll-section snap-start h-screen w-full flex items-center justify-start relative z-10 px-6 md:px-20">
      
      {/* Text Content Wrapper */}
      <div 
        ref={contentRef} 
        className="w-full max-w-lg text-white pt-24" // pt-24 to pull it down below the header
      >
        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-bold mb-4 whitespace-pre-line leading-tight">
          India’s First <br />AI Writing Tool
        </h2>
        
        {/* Paragraph */}
        <p className="text-base md:text-lg opacity-80 mb-10 leading-relaxed max-w-xs">
          Enter your story idea, and watch VED shape it into a plan you can build on for movies, books, comics, and beyond.
        </p>
        
        {/* Input/Prompt Box */}
        <div 
          ref={boxRef} 
          className="bg-black/80 border border-white/20 w-full max-w-md p-4 shadow-xl"
        >
          <p className="text-sm text-white/50 mb-2">Find your idea - start brainstorming with VED...</p>
          <div className="flex justify-between items-center text-white/90">
            <input 
              type="text" 
              placeholder="Enter prompt here" 
              className="bg-transparent border-none focus:outline-none flex-grow text-lg"
            />
            <button className="text-sm font-mono tracking-widest px-3 py-1 border border-white/50 hover:border-red-500 transition-colors">
              GO ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolSection;