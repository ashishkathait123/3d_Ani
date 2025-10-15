// src/components/OrbitalLines.jsx
import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// Orbital node component (Unchanged)
const OrbitalNode = ({ color }) => {
    const nodeRef = useRef();
    const glowRef = useRef();

    useFrame((state) => {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
        if (nodeRef.current) nodeRef.current.scale.setScalar(pulse);
        if (glowRef.current) glowRef.current.scale.setScalar(pulse * 1.5);
    });

    return (
        <> 
            {/* Outer glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
            {/* Inner core */}
            <mesh ref={nodeRef}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </>
    );
};

// Orbital line component (Unchanged logic for drawing and offsets)
const OrbitalLine = ({ radius, startAngle, endAngle, tilt, speed, color, isNodeLine = true, centerOffset = [0, 0, 0] }) => {
    const lineRef = useRef();
    
    const TOTAL_SEGMENTS = 128;
    const [visiblePoints, setVisiblePoints] = useState(0); 

    // Calculate all points
    const fullPoints = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= TOTAL_SEGMENTS; i++) {
            const angle = startAngle + (i / TOTAL_SEGMENTS) * (endAngle - startAngle);
            
            // Apply radius and offset in the line's local X-Y plane
            const x = Math.cos(angle) * radius + centerOffset[0];
            const y = Math.sin(angle) * radius + centerOffset[1];
            const z = 0 + centerOffset[2]; 
            
            pts.push([x, y, z]);
        }
        return pts;
    }, [radius, startAngle, endAngle, TOTAL_SEGMENTS, centerOffset]);
    
    const displayedPoints = useMemo(() => {
        return fullPoints.slice(0, visiblePoints + 1);
    }, [fullPoints, visiblePoints]);


    // Calculate the local (X, Y, Z) coordinates of the endpoints
    const startPoint = useMemo(() => {
        return fullPoints[0] || [0, 0, 0];
    }, [fullPoints]);

    const endPoint = useMemo(() => {
        return fullPoints[TOTAL_SEGMENTS] || [0, 0, 0];
    }, [fullPoints, TOTAL_SEGMENTS]);

    
    useFrame(() => {
        if (lineRef.current) lineRef.current.rotation.y += speed; 

        // Drawing Animation
        if (visiblePoints < TOTAL_SEGMENTS) {
            const speedFactor = TOTAL_SEGMENTS / (1.5 * 60); 
            setVisiblePoints(prev => Math.min(TOTAL_SEGMENTS, prev + speedFactor * 1.5));
        }
    });
    
    // HACK: Use a useEffect to show the end nodes only once the line is fully drawn.
    const [showNodes, setShowNodes] = useState(false);
    useEffect(() => {
        if (visiblePoints >= TOTAL_SEGMENTS) {
            const timer = setTimeout(() => setShowNodes(true), 150);
            return () => clearTimeout(timer);
        }
    }, [visiblePoints]);


    if (displayedPoints.length < 2) return null;


    return (
        <group ref={lineRef} rotation={[tilt, 0, 0]}> 
            <Line
                points={displayedPoints}
                color={color}
                lineWidth={1.5}
                dashed={false} 
                transparent
                opacity={0.8}
            >
                <lineBasicMaterial 
                    attach="material"
                    color={color}
                    linewidth={1.5}
                    transparent
                    opacity={0.8}
                />
            </Line>
            
            {/* RENDER NODES */}
            {isNodeLine && (
                <>
                    {/* Start Node (Always visible for drawing effect) */}
                    <group position={startPoint}>
                        <OrbitalNode color={color} />
                    </group>
                    
                    {/* End Node (Visible only when line is drawn) */}
                    {showNodes && (
                        <group position={endPoint}>
                            <OrbitalNode color={color} />
                        </group>
                    )}
                </>
            )}
        </group>
    );
};


// Main OrbitalLines component
export const OrbitalLines = ({ showLines }) => {
    const groupRef = useRef();
    
    // Radii for separation (gaps)
    const R1 = 0.85; 
    const R2 = 1; 
    const R3 = 1.65; 
    const R4 = 1.75;
    const R5 = 2;
    const R6 = 2.35;

    const orbitals = useMemo(
        () => [
            // Line 1: Inner Arc - Short Arc (less than semicircle)
            { 
                radius: R1, 
                tilt: -0.7, 
                speed: 0, 
                color: "#ffffff", 
                startAngle: Math.PI * 0.1, 
                endAngle: Math.PI * 0.9, // Short arc (0.6 * PI)
                isNodeLine: true,
                centerOffset: [-0.15, -0, -0.1] 
            },
            
            // Line 2: Middle Arc - Full Semicircle (PI)
            { 
                radius: R1, 
                tilt: -1, 
                speed: 0, 
                color: "#ffffff", 
                startAngle: Math.PI * 0.1, 
                endAngle: Math.PI * 0.8,// Exactly a semicircle (1.0 * PI)
                isNodeLine: true,
                centerOffset: [0.05, -0.4, 0.08] 
            },

            // Line 3: Outer Arc - Short Arc, different side, minimal tilt
            { 
                radius: R3, 
                tilt: 2, 
                speed: 0, 
                color: "#ffffff", 
                startAngle: Math.PI * 1.05, 
                endAngle: Math.PI * 1.3, // Short arc (0.6 * PI)
                isNodeLine: true,
                centerOffset: [1.06, 1, 0.1] 
            },

            // --- THREE NEW ARCS (Half of Semicircle or less) ---

            // New Line 4 (R4): Shortest Arc, steep tilt, distinct color
            { 
                radius: R4, 
                tilt: 0.8, 
                speed: 0, 
                color: "#ffe5b4", // Light yellow/orange
                startAngle: Math.PI * 1.5, 
                endAngle: Math.PI * 1.75, // Very short arc (0.25 * PI)
                isNodeLine: true,
                centerOffset: [-0.25, -0.25, 0.05] 
            },
            
            // New Line 5 (R5): Arc spanning the top (0.5 * PI arc)
            { 
                radius: R5, 
                tilt: -0.2, 
                speed: 0, 
                color: "#c3e6f9", // Light blue
                startAngle: Math.PI * 0.30, 
                endAngle: Math.PI * 0.70, // Half of a semicircle (0.5 * PI)
                isNodeLine: true,
                centerOffset: [0.0, -2, 0.1] 
            },
            
            // New Line 6 (R6): Full Semicircle, large radius
           
        ],
        []
    );

    useFrame(() => {
        // Subtle global rotation
        if (groupRef.current && showLines) {
            groupRef.current.rotation.y += 0.0001; 
        }
    });

    if (!showLines) return null;

    return (
        // Adjusted group position for a better overall view.
        <group ref={groupRef} position={[0, -0.4, 1.4]}> 
            {orbitals.map((orbit, i) => (
                <OrbitalLine key={`orbit-${i}`} {...orbit} />
            ))}
            
            {/* Main lighting source, matching the glow of the central sphere */}
            <pointLight position={[0, 0, 0]} intensity={0.8} color="#ff6b9d" distance={5} />
            
            {/* Added a subtle white light in the center for a brighter core glow, similar to the image */}
            <pointLight position={[0, 0, 0]} intensity={0.2} color="#ffffff" distance={1.5} />
        </group>
    );
};