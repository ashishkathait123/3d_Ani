import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const Planet = ({ modelPath = "/model/Planet_1_upd.gltf" }) => {
  const planetRef = useRef();
  const rimGlowRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Basic planet material
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.metalness = 0.5;
      child.material.roughness = 0.4;
      child.material.emissive = new THREE.Color(0x000000); // no inner glow
      child.material.needsUpdate = true;
    }
  });

  useFrame(({ clock }) => {
    if (planetRef.current) planetRef.current.rotation.y += 0.005;

    // subtle animated glow pulse
    if (rimGlowRef.current) {
      rimGlowRef.current.material.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <>
      {/* Planet model */}
      <primitive
        ref={planetRef}
        object={scene}
        scale={[1.5, 1.5, 1.5]}
        position={[0, -0.5, 0]}
      />

      {/* Outer rim glow (Fresnel effect) */}
      <mesh ref={rimGlowRef} position={[0, -0.5, 0]} scale={[1.52, 1.52, 1.52]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={{
            time: { value: 0 },
            color: { value: new THREE.Color(0xff4444) }, // glow color
            intensity: { value: 1.8 },
          }}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vViewDir;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vViewDir = normalize(-mvPosition.xyz);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform vec3 color;
            uniform float intensity;
            varying vec3 vNormal;
            varying vec3 vViewDir;

            void main() {
              float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
              vec3 glow = color * fresnel * intensity;
              gl_FragColor = vec4(glow, fresnel);
            }
          `}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Lighting */}
      <directionalLight
        position={[5, 5, 5]}
        color="yellow"
        intensity={3}
        castShadow
      />
      <ambientLight intensity={0.4} color="yellow" />
    </>
  );
};
