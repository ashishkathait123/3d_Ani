import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Features data with custom icons ---
const features = [
  {
    id: 1,
    seq: "01",
    title: "Smart Research",
    description:
      "Access on-the-fly research and avoid deep dives. Ved brings you credible, on-demand insights into history, culture, characters, and immersive worlds.",
    position: { x: "18%", y: "60%" },
    icon: "/icons/folder-search.svg",
  },
  {
    id: 2,
    seq: "02",
    title: "Powered by Brainstorming",
    description:
      "Sharpen your ideas and leave writer’s block behind. Share a character, a what if, or even just a feeling and watch it grow into your next great story.",
    position: { x: "50%", y: "79%" },
    icon: "/icons/artificial-intelligence-03.svg",
  },
  {
    id: 3,
    seq: "03",
    title: "Story Formatting",
    description:
      "Create rich, multi-dimensional characters and immersive worlds while instantly formatting your screenplay or comic script to industry-ready standards with AI guidance.",
    position: { x: "82%", y: "61%" },
    icon: "/icons/ai-content-generator-01.svg",
  },
];

const REVEAL_ORDER = [3, 2, 1];

const OrbitLineReveal = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  // Handle resize responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Swipe gestures (mobile only)
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;

    if (Math.abs(deltaX) > 70) {
      if (deltaX < 0 && currentIndex < features.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (deltaX > 0 && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      }
      touchStartX.current = null;
    }
  };

  const orbitPathD = "M 100 20 C 70 80, 30 80, 0 20";
  const lineAnimationDuration = 1.4;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
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
      {/* <AnimatePresence>
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
      </AnimatePresence> */}

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

      {/* --- Desktop: All features visible --- */}
      {!isMobile && (
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
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-6 h-6 object-contain"
                    />
                  </div>

                  <div className="pt-4 mt-[-4px]">
                    <h3 className="text-white text-lg md:text-xl font-semibold w-48 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm w-56 px-2 text-center">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      )}

      {/* --- Mobile: Swipeable Single Feature --- */}
      {isMobile && (
        <AnimatePresence mode="wait">
          <motion.div
            key={features[currentIndex].id}
            className="absolute z-20 flex flex-col items-center text-center px-6"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 175 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-pink-500/50 mb-4">
              <img
                src={features[currentIndex].icon}
                alt={features[currentIndex].title}
                className="w-7 h-7 object-contain"
              />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">
              {features[currentIndex].title}
            </h3>
            <p className="text-gray-400 text-sm max-w-[280px]">
              {features[currentIndex].description}
            </p>

            {/* Swipe indicators */}
            <div className="flex gap-2 mt-6">
              {features.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentIndex ? "bg-pink-500" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default OrbitLineReveal;
