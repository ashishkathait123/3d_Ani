import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import "./ImageSlider.css";

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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const slidesRef = useRef([]); 
  const animationTimeline = useRef(null);

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const numSlides = slides.length;
  
  // Responsive animation parameters
  const getAnimationParams = () => {
    if (isMobile) {
      return {
        inactiveRotateX: -12,
        inactiveRotateY: 12,
        inactiveZ: -150,
        activeRotateX: 0,
        activeRotateY: -8,
        activeZ: 0,
        exitX: window.innerWidth * 0.7,
        exitY: window.innerHeight * 0.5
      };
    } else if (isTablet) {
      return {
        inactiveRotateX: -14,
        inactiveRotateY: 14,
        inactiveZ: -180,
        activeRotateX: 0,
        activeRotateY: -9,
        activeZ: 0,
        exitX: window.innerWidth * 0.75,
        exitY: window.innerHeight * 0.5
      };
    }
    return {
      inactiveRotateX: -15,
      inactiveRotateY: 15,
      inactiveZ: -200,
      activeRotateX: 0,
      activeRotateY: -10,
      activeZ: 0,
      exitX: window.innerWidth * 0.8,
      exitY: window.innerHeight * 0.5
    };
  };

  const animateSlide = useCallback((newIndex, direction) => {
    if (newIndex === activeIndex || slidesRef.current.length < numSlides) return;

    const params = getAnimationParams();
    const outgoingIndex = activeIndex; 
    const currentSlide = slidesRef.current[outgoingIndex];
    const nextSlide = slidesRef.current[newIndex];
    
    if (!currentSlide || !nextSlide) return;

    if (animationTimeline.current && animationTimeline.current.isActive()) {
      animationTimeline.current.kill();
    }

    animationTimeline.current = gsap.timeline({
      onComplete: () => {
        gsap.set(currentSlide, {
          x: params.exitX, y: params.exitY, z: params.inactiveZ, 
          scale: isMobile ? 0.5 : 0.6, 
          rotationX: params.inactiveRotateX, 
          rotationY: params.inactiveRotateY, 
          rotation: 0,
          opacity: 0, zIndex: 1,
        });
        setActiveIndex(newIndex);
      },
    });

    animationTimeline.current.to(currentSlide, {
      x: params.exitX, y: params.exitY, z: params.inactiveZ, 
      scale: isMobile ? 0.5 : 0.6, 
      rotationX: params.inactiveRotateX, 
      rotationY: params.inactiveRotateY, 
      rotation: 0,
      opacity: 0, zIndex: 1, 
      duration: isMobile ? 0.8 : 1.0, 
      ease: "power4.inOut",
    }, 0); 

    animationTimeline.current.fromTo(nextSlide, 
      { 
        x: params.exitX, y: params.exitY, z: params.inactiveZ, 
        scale: isMobile ? 0.5 : 0.6, 
        rotationX: params.inactiveRotateX, 
        rotationY: params.inactiveRotateY, 
        rotation: 0,
        opacity: 0, zIndex: 2, 
      }, 
      {
        x: 0, y: 0, z: params.activeZ,
        scale: 1, 
        rotationX: params.activeRotateX, 
        rotationY: params.activeRotateY, 
        rotation: 0,
        opacity: 1, zIndex: 2, 
        duration: isMobile ? 0.8 : 1.0, 
        ease: "power4.inOut",
      }, 0); 
  }, [activeIndex, numSlides, slidesRef, isMobile]);

  const nextSlide = useCallback(() => {
    const newIndex = (activeIndex + 1) % numSlides;
    animateSlide(newIndex, 'next');
  }, [activeIndex, numSlides, animateSlide]);

  const prevSlide = useCallback(() => {
    const newIndex = (activeIndex - 1 + numSlides) % numSlides;
    animateSlide(newIndex, 'prev');
  }, [activeIndex, numSlides, animateSlide]);

  useEffect(() => {
    if (slidesRef.current.length !== numSlides || numSlides === 0) return; 

    const params = getAnimationParams();
    const slidesEls = slidesRef.current;

    gsap.set(slidesEls, {
      x: params.exitX, y: params.exitY, z: params.inactiveZ, 
      scale: isMobile ? 0.5 : 0.6, 
      rotationX: params.inactiveRotateX, 
      rotationY: params.inactiveRotateY, 
      rotation: 0, 
      opacity: 0, zIndex: 1,
      transformOrigin: "center center",
    });
    
    gsap.set(slidesEls[0], {
      x: 0, y: 0, z: params.activeZ,
      scale: 1, 
      rotationX: params.activeRotateX, 
      rotationY: params.activeRotateY, 
      rotation: 0, 
      opacity: 1, zIndex: 2,
    });

  }, [numSlides, isMobile]); 

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let touchStartX = 0;
    const swipeThreshold = isMobile ? 30 : 50; 

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
  }, [nextSlide, prevSlide, isMobile]); 

  const currentSlide = slides[activeIndex] || {};

  useEffect(() => {
    gsap.fromTo(
      containerRef.current?.querySelector(".slide-content"), 
      { autoAlpha: 0, y: isMobile ? 20 : 30 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [activeIndex, isMobile]);

  return (
    <div className={`image-slider-section ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`} ref={containerRef}>
      {/* Content Wrapper */}
      <div className="slide-content-wrapper">
        <div className="slide-content">
          <h3 className="slide-title">{currentSlide.title}</h3>
          <div className="meta">
            <div className="meta-item">
              <strong>COMMUNITY</strong>
              <p>{currentSlide.community}</p>
            </div>
            <div className="meta-item">
              <strong>EXPANSION</strong>
              <p>{currentSlide.expansion}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Images */}
      {slides.map((slide, index) => (
        <div 
            className="slide-wrapper" 
            key={index} 
            ref={el => {
                slidesRef.current[index] = el;
            }}
        > 
            <div className="slide">
              <img src={slide.img} alt={slide.title} />
            </div>
        </div>
      ))}

      {/* Controls Container */}
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
          <span className="current-index">{String(activeIndex + 1).padStart(2, "0")}</span>/
          <span className="total-slides">{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
};