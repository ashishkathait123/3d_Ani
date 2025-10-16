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
  const [visibleSections, setVisibleSections] = useState([]);

  // Optional: slow rotation for planet
  useFrame(() => {
    if (planetGroupRef.current && planetGroupRef.current.scale.x > 0.01) {
      planetGroupRef.current.rotation.y += 0.002;
    }
  });

  // Define planet positions for each section
  const planetPositions = [
    { x: 0, y: -1.2, z: -1, scale: 1.4 },   // 0
    { x: 0, y: 3, z: 0, scale: 1.6 },       // 1
    { x: 0, y: 3, z: 0, scale: 1.5 },       // 2
    { x: -6, y: 3, z: 0, scale: 1.7 },      // 3
    { x: -7, y: 2, z: 0, scale: 0 },        // 4 disappear
    { x: -7, y: 2, z: 0, scale: 0 },        // 5
    { x: 0, y: -1.5, z: -1, scale: 1.5 },   // 6
    { x: 0, y: 3, z: 0, scale: 1.3 },       // 7
    { x: -7, y: 2, z: 0, scale: 0 },        // 8
    { x: -7, y: 2, z: 0, scale: 0 },        // 9
    { x: -7, y: 2, z: 0, scale: 0 },        // 10
    { x: -7, y: 2, z: 0, scale: 0 },        // 11
    { x: -7, y: 2, z: 0, scale: 0 },        // 12
    { x: 0, y: 0, z: -1, scale: 1.5 },      // 13 HeroSection2
    { x: 0, y: 0, z: -1, scale: 1.5 },      // 14 WelcomeSection
  ];

  // Track scroll sections and current section
  useLayoutEffect(() => {
    const sections = document.querySelectorAll(".scroll-section");

    // Dynamically determine visible sections based on data attribute
    const visible = Array.from(sections)
      .map((sec, idx) => (sec.dataset.showPlanet === "true" ? idx : null))
      .filter(idx => idx !== null);
    setVisibleSections(visible);

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
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Animate planet based on current section
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

    // Animate opacity based on visibility
    if (visibleSections.includes(currentSection)) {
      gsap.to(planetGroupRef.current, { opacity: 1, duration: 1, ease: "power1.out" });
    } else {
      gsap.to(planetGroupRef.current, { opacity: 0, duration: 0.6, ease: "power1.inOut" });
    }
  }, [currentSection, visibleSections]);

  // Only show orbital lines in first section
  const showOrbitLines = currentSection === 0;

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

      {/* Planet */}
      <group ref={planetGroupRef}>
        <Planet />
      </group>

      {/* Orbital Lines */}
      <OrbitalLines showLines={showOrbitLines} />

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
    </>
  );
};
