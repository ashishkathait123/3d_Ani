// src/components/Planet.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const Planet = ({ modelPath = "/model/Planet_1_upd.gltf" }) => {
  const planetRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Improve planet material with subtle red glow
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.metalness = 0.3;
      child.material.roughness = 0.6;
      child.material.emissive = new THREE.Color(0x330000); // Dark red emissive glow
      child.material.emissiveIntensity = 0.4; // Subtle glow intensity
      child.material.needsUpdate = true;
    }
  });

  useFrame(() => {
    if (planetRef.current) planetRef.current.rotation.y += 0.005;
  });

  return (
    <>
      {/* Planet */}
      <primitive ref={planetRef} object={scene} />

      {/* Concentrated dark red spotlight from top - creates the darkest red effect */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={0.8}
        intensity={3}
        color="#8B0000"
        distance={20}
        castShadow
      />

      {/* Secondary red spotlight for glow spread effect */}
      <spotLight
        position={[0, 8, 3]}
        angle={0.8}
        penumbra={1}
        intensity={2}
        color="#FF0000"
        distance={15}
      />

      {/* Rim light from side for red glow effect */}
      <pointLight
        position={[5, 3, 5]}
        intensity={1.5}
        color="#FF3333"
        distance={15}
      />

      {/* Top-focused red point light for concentrated glow */}
      <pointLight
        position={[0, 6, 0]}
        intensity={2.5}
        color="#CC0000"
        distance={10}
      />

      {/* Subtle red ambient glow */}
      <ambientLight intensity={0.2} color="#330000" />

      {/* Soft fill light to maintain visibility */}
      <pointLight
        position={[-3, -2, -5]}
        intensity={0.3}
        color="#ffffff"
      />
    </>
  );
};