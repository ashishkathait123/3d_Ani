import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ImageSlider.css";

gsap.registerPlugin(ScrollTrigger);

export const ImageSlider = ({ slides, scrollerRef }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [allSlidesViewed, setAllSlidesViewed] = useState(false);
  const [viewedSlides, setViewedSlides] = useState(new Set([0])); // First slide is already viewed
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    if (!container || !scroller) return;

    const slidesEls = gsap.utils.toArray(".slide");

    // Initial Setup for all slides
    gsap.set(slidesEls, {
      x: "100%",
      y: "100%",
      scale: 0.7,
      rotation: 8,
      opacity: 0,
      zIndex: 1,
      transformOrigin: "bottom right",
    });

    // First slide active
    gsap.set(slidesEls[0], {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      zIndex: 2,
      transformOrigin: "center center",
    });

    // ScrollTrigger Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        scroller,
        start: "top top",
        end: () => `+=${(slidesEls.length - 1) * window.innerHeight}`,
        scrub: 0.8,
        pin: true,
        onUpdate: (self) => {
          const idx = Math.round(self.progress * (slidesEls.length - 1));
          setActiveIndex(idx);
          
          // Track viewed slides
          setViewedSlides(prev => {
            const newSet = new Set(prev);
            newSet.add(idx);
            return newSet;
          });
        },
      },
    });

    scrollTriggerRef.current = tl.scrollTrigger;

    slidesEls.forEach((slide, i) => {
      const next = slidesEls[i + 1];
      if (!next) return;

      const slideLabel = `slide-${i}`;

      // Current slide exit (Bottom-Left)
      tl.to(
        slide,
        {
          x: "-100%",
          y: "100%",
          scale: 0.7,
          rotation: -10,
          opacity: 0,
          zIndex: 1,
          transformOrigin: "bottom left",
          ease: "power2.in",
        },
        slideLabel
      )
        // Next slide entry (Center)
        .to(
          next,
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            zIndex: 2,
            transformOrigin: "center center",
            ease: "power2.out",
          },
          slideLabel
        );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [slides, scrollerRef]);

  // Check if all slides have been viewed
  useEffect(() => {
    if (viewedSlides.size === slides.length) {
      setAllSlidesViewed(true);
    }
  }, [viewedSlides, slides.length]);

  // Block scroll if not all slides viewed
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = (e) => {
      if (!allSlidesViewed && scrollTriggerRef.current) {
        const st = scrollTriggerRef.current;
        const progress = st.progress;
        
        // If user tries to scroll past the slider before viewing all slides
        if (progress >= 0.99 && viewedSlides.size < slides.length) {
          e.preventDefault();
          e.stopPropagation();
          
          // Show visual feedback
          const container = containerRef.current;
          if (container) {
            gsap.to(container, {
              scale: 0.98,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
            });
          }
          
          return false;
        }
      }
    };

    scroller.addEventListener("wheel", handleScroll, { passive: false });
    scroller.addEventListener("touchmove", handleScroll, { passive: false });

    return () => {
      scroller.removeEventListener("wheel", handleScroll);
      scroller.removeEventListener("touchmove", handleScroll);
    };
  }, [allSlidesViewed, scrollerRef, viewedSlides, slides.length]);

  // Manual navigation buttons
  const goToSlide = (direction) => {
    const newIndex = direction === "next" 
      ? Math.min(activeIndex + 1, slides.length - 1)
      : Math.max(activeIndex - 1, 0);
    
    if (scrollTriggerRef.current) {
      const progress = newIndex / (slides.length - 1);
      const scrollPosition = scrollTriggerRef.current.start + 
        (scrollTriggerRef.current.end - scrollTriggerRef.current.start) * progress;
      
      scrollerRef.current.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="image-slider-section" ref={containerRef}>

      {/* Content Wrapper */}
      <div className="slide-content-wrapper">
        <div className="slide-content">
          <h3>Sheshnaag</h3>
          <div className="meta">
            <div>
              <strong>COMMUNITY</strong>
              <p>25K engaged token holders</p>
            </div>
            <div>
              <strong>EXPANSION</strong>
              <p>Comics, books, games, animation, live action pipeline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Images */}
      {slides.map((src, index) => (
        <div className="slide" key={index}>
          <img src={src} alt={`Slide ${index + 1}`} />
        </div>
      ))}

      {/* Controls Container */}
      <div className="controls-container">
        {/* Pagination Counter */}
        <div className="pagination">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>/
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>

        {/* Navigation Buttons */}
        <div className="nav-buttons">
          <button
            className="nav-button"
            aria-label="Previous Slide"
            onClick={() => goToSlide("prev")}
            disabled={activeIndex === 0}
          >
            &lt;
          </button>
          <button
            className="nav-button"
            aria-label="Next Slide"
            onClick={() => goToSlide("next")}
            disabled={activeIndex === slides.length - 1}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};