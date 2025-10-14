import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ImageSlider.css";

gsap.registerPlugin(ScrollTrigger);

export const ImageSlider = ({ slides, scrollerRef }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    if (!container || !scroller || slides.length === 0) return; // Added slides check

    const slidesEls = gsap.utils.toArray(container.querySelectorAll(".slide")); // Targeted query

    // 1. Inactive slides setup
    gsap.set(slidesEls, {
      x: "100%", y: "100%", scale: 0.7, rotation: 8, opacity: 0, zIndex: 1, transformOrigin: "bottom right",
    });

    // 2. First slide setup (centered)
    gsap.set(slidesEls[0], {
      x: 0, y: 0, scale: 1, rotation: 8, opacity: 1, zIndex: 2, transformOrigin: "center center",
    });

    // 3. ScrollTrigger Timeline (The Hijack)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        scroller,
        start: "top top",
        end: () => `+=${(slidesEls.length - 1) * window.innerHeight}`, 
        scrub: 0.8,
        pin: true, 
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.round(self.progress * (slidesEls.length - 1));
          setActiveIndex(idx);
        },
      },
    });

    slidesEls.forEach((slide, i) => {
      const next = slidesEls[i + 1];
      if (!next) return;

      const slideLabel = `slide-${i}`;

      // A) Current slide exit
    tl.to(slide, {
  x: "100%", 
  y: "0%", 
  scale: 0.8,   // slightly smaller
  rotation: 5,  // subtle rotation
  opacity: 0, 
  zIndex: 1, 
  transformOrigin: "bottom left",
  ease: "power2.in",
}, slideLabel)

      // B) Next slide entry
        .to(next, {
  x: 0, 
  y: 0, 
  scale: 1, 
  rotation: 0,
  opacity: 1, 
  zIndex: 2, 
  transformOrigin: "center center",
  ease: "power2.out",
}, slideLabel);
    });

    return () => {
      // ✅ CORRECT CLEANUP: Only kill the trigger created by this timeline
      if (tl.scrollTrigger) {
          tl.scrollTrigger.kill(); 
      }
    };
  }, [slides, scrollerRef]);

  // Content update logic (keep as is)
  const currentSlide = slides[activeIndex] || {};

  useEffect(() => {
    gsap.fromTo(
      ".slide-content",
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
        <div className="slide" key={index}><img src={slide.img} alt={slide.title} /></div>
      ))}

      {/* 3. Controls Container (keep as is) */}
      <div className="controls-container">
        <div className="pagination">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>/
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>

        <div className="nav-buttons">
          <button className="nav-button" aria-label="Previous Slide">&lt;</button>
          <button className="nav-button" aria-label="Next Slide">&gt;</button>
        </div>
      </div>
    </div>
  );
};