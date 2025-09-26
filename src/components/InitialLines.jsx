// src/components/InitialLines.jsx
import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

export const InitialLines = ({ visible, onAnimationComplete }) => {
  const lineGroupRef = useRef();
  const spheresRef = useRef([]);

  useEffect(() => {
    if (lineGroupRef.current && visible) {
      // Animate lines in
      gsap.fromTo(
        lineGroupRef.current.scale,
        { x: 0, y: 0, z: 0 },
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.5,
          ease: "power3.out",
          onComplete: () => {
            // Animate spheres in after lines
            spheresRef.current.forEach((sphere, index) => {
              gsap.fromTo(
                sphere.scale,
                { x: 0, y: 0, z: 0 },
                {
                  x: 0.08,
                  y: 0.08,
                  z: 0.08,
                  duration: 0.8,
                  ease: "back.out(1.7)",
                  delay: index * 0.1,
                  onComplete: () => {
                    if (index === spheresRef.current.length - 1 && onAnimationComplete) {
                      onAnimationComplete();
                    }
                  }
                }
              );
            });
          },
        }
      );
    } else if (lineGroupRef.current && !visible) {
      // Animate out if not visible
      gsap.to(lineGroupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.8,
        ease: "power2.in",
      });
      spheresRef.current.forEach(sphere => {
        gsap.to(sphere.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "power2.in" });
      });
    }
  }, [visible, onAnimationComplete]);

  useFrame(() => {
    // Enhanced water wave effect with ripple-like pulsation
    spheresRef.current.forEach((sphere, i) => {
      if (sphere && sphere.scale.x > 0) {
        const waveIntensity = 0.02;
        const waveSpeed = 0.008;
        const waveOffset = i * 0.5;
        
        // Create a more organic wave pattern
        const scaleVariation = Math.sin(Date.now() * waveSpeed + waveOffset) * waveIntensity;
        const additionalPulse = Math.sin(Date.now() * 0.003 + i) * 0.005;
        
        sphere.scale.setScalar(0.08 + scaleVariation + additionalPulse);
        
        // Add subtle color variation for water effect
        if (sphere.material) {
          const hueVariation = Math.sin(Date.now() * 0.002 + i) * 0.1;
          sphere.material.color.setHSL(0.5 + hueVariation, 0.8, 0.6);
        }
      }
    });
  });

  // Create a half-circle pattern (180 degrees)
  const lineCount = 12; // Number of lines in the half-circle
  const radius = 2; // Radius of the half-circle
  const lineData = [];

  for (let i = 0; i < lineCount; i++) {
    // Calculate angle for each line (from -90° to +90°)
    const angle = (Math.PI / (lineCount - 1)) * i - Math.PI / 2;
    
    // Calculate end point on the half-circle
    const endX = Math.cos(angle) * radius;
    const endY = Math.sin(angle) * radius;
    
    lineData.push({
      start: [0, 0, 0], // All lines start from center
      end: [endX, endY, 0]
    });
  }

  return (
    <group ref={lineGroupRef}>
      {lineData.map((data, index) => (
        <React.Fragment key={index}>
          <Line
            points={[data.start, data.end]}
            color="#FF00FF" // Pinkish color
            lineWidth={0.8}
            transparent
            opacity={0.9}
          />
          {/* Sphere at the end of each line for water wave effect */}
          <mesh 
            position={data.end} 
            ref={(el) => (spheresRef.current[index] = el)}
          >
            <sphereGeometry args={[0.08, 32, 32]} /> {/* Higher resolution for smoother waves */}
            <meshBasicMaterial 
              color="#00FFFF" 
              transparent 
              opacity={0.8}
            />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
};