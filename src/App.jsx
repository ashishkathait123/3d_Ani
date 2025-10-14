import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Scene } from "./Scene";
import { NavOverlay } from "./components/NavOverlay";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlidingTabs } from "./components/SlidingTabs";
import { ScrollIndicators } from "./components/ScrollIndicators";
import CharacterSlider from "./components/CharacterSlider";
import LoaderAndIntro from "./components/LoaderAndIntro";
import SlidingTabSection from "./components/SlidingTabSection";
import FeatureSlider from "./components/FeatureSlider";
import HeroSection2 from "./components/HeroSection2";
import WelcomeSection from "./components/WelcomeSection";
import Footer from "./components/Footer";
import CallToActionSection from "./components/CallToActionSection";
import { ImageSlider } from "./components/ImageSlider";
import Evolve from "./components/Evolve";
import HeroPartnerSection from "./components/HeroPartnerSection";
import ArchDoorwayWrapper from "./components/ArchDoorwayWrapper";
gsap.registerPlugin(ScrollTrigger);

function App() {
  const scrollContainerRef = useRef(null);
  const [showTabs, setShowTabs] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showOrbitalLines, setShowOrbitalLines] = useState(true);
  const [showFooter, setShowFooter] = useState(false); // 👈 NEW STATE

  const slides = [
  { img: "/model/22.png", title: "Dream Architect", community: "Writers Guild", expansion: "Vol. 1" },
  { img: "/model/11.png", title: "Quantum Heist", community: "Cineverse", expansion: "Vol. 2" },
  { img: "/model/22.png", title: "Neon Samurai", community: "Future Fables", expansion: "Vol. 3" },
  { img: "/model/11.png", title: "Echo Protocol", community: "AI Chronicles", expansion: "Vol. 4" },
  { img: "/model/22.png", title: "Starborn", community: "Mythos Legion", expansion: "Vol. 5" },
];

  useEffect(() => {
    if (!loadingComplete) return;

    const scroller = scrollContainerRef.current;
    if (!scroller) return;

    ScrollTrigger.defaults({ scroller });

    const handleScroll = () => {
      const top = scroller.scrollTop;
      const height = scroller.scrollHeight;
      const vh = window.innerHeight;
      const index = Math.round(top / vh);

      // Show tabs on the third section (index 2)
      setShowTabs(index === 2);

      // Show orbital lines only on first section
      setShowOrbitalLines(index === 0);

      // ✅ Show footer when user reaches bottom (within 100px)
      const nearBottom = top + scroller.clientHeight >= height - 100;
      setShowFooter(nearBottom);
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [loadingComplete]);

  if (!loadingComplete) {
    return (
      <LoaderAndIntro onAnimationComplete={() => setLoadingComplete(true)} />
    );
  }

  return (
    <div className="main-app-container">
      {/* Page Border Elements */}
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

      {/* Three.js Canvas */}
      <div className="canvas-container">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene
              showOrbitalLines={showOrbitalLines}
              scrollerRef={scrollContainerRef}
            />
          </Suspense>
        </Canvas>
      </div>

      <ScrollIndicators scrollContainerRef={scrollContainerRef} />

      {/* Main Scroll Content */}
      <div
        ref={scrollContainerRef}
        className="main-scroll-container h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        <NavOverlay />

        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <div className="absolute top-[15%] text-center text-white max-w-4xl px-6">
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
          <CallToActionSection/>
        </section>

        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              World's First AI-Native Studio with Tokenized IP
            </h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed">
              A grand, ever-evolving world where writers, artists, AI, and fans
              create legendary stories together. Turn your ideas into scripts,
              develop rich characters, and bring worlds to life.
            </p>
          </div>
        </section>

        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <SlidingTabs isVisible={showTabs} />
        </section>


 

        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <CharacterSlider />
        </section>
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <Evolve />
        </section>


        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <SlidingTabSection />
        </section>
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <HeroPartnerSection />
        </section>

       
        
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
           <ArchDoorwayWrapper>
      <FeatureSlider />
    </ArchDoorwayWrapper>
        </section>

        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <HeroSection2 />
        </section>
          <section className="scroll-section slider-wrapper snap-start h-screen flex items-center justify-center">
          <ImageSlider slides={slides} scrollerRef={scrollContainerRef} />
        </section>


     <section className="scroll-section snap-start h-screen flex items-center justify-center">
        <WelcomeSection />
        </section>
      </div>

      {/*  Footer appears only at bottom */}
      {showFooter && (
        <div className="footer-wrapper fixed bottom-0 left-0 w-full">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;





