import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Scene } from "./Scene";
import { NavOverlay } from "./components/NavOverlay";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlidingTabs } from "./components/SlidingTabs";
import { ImageSlider } from "./components/ImageSlider";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const scrollContainerRef = useRef(null);
  const [showTabs, setShowTabs] = useState(false);

  const slides = [
    "/model/22.png",
    "/model/11.png",
    "/model/22.png",
    "/model/11.png",
    "/model/22.png",
    "/model/11.png",
    "/model/22.png",
    "/model/11.png",
  ];

  useEffect(() => {
    ScrollTrigger.defaults({ scroller: scrollContainerRef.current });
    const scroller = scrollContainerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const top = scroller.scrollTop;
      const vh = window.innerHeight;
      const index = Math.round(top / vh);
      setShowTabs(index === 3);
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

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="main-scroll-container h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        <NavOverlay />

        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <div className="text-content-wrapper overlay-content text-center text-white">
            <h2 className="title-text text-4xl mb-4">Welcome to the Universe</h2>
            <p className="subtitle-text">Scroll to explore different dimensions</p>
          </div>
        </section>

        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <div className="text-content-wrapper overlay-content text-center text-white">
            <h2 className="title-text text-4xl mb-4">Creative Playground</h2>
            <p className="subtitle-text">Where ideas become universes</p>
          </div>
        </section>

        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <div className="text-content-wrapper overlay-content text-center text-white">
            <h2 className="title-text text-4xl mb-4">AI-Native Studio</h2>
            <p className="subtitle-text">World's first tokenized IP platform</p>
          </div>
        </section>

        {/* Sliding Tabs */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <SlidingTabs isVisible={showTabs} />
        </section>

        {/* Image Slider */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
<ImageSlider slides={slides} scroller={scrollContainerRef.current} />
        </section>
      </div>
    </div>
  );
}

export default App;
