// ImageSlider.jsx

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import "./ImageSlider.css";

// 💡 RECOMMENDED: Define your slide data here (or import from a separate file).
const SLIDE_DATA = [
    { 
        title: "Kuberraa", 
        community: "50K engaged token holders", 
        expansion: "Live-actions films spinoff shows pipeline", 
        img: "/assets/images/kuberraa.jpg" 
    },
    { 
        title: "QUANTUM HEIST", 
        community: "CINEVERSE", 
        expansion: "VOL. 2", 
        img: "/assets/images/quantum-heist.jpg" 
    },
    // ... add more slides
];

export const ImageSlider = ({ slides = SLIDE_DATA, scrollerRef }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slidesRef = useRef([]); 
  const animationTimeline = useRef(null);

  const numSlides = slides.length;
  
  // -------------------- GSAP PARAMETERS (ADJUSTED FOR DESIRED TILT) --------------------
  // Tilt for inactive/exiting slides (deep perspective, moving away)
  const INACTIVE_ROTATE_X = -15; // Tilts top edge away
  const INACTIVE_ROTATE_Y =15; // Tilts left edge away
  const INACTIVE_Z = -200; 
  
  // 💥 CRITICAL CHANGE: Tilt for the *ACTIVE* slide to match the screenshot
  // - ACTIVE_ROTATE_X: A small negative value tilts the top edge slightly away,
  //                    making the bottom edge come forward.
  // - ACTIVE_ROTATE_Y: A positive value tilts the right edge further away from the viewer.
  const ACTIVE_ROTATE_X = 0;  // Tilts top edge slightly away from viewer (bottom towards)
  const ACTIVE_ROTATE_Y = -10; // Tilts right edge away from viewer (left edge towards)
  const ACTIVE_Z = 0; 

  // -------------------- ANIMATE FUNCTION (Unchanged logic, uses new constants) --------------------
  const animateSlide = useCallback((newIndex, direction) => {
    if (newIndex === activeIndex || slidesRef.current.length < numSlides) return;

    const outgoingIndex = activeIndex; 
    const currentSlide = slidesRef.current[outgoingIndex];
    const nextSlide = slidesRef.current[newIndex];
    
    if (!currentSlide || !nextSlide) return;

    if (animationTimeline.current && animationTimeline.current.isActive()) {
      animationTimeline.current.kill();
    }

    const totalSlideWidth = window.innerWidth;
    const totalSlideHeight = window.innerHeight;
    const exitX = totalSlideWidth * 0.8;
    const exitY = totalSlideHeight * 0.5;

    animationTimeline.current = gsap.timeline({
      onComplete: () => {
        gsap.set(currentSlide, {
          x: exitX, y: exitY, z: INACTIVE_Z, 
          scale: 0.6, rotationX: INACTIVE_ROTATE_X, rotationY: INACTIVE_ROTATE_Y, rotation: 0,
          opacity: 0, zIndex: 1,
        });
        setActiveIndex(newIndex);
      },
    });

    animationTimeline.current.to(currentSlide, {
      x: exitX, y: exitY, z: INACTIVE_Z, 
      scale: 0.6, rotationX: INACTIVE_ROTATE_X, rotationY: INACTIVE_ROTATE_Y, rotation: 0,
      opacity: 0, zIndex: 1, 
      duration: 1.0, ease: "power4.inOut",
    }, 0); 

    animationTimeline.current.fromTo(nextSlide, 
      { 
        x: exitX, y: exitY, z: INACTIVE_Z, 
        scale: 0.6, rotationX: INACTIVE_ROTATE_X, rotationY: INACTIVE_ROTATE_Y, rotation: 0,
        opacity: 0, zIndex: 2, 
      }, 
      {
        x: 0, y: 0, z: ACTIVE_Z,
        scale: 1, rotationX: ACTIVE_ROTATE_X, rotationY: ACTIVE_ROTATE_Y, rotation: 0,
        opacity: 1, zIndex: 2, 
        duration: 1.0, ease: "power4.inOut",
      }, 0); 
  }, [activeIndex, numSlides, slidesRef]);


  // Navigation Handlers (Unmodified)
  const nextSlide = useCallback(() => {
    const newIndex = (activeIndex + 1) % numSlides;
    animateSlide(newIndex, 'next');
  }, [activeIndex, numSlides, animateSlide]);

  const prevSlide = useCallback(() => {
    const newIndex = (activeIndex - 1 + numSlides) % numSlides;
    animateSlide(newIndex, 'prev');
  }, [activeIndex, numSlides, animateSlide]);

// --- INITIALIZATION EFFECT (Updated with new Active Tilt constants) ---
  useEffect(() => {
    if (slidesRef.current.length !== numSlides || numSlides === 0) return; 

    const slidesEls = slidesRef.current;
    const totalSlideWidth = window.innerWidth;
    const totalSlideHeight = window.innerHeight;

    const exitX = totalSlideWidth * 0.8;
    const exitY = totalSlideHeight * 0.5;

    gsap.set(slidesEls, {
      x: exitX, y: exitY, z: INACTIVE_Z, 
      scale: 0.6, rotationX: INACTIVE_ROTATE_X, rotationY: INACTIVE_ROTATE_Y, rotation: 0, 
      opacity: 0, zIndex: 1,
      transformOrigin: "center center",
    });
    
    gsap.set(slidesEls[0], {
      x: 0, y: 0, z: ACTIVE_Z,
      scale: 1, rotationX: ACTIVE_ROTATE_X, rotationY: ACTIVE_ROTATE_Y, rotation: 0, 
      opacity: 1, zIndex: 2,
    });

  }, [numSlides]); 

// --- SCROLL/SWIPE LISTENER EFFECT & CONTENT UPDATE EFFECT (Unmodified) ---
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

      {/* 3. Controls Container */}
      <div className="controls-container">
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
        <div className="pagination">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>/
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
};