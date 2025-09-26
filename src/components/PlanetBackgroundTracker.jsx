// src/components/PlanetBackgroundTracker.jsx
import React, { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const PlanetBackgroundTracker = ({ targetRef, domId = "planet-bg-ring" }) => {
  const { camera, size } = useThree();
  const tmpV = new THREE.Vector3();

  useEffect(() => {
    // if the DOM element isn't already in the DOM, create a placeholder
    if (!document.getElementById(domId)) {
      const container = document.querySelector(".canvas-container") || document.body;
      const el = document.createElement("div");
      el.id = domId;
      el.className = "planet-bg-ring"; // so CSS rules apply
      container.appendChild(el);
    }
  }, [domId]);

  useFrame(() => {
    const el = document.getElementById(domId);
    if (!el || !targetRef?.current) return;

    // get world position of the planet group
    targetRef.current.getWorldPosition(tmpV);

    // project to normalized device coordinates (NDC)
    tmpV.project(camera);

    // convert NDC -> screen pixels
    const x = (tmpV.x + 1) / 2 * size.width;
    const y = (-tmpV.y + 1) / 2 * size.height;

    // place DOM element (centered)
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = "translate(-50%,-50%)";

    // scale the ring based on distance (simple heuristic)
    const distance = camera.position.distanceTo(targetRef.current.position || tmpV);
    const scale = Math.max(0.5, 1 / (distance * 0.12)); // tweak constants as needed
    el.style.width = `${Math.round(420 * scale)}px`;
    el.style.height = `${Math.round(420 * scale)}px`;

    // hide if behind camera
    if (tmpV.z > 1 || tmpV.z < -1) {
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    } else {
      el.style.opacity = "1";
    }
  });

  return null;
};
