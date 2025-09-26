// src/Scene.jsx
import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Planet } from "./components/Planet";
// import { InitialLines } from "./components/InitialLines";
// import { TopicPlanets } from "./components/TopicPlanets";

gsap.registerPlugin(ScrollTrigger);

export const Scene = () => {
  const cameraRef = useRef(null);
  const planetGroupRef = useRef(null);
  const initialLinesRef = useRef(null);
  const topicPlanetsRef = useRef(null);

  // const [showInitialLines, setShowInitialLines] = useState(true);
  const [showTopicPlanets, setShowTopicPlanets] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useFrame(() => {
    // Optional: Add any continuous animations here
  });

  useEffect(() => {
    if (!planetGroupRef.current) return;

    // Get all scroll sections
    const sections = document.querySelectorAll('.scroll-section');
    
    // Create ScrollTrigger for each section
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setCurrentSection(index),
        onEnterBack: () => setCurrentSection(index),
      });
    });

    // GSAP Timeline for smooth planet movements
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    console.log(tl)

    // Section 1: Initial state - Planet centered with lines
    tl.to(planetGroupRef.current.position, {
      x: 0, y: -0.5, z: 0,
      scale: 1,
      duration: 0.1
    }, 0)

    // Section 2: Planet moves up
    .to(planetGroupRef.current.position, {
      y: 0.5,
      scale: 0.9,
      duration: 1,
      ease: "power2.inOut"
    }, 0.3)

    // Section 3: Planet moves to top-left corner
    .to(planetGroupRef.current.position, {
      x: -3, y: 2, z: -2,
      scale: 0.6,
      duration: 1.5,
      ease: "power2.inOut"
    }, 1)

    // Section 4: Planet moves to different positions based on scroll
    .to(planetGroupRef.current.position, {
      x: 2, y: -1, z: -1, // Bottom-right position
      scale: 0.7,
      duration: 1,
      ease: "power2.inOut"
    }, 2.5)

    // Additional positions for more scroll sections
    .to(planetGroupRef.current.position, {
      x: 0, y: 3, z: -3, // Top-center position
      scale: 0.8,
      duration: 1,
      ease: "power2.inOut"
    }, 3.5)

    .to(planetGroupRef.current.position, {
      x: 3, y: 3, z: -2, // Right-center position
      scale: 0.5,
      duration: 1,
      ease: "power2.inOut"
    }, 4.5);

    // Handle component visibility
    tl.to({}, {
      duration: 0.1,
      onStart: () => setShowInitialLines(true),
      onReverseComplete: () => setShowInitialLines(true)
    }, 0)

    .to(initialLinesRef.current?.scale, {
      x: 0, y: 0, z: 0,
      duration: 0.5,
      onStart: () => setShowInitialLines(false),
      onReverseComplete: () => setShowInitialLines(true)
    }, 0.8)

    .to({}, {
      duration: 0.1,
      onStart: () => setShowTopicPlanets(true),
      onReverseComplete: () => setShowTopicPlanets(false)
    }, 3)

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Real-time planet position updates based on current section
  useEffect(() => {
    if (!planetGroupRef.current) return;

    const planetPositions = [
      { x: 0, y: -1.5, z: 3, scale: 1.3 },    // Section 1: Center
      { x: 0, y: 4, z: 0, scale: 1.6 },   // Section 2: Slightly up
      { x: -5, y: 3, z: 4, scale: 1.6 },   // Section 3: Top-left
      { x: -14, y: 3, z: -4, scale: 1.6 },   // Section 4: Bottom-right
      { x: 0, y: 3, z: -3, scale: 0.8 },    // Section 5: Top-center
      // { x: 3, y: 1, z: -2, scale: 0.5 }     // Section 6: Right-center
    ];
    console.log(planetGroupRef)

    const targetPosition = planetPositions[Math.min(currentSection, planetPositions.length - 1)];
    
    gsap.to(planetGroupRef.current.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      // z: targetPosition.z,
      duration: 0.8,
      ease: "power2.out"
    });
console.log(planetGroupRef.current.position)
    gsap.to(planetGroupRef.current.scale, {
      x: targetPosition.scale,
      y: targetPosition.scale,
      // z: targetPosition.scale,
      duration: 0.8,
      ease: "power2.out"
    });

  }, [currentSection]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        fov={45}
        near={0.1}
        far={10000}
        makeDefault
        position={[0, 0, 6]}
      />
      <Environment preset="city" />

      {/* Main Planet */}
      <group ref={planetGroupRef}>
        <Planet />
      </group>

      {/* Initial Radiating Lines */}
      {/* <group ref={initialLinesRef}>
        {showInitialLines && <InitialLines visible={showInitialLines} />}
      </group> */}

      {/* Topic Planets */}
      {/* <group ref={topicPlanetsRef}>
        {showTopicPlanets && <TopicPlanets visible={showTopicPlanets} />}
      </group> */}

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
    </>
  );
};