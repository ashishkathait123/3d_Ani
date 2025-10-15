import React, { useState, useEffect, useRef } from 'react';

const features = [
  { id: 1, seq: "01", title: "Smart Research", description: "Access on-the-fly research...", position: { x: '18%', y: '50%' } },
  { id: 2, seq: "02", title: "Powered by Brainstorming", description: "Sharpen your ideas...", position: { x: '50%', y: '60%' } },
  { id: 3, seq: "03", title: "Story Formatting", description: "Create rich, multi-dimensional characters...", position: { x: '82%', y: '50%' } },
];

const REVEAL_ORDER = [3, 2, 1]; // Right -> Center -> Left

const OrbitLineReveal = () => {
  const [lineDrawn, setLineDrawn] = useState(false);
  const [revealedItems, setRevealedItems] = useState([]);
  const containerRef = useRef(null);

  const lineAnimationDuration = 800;
  const itemRevealDelay = 50;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger the animation when section is visible
          const lineDrawTimer = setTimeout(() => {
            setLineDrawn(true);

            REVEAL_ORDER.forEach((id, index) => {
              const featureToReveal = features.find(f => f.id === id);
              if (featureToReveal) {
                setTimeout(() => {
                  setRevealedItems(prev => [...prev, id]);
                }, lineAnimationDuration + index * itemRevealDelay);
              }
            });
          }, 300);

          return () => clearTimeout(lineDrawTimer);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const orbitPathD = "M 100 20 C 75 50, 25 50, 0 20";

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Background planet/glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-auto opacity-20 z-10">
        <div className="w-full aspect-square rounded-full bg-pink-700/50 blur-3xl"></div>
      </div>

      {/* Orbit line */}
      <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={orbitPathD}
          fill="none"
          stroke="#ff0066"
          strokeWidth="0.5"
          style={{
            transition: `stroke-dashoffset ${lineAnimationDuration}ms linear`,
            strokeDasharray: 200,
            strokeDashoffset: lineDrawn ? 0 : 200,
          }}
        />
      </svg>

      {/* Features */}
      {features.map((feature) => {
        const isRevealed = revealedItems.includes(feature.id);
        const revealIndex = REVEAL_ORDER.indexOf(feature.id);
        const finalX = feature.position.x;
        const finalY = feature.position.y;
        const initialX = '95%';
        const initialY = '6%';

        return (
          <div
            key={feature.id}
            className="absolute flex flex-col items-center text-center transition-all duration-900 ease-in-out z-20"
            style={{
              left: isRevealed ? finalX : initialX,
              top: isRevealed ? finalY : initialY,
              transform: isRevealed ? 'translate(-50%, -50%)' : 'translate(0%, 0%)',
              opacity: isRevealed ? 1 : 0,
              transitionDelay: `${lineAnimationDuration + revealIndex * itemRevealDelay}ms`,
              transitionProperty: 'left, top, transform, opacity',
            }}
          >
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center z-30 shadow-lg shadow-pink-500/50">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </div>

            <div className="pt-4 mt-[-4px]">
              <h3 className="text-white text-lg md:text-xl font-semibold w-48 mb-1">{feature.title}</h3>
              <p className={`text-gray-400 text-sm w-56 px-2 ${feature.id === 2 ? 'text-center' : feature.id === 3 ? 'text-right' : 'text-left'}`}>
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}

      <div className="absolute z-30" style={{ top: '68%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <span className="text-white text-sm font-semibold px-4 py-2 bg-pink-600 rounded-full shadow-xl shadow-pink-500/50">
          VED AI - Features
        </span>
      </div>
    </div>
  );
};

export default OrbitLineReveal;
