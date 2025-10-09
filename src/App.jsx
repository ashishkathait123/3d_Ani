import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Scene } from "./Scene";
import { NavOverlay } from "./components/NavOverlay";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlidingTabs } from "./components/SlidingTabs";
import { ImageSlider } from "./components/ImageSlider";
import { ChatSection } from "./components/ChatSection";
import { ScrollIndicators } from "./components/ScrollIndicators";
import MugafiLoading from "./components/MugafiLoading";gsap.registerPlugin(ScrollTrigger);function App() {
  const scrollContainerRef = useRef(null);
  const [showTabs, setShowTabs] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showOrbitalLines, setShowOrbitalLines] = useState(true);  const slides = [
    "/model/22.png",
    "/model/11.png",
    "/model/22.png",
    "/model/11.png",
    "/model/22.png",
  ];  useEffect(() => {
    if (!loadingComplete) return;ScrollTrigger.defaults({ scroller: scrollContainerRef.current });
const scroller = scrollContainerRef.current;
if (!scroller) return;

const handleScroll = () => {
  const top = scroller.scrollTop;
  const vh = window.innerHeight;
  const index = Math.round(top / vh);
  setShowTabs(index === 2);
  
  // Show orbital lines only on first section (index 0)
  setShowOrbitalLines(index === 0);
};

scroller.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", handleScroll);
handleScroll();

return () => {
  scroller.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
};  }, [loadingComplete]);  if (!loadingComplete) {
    return <MugafiLoading onComplete={() => setLoadingComplete(true)} />;
  }  return (
    <div className="main-app-container">
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
      <div className="canvas-container">
  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
    <Suspense fallback={null}>
      <Scene showOrbitalLines={showOrbitalLines} scrollerRef={scrollContainerRef} />
    </Suspense>
  </Canvas>
</div>

  <ScrollIndicators scrollContainerRef={scrollContainerRef} />

  <div
    ref={scrollContainerRef}
    className="main-scroll-container h-screen overflow-y-scroll"
  >
    <NavOverlay />

    <section className="scroll-section snap-start h-screen relative flex items-center justify-center">
      <div
        className="absolute top-[15%] text-center text-white max-w-4xl px-6"
        style={{ transform: "translateY(-10%)" }}
      >
        <h2 className="title-text text-5xl md:text-6xl font-bold mb-2 leading-tight tracking-wide">
          Turn Ideas Into<br />Multi-Format Universes
        </h2>
        <p className="subtitle-text text-base md:text-lg opacity-80 mb-6 tracking-wider">
          Scroll to explore different dimensions
        </p>
        <button className="keep-exploring-btn">KEEP EXPLORING ↓</button>
      </div>
    </section>

    <section className="scroll-section snap-start h-screen flex items-center justify-center">
      <div className="text-content-wrapper overlay-content text-center text-white max-w-3xl px-6">
        <h2 className="title-text text-4xl md:text-5xl font-bold mb-6">
          World's First AI-Native Studio with Tokenized IP
        </h2>
        <p className="subtitle-text text-base md:text-lg opacity-90 leading-relaxed">
          A grand, ever-evolving world where writers, artists, AI, and fans
          create legendary stories together. Turn your ideas into scripts,
          develop rich characters, and bring worlds to life.
        </p>
      </div>
    </section>

    <section className="scroll-section snap-start h-screen flex items-center justify-center">
      <SlidingTabs isVisible={showTabs} />
    </section>

    <section className="scroll-section slider-wrapper h-screen flex items-center justify-center">
      <ImageSlider slides={slides} scrollerRef={scrollContainerRef} />
    </section>

    <section className="scroll-section snap-start h-screen flex items-center justify-center">
      <ChatSection />
    </section>
  </div>
</div>  );
}export default App;

