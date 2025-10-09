import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Preload the model
useGLTF.preload("/model/Planet_1_upd.gltf");

export const Planet = ({ modelPath = "/model/Planet_1_upd.gltf" }) => {
  const planetRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Clone the scene to avoid issues with multiple instances
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  // Improve planet material with subtle red glow
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.metalness = 0.3;
        child.material.roughness = 0.6;
        child.material.emissive = new THREE.Color(0x330000);
        child.material.emissiveIntensity = 0.4;
        child.material.needsUpdate = true;
      }
    });
  }, [clonedScene]);

  useFrame(() => {
    if (planetRef.current) planetRef.current.rotation.y += 0.005;
  });

  return (
    <>
      <primitive ref={planetRef} object={clonedScene} />

      {/* Lights are now in ChatSection.jsx */}
    </>
  );
};