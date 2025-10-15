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
import OrbitLineReveal from "./components/OrbitLineReveal";
import AIWritingHero from "./components/AIWritingHero";

gsap.registerPlugin(ScrollTrigger);

// 💥 CHANGE 1: Define a list of BACKGROUND IMAGE URLs for each section
// You need 14 images for 13 transitions across 14 sections (0 to 13).
// ** NOTE: आपको इन paths को अपनी वास्तविक फ़ाइल structure के अनुसार बदलना होगा। **
const SECTION_IMAGES = [
  '/model/bg1.webp', 
  '/model/glows-2.webp',
  '/model/bg3.webp',
  '/model/bg2.webp',
 '/model/bg1.webp', 
  '/model/glows.webp',
  '/model/bg3.webp',
  '/model/bg2.webp',
  '/model/bg1.webp', 
  '/model/glows.webp',
  '/model/bg3.webp',
  '/model/bg2.webp',
 '/model/bg2.webp',
'/model/bg3.webp', 
   '/model/glows.webp',
 '/model/bg1.webp', 
];

function App() {
  const scrollContainerRef = useRef(null);
  const imageOverlayRef = useRef(null); // Ref changed from gradientOverlayRef
  const [showTabs, setShowTabs] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showOrbitalLines, setShowOrbitalLines] = useState(true);
  const [showFooter, setShowFooter] = useState(false);

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

    // --- BORDER ANIMATION SETUP (Unchanged) ---
    gsap.set(".page-border .line", { scaleX: 0, scaleY: 0, opacity: 0 });
    gsap.set(".page-border .corner", { opacity: 0 });

    const borderTimeline = gsap.timeline({ delay: 0.5 }); 
    
    borderTimeline
        .to(".page-border .line.top, .page-border .line.bottom", { 
            scaleX: 1, 
            opacity: 1, 
            duration: 1.2,
            ease: "power2.out" 
        })
        .to(".page-border .line.left, .page-border .line.right", { 
            scaleY: 1, 
            opacity: 1,
            duration: 1.2, 
            ease: "power2.out" 
        }, "<0.3") 
        .to(".page-border .corner", { opacity: 1, duration: 0.5 }, "<0.5"); 
    // ------------------------------------------------------------------

    // 💥 CHANGE 2: GSAP Image Cross-Fade ScrollTrigger Setup
    const sections = gsap.utils.toArray(".scroll-section");
    // सभी इमेज एलिमेंट्स प्राप्त करें
    const imageElements = gsap.utils.toArray(".background-image-item"); 

    // सभी इमेज को छोड़कर पहली इमेज को छोड़कर, opacity 0 सेट करें
    gsap.set(imageElements, { opacity: 0 });
    if (imageElements.length > 0) {
        gsap.set(imageElements[0], { opacity: 1 });
    }
    
    sections.forEach((section, i) => {
      // Fade out the current image (i) and fade in the next image (i+1)
      if (i < sections.length - 1) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];

        // Create a timeline for the image transition
        const imageTransitionTL = gsap.timeline({ paused: true });

        // Animate out the current image's opacity
        imageTransitionTL.to(currentImage, { opacity: 0, duration: 0.5, ease: "linear" }, 0); 
        // Animate in the next image's opacity
        imageTransitionTL.to(nextImage, { opacity: 1, duration: 0.5, ease: "linear" }, 0); 
        
        // Link the timeline to the scroll position between sections
        ScrollTrigger.create({
          trigger: section,
          start: "bottom bottom", 
          endTrigger: sections[i + 1],
          end: "top bottom", 
          scrub: true, // Smoothly animate the timeline during scroll
          animation: imageTransitionTL,
        });
      }
    });
    // ------------------------------------------------------------------

    // --- Manual Scroll Handler (Unchanged) ---
    const handleScroll = () => {
      const top = scroller.scrollTop;
      const height = scroller.scrollHeight;
      const vh = window.innerHeight;
      const index = Math.round(top / vh);

      setShowTabs(index === 3); 
      setShowOrbitalLines(index === 0);

      const nearBottom = top + scroller.clientHeight >= height - 100;
      setShowFooter(nearBottom);
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      borderTimeline.kill(); 
      // Kill all ScrollTriggers created in this effect
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loadingComplete]);

  if (!loadingComplete) {
    return (
      <LoaderAndIntro onAnimationComplete={() => setLoadingComplete(true)} />
    );
  }

  return (
    <div className="main-app-container">
      {/* Page Border Elements (Z-index: 50) */}
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
      
      {/* 💥 CHANGE 3: Image Background Overlay Container (Z-index: 0) */}
      <div 
        ref={imageOverlayRef} // Ref updated
        className="image-background-overlay" // Class updated
      >
        {/* Render each background image as a separate layer */}
        {SECTION_IMAGES.map((src, index) => (
          <div
            key={index}
            className="background-image-item"
            style={{ backgroundImage: `url(${src})` }}
            // Initial opacity will be set by GSAP in useEffect
          />
        ))}
      </div>

      {/* Three.js Canvas (Z-index: 1) */}
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

      {/* Main Scroll Content (Z-index: 10) */}
      <div
        ref={scrollContainerRef}
        className="main-scroll-container h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        <NavOverlay />
        
        {/* 0. INITIAL: Hero Text */}
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

        {/* 1. 1st SCROLL: CallToActionSection */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <CallToActionSection/>
        </section>

        {/* 2. 2nd SCROLL: AI-Native Studio Text */}
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

        {/* 3. 3rd SCROLL: SlidingTabs - Index 3 */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <SlidingTabs isVisible={showTabs} /> 
        </section>
        
        {/* 4. 4th SCROLL: ImageSlider */}
      <section className="scroll-section snap-start h-screen flex items-center justify-center">
    <ImageSlider slides={slides} scrollerRef={scrollContainerRef} />
</section>

        {/* 5. 5th SCROLL: Transition Section */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
        <AIWritingHero/>
        </section>
        
        {/* 6. 6th SCROLL: OrbitLineReveal */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <OrbitLineReveal/> 
        </section>

        {/* 7. 7th SCROLL: CharacterSlider */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <CharacterSlider />
        </section>
        
        {/* 8. 8th SCROLL: Evolve */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <Evolve />
        </section>

        {/* 9. 9th SCROLL: SlidingTabSection */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <SlidingTabSection />
        </section>
        
        {/* 10. 10th SCROLL: HeroPartnerSection */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <HeroPartnerSection />
        </section>

        {/* 11. 11th SCROLL: FeatureSlider */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <ArchDoorwayWrapper>
            <FeatureSlider />
          </ArchDoorwayWrapper>
        </section>

        {/* 12. 12th SCROLL: HeroSection2 */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <HeroSection2 />
        </section>
        
        {/* 13. 13th SCROLL: WelcomeSection (Final content before footer) */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center">
          <WelcomeSection />
        </section>
        
      </div>

      {/* Footer appears only at bottom */}
      {showFooter && (
        <div className="footer-wrapper fixed bottom-0 left-0 w-full">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;