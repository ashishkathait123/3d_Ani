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
      <div className="flex items-center" style={{ marginRight: "15px" }}>
        <img src="/model/image 274.png" alt="Films" className="w-8 h-8 mr-2" />
        <span>Films</span>
      </div>

      {/* Comics */}
      <div className="flex items-center" style={{ marginRight: "15px" }}>
        <img src="/model/image 274.png" alt="Comics" className="w-8 h-8 mr-2" />
        <span>Comics</span>
      </div>

      {/* Games */}
      <div className="flex items-center" style={{ marginRight: "15px" }}>
        <img src="/model/image 274.png" alt="Games" className="w-8 h-8 mr-2" />
        <span>Games</span>
      </div>

      {/* Merchandise */}
      <div className="flex items-center" style={{ marginRight: "15px" }}>
        <img src="/model/image 285.png" alt="Merchandise" className="w-8 h-8 mr-2" />
        <span>Merchandise</span>
      </div>
    </div>
  );
};
