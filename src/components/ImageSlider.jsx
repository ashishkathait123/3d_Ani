import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const ImageSlider = ({ slides, scroller }) => {
  const sliderRef = useRef(null);
  const slideRefs = useRef([]);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, slides.length);
    if (!sliderRef.current) return;

    const slideCount = slides.length;
    const viewportHeight = window.innerHeight;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sliderRef.current,
        start: "top top",
        end: `+=${viewportHeight * slideCount}`,
        pin: true,
        scrub: true,
        scroller: scroller || window,
      },
    });

    slideRefs.current.forEach((slide, i) => {
      if (!slide) return; // safeguard

      const start = i / slideCount;
      const end = (i + 1) / slideCount;

      // Slide enters
      tl.fromTo(
        slide,
        { x: 500, y: 500, scale: 0.6, opacity: 0 },
        { x: 0, y: 0, scale: 1, opacity: 1, ease: "none" },
        start
      );

      // Slide moves behind next slide
      if (i < slideCount - 1) {
        tl.to(
          slide,
          { x: -100, y: -100, scale: 0.8, opacity: 0.4, ease: "none" },
          end
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      tl.kill();
    };
  }, [slides, scroller]);

  return (
    <div
      ref={sliderRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {slides.map((src, i) => (
        <div
          key={i}
          ref={(el) => (slideRefs.current[i] = el)}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "850px",
            height: "70vh",
            maxHeight: "700px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            opacity: 0,
            zIndex: slides.length - i,
          }}
        >
          <img
            src={src}
            alt={`slide-${i}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
};
