// WORK IN PROGRESS - DO NOT DELETE
import React, { useEffect, useState, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Planet } from "./Planet";
import "./ScrollIcons.css";

const FallbackSphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color="#ff0000" 
        emissive="#330000"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

export const ScrollIcons = ({ scrollerRef }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef?.current;
    if (!scroller) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through this section
      const scrollStart = -rect.top;
      const scrollEnd = sectionHeight - windowHeight;
      const progress = Math.max(0, Math.min(1, scrollStart / scrollEnd));
      
      setScrollProgress(progress);
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [scrollerRef]);

  // Calculate sphere position (moves up as we scroll)
  const sphereY = scrollProgress * 70 - 10; // Moves from -10vh to 60vh

  // Icon visibility thresholds
  const icon1Visible = scrollProgress > 0.25;
  const icon2Visible = scrollProgress > 0.5;
  const icon3Visible = scrollProgress > 0.75;

  const icons = [
    {
      id: 1,
      icon: "📚",
      title: "Smart Research",
      description: "Access on-the-fly research and avoid deep dives. VED brings you credible, on-point insights into history, culture, character insights from real worlds.",
      visible: icon1Visible,
      delay: 0
    },
    {
      id: 2,
      icon: "💡",
      title: "Powered by Brainstorming",
      description: "Sharpen your ideas and leave writer's block behind. Share a character, a world, or even just a feeling and watch it grow into your next great story.",
      visible: icon2Visible,
      delay: 0.2
    },
    {
      id: 3,
      icon: "📝",
      title: "Story Formatting",
      description: "Create rich, multi-dimensional characters and immersive worlds with ease. We're formatting your screenplay or comic script to industry-ready standards with AI guidance.",
      visible: icon3Visible,
      delay: 0.4
    }
  ];

  return (
    <section className="scroll-icons-section" ref={sectionRef}>
      {/* Inverted Semi-circular orange line (downward arc) */}
      <svg className="semi-circle-path" viewBox="0 0 100 60" preserveAspectRatio="none">
        <path
          d="M 0,0 Q 50,60 100,0"
          fill="none"
          stroke="rgba(255, 140, 0, 0.8)"
          strokeWidth="0.4"
        />
      </svg>

      {/* 3D Canvas for Planet - isolated */}
      <div 
        className="sphere-container-scroll" 
        style={{
          transform: `translateY(${sphereY}vh)`,
        }}
      >
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 45 }} 
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={<FallbackSphere />}>
            <group scale={0.45} position={[0, 0, 0]}>
              <Planet modelPath="/model/Planet_1_upd.gltf" />
            </group>
          </Suspense>
          
          <ambientLight intensity={0.8} color="#ff4444" />
          <directionalLight position={[0, 0, 5]} intensity={2.5} color="#ff3333" />
          <directionalLight position={[0, 5, 2]} intensity={2} color="#ff6666" />
          <pointLight position={[5, 0, 3]} intensity={1.5} color="#ff5555" distance={15} />
          <pointLight position={[-5, 0, 3]} intensity={1.5} color="#ff5555" distance={15} />
          <pointLight position={[0, 0, -5]} intensity={1} color="#ff4444" distance={12} />
        </Canvas>
      </div>

      {/* Icons Container */}
      <div className="icons-container">
        {icons.map((item, index) => {
          // Calculate position along the inverted arc (downward)
          const angle = (index / 2) * Math.PI; // 0 to π (180 degrees)
          const radius = 40; // percentage
          const x = 50 - radius * Math.cos(angle); // Center at 50%
          const y = radius * Math.sin(angle); // Start from top, curve downward
          
          return (
            <div
              key={item.id}
              className={`icon-wrapper ${item.visible ? 'visible' : ''}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transitionDelay: `${item.delay}s`
              }}
            >
              {/* Icon Circle on the line */}
              <div className="icon-circle">
                <span className="icon-emoji">{item.icon}</span>
              </div>
              
              {/* Content below the icon */}
              <div className="icon-content-box">
                <h3 className="icon-title">{item.title}</h3>
                <p className="icon-description">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Particle/Star Effects */}
      <div className="particles-scroll">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle-scroll"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="gradient-overlay-scroll" />
    </section>
  );
};