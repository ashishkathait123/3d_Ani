// components/LoaderAndIntro.jsx
import React, { useState, useEffect } from 'react';

// Define the three main stages of the animation
const STAGES = {
    LOADING: 'loading',
    WELCOME: 'welcome',
    COMPLETE: 'complete',
};

const LoaderAndIntro = ({ onAnimationComplete }) => {
    const [stage, setStage] = useState(STAGES.LOADING);
    const [progress, setProgress] = useState(0);

    // 1. Loading and Progress Simulation (Slower for effect)
    useEffect(() => {
        if (stage === STAGES.LOADING) {
            const loadInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(loadInterval);
                        // Move to the next stage after loading
                        setStage(STAGES.WELCOME);
                        return 100;
                    }
                    // Load in visible increments, adjusted timing for a better demo
                    return prev + 5; 
                });
            }, 100); // Check every 100ms, incrementing by 5 (takes about 2 seconds total)

            return () => clearInterval(loadInterval);
        }
    }, [stage]);

    // 2. Welcome Screen Transition (The slow, clean arch stretch)
    useEffect(() => {
        if (stage === STAGES.WELCOME) {
            // *** 7 seconds for the dramatic, slow visual stretch to complete ***
            const welcomeTimer = setTimeout(() => {
                setStage(STAGES.COMPLETE);
            }, 7000); 

            return () => clearTimeout(welcomeTimer);
        }
    }, [stage]);

    // 3. Final Stage: Notify Parent to enable scrolling and hide loader
    useEffect(() => {
        if (stage === STAGES.COMPLETE) {
            // Short delay before notifying parent to ensure the loader DOM element is hidden smoothly.
            const completeTimer = setTimeout(() => {
                if (onAnimationComplete) {
                    onAnimationComplete(true);
                }
            }, 1000); // Wait 1 second after stretch finishes before hiding the loader container
            return () => clearTimeout(completeTimer);
        }
    }, [stage]);

    // --- Dynamic CSS Classes for Animation ---

    // Arch/Door Expansion (Matching the initial small arch and final large narrow arch)
    const archClass = 
        stage === STAGES.LOADING 
            // Initial small arch based on loader size (approx 170px wide)
            ? 'w-[170px] h-[85px] border-white' 
            : stage === STAGES.WELCOME
            // Final tall, narrow arch, now transitioning slowly over 5s (170px wide, 70vh tall)
            ? 'w-[170px] h-[70vh] border-white transition-all duration-[7000ms] ease-in-out' 
            // Invisible arch border line after stretch completes
            : 'w-[170px] h-[70vh] border-transparent transition-all duration-300 ease-out'; 
    
    // Logo position (Goes from center-loader to top-center-welcome)
    const logoClass = 
        stage === STAGES.LOADING 
            // Centered over loader, slightly below center
            ? 'bottom-1/2 -mb-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out' 
            // Top of the screen (final position)
            : 'top-10 left-1/2 -translate-x-1/2 transition-all duration-[7000ms] ease-in-out'; 

    // Full Loader Container Fade-Out
    const loaderContainerClass = 
        stage === STAGES.COMPLETE 
            ? 'opacity-0 pointer-events-none transition-opacity duration-1000'
            : 'opacity-100';


    return (
        // The entire loader is fixed and fades out when complete
        <div 
            className={`fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden ${loaderContainerClass}`}
        >
            
            {/* Full-Screen Animated Red Glow Background (Appears on WELCOME) */}
            <div 
                className={`absolute inset-0 transition-opacity duration-[7000ms] ease-in-out ${stage !== STAGES.LOADING ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    background: 'radial-gradient(circle at 10% 30%, rgba(160, 0, 80, 0.4) 0%, rgba(0, 0, 0, 1) 70%)',
                }}
            />

            {/* Logo (The white splatter circle) - Moves to the top */}
            <div 
                className={`absolute z-20 ${logoClass}`}
            >
                {/* Use the actual image or a styled div placeholder */}
                <div className="w-10 h-10">
                    <img src="/model/logo.png" alt="Mugafi Logo" className="w-full h-full" /> 
                </div>
            </div>

            {/* The primary expanding arch visual (The Window) */}
            <div 
                className={`
                    absolute border-2
                    ${archClass}
                `}
                style={{
                    // Centering and defining the arch shape
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderBottom: 'none', 
                    borderTopLeftRadius: '50%',
                    borderTopRightRadius: '50%',
                }}
            >
                {/* Inner Arch Content: Red glow/stars placeholder for the final window look */}
                {(stage === STAGES.WELCOME || stage === STAGES.COMPLETE) && (
                    <div 
                        className="absolute inset-0 transition-opacity duration-3000 delay-1000"
                        style={{
                            // Background gradient/stars for the "universe" inside the arch
                            background: 'radial-gradient(circle at center, rgba(255, 0, 70, 0.2) 0%, rgba(0, 0, 0, 0) 70%), url("/stars.png")',
                            backgroundSize: 'cover',
                            // Clip the inner content to the arch shape
                            clipPath: 'ellipse(50% 100% at 50% 100%)',
                            opacity: 1, // Start fully visible after the stretch begins
                        }}
                    ></div>
                )}
            </div>

            {/* LOADER ELEMENTS (Only visible in the LOADING stage) */}
            {stage === STAGES.LOADING && (
                <div className="absolute text-center text-white z-30 bottom-1/2 mb-2">
                    {/* Loading Text and Progress Bar */}
                    <div className="mt-8 text-sm tracking-wider">
                        LOADING: MULTIVERSE... 
                        <span className="ml-2 font-bold">{progress}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-32 h-1 bg-gray-700 mx-auto mt-2">
                        <div 
                            className="h-full bg-white transition-all duration-100" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoaderAndIntro;