// src/components/OrbitalLines.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const OrbitalLine = ({ radius, tilt, speed, color, dashSpeed }) => {
  const lineRef = useRef();
  const materialRef = useRef();

  // Create orbital path
  const points = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      pts.push([x, y, 0]);
    }
    return pts;
  }, [radius]);

  // Animated dash offset for flowing effect
  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.rotation.y += speed;
    }
    if (materialRef.current) {
      materialRef.current.dashOffset -= dashSpeed;
    }
  });

  return (
    <group ref={lineRef} rotation={[tilt, 0, 0]}>
      <Line
        points={points}
        color={color}
        lineWidth={2}
        dashed={true}
        dashScale={50}
        dashSize={0.3}
        dashOffset={0}
        gapSize={0.2}
        transparent
        opacity={1.6}
      >
        <lineDashedMaterial
          ref={materialRef}
          attach="material"
          color={color}
          linewidth={2}
          dashScale={50}
          dashSize={0.3}
          gapSize={0.2}
          transparent
          opacity={1.6}
        />
      </Line>
    </group>
  );
};

const OrbitalNode = ({ position, color }) => {
  const nodeRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
    if (nodeRef.current) {
      nodeRef.current.scale.setScalar(pulse);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(pulse * 1.5);
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Inner core */}
      <mesh ref={nodeRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

export const OrbitalLines = () => {
  const groupRef = useRef();

  // Orbital configurations matching the images
  const orbitals = useMemo(
    () => [
      { radius: 1.3, tilt: 0.3, speed: 0.003, color: "#ffffff", dashSpeed: 0.01 },
      { radius: 1.3, tilt: -0.5, speed: -0.004, color: "#ff6b9d", dashSpeed: 0.015 },
      { radius: 1.3, tilt: 0.7, speed: 0.002, color: "#ffffff", dashSpeed: 0.008 },
      { radius: 1.3, tilt: -0.2, speed: -0.0035, color: "#ff8fa3", dashSpeed: 0.012 },
    ],
    []
  );

  // Node positions (white dots on orbits)
  const nodes = useMemo(
    () => [
      { position: [1.8, 0.8, 0.5], color: "#ffffff" },
      { position: [-1.5, -1.2, 1.0], color: "#ffffff" },
      { position: [2.0, -0.5, -0.8], color: "#ffffff" },
      { position: [-1.0, 1.5, 0.3], color: "#ffffff" },
      { position: [0.8, 0.3, 2.0], color: "#ff6b9d" },
    ],
    []
  );

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbital lines */}
      {orbitals.map((orbit, i) => (
        <OrbitalLine key={`orbit-${i}`} {...orbit} />
      ))}

      {/* Orbital nodes */}
      {nodes.map((node, i) => (
        <OrbitalNode key={`node-${i}`} {...node} />
      ))}

      {/* Additional ambient lighting for the orbital system */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#ff6b9d" distance={5} />
    </group>
  );
};