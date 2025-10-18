// components/HeroPartnerSection.jsx

import React, { useState, useEffect, useRef } from "react";

const partnerLogos = [
  { id: 1, src: "./model/01.png", alt: "STAGE" }, // Assuming this corresponds to STAGE logo
  { id: 2, src: "./model/12.png", alt: "EXCEL" }, // Assuming this corresponds to EXCEL logo
  { id: 3, src: "./model/13.png", alt: "RIGI" }, // Assuming this corresponds to RIGI logo
  { id: 4, src: "./model/14.png", alt: "Sree Venkateswara Cinemas LLP" }, // Assuming this logo
  { id: 5, src: "./model/15.png", alt: "Bhanushali Studios" }, // Assuming this logo
  { id: 6, src: "./model/16.png", alt: "CHAUPAL" }, // Assuming this corresponds to CHAUPAL logo
];

// Helper component for the Brackets border
const BracketBorder = () => (
  <>
    {/* Left Bracket */}
    <span className="absolute left-0 top-0 w-full h-full border-l border-white/30"></span>
    <span className="absolute left-0 top-0 w-2 h-[1px] border-t border-white/30"></span>
    <span className="absolute left-0 bottom-0 w-2 h-[1px] border-b border-white/30"></span>
    
    {/* Right Bracket */}
    <span className="absolute right-0 top-0 w-full h-full border-r border-white/30"></span>
    <span className="absolute right-0 top-0 w-2 h-[1px] border-t border-white/30"></span>
    <span className="absolute right-0 bottom-0 w-2 h-[1px] border-b border-white/30"></span>
  </>
);

const HeroPartnerSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    // Cleanup function
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const animationClass = isVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-10";

  return (
    <section
      ref={sectionRef}
      className="
        relative w-full min-h-screen flex flex-col justify-center
        pt-20 pb-16 sm:py-24 md:py-32  // Set background to black
        overflow-hidden 
      "
    >
      {/* 1. Background Glow (Mimicking the Red Radial Gradient) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          // style={{
          //   // Custom radial gradient for the red glow effect from the image
          //   background:
          //     "radial-gradient(circle at 60% 0%, rgba(140, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 60%)",
          //   opacity: 0.8,
          //   filter: "blur(50px)",
          // }}
        ></div>
        {/* Subtle dark gradient overlay to ensure logos pop */}
        <div className="absolute inset-0 "></div>
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
        {/* Heading - Large, multi-line, and responsive */}
        <h1
          className={`
            font-extrabold text-white leading-tight tracking-tight
            mb-16 md:mb-24 lg:mb-32
            text-4xl sm:text-5xl md:text-6xl lg:text-[60px] // Adjusted sizes for large impact
            max-w-xl items-start text-left
            transition-all duration-1000 ease-out
            ${animationClass}
          `}
        >
          Watch IP's Become <br />
          Universes You Can <br />
          Be Part Of
        </h1>

        {/* 3. Partner Logos Grid (3x2 for mobile/small screens, 3x2 for medium, 6x1 for large) */}
        <div
  className={`
    grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3
    gap-y-6 gap-x-4 
    justify-items-center items-center
    max-w-4xl mx-auto md:mx-0
    transition-all duration-1000 ease-out delay-300
    ${animationClass}
  `}
>
  {partnerLogos.map((logo) => (
    <div
      key={logo.id}
      className="relative flex items-center justify-center 
                 w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-16 lg:w-28 lg:h-20 
                 px-2 sm:px-4 md:px-6 
                 opacity-80 hover:opacity-100 transition duration-300"
    >
      {/* Bracket Wrapper */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full p-1.5 md:p-2">
          <BracketBorder />
        </div>
      </div>

      {/* Logo Image */}
      <img
        src={logo.src}
        alt={logo.alt}
        className="max-h-full max-w-full object-contain filter brightness-[1.8]"
      />
    </div>
  ))}
</div>


      </div>
    </section>
  );
};

export default HeroPartnerSection;