// src/components/Planet.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const Planet = ({ modelPath = "/model/Planet_1_upd.gltf" }) => {
  const planetRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Improve planet material
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.metalness = 0.5;
      child.material.roughness = 0.4;
      child.material.emissive = new THREE.Color(0x111111);
      child.material.needsUpdate = true;
    }
  });

  useFrame(() => {
    if (planetRef.current) planetRef.current.rotation.y += 0.005;
  });

  return (
    <>
      {/* Planet */}
      <primitive
        ref={planetRef}
        object={scene}
        scale={[1.5, 1.5, 1.5]}
        position={[0, -0.5, 0]}
      />

      {/* Red light casting soft red "shadow" */}
      <directionalLight
        position={[5, 5, 5]}
        color="red"       // red light
        intensity={9}   // adjust brightness
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-radius={5}  // soft shadow
      />

      {/* Optional fill light to balance the scene */}
      <ambientLight intensity={0.2} color="white" />
    </>
  );
};
