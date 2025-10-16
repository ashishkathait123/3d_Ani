// components/TryVedButton.jsx
import React from 'react';

const TryVedButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center py-3 px-8 text-white text-lg font-medium tracking-widest uppercase
                 bg-transparent border border-transparent cursor-pointer transition-colors duration-300
                 hover:text-pink-500 group" // Added group for hover effects on children
    >
      {/* Left Bracket */}
      <span className="absolute left-0 top-0 w-3 h-3 border-l border-t border-gray-400 group-hover:border-pink-500 transition-colors"></span>
      <span className="absolute left-0 bottom-0 w-3 h-3 border-l border-b border-gray-400 group-hover:border-pink-500 transition-colors"></span>

      {/* Right Bracket */}
      <span className="absolute right-0 top-0 w-3 h-3 border-r border-t border-gray-400 group-hover:border-pink-500 transition-colors"></span>
      <span className="absolute right-0 bottom-0 w-3 h-3 border-r border-b border-gray-400 group-hover:border-pink-500 transition-colors"></span>

      <span className="mr-2 text-xl">TRY VED</span> {/* Main Text */}

      {/* Arrow Icon - Using inline SVG for simplicity. Replace with <img> if you have a file. */}
      <svg
        className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        ></path>
        <path
          fillRule="evenodd"
          d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        ></path>
      </svg>
    </button>
  );
};

export default TryVedButton;