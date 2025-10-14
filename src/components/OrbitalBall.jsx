// src/components/OrbitalBall.jsx
import React, { forwardRef } from 'react';
import * as THREE from 'three';

const material = new THREE.MeshStandardMaterial({
  color: 0xff0040, // Pink/Red color
  emissive: 0xff0040,
  emissiveIntensity: 1.5,
  metalness: 0.8,
  roughness: 0.1,
});

export const OrbitalBall = forwardRef(({ initialPosition, ...props }, ref) => {
  return (
    <mesh 
      ref={ref} 
      material={material}
      position={initialPosition} 
      {...props}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      {/* Light for glow */}
      <pointLight color={0xff0040} intensity={3} distance={2} decay={2} />
    </mesh>
  );
});