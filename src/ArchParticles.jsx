import React from 'react';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Define the material for the arch
const archMaterial = new THREE.MeshBasicMaterial({
  color: 0xcc0033, // Deep Red color
  transparent: true,
  opacity: 0.15,
  side: THREE.DoubleSide,
  wireframe: true, // Optional: Wireframe look
});

export const ArchParticles = () => {
  const innerRadius = 3.5;
  const outerRadius = 4.0;
  const height = 8.0;

  return (
    <group position={[0, -1, -5]}> 
      
      {/* Particle System (Starfield) */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />

      {/* Arch Outline (RingGeometry for the top curve) */}
      <mesh material={archMaterial} rotation-x={Math.PI / 2}>
        <ringGeometry args={[innerRadius, outerRadius, 64, 1, 0, Math.PI]} />
      </mesh>
      
      {/* Arch Side Posts (BoxGeometry) */}
      <mesh material={archMaterial} position={[-outerRadius, -height / 2, 0]}>
        <boxGeometry args={[0.05, height, 0.05]} />
      </mesh>
      <mesh material={archMaterial} position={[outerRadius, -height / 2, 0]}>
        <boxGeometry args={[0.05, height, 0.05]} />
      </mesh>
      
      {/* Red Light Beam (ConeGeometry) */}
      <mesh position={[0, height / 2, 0]} rotation-x={-Math.PI / 2}>
        <coneGeometry args={[3, 10, 32]} />
        <meshBasicMaterial 
          color={0xcc0033} 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide} 
        />
      </mesh>

    </group>
  );
};