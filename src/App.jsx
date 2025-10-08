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
import { OrbitSection } from "./components/OrbitSection";
import CharacterSlider from './components/CharacterSlider';
import HeroSection from './components/HeroSection';
import SlidingTabSection from './components/SlidingTabSection';
import HeroPartnerSection from "./components/HeroPartnerSection";
import DoorwayHeroSection from "./components/DoorwayHeroSection";
import LoaderAndIntro from "./components/LoaderAndIntro";

gsap.registerPlugin(ScrollTrigger);


function App() {
    const scrollContainerRef = useRef(null);
    const [showTabs, setShowTabs] = useState(false);
    const [isIntroComplete, setIsIntroComplete] = useState(false);
    
    // Function passed to the loader to update state
    const handleIntroComplete = () => {
        setIsIntroComplete(true);
        // On completion, immediately scroll to the top of the first scroll section
        if (scrollContainerRef.current) {
             scrollContainerRef.current.scrollTo(0, 0);
        }
    };
    
    const slides = [
        // ... (your existing slide data)
        {
          img: "/model/11.png",
          title: "Sheshnaag",
          community: "25K engaged token holders",
          expansion: "Comics, books, games, animation, live action pipeline",
        },
        {
          img: "/model/11.png",
          title: "Vritra",
          community: "40K engaged token holders",
          expansion: "Anime, VR experience, merchandise",
        },
    ];

    useEffect(() => {
        const scroller = scrollContainerRef.current;
        if (!scroller) return;

        // Apply ScrollTrigger defaults only after the intro is complete
        if (isIntroComplete) {
            ScrollTrigger.defaults({ scroller: scroller });
        } else {
             // Disable scrolling during the intro
             scroller.style.overflowY = 'hidden';
        }

        const handleScroll = () => {
            if (!isIntroComplete) return;
            const top = scroller.scrollTop;
            const vh = window.innerHeight;
            // The index calculation will change based on the final layout
            // If SlidingTabs is section 4, index = 3
            // Assuming it's section 3 in the final layout, index = 2
            const index = Math.round(top / vh); 
            setShowTabs(index === 2); 
        };

        scroller.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        handleScroll();
        
        // Re-enable scroll once intro is complete
        if (isIntroComplete) {
            scroller.style.overflowY = 'scroll';
        }


        return () => {
            scroller.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isIntroComplete]); // Rerun effect when intro completes

    return (
        <div className="main-app-container">

            {/* Page Border */}
            <div className="page-border">
                {/* ... (your existing border divs) ... */}
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
            {isIntroComplete && <ScrollIndicators scrollContainerRef={scrollContainerRef} />}

            {/* The Loader is outside the scroll container and overlays everything */}
            {!isIntroComplete && <LoaderAndIntro onAnimationComplete={handleIntroComplete} />}


            {/* Scrollable Content (Hidden until intro completes) */}
            <div
                ref={scrollContainerRef}
                className={`main-scroll-container h-screen overflow-y-scroll snap-y snap-mandatory transition-opacity duration-1000 ${isIntroComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <NavOverlay />

                {/* SECTION 1: WELCOME SCREEN (The first screen user sees after loader) */}
                <section className="scroll-section snap-start h-screen flex items-center justify-center relative">
                    {/* The logo is already placed on the top by LoaderAndIntro, we just need the text */}
                    <div className="text-content-wrapper overlay-content text-center text-white z-20">
                        <h1 className="title-text text-6xl font-extrabold mb-4">
                            Welcome to Mugafi
                        </h1>
                        <p className="subtitle-text text-xl text-gray-300 max-w-lg mx-auto mb-10">
                            Where Ideas Grow Into Characters, Worlds, and Timeless Tales
                        </p>
                        <button className="text-sm tracking-widest border border-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300">
                            SCROLL TO ENTER &gt;
                        </button>
                    </div>
                </section>

                {/* SECTION 2: Doorway Hero Section (The Invest with Web3 Tokens section) */}
                <section className="scroll-section snap-start h-screen">
                    <DoorwayHeroSection /> 
                </section>
                
                {/* SECTION 3: Multi-Format IP Development (New Component) */}
                <section className="scroll-section snap-start h-screen">
                    {/* Placeholder for the IPDevelopmentShowcase (the "Multi-Format IP" text and carousel) */}
                    {/* You'll need to create this component based on the previous conversation */}
                </section>

                {/* SECTION 4: World's First AI-Native Studio (Updated Section) */}
                <section className="scroll-section snap-start h-screen flex items-center justify-center">
                    <div className="text-content-wrapper overlay-content text-center text-white">
                        <h2 className="title-text text-4xl mb-4">
                            World’s First AI-Native Studio with Tokenized IP
                        </h2>
                        <p className="subtitle-text">
                            A grand, ever-evolving world where writers, artists, AI, and fans create legendary stories together. Turn your ideas into scripts, develop rich characters, and bring worlds to life.
                        </p>
                    </div>
                </section>

                {/* SECTION 5: Sliding Tabs (Original) */}
                <section className="scroll-section snap-start h-screen flex items-center justify-center">
                    <SlidingTabs isVisible={showTabs} />
                </section>

                {/* ... (Rest of your sections follow) ... */}

                {/* SECTION 6: Image Slider (No Snap) */}
                <section className="scroll-section slider-wrapper h-screen flex items-center justify-center">
                    <ImageSlider slides={slides} scrollerRef={scrollContainerRef} />
                </section>

                {/* NEW SECTION 7: Character Slider */}
                <section className="scroll-section snap-start h-screen">
                    <CharacterSlider />
                </section>
                
                {/* NEW SECTION 8: Hero Section */}
                <section className="scroll-section snap-start h-screen">
                    <HeroSection />
                </section>
                
                {/* NEW SECTION 9: SlidingTabSection */}
                <section className="scroll-section snap-start h-screen">
                    <SlidingTabSection />
                </section>

                {/* NEW SECTION 10: HeroPartnerSection */}
                <section className="scroll-section snap-start h-screen">
                    <HeroPartnerSection/>
                </section>

            </div>
        </div>
    );
}

export default App;