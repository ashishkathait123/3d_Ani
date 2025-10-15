import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Planet } from "./components/Planet";
import { OrbitalLines } from "./components/OrbitalLines";

gsap.registerPlugin(ScrollTrigger);

export const Scene = () => {
  const cameraRef = useRef(null);
  const planetGroupRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);

  // Optional: add slow rotation to planet
  useFrame(() => {
    if (planetGroupRef.current) {
      // Ensure the planet doesn't try to rotate if its scale is 0
      if (planetGroupRef.current.scale.x > 0.01) {
        planetGroupRef.current.rotation.y += 0.002;
      }
    }
  });

const planetPositions = [
  { x: 0, y: -1.2, z: -1, scale: 1.4 },   // 0. Initial (bottom)
  { x: 0, y: 3, z: 0, scale: 1.6 },       // 1. Top center
  { x: 0, y: 3, z: 0, scale: 1.5 },       // 2. Orbit animation start
  { x: -6, y: 3, z: 0, scale: 1.7 },      // 3. Top-left
  { x: -7, y: 2, z: 0, scale: 0 },        // 4. Disappear
  { x: -7, y: 2, z: 0, scale: 0 },        // 5. Hidden (transition section)
  { x: 0, y: -1.5, z: -1, scale: 1.5 },      // 6. 💥 Reappear in center (OrbitLineReveal)
  { x: 0, y: 3, z: 0, scale: 1.3 },       // 7. After OrbitLineReveal
  { x: -7, y: 2, z: 0, scale: 0 },        // 8. Hidden again
  { x: -7, y: 2, z: 0, scale: 0 },        // 9. Hidden
  { x: -7, y: 2, z: 0, scale: 0 },        // 10. Hidden
  { x: -7, y: 2, z: 0, scale: 0 },        // 11. Hidden
  { x: -7, y: 2, z: 0, scale: 0 },        // 12. Hidden
  { x: 0, y: 0, z: -1, scale: 1.5 },0      // 13. 💥 Reappear in WelcomeSection
];


  // Determine if orbital lines should be shown
  const showOrbitLines = currentSection === 0; // only show in initial section

  // Track scroll sections using useLayoutEffect
  useLayoutEffect(() => {
    const sections = document.querySelectorAll(".scroll-section");
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setCurrentSection(index),
        onEnterBack: () => setCurrentSection(index),
        scroller: document.querySelector(".main-scroll-container"),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Animate planet position & scale based on current section
useEffect(() => {
  if (!planetGroupRef.current) return;

  const idx = Math.min(currentSection, planetPositions.length - 1);
  const target = planetPositions[idx];

  // Animate position & scale
  gsap.to(planetGroupRef.current.position, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 1.2,
    ease: "power2.inOut",
  });

  gsap.to(planetGroupRef.current.scale, {
    x: target.scale,
    y: target.scale,
    z: target.scale,
    duration: 1.2,
    ease: "power2.inOut",
  });

  // Fade-in when planet is visible (sections 0, 6, 13)
  if ([0, 6, 13].includes(currentSection)) {
    gsap.fromTo(
      planetGroupRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power1.out" }
    );
  } else {
    // Immediately hide for all other sections
    gsap.set(planetGroupRef.current, { opacity: 0 });
  }
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

      {/* Orbital lines appear only in initial planet position */}
      <OrbitalLines showLines={showOrbitLines} />

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
    </>
  );
};