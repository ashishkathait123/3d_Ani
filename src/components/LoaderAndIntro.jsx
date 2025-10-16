import React, { useEffect, useRef, useState } from "react";
import { Canvas,useFrame  } from "@react-three/fiber";
import { Planet } from "./Planet";

// --- CONSTANTS ---
const ARCH_COUNT = 6;

const LoaderAndIntro = ({ onAnimationComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading, opening, welcome, sphereAppear, planetReveal
  const [showPlanet, setShowPlanet] = useState(false);
  const [isTunnelVisible, setIsTunnelVisible] = useState(false); // Renamed from showMirrors/showTunnel
  const containerRef = useRef(null);
const cameraRef = useRef();



const PlanetWithVibration = ({ modelPath, phase }) => {
  const planetRef = useRef();

  useFrame(() => {
    if (!planetRef.current) return;

    if (phase === "planetReveal") {
      // Vibrate the planet with small random offsets
      const amplitude = 0.03; // max movement in x/y direction
      planetRef.current.position.x = (Math.random() - 0.5) * amplitude;
      planetRef.current.position.y = (Math.random() - 0.5) * amplitude;
      planetRef.current.position.z = 0; // keep z fixed
    } else {
      // Reset position for all other phases
      planetRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <group ref={planetRef} scale={0.55}>
      <Planet modelPath={modelPath} />
    </group>
  );
};



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
          setPhase("opening"); 

          setTimeout(() => {
            setPhase("welcome"); 

            setTimeout(() => {
              setPhase("sphereAppear");
              setShowPlanet(true); 

              setTimeout(() => {
                setIsTunnelVisible(true); // Trigger tunnel arch appearance

                setTimeout(() => {
                  setPhase("planetReveal"); 

                  setTimeout(() => {
                    if (onAnimationComplete) onAnimationComplete();
                  }, 2500); 
                }, 1000); 
              }, 1200); 
            }, 2500);
          }, 1200);
        }, 500);
      }
    };

    requestAnimationFrame(animateProgress);
  }, [onAnimationComplete]);

  // The central arc path is only used for the original SVG loading screen
  const stretchedArcPath =
    "M 40 500 L 40 100 Q 50 0, 170 0 Q 300 0, 300 100 L 300 500 L 40 500 Z";

  // Base Arch dimensions (matches the closest SVG size)
  const BASE_ARCH_WIDTH = 440;
  const BASE_ARCH_HEIGHT = 620;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* ------------------- BACKGROUND LAYER with Red Glow ------------------- */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1500ms] ease-out ${
          phase === "loading" ? "opacity-30" : "opacity-100"
        }`}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(100, 0, 0, 0.4) 0%, rgba(0, 0, 0, 1) 70%)',
          zIndex: 0,
        }}
      />

      {/* ------------------- TUNNEL ARCHES & CROSS-HAIR (with expanding image) ------------------- */}
      <div
        className="absolute flex items-center justify-center w-[100%] h-[100%] overflow-hidden"
        style={{
          zIndex: 15,
          perspective: '1000px',
          opacity: phase === "planetReveal" ? 0 : 1, // Fade out the tunnel on reveal
          transition: 'opacity 1s ease-out',
        }}
      >
        {/* 💥 NEW: Expanding Background Image Content (Behind Arches) */}
        {isTunnelVisible && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(/model/bg21.png)`, // Use your desired background image here
              zIndex: 14, // Lower than the arch lines
              
              // Animate the scale to create the feeling of the tunnel opening/expanding
              transform: `scale(${phase === 'sphereAppear' ? 0.9 : 1.1})`,
              transition: 'transform 3s cubic-bezier(0.2, 0.8, 0.6, 1)',
              opacity: isTunnelVisible ? 1 : 0,
            }}
          />
        )}

        {/* Repeated Tunnel Arches (Door Replicas) */}
        {isTunnelVisible &&
          [...Array(ARCH_COUNT)].map((_, i) => {
            const scaleFactor = 1 - (i * 0.15); 
            const opacity = Math.max(0.6 - i * 0.1, 0.1);
            const archSize = BASE_ARCH_WIDTH + i * 150; 

            return (
              <div
                key={`arch-${i}`}
                className="absolute border-[2px] border-white/40"
                style={{
                  width: `${archSize}px`,
                  height: `${BASE_ARCH_HEIGHT * 1.5 + i * 150}px`, 
                  borderTopLeftRadius: '50% 30%',
                  borderTopRightRadius: '50% 30%',
                  borderBottom: 'none',
                  
                  transform: `translate(-50%, -50%) translateZ(${i * 10}px)`, 
                  top: '50%',
                  left: '50%',
                  opacity: opacity,
                  zIndex: 15 + i, // Ensure arches are layered correctly
                  transition: `all 1500ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                  transitionDelay: `${400 + i * 150}ms`,
                }}
              />
            );
          })}

        {/* Central Cross-Hair */}
        {isTunnelVisible && (
          <div 
            className={`absolute transition-opacity duration-1000`}
            style={{ 
              width: '300px', 
              height: '300px', 
              transform: 'translate(-50%, -50%)',
              top: '50%',
              left: '50%',
              opacity: phase === 'sphereAppear' ? 1 : 0, 
              transitionDelay: '800ms',
              zIndex: 40, // Ensure it's on top of everything
            }}
          >
            <div className="absolute w-full h-[2px] bg-white/40 top-1/2 left-0" style={{ transform: 'translateY(-50%) rotate(45deg)' }} />
            <div className="absolute w-full h-[2px] bg-white/40 top-1/2 left-0" style={{ transform: 'translateY(-50%) rotate(-45deg)' }} />
          </div>
        )}
      </div>


      {/* ------------------- 3D Canvas for Planet ------------------- */}
      <div
        className={`absolute inset-0 transition-all duration-1200 ${
          phase === "sphereAppear" || phase === "planetReveal"
            ? "opacity-100"
            : "opacity-0"
        }`}
        style={{ zIndex: 20 }}
      >
        <Canvas dpr={[1, 2]}>
  <perspectiveCamera ref={cameraRef} position={[0, 0, 6]} fov={45} />

          {showPlanet && (
            <>
              <group
                scale={0.55}
                position={[0, phase === "planetReveal" ? 0 : 0, 0]}
              >
                <Planet modelPath="/model/Planet_1_upd.gltf" />
              </group>
              {/* Lighting adjusted for the intense red glow look */}
              <ambientLight intensity={9.5} color="#ff8888" />
              <directionalLight
                position={[0, 0, 5]}
                intensity={7.5}
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

      {/* ------------------- Original SVG for Loading Bar ------------------- */}
      <div
        className={`absolute flex items-center justify-center transition-all duration-1000 ${
          phase === "planetReveal"
            ? "opacity-0 scale-110"
            : "opacity-100 scale-100"
        }`}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10, 
        }}
      >
        <svg
          width="340"
          height={phase === "loading" ? "300" : "520"} 
          viewBox={phase === "loading" ? "0 0 340 200" : "0 0 340 520"} 
          className="block transition-all duration-1000"
        >
          <path
            d={
              phase === "loading"
                ? "M 40 180 L 40 100 Q 50 0, 170 0 Q 300 0, 300 100 L 300 180 L 40 180 Z"
                : stretchedArcPath
            }
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            className="transition-all duration-1000"
          />

          {/* Progress Bar (Only during loading phase) */}
          {phase === "loading" && (
            <g>
              <rect
                x="50"
                y="195"
                width="240"
                height="2"
                fill="rgba(255, 255, 255, 0.2)"
              />
              <rect
                x="50"
                y="195"
                width={240 * (progress / 100)}
                height="2"
                fill="white"
              />
            </g>
          )}
        </svg>
      </div>

      {/* ------------------- Logo, Loading Text, and Welcome Screen Content (Unchanged) ------------------- */}
      {/* Logo (ZIndex 30) */}
      <div
        className={`absolute flex items-center justify-center ${
          phase === "planetReveal" ? "scale-90" : "scale-100"
        }`}
        style={{
          top:
            phase === "planetReveal" || isTunnelVisible
              ? "50%"
              : phase === "welcome"
              ? "calc(50% - 240px)"
              : phase === "opening"
              ? "calc(50% - 80px)"
              : "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotateZ(${
            phase === "planetReveal" || isTunnelVisible ? "8deg" : "0deg"
          })`,
          opacity:
            phase === "sphereAppear" || phase === "planetReveal"
              ? 1
              : phase === "welcome" || phase === "opening"
              ? 1
              : 1,
          zIndex: 30,
          filter:
            phase === "planetReveal"
              ? "drop-shadow(0 0 20px rgba(255,255,255,0.8))"
              : "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
          transition: "all 1800ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <svg
          width="90"
          height="70"
          viewBox="0 0 90 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
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
          phase === "loading" ? "opacity-100" : "opacity-0"
        }`}
        style={{
          top: "48%",
          marginTop: "140px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        LOADING MULTIVERSE...
        <span className="ml-4 font-mono">{progress}%</span>
      </div>

      {/* Welcome Screen Content */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ${
          phase === "welcome" || phase === "opening"
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <h1
          className={`text-white text-5xl md:text-6xl font-light mb-8 transition-all duration-1000 ${
            phase === "welcome"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
          style={{
            transitionDelay: phase === "welcome" ? "400ms" : "0ms",
            zIndex: 20,
          }}
        >
          Welcome to Mugafi
        </h1>

        <div
          className={`text-white text-xl md:text-2xl font-light text-center transition-all duration-1000 ${
            phase === "welcome"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
          style={{
            transitionDelay: phase === "welcome" ? "800ms" : "0ms",
            zIndex: 20,
          }}
        >
          <p>Where Ideas Grow Into Characters,</p>
          <p>Worlds, and Timeless Tales</p>
        </div>

        <div
          className={`absolute w-80 h-96 transition-all duration-1000 ${
            phase === "welcome" ? "opacity-40" : "opacity-0"
          }`}
          style={{ top: "58%" }}
        >
          {phase === "welcome" && (
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
    </div>
  );
};

export default LoaderAndIntro;