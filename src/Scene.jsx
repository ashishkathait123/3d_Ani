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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slow planet rotation
  useFrame(() => {
    if (planetGroupRef.current && planetGroupRef.current.scale.x > 0.01) {
      planetGroupRef.current.rotation.y += 0.002;
    }
  });

  // Base planet positions (desktop)
  const basePositions = [
    { x: 0, y: -1.2, z: -1, scale: 1.4 },   // 0
    { x: 0, y: 3, z: 0, scale: 1.6 },       // 1
    { x: 0, y: 3.5, z: 0, scale: 1.5 },     // 2
    { x: -5.2, y: 3.5, z: 0, scale: 2 },    // 3
    { x: -7, y: 2, z: 0, scale: 0 },        // 4 disappear
    { x: -7, y: 2, z: 0, scale: 0 },        // 5
    { x: 0, y: -1.5, z: -1, scale: 1.5 },   // 6
    { x: 0, y: 3, z: 0, scale: 1.3 },       // 7
    { x: -7, y: 2, z: 0, scale: 0 },        // 8
    { x: -7, y: 2, z: 0, scale: 0 },        // 9
    { x: -7, y: 2, z: 0, scale: 0 },        // 10
    { x: -7, y: 2, z: 0, scale: 0 },        // 11
    { x: -7, y: 2, z: 0, scale: 0 },        // 12
     {x: -7, y: 2, z: 0, scale: 0 },     // 13 HeroSection2
    { x: 0, y: -1, z: -1, scale: 1.8 },      // 14 WelcomeSection
  ];

  // Responsive adjustment helper
  const getResponsivePosition = (base) => {
    if (isMobile) {
      // Slightly reduce scale and bring up Y to center better on small screens
      return {
        x: base.x * 0.4,
        y: base.y * 1,
        z: base.z,
        scale: base.scale * 1,
      };
    } else if (window.innerWidth <= 1024) {
      // Tablet: moderate adjustment
      return {
        x: base.x * 0.8,
        y: base.y * 0.85,
        z: base.z,
        scale: base.scale * 0.85,
      };
    }
    return base; // Desktop
  };

  // ScrollTrigger setup
  useLayoutEffect(() => {
    const sections = document.querySelectorAll(".scroll-section");

    const visible = Array.from(sections)
      .map((sec, idx) => (sec.dataset.showPlanet === "true" ? idx : null))
      .filter((idx) => idx !== null);
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

  // Animate planet with responsive values
  useEffect(() => {
    if (!planetGroupRef.current) return;

    const idx = Math.min(currentSection, basePositions.length - 1);
    const target = getResponsivePosition(basePositions[idx]);

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

    // Visibility toggle
    if (visibleSections.includes(currentSection)) {
      gsap.to(planetGroupRef.current, {
        opacity: 1,
        duration: 1,
        ease: "power1.out",
      });
    } else {
      gsap.to(planetGroupRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power1.inOut",
      });
    }
  }, [currentSection, visibleSections, isMobile]);

  // Adjust camera for screen size
  useEffect(() => {
    if (!cameraRef.current) return;
    const camZ = isMobile ? 9 : window.innerWidth <= 1024 ? 7 : 6;

    gsap.to(cameraRef.current.position, {
      z: camZ,
      duration: 1,
      ease: "power2.inOut",
    });
  }, [isMobile]);

  const showOrbitLines = currentSection === 0;

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        fov={45}
        near={0.1}
        far={10000}
        makeDefault
        position={[0, 0, 6.5]}
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
