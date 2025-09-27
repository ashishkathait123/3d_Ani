import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Scene } from "./Scene";
import { NavOverlay } from "./components/NavOverlay";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlidingTabs } from "./components/SlidingTabs";
import { ImageSlider } from "./components/ImageSlider";
import { ScrollIndicators } from "./components/ScrollIndicators";

gsap.registerPlugin(ScrollTrigger);

// Scroll Indicators Component


function App() {
  const scrollContainerRef = useRef(null);
  const [showTabs, setShowTabs] = useState(false);

  const slides = [
    "/model/22.png",
    "/model/11.png",
    "/model/22.png",
    "/model/11.png",
    "/model/22.png",
   
  ];

  useEffect(() => {
    ScrollTrigger.defaults({ scroller: scrollContainerRef.current });
    const scroller = scrollContainerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const top = scroller.scrollTop;
      const vh = window.innerHeight;
      const index = Math.round(top / vh);
      setShowTabs(index === 2); // Adjust index according to SlidingTabs section
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="main-app-container">
      {/* Page Border */}
      <div className="page-border">
        <div className="line top" />
        <div className="line bottom" />
        <div className="line left" />
        <div className="line right" />
        <div className="corner top-left" />
        <div className="corner top-right" />
        <div className="corner bottom-left" />
        <div className="corner bottom-right" />
      </div>

      {/* Fixed Canvas */}
      <div className="canvas-container">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll Indicators */}
      <ScrollIndicators scrollContainerRef={scrollContainerRef} />

      {/* Scrollable Content */}
     <div
  ref={scrollContainerRef}
  className="main-scroll-container h-screen overflow-y-scroll"
>
  <NavOverlay />

  <section className="scroll-section snap-start h-screen flex items-center justify-center">
    <div className="text-content-wrapper overlay-content text-center text-white">
      <h2 className="title-text text-4xl mb-4">
        Welcome to the Universe
      </h2>
      <p className="subtitle-text">
        Scroll to explore different dimensions
      </p>
    </div>
  </section>

  <section className="scroll-section snap-start h-screen flex items-center justify-center">
    <div className="text-content-wrapper overlay-content text-center text-white">
      <h2 className="title-text text-4xl mb-4">
        World’s First AI-Native Studio with Tokenized IP
      </h2>
      <p className="subtitle-text">
        A grand, ever-evolving world where writers, artists, AI, and fans
        create legendary stories together. Turn your ideas into scripts,
        develop rich characters, and bring worlds to life.
      </p>
    </div>
  </section>

  <section className="scroll-section snap-start h-screen flex items-center justify-center">
    <SlidingTabs isVisible={showTabs} />
  </section>

  {/* Slider section: no snap */}
  <section className="scroll-section slider-wrapper h-screen flex items-center justify-center">
    <ImageSlider slides={slides} scrollerRef={scrollContainerRef} />
  </section>
</div>

    </div>
  );
}

export default App;
