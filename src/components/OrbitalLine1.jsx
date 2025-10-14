// src/components/OrbitalLines.jsx
import React, { forwardRef } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// Calculate the length of the circle for the dash property
const ORBIT_RADIUS = 4.5;
const CIRCUMFERENCE = 2 * Math.PI * ORBIT_RADIUS;

export const OrbitalLines = forwardRef(({ radius = ORBIT_RADIUS, ...props }, ref) => {
  // Create points for a circle in the XZ plane
  const points = [];
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(theta) * radius, // X
      0,                       // Y (flat orbit)
      Math.sin(theta) * radius // Z
    ));
  }
  
  return (
    // We attach the ref to the Line component to access its material properties
    <group position={[0, 2, 0]} {...props}> 
      <Line
        ref={ref} // Ref used by GSAP to access material properties
        points={points}
        color={0xffffff} 
        lineWidth={1}
        opacity={0.3} 
        transparent
        // Setup for the "drawing" effect:
        dashed={true}
        dashSize={CIRCUMFERENCE + 1} // Dash size must be larger than circumference
        gapSize={0}
        // dashOffset will be animated from CIRCUMFERENCE to 0
        material-dashOffset={CIRCUMFERENCE} 
      />
    </group>
  );
});