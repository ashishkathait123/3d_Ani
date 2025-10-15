import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import "./ImageSlider.css";

export const ImageSlider = ({ slides, scrollerRef }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slidesRef = useRef([]); 
  const animationTimeline = useRef(null);

  const numSlides = slides.length;

  const animateSlide = useCallback((newIndex, direction) => {
    if (newIndex === activeIndex || slidesRef.current.length < numSlides) return;

    const outgoingIndex = activeIndex; 
    const currentSlide = slidesRef.current[outgoingIndex];
    const nextSlide = slidesRef.current[newIndex];
    
    if (!currentSlide || !nextSlide) return;

    if (animationTimeline.current && animationTimeline.current.isActive()) {
      animationTimeline.current.kill();
    }

    // Video animation uses deep perspective:
    // Outgoing slide moves to bottom-right, new slide comes from bottom-right.
    
    const totalSlideWidth = window.innerWidth;
    const totalSlideHeight = window.innerHeight;

    // 💥 CHANGE 4: Exit position is significantly to the bottom right and further back (z)
    const exitX = totalSlideWidth * 0.8;
    const exitY = totalSlideHeight * 0.5;
    const exitZ = -200; // Push back in Z-space

    // 💥 CHANGE 5: Rotation values for the inactive/exiting state (Deep 3D Tilt)
    const inactiveRotateX = -15; // Tilts top edge away
    const inactiveRotateY = 15; // Tilts left edge away
    const inactiveRotateZ = 0; // No Z-axis rotation (flat plane)

    animationTimeline.current = gsap.timeline({
      onComplete: () => {
        // Reset the outgoing slide to the far-off inactive state
        gsap.set(currentSlide, {
          x: exitX, 
          y: exitY,
          z: exitZ, 
          scale: 0.6, 
          rotationX: inactiveRotateX, 
          rotationY: inactiveRotateY,
          rotation: inactiveRotateZ,
          opacity: 0,
          zIndex: 1,
        });
        setActiveIndex(newIndex);
      },
    });

    // 1. Current slide exit (moves out to bottom-right and shrinks/tilts)
    // The active slide moves slightly down and right, and tilts away as it exits.
    animationTimeline.current.to(currentSlide, {
      x: exitX, 
      y: exitY,
      z: exitZ, 
      scale: 0.6, 
      rotationX: inactiveRotateX, 
      rotationY: inactiveRotateY,
      rotation: inactiveRotateZ,
      opacity: 0, 
      zIndex: 1, 
      duration: 1.0, 
      ease: "power4.inOut", // Stronger ease for dramatic feel
    }, 0); 

    // 2. Next slide entry (comes in from bottom-right, expands/straightens)
    animationTimeline.current.fromTo(nextSlide, 
      { 
        x: exitX, 
        y: exitY,
        z: exitZ, 
        scale: 0.6, 
        rotationX: inactiveRotateX, 
        rotationY: inactiveRotateY,
        rotation: inactiveRotateZ,
        opacity: 0, // Start fully transparent
        zIndex: 2, 
      }, 
      {
        x: 0, 
        y: 0,
        z: 0,
        scale: 1, 
        rotationX: 0, 
        rotationY: 0,
        rotation: 0,
        opacity: 1, 
        zIndex: 2, 
        duration: 1.0,
        ease: "power4.inOut",
      }, 0); 
  }, [activeIndex, numSlides, slidesRef]);


  // Navigation Handlers (Carousel style: wrap around) - NO CHANGE
  const nextSlide = useCallback(() => {
    const newIndex = (activeIndex + 1) % numSlides;
    animateSlide(newIndex, 'next');
  }, [activeIndex, numSlides, animateSlide]);

  const prevSlide = useCallback(() => {
    const newIndex = (activeIndex - 1 + numSlides) % numSlides;
    animateSlide(newIndex, 'prev');
  }, [activeIndex, numSlides, animateSlide]);

// --- INITIALIZATION EFFECT ---
  useEffect(() => {
    if (slidesRef.current.length !== numSlides || numSlides === 0) return; 

    const slidesEls = slidesRef.current;
    const totalSlideWidth = window.innerWidth;
    const totalSlideHeight = window.innerHeight;


    // 💥 CHANGE 6: Initial 3D state for all inactive slides
    const inactiveRotateX = -15; 
    const inactiveRotateY = 15; 
    const inactiveRotateZ = 0; 

    const exitX = totalSlideWidth * 0.8;
    const exitY = totalSlideHeight * 0.5;
    const exitZ = -200; 

    // 1. Set all slides off-screen/inactive state
    gsap.set(slidesEls, {
      x: exitX, 
      y: exitY,
      z: exitZ, 
      scale: 0.6, 
      rotationX: inactiveRotateX, 
      rotationY: inactiveRotateY,
      rotation: inactiveRotateZ, 
      opacity: 0,
      zIndex: 1,
      transformOrigin: "center center",
    });
    
    // 2. Set the FIRST slide visible/centered immediately (active state)
    gsap.set(slidesEls[0], {
      x: 0, 
      y: 0,
      z: 0,
      scale: 1, 
      rotationX: 0, 
      rotationY: 0,
      rotation: 0, 
      opacity: 1, 
      zIndex: 2,
    });

  }, [numSlides]); 

// --- SCROLL/SWIPE LISTENER EFFECT & CONTENT UPDATE EFFECT (UNMODIFIED) ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let touchStartX = 0;
    const swipeThreshold = 50; 

    const isAnimating = () => animationTimeline.current && animationTimeline.current.isActive();

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (isAnimating()) return;

      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;

      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < 0) {
          nextSlide();
        } else if (deltaX > 0) {
          prevSlide();
        }
      }
    };

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 10) {
        e.preventDefault(); 
        if (isAnimating()) return;

        if (e.deltaX > 0) {
          nextSlide();
        } else if (e.deltaX < 0) {
          prevSlide();
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      if (animationTimeline.current) {
        animationTimeline.current.kill();
      }
    };
  }, [nextSlide, prevSlide]); 

// --- CONTENT UPDATE EFFECT (UNMODIFIED) ---
  const currentSlide = slides[activeIndex] || {};

  useEffect(() => {
    gsap.fromTo(
      containerRef.current.querySelector(".slide-content"), 
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [activeIndex]);

  return (
    <div className="image-slider-section" ref={containerRef}>
      {/* 1. Content Wrapper (dynamic) */}
      <div className="slide-content-wrapper">
        <div className="slide-content">
          <h3>{currentSlide.title}</h3>
          <div className="meta">
            <div><strong>COMMUNITY</strong><p>{currentSlide.community}</p></div>
            <div><strong>EXPANSION</strong><p>{currentSlide.expansion}</p></div>
          </div>
        </div>
      </div>

      {/* 2. Slide Images (animated by GSAP) */}
      {slides.map((slide, index) => (
        <div 
            className="slide-wrapper" 
            key={index} 
            ref={el => {
                slidesRef.current[index] = el;
            }}
        > 
            <div className="slide"><img src={slide.img} alt={slide.title} /></div>
        </div>
      ))}

      {/* 3. Controls Container (UNMODIFIED) */}
      <div className="controls-container">
        <div className="pagination">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>/
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>

        <div className="nav-buttons">
          <button 
                className="nav-button" 
                aria-label="Previous Slide" 
                onClick={prevSlide}
            >&lt;</button>
          <button 
                className="nav-button" 
                aria-label="Next Slide" 
                onClick={nextSlide}
            >&gt;</button>
        </div>
      </div>
    </div>
  );
};