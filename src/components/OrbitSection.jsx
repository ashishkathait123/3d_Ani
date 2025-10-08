import React, { useEffect } from "react";
import gsap from "gsap";

export const OrbitSection = () => {
  useEffect(() => {
    const orbitPath = document.querySelector("#orbitPath");
    if (!orbitPath) return; // Safety check
    
    const length = orbitPath.getTotalLength();

    // Hide arc at start
    gsap.set(orbitPath, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // Draw arc like hand sketch
    gsap.to(orbitPath, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
    });

    // Position icons along arc
    const icons = document.querySelectorAll(".orbit-item");
    icons.forEach((icon, i) => {
      const point = orbitPath.getPointAtLength((length / (icons.length + 1)) * (i + 1));
      gsap.set(icon, {
        x: point.x,
        y: point.y,
        xPercent: -50,
        yPercent: 20, 
      });
    });

    // Animate icons in after line is drawn
    gsap.fromTo(
      ".orbit-item",
      { autoAlpha: 0, scale: 0.5 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.4,
        delay: 2,
        ease: "back.out(1.7)",
      }
    );
  }, []);

  // IMPORTANT: The added 'scroll-section' class ensures Scene.jsx tracks this section for Step 5
  return (
    <section className="scroll-section h-screen flex items-center justify-center relative text-white section-4">
      {/* SVG Arc */}
      <svg
        className="absolute top-1/4 left-0 w-full h-1/2"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
      >
        <path
          id="orbitPath"
          d="M100,0 Q50,50 0,0"
          stroke="#ff4b6e"
          strokeWidth="2"
          fill="transparent"
        />
      </svg>

      {/* Icons positioned along path */}
      <div className="absolute top-1/4 left-0 w-full h-1/2 pointer-events-none">
        <div className="orbit-item absolute flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-xl">
            📁
          </div>
          <p className="mt-2 text-xs">Organize your ideas</p>
        </div>

        <div className="orbit-item absolute flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-xl">
            ✍️
          </div>
          <p className="mt-2 text-xs">Write seamlessly</p>
        </div>

        <div className="orbit-item absolute flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-xl">
            🚀
          </div>
          <p className="mt-2 text-xs">Launch your story</p>
        </div>
      </div>
    </section>
  );
};