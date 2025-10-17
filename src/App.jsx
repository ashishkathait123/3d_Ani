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
import TryVedButton from "./components/TryVedButton";
import HeroSection from "./components/HeroSection";

gsap.registerPlugin(ScrollTrigger);

const SECTION_IMAGES = [
  "/model/bg1.webp",
  "/model/glows-2.webp",
  "/model/bg3.webp",
  "/model/bg2.webp",
  "/model/bg1.webp",
  "/model/glows.webp",
  "/model/bg3.webp",
  "/model/bg2.webp",
  "/model/bg1.webp",
  "/model/glows.webp",
  "/model/bg3.webp",
  "/model/bg2.webp",
  "/model/bg2.webp",
  "/model/bg3.webp",
  "/model/glows.webp",
  "/model/bg1.webp",
];

function App() {
  const scrollContainerRef = useRef(null);
  const imageOverlayRef = useRef(null);
  const [showTabs, setShowTabs] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showOrbitalLines, setShowOrbitalLines] = useState(true);
  const [showFooter, setShowFooter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  const slides = [
    { img: "/model/gg.jpg", title: "Dream Architect", community: "Writers Guild", expansion: "Vol. 1" },
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

    // --- Page Border Animation (Hidden on Mobile) ---
    if (!isMobile) {
      gsap.set(".page-border .line", { scaleX: 0, scaleY: 0, opacity: 0 });
      gsap.set(".page-border .corner", { opacity: 0 });

      const borderTimeline = gsap.timeline({ delay: 0.5 });
      borderTimeline
        .to(".page-border .line.top, .page-border .line.bottom", {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        })
        .to(
          ".page-border .line.left, .page-border .line.right",
          { scaleY: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
          "<0.3"
        )
        .to(".page-border .corner", { opacity: 1, duration: 0.5 }, "<0.5");
    }

    // --- Background Image Transitions ---
    const sections = gsap.utils.toArray(".scroll-section");
    const imageElements = gsap.utils.toArray(".background-image-item");

    gsap.set(imageElements, { opacity: 0 });
    if (imageElements.length > 0) gsap.set(imageElements[0], { opacity: 1 });

    sections.forEach((section, i) => {
      if (i < sections.length - 1) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        const imageTransitionTL = gsap.timeline({ paused: true });

        imageTransitionTL.to(currentImage, { opacity: 0, duration: 0.5 }, 0);
        imageTransitionTL.to(nextImage, { opacity: 1, duration: 0.5 }, 0);

        // --- SlidingTabs Visibility (show once and persist) ---
        ScrollTrigger.create({
          trigger: "#sliding-tabs-section",
          scroller,
          start: "top center",
          onEnter: () => setShowTabs(true),
        });
      }
    });

    // --- Section Entrance Animations ---
    sections.forEach((section) => {
      const children = section.children;
      gsap.from(children, {
        scrollTrigger: {
          trigger: section,
          scroller: scroller,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: isMobile ? 30 : 50,
        opacity: 0,
        duration: isMobile ? 0.8 : 1,
        ease: "power3.out",
        stagger: isMobile ? 0.1 : 0.15,
      });
    });

    // --- SlidingTabs Visibility ---
    ScrollTrigger.create({
      trigger: "#sliding-tabs-section",
      scroller,
      start: "top center",
      end: "bottom center",
      onEnter: () => setShowTabs(true),
      onLeave: () => setShowTabs(false),
      onEnterBack: () => setShowTabs(true),
      onLeaveBack: () => setShowTabs(false),
    });

    // --- Orbital Lines Visibility ---
    ScrollTrigger.create({
      trigger: sections[0],
      scroller,
      start: "top top",
      end: "bottom top",
      onEnter: () => setShowOrbitalLines(true),
      onLeave: () => setShowOrbitalLines(false),
      onEnterBack: () => setShowOrbitalLines(true),
      onLeaveBack: () => setShowOrbitalLines(false),
    });

    // --- Footer Visibility ---
    const lastSection = sections[sections.length - 1];
    ScrollTrigger.create({
      trigger: lastSection,
      scroller,
      start: "top bottom-=200",
      end: "bottom bottom",
      onEnter: () => setShowFooter(true),
      onLeave: () => setShowFooter(true),
      onLeaveBack: () => setShowFooter(false),
    });

    ScrollTrigger.refresh();

    // --- Cleanup ---
    return () => {
      if (!isMobile) {
        borderTimeline.kill();
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loadingComplete, isMobile]);

  if (!loadingComplete) {
    return <LoaderAndIntro onAnimationComplete={() => setLoadingComplete(true)} />;
  }

  return (
    <div className="main-app-container">
      {/* Page Borders - Hidden on Mobile */}
      {!isMobile && (
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
      )}

      {/* Background Layers */}
      <div ref={imageOverlayRef} className="image-background-overlay">
        {SECTION_IMAGES.map((src, i) => (
          <div key={i} className="background-image-item" style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>

      {/* 3D Scene */}
      <div className="canvas-container">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, isMobile ? 8 : 6], fov: isMobile ? 35 : 45 }}>
          <Suspense fallback={null}>
            <Scene showOrbitalLines={showOrbitalLines} scrollerRef={scrollContainerRef} />
          </Suspense>
        </Canvas>
      </div>

      <ScrollIndicators scrollContainerRef={scrollContainerRef} />

      {/* Scroll Content */}
      <div
        ref={scrollContainerRef}
        className="main-scroll-container h-screen overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <NavOverlay />

        {/* Hero Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <div className={`relative text-center text-white px-4 flex flex-col items-center justify-center gap-4 ${isMobile ? 'top-[-10%] max-w-xs gap-4' : isTablet ? 'top-[-15%] max-w-2xl gap-6' : 'top-[-20%] max-w-4xl gap-8'}`}>
            <h2 className={`font-bold leading-tight tracking-wide ${isMobile ? 'text-2xl' : isTablet ? 'text-4xl' : 'text-5xl md:text-6xl'}`}>
              Turn Ideas Into<br />Multi-Format Universes
            </h2>

            <TryVedButton />

            {/* Arrow Down Image */}
            <img
              src="/model/arrow.webp"
              alt="Scroll Down"
              className={`mt-4 animate-bounce ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <CallToActionSection />
        </section>

        {/* World's First AI Studio Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <div className={`text-center text-white px-4 ${isMobile ? 'max-w-xs top-32' : isTablet ? 'max-w-lg top-40' : 'max-w-3xl top-48'}`}>
            {/* Main Title */}
            <h2 className={`font-bold mb-4 leading-tight tracking-wide ${isMobile ? 'text-xl' : isTablet ? 'text-3xl' : 'text-4xl md:text-5xl'}`}>
              World's First AI-Native Studio<br />
              with Tokenized IP
            </h2>
            
            {/* Paragraph Text */}
            <p className={`opacity-90 leading-relaxed mb-8 ${isMobile ? 'text-xs px-2' : isTablet ? 'text-base px-4' : 'text-base md:text-lg px-2 md:px-6'}`}>
              A grand, ever-evolving world where writers, artists, AI, and fans create legendary stories together. Turn your ideas into scripts, develop rich characters, and bring worlds to life.
            </p>
            
            {/* Bracketed Button */}
            <a 
              href="#explore-ips" 
              className={`font-mono tracking-widest text-white/90 px-4 py-2 uppercase inline-flex items-center justify-center hover:text-red-500 transition-colors duration-300 ${isMobile ? 'text-xs' : 'text-sm'}`}
            >
              [ EXPLORE OUR IPS ] 
              <span className="ml-2">▶</span>
            </a>
          </div>
        </section>

        {/* Sliding Tabs Section */}
        <section
          id="sliding-tabs-section"
          className="scroll-section snap-start h-screen flex items-center justify-center relative"
        >
          <SlidingTabs isVisible={showTabs} />
        </section>

        {/* Image Slider Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <ImageSlider slides={slides} scrollerRef={scrollContainerRef} />
        </section>

        {/* AI Writing Hero Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <AIWritingHero />
        </section>

        {/* Orbit Line Reveal Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <OrbitLineReveal />
        </section>

        {/* Character Slider Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <CharacterSlider />
        </section>

        {/* Evolve Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <Evolve />
        </section>

        {/* Sliding Tab Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <SlidingTabSection />
        </section>

        {/* Hero Partner Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <HeroPartnerSection />
        </section>

        {/* Feature Slider Section */}
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <ArchDoorwayWrapper>
            <FeatureSlider />
          </ArchDoorwayWrapper>
        </section>

        {/* Hero Section 2 */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center" data-show-planet="true">
          <HeroSection2 />
        </section>

        {/* Welcome Section */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center" data-show-planet="true">
          <WelcomeSection />
        </section>
      </div>

      {showFooter && (
        <div className="footer-wrapper fixed bottom-0 left-0 w-full">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;