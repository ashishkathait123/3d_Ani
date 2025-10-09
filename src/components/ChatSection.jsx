import React, { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Planet } from "./Planet";
import "./ChatSection.css";// Fallback loading sphere
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
};export const ChatSection = () => {
  const [animatedText, setAnimatedText] = useState("");
  const fullText = "Feed your idea — start Brainstorming with VED...";  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setAnimatedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);return () => clearInterval(interval);  }, []);  const handleBrainstorm = () => {
    console.log("Brainstorm clicked");
  };  return (
    <section className="chat-section">
      {/* 3D Canvas for Planet */}
      <div className="sphere-container">
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 45 }} 
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={<FallbackSphere />}>
            <group scale={0.45} position={[0, 0, 0]}>
              <Planet modelPath="/model/Planet_1_upd.gltf" />
            </group>
          </Suspense>      {/* Additional ambient lighting for brighter red appearance */}
      <ambientLight intensity={0.8} color="#ff4444" />
      
      {/* Front key light - bright red */}
      <directionalLight 
        position={[0, 0, 5]} 
        intensity={2.5} 
        color="#ff3333"
      />
      
      {/* Top light - light red */}
      <directionalLight 
        position={[0, 5, 2]} 
        intensity={2} 
        color="#ff6666"
      />
      
      {/* Side fill lights for even illumination */}
      <pointLight 
        position={[5, 0, 3]} 
        intensity={1.5} 
        color="#ff5555"
        distance={15}
      />
      <pointLight 
        position={[-5, 0, 3]} 
        intensity={1.5} 
        color="#ff5555"
        distance={15}
      />
      
      {/* Back rim light for glow effect */}
      <pointLight 
        position={[0, 0, -5]} 
        intensity={1} 
        color="#ff4444"
        distance={12}
      />
    </Canvas>
  </div>

  {/* Particle/Star Effects */}
  <div className="particles">
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
        }}
      />
    ))}
  </div>

  {/* Content Container */}
  <div className="content-container">
    {/* Hero Section */}
    <div className="hero-section">
      <h1 className="hero-headline">India's First<br />AI Writing Tool</h1>
      <p className="hero-subtitle">
        Enter your story idea, and watch VED shape it into a plan you can
        build on for movies, books, comics, and beyond.
      </p>
    </div>

    {/* Chat Input Box */}
    <div className="chat-input-box">
      <div className="input-content">
        <span className="input-text">{animatedText}</span>
        {animatedText.length < fullText.length && (
          <span className="cursor">|</span>
        )}
      </div>

      <button className="brainstorm-button" onClick={handleBrainstorm}>
        <span className="button-text">BRAINSTORM WITH VED</span>
        <span className="arrow">→</span>
      </button>
    </div>
  </div>

  {/* Gradient Overlay */}
  <div className="gradient-overlay" />
</section>  );
};

