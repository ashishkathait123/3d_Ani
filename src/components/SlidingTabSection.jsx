// components/SlidingTabSection.jsx

import React, { useState } from "react";

// Data for the sliding tabs
const formatData = [
  { id: 1, title: "Digital Comics", image: "/model/11.png" },
  { id: 2, title: "Animated Series", image: "/model/22.png" },
  { id: 3, title: "Feature Films", image: "/model/11.png" }, // Highlighted option
  { id: 4, title: "Video Games", image: "/model/22.png" },
  { id: 5, title: "Merchandise", image: "/model/11.png" },
  { id: 6, title: "Theme Experiences", image: "/model/11.png" },
];

const SlidingTabSection = () => {
  // Set the default active state to "Feature Films" (id: 3)
  const [activeFormat, setActiveFormat] = useState(formatData[2]);

  const handleItemClick = (format) => {
    setActiveFormat(format);
  };

  return (
    // 1. Main Container (Adjust height for visual context)
    <section className="relative w-screen h-screen  overflow-hidden flex items-center justify-center p-8">
      {/* 2. Red Background Blur Effect (Simulating the glow) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-50 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
       
        ></div>
      </div>

      {/* 3. Content Grid (Max-width adjusted slightly to match screenshot layout) */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-12 gap-4 h-[700px]">
        {/* Left Side: Text and Image */}
        <div className="col-span-6 flex flex-col justify-center pr-2">
          {/* Top Navigation Replica */}

          <h1 className="text-[48px text-white mb-6 leading-tight">
            Multi-Format IP Development at Studio Scale
          </h1>
          <p className="text-[22px] text-gray-400 max-w-md mb-20">
            Your story doesn't end with a single medium.
          </p>

          {/* Image Container (Positioned low) */}
          {/* Image Container (Tilted and flush to left) */}
          {/* Image Container (Tilted and flush to left) */}
          <div className="w-[584px] h-[514px] overflow-hidden relative -mb-16 -ml-40">
            <img
              src={activeFormat.image || "/model/11.png"}
              alt="Multi-Format IP"
              className="w-full h-full object-cover transition-opacity duration-500 transform -rotate-[-13deg]"
            />
          </div>
        </div>

        {/* Right Side: Sliding Vertical Tabs */}
        <div className="col-span-6 flex items-center justify-end">
          <ul className="flex flex-col space-y-3">
            {formatData.map((format) => (
              <li
                key={format.id}
                onClick={() => handleItemClick(format)}
                className={`
                  relative text-right cursor-pointer py-1 transition-all duration-300 select-none
                  ${
                    activeFormat.id === format.id
                      ? "text-white text-[64px] font-extrabold pr-4 opacity-100" // Active: slightly larger text
                      : "text-gray-600 text-[48px] font-extrabold opacity-70 hover:opacity-100" // Inactive: smaller text
                  }
                `}
              >
                {/* Highlight Marker (>) */}
                {activeFormat.id === format.id && (
                  <img
                    src="/model/arrow.png" // Replace with your actual arrow PNG path
                    alt="active indicator"
                    className="absolute left-[-2rem] top-1/2 transform -translate-y-1/2 w-6 h-6 object-contain" // Adjust w- and h- as needed
                  />
                )}

                <span className="relative inline-block">
                  {activeFormat.id === format.id && (
                    <>
                      {/* Left Bracket */}
                      <span className="absolute left-[-0.5rem] top-0 w-[1px] h-full border-l border-white opacity-40"></span>
                      <span className="absolute left-[-0.5rem] top-0 w-[8px] h-[1px] border-t border-white opacity-40"></span>
                      <span className="absolute left-[-0.5rem] bottom-0 w-[8px] h-[1px] border-b border-white opacity-40"></span>

                      {/* Right Bracket */}
                      <span className="absolute right-[-0.5rem] top-0 w-[1px] h-full border-r border-white opacity-40"></span>
                      <span className="absolute right-[-0.5rem] top-0 w-[8px] h-[1px] border-t border-white opacity-40"></span>
                      <span className="absolute right-[-0.5rem] bottom-0 w-[8px] h-[1px] border-b border-white opacity-40"></span>
                    </>
                  )}
                  {format.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SlidingTabSection;
