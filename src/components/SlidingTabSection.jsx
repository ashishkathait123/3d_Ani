import React, { useState } from "react";

// Data for the sliding tabs
const formatData = [
  { id: 1, title: "Digital Comics", image: "/model/11.png" },
  { id: 2, title: "Animated Series", image: "/model/22.png" },
  { id: 3, title: "Feature Films", image: "/model/11.png" },
  { id: 4, title: "Video Games", image: "/model/22.png" },
];

const SlidingTabSection = () => {
  const [activeFormat, setActiveFormat] = useState(formatData[0]);

  const handleItemClick = (format) => setActiveFormat(format);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 py-8 lg:py-16">
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12 h-auto lg:h-[700px]">
        
        {/* Left Side: Title, Text, Image */}
     <div className="flex flex-col justify-center w-full lg:w-1/2 order-1 items-start">
  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] text-[#F2F2F2] font-bold leading-tight mb-4 text-left">
    Multi-Format IP Development at Studio Scale
  </h1>
  <p className="text-base sm:text-lg md:text-xl lg:text-[22px] text-gray-400 mb-6 max-w-full lg:max-w-md text-left">
    Your story doesn't end with a single medium.
  </p>
  <div className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[514px] overflow-hidden relative">
    <img
      src={activeFormat.image || "/model/11.png"}
      alt="Multi-Format IP"
      className="w-full h-full object-cover transition-transform duration-500 transform -rotate-[-8deg] lg:-rotate-[-12deg]"
    />
  </div>
</div>


        {/* Right Side: Tabs */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 order-2 mt-6 lg:mt-0">
          <ul className="flex flex-col space-y-4 w-full text-left lg:text-right relative">
            {formatData.map((format) => (
              <li
                key={format.id}
                onClick={() => handleItemClick(format)}
                className={`relative cursor-pointer transition-all duration-300 select-none
                  ${activeFormat.id === format.id
                    ? "text-white font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[64px]"
                    : "text-gray-600 font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-[48px] opacity-70 hover:opacity-100"
                  }
                `}
              >
                {/* Active Arrow */}
                {activeFormat.id === format.id && (
                  <img
                    src="/model/arrow.png"
                    alt="active indicator"
                    className="absolute left-0 lg:left-[-3rem] top-1/2 transform -translate-y-1/2 w-6 h-6 object-contain"
                  />
                )}

                {/* Brackets */}
                {activeFormat.id === format.id && (
                  <>
                    {/* Left Bracket */}
                    <span className="absolute left-0 lg:left-[-1rem] top-0 w-[1px] h-full border-l border-white opacity-40"></span>
                    <span className="absolute left-0 lg:left-[-1rem] top-0 w-4 lg:w-[8px] h-[1px] border-t border-white opacity-40"></span>
                    <span className="absolute left-0 lg:left-[-1rem] bottom-0 w-4 lg:w-[8px] h-[1px] border-b border-white opacity-40"></span>

                    {/* Right Bracket */}
                    <span className="absolute right-0 lg:right-[-1rem] top-0 w-[1px] h-full border-r border-white opacity-40"></span>
                    <span className="absolute right-0 lg:right-[-1rem] top-0 w-4 lg:w-[8px] h-[1px] border-t border-white opacity-40"></span>
                    <span className="absolute right-0 lg:right-[-1rem] bottom-0 w-4 lg:w-[8px] h-[1px] border-b border-white opacity-40"></span>
                  </>
                )}

                <span className="relative inline-block px-2 lg:px-0">{format.title}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};

export default SlidingTabSection;
