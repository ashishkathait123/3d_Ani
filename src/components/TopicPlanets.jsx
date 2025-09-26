// src/components/TopicPlanets.jsx
import React, { useRef, useEffect } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber"; // Add this

const SmallPlanet = ({ position, text, rotationSpeed = 0.01 }) => {
  const meshRef = useRef();
  const textRef = useRef();

  // Basic rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ADD8E6" roughness={0.7} metalness={0.2} /> {/* Light Blue */}
      </mesh>
      <Text
        ref={textRef}
        position={[0, -0.5, 0]} // Position text below the planet
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation-y={Math.PI / 8} // Slightly angle text
      >
        {text}
      </Text>
    </group>
  );
};

export const TopicPlanets = ({ visible }) => {
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      if (visible) {
        gsap.fromTo(
          groupRef.current.position,
          { x: 5 }, // Start from right
          { x: 0, duration: 1, ease: "power3.out" }
        );
        gsap.fromTo(
          groupRef.current.rotation,
          { y: Math.PI / 2 },
          { y: 0, duration: 1, ease: "power3.out" }
        );
      } else {
        gsap.to(groupRef.current.position, { x: 5, duration: 0.8, ease: "power2.in" });
        gsap.to(groupRef.current.rotation, { y: Math.PI / 2, duration: 0.8, ease: "power2.in" });
      }
    }
  }, [visible]);

  return (
    <group ref={groupRef} position={[5, 0, 0]}>
      {visible && (
        <>
          <SmallPlanet position={[0, 1.5, 0]} text="FILMS" rotationSpeed={0.015} />
          <SmallPlanet position={[-1.5, -1, 0]} text="COMICS" rotationSpeed={0.012} />
          <SmallPlanet position={[1.5, -1, 0]} text="GAMES" rotationSpeed={0.01} />
        </>
      )}
    </group>
  );
};