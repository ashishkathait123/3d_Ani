import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Planet } from "./components/Planet";
import { OrbitalLines } from "./components/OrbitalLines";

gsap.registerPlugin(ScrollTrigger);

export const Scene = ({ showOrbitalLines }) => {
  const cameraRef = useRef(null);
  const planetGroupRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);

  // 🌀 Gentle planet rotation
  useFrame(() => {
    if (planetGroupRef.current) {
      planetGroupRef.current.rotation.y += 0.002;
    }
  });

  // 🧭 Section tracking based on scroll position (window scroll)
  useEffect(() => {
    const sections = document.querySelectorAll(".scroll-section");
    console.log("Detected sections:", sections.length);

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          setCurrentSection(index);
          console.log(`Entered section ${index}`);
        },
        onEnterBack: () => {
          setCurrentSection(index);
          console.log(`Entered back section ${index}`);
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // 🎯 Animate planet movement based on current section
  useEffect(() => {
    if (!planetGroupRef.current) return;

    // Define planetary positions for each section
    const planetPositions = [
      { x: 0, y: -2, z: 0, scale: 1.4 },  // Section 0: Bottom
      { x: 0, y: 3, z: 0, scale: 1.3 },   // Section 1: Top
      { x: -6, y: 3, z: 0, scale: 1.7 },  // Section 2: Top-left
      { x: 0, y: 0, z: 0, scale: 1 },     // Section 3: Center
      { x: 0, y: 0, z: 0, scale: 1 },     // Section 4: ChatSection
    ];

    const idx = Math.min(currentSection, planetPositions.length - 1);
    const target = planetPositions[idx];

    // Animate position
    gsap.to(planetGroupRef.current.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1.2,
      ease: "power2.inOut",
    });

    // Animate scale
    gsap.to(planetGroupRef.current.scale, {
      x: target.scale,
      y: target.scale,
      z: target.scale,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [currentSection]);

  return (
    <>
      {/* 🎥 Camera */}
      <PerspectiveCamera
        ref={cameraRef}
        fov={45}
        near={0.1}
        far={10000}
        makeDefault
        position={[0, 0, 6]}
      />

      {/* 🌆 Ambient environment */}
      <Environment preset="city" />

      {/* 🌍 Main Planet + Orbital Lines */}
      <group ref={planetGroupRef}>
        <Planet />
        {showOrbitalLines && <OrbitalLines />}
      </group>

      {/* 💡 Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
    </>
  );
};
