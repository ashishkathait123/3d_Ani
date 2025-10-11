import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Planet } from './Planet';

// Component for the animated particle background
const AnimatedBackgroundParticles = ({ show }) => {
  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
      {/* Central Red Plume (like the image) */}
      <div
        className="absolute top-0 w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(160, 0, 0, 0.4) 0%, rgba(40, 0, 0, 0) 60%)',
        }}
      />
      <div
        className="absolute top-0 w-full h-full"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0) 50%, rgba(139, 0, 0, 0.5) 80%, rgba(0, 0, 0, 0) 100%)',
          clipPath: 'polygon(45% 0, 55% 0, 65% 100%, 35% 100%)', // Creates a column of red light
        }}
      />
      
      {/* Scattered particles that match the image's density */}
      {[...Array(300)].map((_, i) => (
        <div
          key={`scatter-particle-${i}`}
          className="absolute bg-white rounded-full"
          style={{
            width: `${Math.random() * 2}px`,
            height: `${Math.random() * 2}px`,
            // Constrain particles to the center third to mimic the image
            left: `${40 + Math.random() * 20}%`, 
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.1,
            animation: `twinkle ${1.5 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 1.5}s`,
            boxShadow: '0 0 1px rgba(255,255,255,0.7)',
          }}
        />
      ))}
      
      {/* Perspective particles converging to the center/back */}
      {[...Array(200)].map((_, i) => {
        const spreadFactor = Math.random() * 50;
        const opacity = 0.1 + Math.random() * 0.3;
        return (
          <div
            key={`perspective-particle-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: `${0.5 + Math.random() * 1.5}px`,
              height: `${0.5 + Math.random() * 1.5}px`,
              top: `calc(50% + ${(Math.random() - 0.5) * 100}%)`, // Vertical position
              left: '50%', // Start at the center
              opacity: show ? opacity : 0,
              // Animates outwards and slightly upwards/downwards
              transform: `translateX(-50%) translate3d(${(Math.random() - 0.5) * spreadFactor}vw, ${(Math.random() - 0.5) * spreadFactor}vh, 0) scale(${1 + Math.random() * 2})`,
              transition: `all 3000ms linear ${Math.random() * 500}ms`,
              transitionDelay: `${Math.random() * 2}s`,
            }}
          />
        );
      })}

      {/* Tailwind CSS for twinkle animation (injected via style tag) */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}


const LoaderAndIntro = ({ onAnimationComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading, opening, welcome, sphereAppear, planetReveal
  const [showPlanet, setShowPlanet] = useState(false);
  const [showMirrors, setShowMirrors] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Animate progress from 0 to 100%
    const duration = 3000; // 3 seconds
    const startTime = Date.now();

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const prog = Math.min((elapsed / duration) * 100, 100);

      setProgress(Math.round(prog));

      if (prog < 100) {
        requestAnimationFrame(animateProgress);
      } else {
        // Start opening animation after loading completes
        setTimeout(() => {
          setPhase('opening');

          // Move to welcome screen with text
          setTimeout(() => {
            setPhase('welcome');

            // Show sphere in window center after welcome text
            setTimeout(() => {
              setPhase('sphereAppear');
              setShowPlanet(true);

              // Start mirror spreading and logo descent
              setTimeout(() => {
                setShowMirrors(true);

                // Final reveal with stars
                setTimeout(() => {
                  setPhase('planetReveal');

                  // Call onAnimationComplete after full reveal
                  setTimeout(() => {
                    if (onAnimationComplete) onAnimationComplete();
                  }, 2000);
                }, 1800);
              }, 800);
            }, 2500);
          }, 1200);
        }, 500);
      }
    };

    requestAnimationFrame(animateProgress);
  }, [onAnimationComplete]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      
      {/* BACKGROUND IMAGE EFFECT (Dark Red Center Glow and Particles) */}
      <AnimatedBackgroundParticles 
        show={phase !== 'loading'}
      />
      
      {/* 3D Canvas for Planet */}
      <div className={`absolute inset-0 transition-all duration-1200 ${
        phase === 'sphereAppear' || phase === 'planetReveal' ? 'opacity-100' : 'opacity-0'
      }`} style={{ zIndex: 5 }}>
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
          {showPlanet && (
            <>
              <group
                scale={0.45}
                position={[0, phase === 'planetReveal' ? 0 : 0, 0]}
              >
                <Planet modelPath="/model/Planet_1_upd.gltf" />
              </group>

              {/* Lighting adjusted for the intense red glow look */}
              <ambientLight intensity={1.5} color="#ff8888" /> 

              <directionalLight
                position={[0, 0, 5]}
                intensity={3.5}
                color="#ff4444"
              />

              <pointLight
                position={[0, 0, 0]}
                intensity={2.5}
                color="#ff0000"
                distance={10}
              />
            </>
          )}
        </Canvas>
      </div>

      {/* Semi-circular Arc Window - FADES OUT ON PLANET REVEAL */}
      <div
        className={`absolute flex items-center justify-center transition-all duration-1000 ${
          phase === 'planetReveal' ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
        }`}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
      >
        <svg
          width="340"
          height={phase === 'loading' ? '300' : '520'}
          viewBox={phase === 'loading' ? '0 0 340 200' : '0 0 340 520'}
          className="block transition-all duration-1000"
        >
          {/* Main Window - ARC INCREASED: Q control point y is now 0 */}
          <path
            d={phase === 'loading'
              ? "M 40 180 L 40 100 Q 50 0, 170 0 Q 300 0, 300 100 L 300 180"
              : "M 40 500 L 40 100 Q 50 0, 170 0 Q 300 0, 300 100 L 300 500"
            }
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            className="transition-all duration-1000"
          />


          {/* Progress Bar */}
          {phase === 'loading' && (
            <g>
              <rect x="50" y="170" width="240" height="2" fill="rgba(255, 255, 255, 0.2)" />
              <rect x="50" y="170" width={240 * (progress / 100)} height="2" fill="white" />
            </g>
          )}
        </svg>

        {/* --- MODIFIED: Mirrored Windows with image's perspective effect --- */}
        {showMirrors && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
            {/* Left side mirrors (Increased to 25 for density) */}
            {[...Array(25)].map((_, i) => ( 
              <svg
                key={`left-mirror-${i}`}
                width="340"
                height="520"
                viewBox="0 0 340 520"
                className="absolute block"
                style={{
                  // Adjusted to start closer to the center line and spread out less horizontally
                  left: `calc(50% - ${20 + (i + 1) * 3}px)`, 
                  opacity: showMirrors ? Math.max(0.6 - (i + 1) * 0.02, 0.04) : 0, 

                  // ENHANCED 'TOWARDS SCREEN' EFFECT:
                  // Starts far away, scales hugely, and moves rapidly forward in Z-space, simulating a powerful tunnel view
                  transform: showMirrors
                    // Increased scale and Z translation for a more dramatic zoom
                    ? `translateX(-50%) scale(${4.0 + (i + 1) * 0.2}) rotateY(${2.5}deg) translateZ(${-(i + 1) * 120}px)` 
                    : 'translateX(-50%) scale(0.1) rotateY(0deg) translateZ(0px)', 
                  
                  transition: `all ${2500 + (i + 1) * 70}ms cubic-bezier(0.34, 1.56, 0.64, 1)`, // Longer transition for dramatic effect
                  transitionDelay: `${(i + 1) * 30}ms`, 
                  filter: `none`, // *** MODIFIED: Removed blur
                  transformOrigin: 'center center',
                }}
              >
                <path
                  d="M 40 500 L 40 100 Q 40 0, 170 0 Q 300 0, 300 100 L 300 500"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1.5"
                />
              </svg>
            ))}

            {/* Right side mirrors (Increased to 25 for density) */}
            {[...Array(25)].map((_, i) => ( 
              <svg
                key={`right-mirror-${i}`}
                width="340"
                height="520"
                viewBox="0 0 340 520"
                className="absolute block"
                style={{
                  // Adjusted to start closer to the center line and spread out less horizontally
                  left: `calc(50% + ${20 + (i + 1) * 3}px)`, 
                  opacity: showMirrors ? Math.max(0.6 - (i + 1) * 0.02, 0.04) : 0, 
                  
                  // ENHANCED 'TOWARDS SCREEN' EFFECT:
                  // Starts far away, scales hugely, and moves rapidly forward in Z-space
                  transform: showMirrors
                    // Increased scale and Z translation for a more dramatic zoom
                    ? `translateX(-50%) scale(${4.0 + (i + 1) * 0.2}) rotateY(${-2.5}deg) translateZ(${-(i + 1) * 120}px)` 
                    : 'translateX(-50%) scale(0.1) rotateY(0deg) translateZ(0px)', 
                  
                  transition: `all ${2500 + (i + 1) * 70}ms cubic-bezier(0.34, 1.56, 0.64, 1)`, // Longer transition for dramatic effect
                  transitionDelay: `${(i + 1) * 30}ms`, 
                  filter: `none`, // *** MODIFIED: Removed blur
                  transformOrigin: 'center center',
                }}
              >
                <path
                  d="M 40 500 L 40 100 Q 40 0, 170 0 Q 300 0, 300 100 L 300 500"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1.5"
                />
              </svg>
            ))}
            {/* --- END MODIFIED MIRROR SECTION --- */}
            
            {/* Horizontal reflection lines for depth - animated outwards */}
            {[...Array(15)].map((_, i) => (
              <div
                key={`h-line-${i}`}
                className="absolute bg-gradient-to-r from-transparent via-white/5 to-transparent"
                style={{
                  height: '1px',
                  width: showMirrors ? '100%' : '40%',
                  top: `${18 + i * 5}%`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  opacity: showMirrors ? (0.35 - i * 0.018) : 0,
                  transition: `all ${900 + i * 70}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                  transitionDelay: `${450 + i * 50}ms`,
                }}
              />
            ))}

            {/* Vertical glowing lines spreading outward */}
            {[...Array(12)].map((_, i) => {
              const leftOffset = 50 - (i + 1) * 11;
              const rightOffset = 50 + (i + 1) * 11;

              return (
                <React.Fragment key={`v-glow-${i}`}>
                  {/* Left vertical lines */}
                  <div
                    className="absolute bg-gradient-to-b from-transparent via-white/4 to-transparent"
                    style={{
                      width: '1px',
                      height: showMirrors ? '80%' : '30%',
                      left: `${leftOffset}%`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      opacity: showMirrors ? Math.max(0.4 - i * 0.03, 0.08) : 0,
                      transition: `all ${1000 + i * 90}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                      transitionDelay: `${500 + i * 60}ms`,
                    }}
                  />

                  {/* Right vertical lines */}
                  <div
                    className="absolute bg-gradient-to-b from-transparent via-white/4 to-transparent"
                    style={{
                      width: '1px',
                      height: showMirrors ? '80%' : '30%',
                      left: `${rightOffset}%`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      opacity: showMirrors ? Math.max(0.4 - i * 0.03, 0.08) : 0,
                      transition: `all ${1000 + i * 90}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                      transitionDelay: `${500 + i * 60}ms`,
                    }}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* Logo - descends to center during mirror spreading. Z-index 30 ensures it's in front. */}
      <div
        className={`absolute flex items-center justify-center ${
          phase === 'planetReveal' ? 'scale-90' : 'scale-100'
        }`}
        style={{
          top: phase === 'planetReveal' || showMirrors ? '50%' : phase === 'welcome' ? 'calc(50% - 240px)' : phase === 'opening' ? 'calc(50% - 80px)' : '50%',
          left: '50%',
          // LOGO ROTATION ADDED HERE
          transform: `translate(-50%, -50%) rotateZ(${
            phase === 'planetReveal' || showMirrors ? '5deg' : '0deg'
          })`,
          opacity: (phase === 'sphereAppear' || phase === 'planetReveal') ? 1 : (phase === 'welcome' || phase === 'opening') ? 1 : 1,
          zIndex: 30, // Key to keeping the logo in front of the planet and mirrors
          filter: phase === 'planetReveal' ? 'drop-shadow(0 0 20px rgba(255,255,255,0.8))' : 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
          transition: 'all 1800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg width="90" height="70" viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd" // Changed fill-rule to fillRule for JSX
          clipRule="evenodd" // Changed clip-rule to clipRule for JSX
          d="M13.1964 2.36136L25.2614 31.2699L20.4589 0.165909C31.2514 -1.16744 41.7001 5.6459 44.7924 16.6423C46.5617 22.9339 45.577 29.3657 42.5664 34.5978L32.3411 10.0971L37.1119 40.9955C34.8746 42.8001 32.2617 44.1985 29.3495 45.0499C26.5808 45.8594 23.7844 46.1036 21.0792 45.8493L9.00481 16.9188L13.1151 43.5391C7.65156 40.7679 3.30421 35.7558 1.48972 29.3033C-1.56411 18.4442 3.58594 7.16822 13.1964 2.36136Z"
          fill="#EFEFEF"
          transform="translate(10,10) scale(1.2)"
        />
        <path
          d="M15.6613 18.4334C15.7266 18.4067 15.7765 18.4272 15.7139 18.4551C10.3637 20.8381 7.36878 22.6685 8.02797 23.3632C9.31935 24.7245 24.1519 21.2091 41.1585 15.5111C58.1645 9.81293 70.9042 4.08999 69.6128 2.72869C68.9541 2.03399 64.7691 2.60911 58.5686 4.09617C58.496 4.11366 58.4923 4.07762 58.5646 4.05819C69.8012 1.03232 77.7914 -0.3688 78.8352 0.7316C80.4802 2.46609 64.2501 9.75692 42.5851 17.0159C20.9198 24.275 2.02348 28.7536 0.378437 27.0192C-0.665346 25.9187 5.48862 22.5807 15.6613 18.4334Z"
          fill="#EFEFEF"
          transform="translate(5,30) scale(0.9)"
        />
        </svg>
      </div>

      {/* Loading Text */}
      <div
        className={`absolute text-white text-sm tracking-widest transition-opacity duration-500 ${
          phase === 'loading' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          top: '50%',
          marginTop: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
        }}
      >
        LOADING MULTIVERSE... <span className="ml-4 font-mono">{progress}%</span>
        
      </div>

      {/* Welcome Screen Content */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ${
        phase === 'welcome' || phase === 'opening' ? 'opacity-100' : 'opacity-0'
      }`}>
        <h1
          className={`text-white text-5xl md:text-6xl font-light mb-8 transition-all duration-1000 ${
            phase === 'welcome' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{
            transitionDelay: phase === 'welcome' ? '400ms' : '0ms',
            marginTop: '60px',
            zIndex: 20,
          }}
        >
          Welcome to Mugafi
        </h1>

        <div
          className={`text-white text-xl md:text-2xl font-light text-center transition-all duration-1000 ${
            phase === 'welcome' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{
            transitionDelay: phase === 'welcome' ? '800ms' : '0ms',
            zIndex: 20,
          }}
        >
          <p>Where Ideas Grow Into Characters,</p>
          <p>Worlds, and Timeless Tales</p>
        </div>

        {/* Floating particles */}
        <div
          className={`absolute w-80 h-96 transition-all duration-1000 ${
            phase === 'welcome' ? 'opacity-40' : 'opacity-0'
          }`}
          style={{ top: '58%' }}
        >
          {phase === 'welcome' && (
            <div className="relative w-full h-full">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                    opacity: Math.random() * 0.7 + 0.3,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Removed the old 'star' animation section as it's replaced by AnimatedBackgroundParticles for a cleaner look --- */}
    </div>
  );
};

export default LoaderAndIntro;