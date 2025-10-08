// src/components/SlidingTabs.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const SlidingTabs = ({ isVisible }) => {
  const tabRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      gsap.to(tabRef.current, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      });
    } else {
      gsap.to(tabRef.current, {
        x: 200,
        opacity: 0,
        duration: 0.6,
        ease: "power3.in",
      });
    }
  }, [isVisible]);

  return (
    <div
      ref={tabRef}
      className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-end text-white font-semibold opacity-0"
      style={{
        top: "153px",
        height: "95px",
        width: "1370px",
        gap: "31px",
        borderRadius: "12px", // optional
        padding: "0 140px",
        fontSize: "48px",
      }}
    >
      {/* Films */}
      <div className="flex items-center" style={{ marginRight: "120px" }}>
        <img src="/model/image 274.png" alt="Films" className="w-15 h-15 mr-1" />
        <span>Films</span>
      </div>

      {/* Comics */}
      <div className="flex items-center" style={{ marginRight: "60px" }}>
        <img src="/model/image 285.png" alt="Comics" className="w-14 h-14 mr-3" />
        <span>Comics</span>
      </div>

      {/* Games */}
      <div className="flex items-center" style={{ marginRight: "60px" }}>
        <img src="/model/image 285.png" alt="Games" className="w-14 h-14 mr-3" />
        <span>Games</span>
      </div>

      {/* Merchandise */}
      <div className="flex items-center">
        <img src="/model/image 274.png" alt="Merchandise" className="w-15 h-15 mr-1" />
        <span>Merchandise</span>
      </div>
    </div>
  );
};
