// components/ScrollIndicators.jsx
import { useEffect, useState } from "react";

export const ScrollIndicators = ({ scrollContainerRef }) => {
  const [progresses, setProgresses] = useState([]);

  useEffect(() => {
    const scroller = scrollContainerRef.current;
    if (!scroller) return;

    const sections = scroller.querySelectorAll(".scroll-section");
    setProgresses(new Array(sections.length).fill(0));

    const handleScroll = () => {
      const scrollTop = scroller.scrollTop;
      const vh = window.innerHeight;

      const newProgresses = Array.from(sections).map((section, i) => {
        const sectionTop = i * vh;
        const sectionBottom = sectionTop + vh;
        if (scrollTop < sectionTop) return 0;
        if (scrollTop > sectionBottom) return 1;
        return (scrollTop - sectionTop) / vh;
      });

      setProgresses(newProgresses);
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scrollContainerRef]);

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
      {progresses.map((p, i) => (
        <div
          key={i}
          className="w-0.5 h-10 bg-white/20 rounded-full overflow-hidden"
        >
          <div
            className="bg-white w-full h-full origin-top transition-all duration-100"
            style={{ transform: `scaleY(${p})` }}
          />
        </div>
      ))}
    </div>
  );
};
