import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Planet } from "./components/Planet";

gsap.registerPlugin(ScrollTrigger);

export const Scene = () => {
  const cameraRef = useRef(null);
  const planetGroupRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);

  // Optional: add slow rotation to planet
  useFrame(() => {
    if (planetGroupRef.current) {
      planetGroupRef.current.rotation.y += 0.002;
    }
  });

  const planetPositions = [
    // Array size must match the number of scroll-sections in App.jsx (6 sections)
    // Section 1: Welcome - Planet bottom center (Default starting point)
    { x: 0, y: -2, z: 0, scale: 1.4 },
    // Section 2: Step 1 - Scroll planet will go top center
    { x: 0, y: 2, z: 0, scale: 1.3 },
    // Section 3: Step 2 - Plant will go to left & Step 3 - Planet disappear (off-screen left)
    { x: -7, y: 2, z: 0, scale: 1.7 },
    // Section 4: SlidingTabs - Keep planet disappeared/off-screen
    { x: -7, y: 2, z: 0, scale: 1.7 },
    // Section 5: ImageSlider (Pinning) - Keep planet disappeared/off-screen
    { x: -7, y: 2, z: 0, scale: 1.7 },
    // Section 6: Step 5/6 - Planet re-appear center, then go top center for orbit line
    { x: 0, y: 2.5, z: 0, scale: 1.5 },
  ];

  // Track scroll sections using useLayoutEffect to ensure DOM is ready
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

  // Animate planet position based on current section
  useEffect(() => {
    if (!planetGroupRef.current) return;

    const idx = currentSection;
    const target = planetPositions[idx] || planetPositions[0];

    // Animate planet
    gsap.to(planetGroupRef.current.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1.0,
      ease: "power2.out",
    });

    gsap.to(planetGroupRef.current.scale, {
      x: target.scale,
      y: target.scale,
      z: target.scale,
      duration: 1.0,
      ease: "power2.out",
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

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
    </>
  );
};