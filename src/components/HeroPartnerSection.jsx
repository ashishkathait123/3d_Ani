// components/HeroPartnerSection.jsx

import React, { useState, useEffect, useRef } from 'react';
// Partner logo data (replace /logos/ with your actual image paths)
const partnerLogos = [
    { id: 1, src: "./model/01.png", alt: "STAGE" },
    { id: 2, src: "./model/12.png", alt: "EXCEL" },
    { id: 3, src: "./model/13.png", alt: "RIGI" },
    { id: 4, src: "./model/14.png", alt: "Partner 4" },
    { id: 5, src: "./model/15.png", alt: "Partner 5" },
    { id: 6, src: "./model/16.png", alt: "CHAUPAL" },
];

const HeroPartnerSection = () => {
    // State to trigger the animation
    const [isVisible, setIsVisible] = useState(false);
    // Reference to the main section element
    const sectionRef = useRef(null);

    // Intersection Observer logic for opacity animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the element is intersecting (in the viewport)
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Stop observing once the animation is triggered
                    observer.unobserve(entry.target);
                }
            },
            // Options: trigger when 10% of the element is visible
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                // Clean up the observer
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // Helper class for animation
    const animationClass = isVisible 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-10';

    return (
        <section 
            ref={sectionRef} // Attach the ref here
            className="relative w-screen min-h-screen flex items-center justify-center py-20 overflow-hidden"
        >
            
            {/* Red Background Glow Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div 
                    className="absolute inset-0"
                    style={{
                        // Centered radial gradient for the red glow effect
                        background: 'radial-gradient(circle at center, rgba(255, 0, 70, 0.4) 0%, rgba(0, 0, 0, 0) 60%)',
                        opacity: 0.7, // Adjust opacity to match the image
                    }}
                ></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                
                {/* Main Heading Text */}
                <h1 
                    className={`
                        text-[72px] md:text-[72px] font-bold text-white text-left leading-snug tracking-tighter mb-20 
                        transition-all duration-1000 ease-out 
                        ${animationClass}
                    `}
                    style={{ 
                        // Apply a subtle shadow/glow to the text to match the image
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                    }}
                >
                    Watch IP's Become <br/> Universes You Can <br/> Be Part Of
                </h1>

                {/* Partner Logos Grid */}
                <div 
                    className={`
                        grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-y-12 gap-x-16 max-w-3xl mx-auto
                        transition-all duration-1000 ease-out delay-500
                        ${animationClass}
                    `}
                >

                    
                    {partnerLogos.map((logo, index) => (
                        <div key={logo.id} className="flex items-center justify-center p-2 h-16 sm:h-20 opacity-70 hover:opacity-100 transition duration-300">
                            {/* Assuming the logos are mostly white or transparent PNGs */}
                            <img 
                                src={logo.src} 
                                alt={logo.alt} 
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroPartnerSection;