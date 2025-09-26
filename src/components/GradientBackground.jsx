// src/Scene.jsx
import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Planet } from "./components/Planet";
import { InitialLines } from "./components/InitialLines";
import { TopicPlanets } from "./components/TopicPlanets";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export const Scene = () => {
  const cameraRef = useRef(null);
  const planetGroupRef = useRef(null);
  const initialLinesRef = useRef(null);
  const topicPlanetsRef = useRef(null);
  const { scene: threeScene } = useThree();

  const [showInitialLines, setShowInitialLines] = useState(true);
  const [showTopicPlanets, setShowTopicPlanets] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  // Background colors for each section
  const backgroundColors = [
    new THREE.Color(0x0a0a1a), // Section 1: Dark blue
    new THREE.Color(0x1a0a2a), // Section 2: Purple
    new THREE.Color(0x2a1a3a), // Section 3: Deep purple
    new THREE.Color(0x3a2a4a), // Section 4: Light purple
    new THREE.Color(0x4a3a5a), // Section 5: Lavender
    new THREE.Color(0x5a4a6a)  // Section 6: Light lavender
  ];

  useFrame(() => {
    // Optional: Add any continuous animations here
  });

  useEffect(() => {
    // Initialize background
    threeScene.background = backgroundColors[0];
  }, [threeScene]);

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

    // GSAP Timeline for smooth planet movements and background changes
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Section 1: Initial state - Planet centered with lines
    tl.to(planetGroupRef.current.position, {
      x: 0, y: -0.5, z: 0,
      scale: 1,
      duration: 0.1
    }, 0)

    // Background for section 1
    .to(threeScene.background, {
      r: backgroundColors[0].r,
      g: backgroundColors[0].g,
      b: backgroundColors[0].b,
      duration: 0.1
    }, 0)

    // Section 2: Planet moves up
    .to(planetGroupRef.current.position, {
      y: 0.5,
      scale: 0.9,
      duration: 1,
      ease: "power2.inOut"
    }, 0.3)

    // Background for section 2
    .to(threeScene.background, {
      r: backgroundColors[1].r,
      g: backgroundColors[1].g,
      b: backgroundColors[1].b,
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

    // Background for section 3
    .to(threeScene.background, {
      r: backgroundColors[2].r,
      g: backgroundColors[2].g,
      b: backgroundColors[2].b,
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

    // Background for section 4
    .to(threeScene.background, {
      r: backgroundColors[3].r,
      g: backgroundColors[3].g,
      b: backgroundColors[3].b,
      duration: 1,
      ease: "power2.inOut"
    }, 2.5)

    // Section 5: Top-center position
    .to(planetGroupRef.current.position, {
      x: 0, y: 3, z: -3,
      scale: 0.8,
      duration: 1,
      ease: "power2.inOut"
    }, 3.5)

    // Background for section 5
    .to(threeScene.background, {
      r: backgroundColors[4].r,
      g: backgroundColors[4].g,
      b: backgroundColors[4].b,
      duration: 1,
      ease: "power2.inOut"
    }, 3.5)

    // Section 6: Right-center position
    .to(planetGroupRef.current.position, {
      x: 3, y: 4, z: -2,
      scale: 0.5,
      duration: 1,
      ease: "power2.inOut"
    }, 4.5)

    // Background for section 6
    .to(threeScene.background, {
      r: backgroundColors[5].r,
      g: backgroundColors[5].g,
      b: backgroundColors[5].b,
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
  }, [threeScene]);

  // Real-time planet position and background updates based on current section
  useEffect(() => {
    if (!planetGroupRef.current) return;

    const planetPositions = [
      { x: 0, y: -0.5, z: 0, scale: 1 },    // Section 1: Center
      { x: 0, y: 0.5, z: 0, scale: 0.9 },   // Section 2: Slightly up
      { x: -7, y: 2, z: -3, scale: 1.5 },   // Section 3: Top-left
      { x: 2, y: -1, z: -1, scale: 0.7 },   // Section 4: Bottom-right
      { x: 0, y: 3, z: -3, scale: 0.8 },    // Section 5: Top-center
      { x: 3, y: 4, z: -2, scale: 0.5 }     // Section 6: Right-center
    ];

    const targetPosition = planetPositions[Math.min(currentSection, planetPositions.length - 1)];
    const targetColor = backgroundColors[Math.min(currentSection, backgroundColors.length - 1)];
    
    // Animate planet position
    gsap.to(planetGroupRef.current.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 0.8,
      ease: "power2.out"
    });

    // Animate planet scale
    gsap.to(planetGroupRef.current.scale, {
      x: targetPosition.scale,
      y: targetPosition.scale,
      z: targetPosition.scale,
      duration: 0.8,
      ease: "power2.out"
    });

    // Animate background color
    gsap.to(threeScene.background, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.8,
      ease: "power2.out"
    });

  }, [currentSection, threeScene]);

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
        <Planet rotationSpeed={0.3} />
      </group>

      {/* Initial Radiating Lines */}
      <group ref={initialLinesRef}>
        {showInitialLines && <InitialLines visible={showInitialLines} />}
      </group>

      {/* Topic Planets */}
      <group ref={topicPlanetsRef}>
        {showTopicPlanets && <TopicPlanets visible={showTopicPlanets} />}
      </group>

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
    </>
  );
};