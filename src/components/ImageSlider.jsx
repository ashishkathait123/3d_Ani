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
    if (!container || !scroller) return;

    const slidesEls = gsap.utils.toArray(".slide");

    // 1. Next/Inactive Slides की Initial Setups (Right-Bottom Position)
    gsap.set(slidesEls, {
      x: "100%", // Viewport के 100% दाईं ओर
      y: "100%", // Viewport के 100% नीचे की ओर
      scale: 0.7, 
      rotation: 8, // नीचे-दाएँ से आने वाला tilt
      opacity: 0, 
      zIndex: 1, 
      transformOrigin: "bottom right", // रोटेशन का केंद्र नीचे-दाएँ कोने पर
    });

    // 2. Active Slide (First Slide) की Setups
    gsap.set(slidesEls[0], {
      x: 0, // Center में
      y: 0, // Center में
      scale: 1,
      rotation: 0,
      opacity: 1,
      zIndex: 2, 
      transformOrigin: "center center", 
    });

    // 3. ScrollTrigger Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        scroller,
        start: "top top",
        // हर स्लाइड के लिए एक full viewport scroll distance चाहिए
        end: () => `+=${(slidesEls.length - 1) * window.innerHeight}`,
        scrub: 0.8, 
        pin: true,
        // Active Index Update करना
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
      
      // A) Current Slide बाहर जा रही है (Bottom-Left Exit)
      tl.to(slide, {
        x: "-100%", // बाईं ओर ले जाएँ
        y: "100%", // नीचे की ओर ले जाएँ
        scale: 0.7,
        rotation: -10, // नीचे-बाएँ की ओर मुड़ना
        opacity: 0,
        zIndex: 1, // पीछे भेज दें
        transformOrigin: "bottom left", 
        ease: "power2.in", 
      }, slideLabel) 
      
      // B) Next Slide अंदर आ रही है (Center Entry)
      .to(
        next,
        {
          x: 0, // Center में
          y: 0, // Center में
          scale: 1,
          rotation: 0,
          opacity: 1,
          zIndex: 2, // सामने ले आएँ
          transformOrigin: "center center", 
          ease: "power2.out", 
        },
        slideLabel // Previous animation के साथ ही शुरू करें
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [slides, scrollerRef]);

  return (
   <div className="image-slider-section" ref={containerRef}>
      
      {/* Active slide data fetch. यह JSX loop के बाहर है। */}
      {/* Note: आपको यह सुनिश्चित करना होगा कि 'slides' array में title, community, और expansion fields हों। */}
      {/* यदि slides array केवल strings (URLs) है, तो इन values को hardcode ही रखना होगा। */}
      {/* मैं मान रहा हूँ कि आपने currentSlide data को useEffect के बाहर fetch किया है: */}
      {/* const currentSlide = slides[activeIndex] || {}; */}
      
      {/* 1. Content Wrapper (Left Aligned) */}
      <div className="slide-content-wrapper">
        <div className="slide-content">
          {/* यहाँ title को dynamic या hardcoded use करें */}
          <h3>{"Sheshnaag"}</h3> 
          <div className="meta">
            <div>
              <strong>COMMUNITY</strong>
              <p>{"25K engaged token holders"}</p>
            </div>
            <div>
              <strong>EXPANSION</strong>
              <p>{"Comics, books, games, animation, live action pipeline"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Slide Images (Right-Center Aligned) - यह GSAP द्वारा animated होता है */}
      {slides.map((src, index) => (
        <div className="slide" key={index}>
          <img src={src} alt={`Slide ${index}`} /> 
        </div>
      ))}
      
      {/* 3. Controls Container (Pagination & Buttons) - Left/Bottom Positioned */}
      <div className="controls-container">
        {/* Pagination Counter */}
        <div className="pagination">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>/
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
        
        {/* Navigation Buttons (Image के अनुसार) */}
        <div className="nav-buttons">
            <button className="nav-button" aria-label="Previous Slide">
                &lt;
            </button>
            <button className="nav-button" aria-label="Next Slide">
                &gt;
            </button>
        </div>
      </div>
    </div>
  );
};