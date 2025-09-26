import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

const WaterWave = ({ position, delay }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      gsap.fromTo(meshRef.current.scale, 
        { x: 0, y: 0, z: 0 },
        { 
          x: 1, 
          y: 1, 
          z: 1, 
          duration: 1.5, 
          delay: delay,
          ease: "back.out(1.7)" 
        }
      );
      
      gsap.to(meshRef.current.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 2,
        delay: delay + 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
  }, [delay]);

  return (
    <Sphere ref={meshRef} args={[0.08, 16, 16]} position={position}>
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.8} />
    </Sphere>
  );
};

export const DittoLines = () => {
  const groupRef = useRef();

  const linePoints = [
    { start: [0, 0, 0], end: [2, 1.5, 0], wavePos: [2.2, 1.65, 0] },
    { start: [0, 0, 0], end: [-2, 1.2, 0], wavePos: [-2.2, 1.35, 0] },
    { start: [0, 0, 0], end: [1.8, -1.3, 0], wavePos: [2, -1.45, 0] },
    { start: [0, 0, 0], end: [-1.5, -1.5, 0], wavePos: [-1.7, -1.65, 0] },
    { start: [0, 0, 0], end: [0, 2, 0], wavePos: [0, 2.2, 0] },
  ];

  useEffect(() => {
    if (groupRef.current) {
      gsap.fromTo(groupRef.current.children, 
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1,
          duration: 1.5, 
          stagger: 0.2,
          ease: "power2.out" 
        }
      );
    }
  }, []);

  return (
    <group ref={groupRef}>
      {linePoints.map((line, index) => (
        <group key={index}>
          <Line
            points={[line.start, line.end]}
            color="#ffffff"
            lineWidth={2}
            transparent
            opacity={0.6}
          />
          <WaterWave position={line.wavePos} delay={index * 0.3} />
        </group>
      ))}
    </group>
  );
};