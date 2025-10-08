// src/components/ConnectingElements.jsx
import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export const ConnectingElements = ({ isVisible, planetPosition, planetScale }) => {
  const lineRef = useRef();
  const iconsGroupRef = useRef();
  const { viewport } = useThree();

  // Define icon data (position relative to line, texture, etc.)
  const iconData = [
    { xOffset: 0.1, yOffset: -0.1, texture: '/model/icon1.png' }, // Replace with actual icon paths
    { xOffset: 0.3, yOffset: 0.05, texture: '/model/icon2.png' },
    { xOffset: 0.5, yOffset: -0.15, texture: '/model/icon3.png' },
  ];

  // Load textures (assuming you have these icon files)
  const [textures, setTextures] = useState([]);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loadedTextures = iconData.map(d => loader.load(d.texture));
    setTextures(loadedTextures);
  }, []);

  useEffect(() => {
    if (!lineRef.current || !iconsGroupRef.current) return;

    if (isVisible) {
      // Animate line
      gsap.to(lineRef.current.geometry.attributes.position.array, {
        endArray: lineRef.current.geometry.attributes.position.array.map((val, i) => {
          if (i % 3 === 0) return val; // x
          if (i % 3 === 1) return val; // y
          if (i % 3 === 2) return val; // z
          return val;
        }),
        duration: 1.5,
        ease: "power3.out",
        onUpdate: () => {
          lineRef.current.geometry.attributes.position.needsUpdate = true;
        }
      });

      // Animate icons from right (with dangling effect)
      gsap.fromTo(iconsGroupRef.current.children, {
        x: viewport.width / 2 + 1, // Start from right outside view
        y: (index) => planetPosition.y + 0.5 - (index * 0.1), // Adjusted y based on planet
        opacity: 0,
        rotationZ: Math.PI / 4, // Initial dangle
      }, {
        x: (i, target) => target.userData.originalX, // Move to original calculated X
        y: (i, target) => target.userData.originalY, // Move to original calculated Y
        opacity: 1,
        rotationZ: 0,
        duration: 1,
        ease: "back.out(1.7)", // Dangling effect
        stagger: 0.2,
        delay: 0.5, // Delay after line starts
      });
    } else {
      // Animate out
      gsap.to([lineRef.current.scale, iconsGroupRef.current.scale], {
        x: 0, y: 0, z: 0,
        duration: 0.6,
        ease: "power2.in",
      });
      gsap.to(iconsGroupRef.current.children, {
        opacity: 0,
        duration: 0.3,
      });
    }
  }, [isVisible, planetPosition, planetScale, viewport]);

  // Create the curved line geometry
  const generateLineGeometry = (startPoint, endPoint, controlPoint) => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z),
      new THREE.Vector3(controlPoint.x, controlPoint.y, controlPoint.z),
      new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z)
    );
    const points = curve.getPoints(50); // Number of segments
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  };

  const lineStart = new THREE.Vector3(planetPosition.x + planetScale * 0.5, planetPosition.y, planetPosition.z); // Start from planet's right side
  const lineEnd = new THREE.Vector3(planetPosition.x - planetScale * 0.5, planetPosition.y + 0.5, planetPosition.z); // End higher on the left
  const lineControl = new THREE.Vector3(planetPosition.x + planetScale * 0.8, planetPosition.y + 1, planetPosition.z); // Control point for the curve

  const lineGeometry = generateLineGeometry(lineStart, lineEnd, lineControl);


  return (
    <>
      {/* Curved Line */}
      <line ref={lineRef}>
        <primitive object={lineGeometry} attach="geometry" />
        <lineBasicMaterial color={0x00ffff} linewidth={2} /> {/* Cyan line */}
      </line>

      {/* Icons */}
      <group ref={iconsGroupRef}>
        {textures.map((texture, index) => {
          // Position icons along the curve, slightly "hanging"
          const pointOnCurve = lineGeometry.attributes.position.array.slice(
            (Math.floor((index / iconData.length) * 50) * 3),
            (Math.floor((index / iconData.length) * 50) * 3) + 3
          );
          const iconX = pointOnCurve[0] + iconData[index].xOffset;
          const iconY = pointOnCurve[1] + iconData[index].yOffset;
          const iconZ = pointOnCurve[2];

          return (
            <mesh
              key={index}
              position={[iconX, iconY, iconZ]}
              scale={[0.3, 0.3, 0.3]}
              userData={{ originalX: iconX, originalY: iconY }} // Store original position for animation
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={texture} transparent />
            </mesh>
          );
        })}
      </group>
    </>
  );
};