import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    id: 1,
    seq: "01",
    title: "Smart Research",
    description: "Access on-the-fly research...",
    position: { x: "18%", y: "53%" },
  },
  {
    id: 2,
    seq: "02",
    title: "Powered by Brainstorming",
    description: "Sharpen your ideas...",
    // Slightly lowered to sit below the orbit line
    position: { x: "50%", y: "73%" },
  },
  {
    id: 3,
    seq: "03",
    title: "Story Formatting",
    description: "Create rich, multi-dimensional characters...",
    position: { x: "82%", y: "55%" },
  },
];

const REVEAL_ORDER = [3, 2, 1];

const OrbitLineReveal = () => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const orbitPathD = "M 100 20 C 70 80, 30 80, 0 20"; // keeps the nice smooth curve
  const lineAnimationDuration = 1.4;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* --- Background Glow --- */}
      <motion.div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full max-w-4xl h-auto z-0"
        animate={{ opacity: visible ? 0.25 : 0 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full aspect-square rounded-full bg-pink-700/50 blur-3xl"></div>
      </motion.div>

      {/* --- “VED AI – Features” Label --- */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="ved-ai"
            className="absolute z-10"
            style={{
              top: "48%",
              left: "45%",
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          >
            <span className="text-white text-base font-semibold px-5 py-2 bg-pink-600/90 rounded-full shadow-lg shadow-pink-500/40 backdrop-blur-sm">
              VED AI – Features
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Orbit Line --- */}
      <motion.svg
        className="absolute inset-0 w-full h-full z-[5]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d={orbitPathD}
          fill="none"
          stroke="#ff0066"
          strokeWidth="0.6"
          strokeDasharray="200"
          strokeDashoffset="200"
          animate={visible ? { strokeDashoffset: 0 } : { strokeDashoffset: 200 }}
          transition={{ duration: lineAnimationDuration, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* --- Features --- */}
      <AnimatePresence>
        {visible &&
          features.map((feature) => {
            const delay = (REVEAL_ORDER.indexOf(feature.id) + 1) * 0.3;
            return (
              <motion.div
                key={feature.id}
                className="absolute flex flex-col items-center text-center z-20"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  left: feature.position.x,
                  top: feature.position.y,
                  transform: "translate(-50%, -50%)",
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: delay,
                }}
              >
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-pink-500/50">
                  <div className="w-5 h-5 bg-white rounded-sm"></div>
                </div>

                <div className="pt-4 mt-[-4px]">
                  <h3 className="text-white text-lg md:text-xl font-semibold w-48 mb-1">
                    {feature.title}
                  </h3>
                  <p
                    className={`text-gray-400 text-sm w-56 px-2 ${
                      feature.id === 2
                        ? "text-center"
                        : feature.id === 3
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
};

export default OrbitLineReveal;
