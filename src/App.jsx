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

    // --- Page Border Animation ---
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

        ScrollTrigger.create({
          trigger: section,
          start: "bottom bottom",
          endTrigger: sections[i + 1],
          end: "top bottom",
          scrub: true,
          animation: imageTransitionTL,
        });
      }
    });

    // --- Section Entrance Animations ---
    sections.forEach((section) => {
      const children = section.children; // animate children individually
      gsap.from(children, {
        scrollTrigger: {
          trigger: section,
          scroller: scroller,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
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
      borderTimeline.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loadingComplete]);

  if (!loadingComplete) {
    return <LoaderAndIntro onAnimationComplete={() => setLoadingComplete(true)} />;
  }

  return (
    <div className="main-app-container">
      {/* Page Borders */}
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

      {/* Background Layers */}
      <div ref={imageOverlayRef} className="image-background-overlay">
        {SECTION_IMAGES.map((src, i) => (
          <div key={i} className="background-image-item" style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>

      {/* 3D Scene */}
      <div className="canvas-container">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
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

    <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
  <div className="relative top-[-20%] text-center text-white max-w-4xl px-6 flex flex-col items-center justify-center gap-8">
    <h2 className="title-text text-5xl md:text-6xl font-bold leading-tight tracking-wide">
      Turn Ideas Into<br />Multi-Format Universes
    </h2>

    <TryVedButton />

    {/* Arrow Down Image */}
    <img
      src="/model/arrow.webp" // replace with your actual path
      alt="Scroll Down"
      className="mt-6 w-8 h-8 animate-bounce"
    />
  </div>
</section>

        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <CallToActionSection />
        </section>

        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              World's First AI-Native Studio with Tokenized IP
            </h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed">
              A grand, ever-evolving world where writers, artists, AI, and fans create legendary stories together.
            </p>
          </div>
        </section>

        <section id="sliding-tabs-section" className="scroll-section h-screen flex items-center justify-center snap-none relative">
          {showTabs && <SlidingTabs isVisible={showTabs} />}
        </section>

        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center">
          <ImageSlider slides={slides} scrollerRef={scrollContainerRef} />
        </section>

        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center"><AIWritingHero /></section>
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center"><OrbitLineReveal /></section>
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center"><CharacterSlider /></section>
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center"><Evolve /></section>
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center"><SlidingTabSection /></section>
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center"><HeroPartnerSection /></section>
        <section className="scroll-section snap-start h-screen w-full flex items-center justify-center"><ArchDoorwayWrapper><FeatureSlider /></ArchDoorwayWrapper></section>
        <section className="scroll-section snap-start h-screen flex items-center justify-center" data-show-planet="true"><HeroSection2 /></section>
        <section className="scroll-section snap-start h-screen flex items-center justify-center" data-show-planet="true"><WelcomeSection /></section>
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
