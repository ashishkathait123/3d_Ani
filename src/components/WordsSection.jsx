import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const WordsSection = () => {
  const wordsRef = useRef([]);

  useEffect(() => {
    gsap.from(wordsRef.current, {
      x: 200,
      opacity: 0,
      stagger: 0.3,
      scrollTrigger: {
        trigger: "#words",
        start: "top center",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <section id="words" className="h-[100vh] flex flex-col justify-center items-end pr-20 text-white gap-10">
      {["Films", "Comics", "Games"].map((word, i) => (
        <div key={i} ref={(el) => (wordsRef.current[i] = el)} className="flex items-center gap-6 text-5xl font-bold">
          <span className="w-12 h-12 rounded-full bg-pink-500"></span>
          {word}
        </div>
      ))}
    </section>
  );
};
