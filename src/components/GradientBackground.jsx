// src/Scene.jsx
import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Planet } from "./components/Planet";
import { OrbitalLines } from "./components/OrbitalLines";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export const Scene = ({ showOrbitalLines }) => {
  const cameraRef = useRef(null);
  const planetGroupRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);

  // Optional: add slow rotation to planet
  useFrame(() => {
    if (planetGroupRef.current) {
      planetGroupRef.current.rotation.y += 0.002;
    }
  });

  // Track scroll sections and update current section
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const initScrollTriggers = () => {
      const sections = document.querySelectorAll(".scroll-section");
      
      if (sections.length === 0) {
        // Retry if sections not found
        setTimeout(initScrollTriggers, 100);
        return;
      }

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setCurrentSection(index),
          onEnterBack: () => setCurrentSection(index),
        });
      });
    };

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initScrollTriggers, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Update planet position based on current section
  useEffect(() => {
    if (!planetGroupRef.current) return;

    const planetPositions = [
      { x: 0, y: -2, z: 0, scale: 1.4 },   // Section 1: Center
      { x: 0, y: 3, z: 0, scale: 1.3 },    // Section 2: Top
      { x: -6, y: 3, z: 0, scale: 1.7 },   // Section 3: Top-left
      { x: 0, y: 0, z: 0, scale: 1 },      // Section 4: Reset to center
    ];

    // Ensure index does not go out of bounds
    const idx = currentSection >= planetPositions.length ? planetPositions.length - 1 : currentSection;
    const target = planetPositions[idx];

    // Set initial position immediately on first render without animation
    if (currentSection === 0 && planetGroupRef.current.position.x === 0 && planetGroupRef.current.position.y === 0 && planetGroupRef.current.position.z === 0) {
      planetGroupRef.current.position.set(target.x, target.y, target.z);
      planetGroupRef.current.scale.set(target.scale, target.scale, target.scale);
    } else {
      // Animate planet position
      gsap.to(planetGroupRef.current.position, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 0.8,
        ease: "power2.out",
      });

      // Animate planet scale
      gsap.to(planetGroupRef.current.scale, {
        x: target.scale,
        y: target.scale,
        z: target.scale,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, [currentSection]);

  // Set initial planet position on mount
  useEffect(() => {
    if (planetGroupRef.current) {
      // Force initial position
      const initialPos = { x: 0, y: -2, z: 0, scale: 1.4 };
      planetGroupRef.current.position.set(initialPos.x, initialPos.y, initialPos.z);
      planetGroupRef.current.scale.set(initialPos.scale, initialPos.scale, initialPos.scale);
    }
  }, []);

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
        {/* Orbital lines - only show on first section */}
        {showOrbitalLines && currentSection === 0 && <OrbitalLines />}
      </group>

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
    </>
  );
};