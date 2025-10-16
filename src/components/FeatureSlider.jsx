import React, { useState, useMemo, useEffect, useRef } from 'react';

// --- Data for the slides with IMAGE PATHS ---
const features = [
  { id: 1, seq: "01", title: "Direct Creator Access", description: "Connect instantly with a curated network of artists, developers, and writers to jumpstart your project.", visual: { key: "Arch Portal", src: "./F_slide/001.png" } },
  { id: 2, seq: "04", title: "Transparent Revenue", description: "Blockchain-based systems ensure every contribution and revenue share is visible, secure, and equitable.", visual: { key: "Circular Arena", src: "./F_slide/22.png" } },
  { id: 3, seq: "08", title: "Studio-Scale Potential", description: "Scale universes at studio level, with tools, insights, and fan-backed funding.", visual: { key: "Floating Cubes", src: "./F_slide/33.png" } },
  { id: 4, seq: "09", title: "High-Value IPs", description: "Access a curated catalog of characters, worlds, and core narrative concepts for expansion.", visual: { key: "Floating Spheres", src: "./F_slide/44.png" } },
  { id: 5, seq: "12", title: "Next-Gen Asset Library", description: "Utilize a growing collection of 3D models and high-resolution assets ready for any multiverse build.", visual: { key: "Pixel Assets", src: "./F_slide/55.png" } },
  { id: 6, seq: "08", title: "Studio-Scale Potential", description: "Scale universes at studio level, with tools, insights, and fan-backed funding.", visual: { key: "Floating Cubes", src: "./F_slide/11.png" } },
];

// --- Visual Panel Component ---
const VisualPanel = ({ visualSrc, isActive }) => (
  <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 z-0'}`}>
    <img src={visualSrc} alt="Feature Visual" className="w-full h-full object-cover" />
    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-15"></div>
  </div>
);

// --- Feature Card Component ---
const FeatureCard = ({ feature, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 w-full md:w-1/3 p-4 md:p-8 flex flex-col justify-end text-left cursor-pointer transition-all duration-300 ease-out 
      ${isActive ? 'bg-red-900/10' : 'bg-transparent hover:bg-black/20'}`}
    style={{ backdropFilter: isActive ? 'blur(1px)' : 'none' }}
  >
    <div className={`mb-4 h-px w-full transition-all duration-300 ${isActive ? 'bg-white/80' : 'bg-white/30'}`}></div>
    <div className="text-white text-base md:text-[40px] font-light mb-2">{feature.title}</div>
    <div className={`text-sm md:text-base font-light transition-opacity duration-300 ${isActive ? 'opacity-100 text-white/90' : 'opacity-0 h-0 md:h-auto md:opacity-50'}`}>
      {feature.description}
    </div>
  </button>
);

// --- Main Slider Component ---
const FeatureSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = features.length;
  const contentRef = useRef(null);

  // --- Drag / Swipe state ---
  const [dragStartX, setDragStartX] = useState(null);
  const [dragDelta, setDragDelta] = useState(0);

  const goToIndex = (index) => {
    if (index >= 0 && index < totalSlides) setCurrentIndex(index);
  };
  const nextSlide = () => goToIndex((currentIndex + 1) % totalSlides);
  const prevSlide = () => goToIndex((currentIndex - 1 + totalSlides) % totalSlides);

  const translateX = useMemo(() => `-${currentIndex * (100 / 3)}%`, [currentIndex]);

  // --- Keyboard navigation ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') nextSlide();
      else if (event.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // --- Drag/Swipe Handlers ---
  const handlePointerDown = (e) => setDragStartX(e.clientX || e.touches?.[0]?.clientX);
  const handlePointerMove = (e) => {
    if (dragStartX === null) return;
    const currentX = e.clientX || e.touches?.[0]?.clientX;
    setDragDelta(currentX - dragStartX);
  };
  const handlePointerUp = () => {
    if (dragDelta > 50) prevSlide();
    else if (dragDelta < -50) nextSlide();
    setDragStartX(null);
    setDragDelta(0);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Visual Area */}
      <div className="absolute inset-0">
        {features.map((feature, index) => (
          <VisualPanel key={feature.id} visualSrc={feature.visual.src} isActive={index === currentIndex} />
        ))}
      </div>

      {/* Sequence Number */}
      <div className="absolute top-4 left-4 text-white/40 text-sm font-mono z-50">
        SEQ {features[currentIndex].seq}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 min-h-[160px] max-h-[250px] flex z-20">
        <div className="flex w-full h-full border-t border-white/10 relative">
          <div
            ref={contentRef}
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{
              width: `${totalSlides * (100 / 3)}%`,
              transform: `translateX(calc(${translateX} + ${dragDelta}px))`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          >
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} isActive={index === currentIndex} onClick={() => goToIndex(index)} />
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-0 h-full w-10 bg-transparent hover:bg-black/50 transition-colors z-30 flex items-center justify-center"
            aria-label="Previous Feature"
          >
            <span className="text-white/30 hover:text-red-500 transition-colors hidden md:block">&lt;</span>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-0 h-full w-10 bg-transparent hover:bg-black/50 transition-colors z-30 flex items-center justify-center"
            aria-label="Next Feature"
          >
            <span className="text-white/30 hover:text-red-500 transition-colors hidden md:block">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureSlider;
