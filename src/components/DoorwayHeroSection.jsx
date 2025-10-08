// components/DoorwayHeroSection.jsx
import React, { useState, useEffect, useRef } from 'react';

const DoorwayHeroSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Intersection Observer logic (kept the same)
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // CSS class for the content fade-in animation (kept the same)
    const contentClass = isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-10';

    return (
        <section
            ref={sectionRef}
            className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden snap-start"
        >
            
            {/* 1. The Animated Doorway/Arch Container */}
            {/* This container expands to fill the screen */}
            <div
                className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    transition-all duration-[2000ms] ease-out 
                    overflow-hidden
                    ${isVisible 
                        ? 'h-full w-full' // Expanded state
                        : 'h-[50vh] w-[300px] sm:w-[400px] lg:w-[400px]' // Initial size (fixed width, half height)
                    }
                `}
                style={{
                    // Apply a high border-radius only to the top when small, 
                    // and let the animation overwrite it when large
                    borderTopLeftRadius: isVisible ? '0' : '50%',
                    borderTopRightRadius: isVisible ? '0' : '50%',
                    bottom: isVisible ? '0' : 'unset',
                    top: isVisible ? '0' : '50%',
                    // Ensures the transition smooths the shape change
                    transitionProperty: 'width, height, border-radius, transform',
                }}
            >
                {/* 1a. The Doorway Visual Content (The stars and the red platform) */}
                {/* This element holds the visual look and expands with the outer container. */}
                <div 
                    className={`
                        absolute inset-0 bg-cover bg-center 
                        transition-opacity duration-1000 delay-1000
                    `}
                    style={{
                        // Placeholder for the red platform and starry night sky
                        // In a real app, this would likely be a 3D Canvas or a high-quality background image
                        background: isVisible 
                            ? 'radial-gradient(circle at center, rgba(255, 0, 70, 0.5) 0%, rgba(0, 0, 0, 1) 90%)'
                            : 'url("/model/doorway_visual.jpg") center bottom / cover no-repeat, radial-gradient(circle at center, rgba(255, 0, 70, 0.8) 0%, rgba(0, 0, 0, 1) 100%)', // Simulating the initial visual
                        opacity: isVisible ? 1 : 1, // Keep it visible during the entire transition
                    }}
                >
                    {/* The Inner Glowing Arch (Used for the final fully expanded state) */}
                    {isVisible && (
                        <div
                            className="absolute inset-0 transition-opacity duration-1000"
                            style={{
                                // This provides the final red tunnel glow seen on the right side of the screenshot
                                boxShadow: '0 0 100px rgba(255, 0, 70, 0.5), inset 0 0 100px rgba(255, 0, 70, 0.2)',
                                opacity: 1,
                            }}
                        />
                    )}
                </div>

                {/* Optional: Add a subtle overlay to fade the edges when small, matching the image */}
                {!isVisible && (
                    <div className="absolute inset-0" style={{
                        boxShadow: 'inset 0px -100px 50px rgba(0, 0, 0, 0.9), inset 0px 100px 50px rgba(0, 0, 0, 0.9)',
                    }} />
                )}
            </div>

            {/* 2. Text Content and Details (Fade in when door opens) */}
            {/* The content layout remains the same as it was correctly responsive */}
            <div
                className={`
                    relative z-10 p-8 pt-40 sm:pt-20 text-white text-left 
                    max-w-7xl mx-auto w-full h-full flex flex-col justify-end transition-all 
                    duration-1000 ease-out delay-1000
                    ${contentClass}
                `}
            >
                {/* Main Heading/Title */}
                <div className="mb-20 space-y-16">
                    <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight max-w-lg">
                        Invest With Web3 Tokens in Living Universes
                    </h1>

                    {/* Sub-text/Paragraph */}
                    <p className="text-lg text-gray-300 max-w-md">
                        Mugafi's game-changing ecosystem promotes creativity, innovation, and studios building full cinematic universes together. Forge connections, shape stories, and create legacies that fuel our future and inspire others to build the meme and the believer imagination.
                    </p>
                </div>

                {/* Bottom Row of Features (Responsive) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-gray-700 pt-8 pb-10">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Direct Creator Access</h3>
                        <p className="text-sm text-gray-400">
                            Receive full control over your content and project direction while accessing studio-grade resources.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Global Community</h3>
                        <p className="text-sm text-gray-400">
                            Connect with a worldwide network of creators and fans eager to support groundbreaking ideas.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Transparency</h3>
                        <p className="text-sm text-gray-400">
                            Experience immutable ownership and secure on-chain tokenized rights and royalties.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoorwayHeroSection;