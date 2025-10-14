import React, { useState, useEffect, useRef } from "react";

const ANIMATION_DURATION_MS = 2000;
const INITIAL_DELAY_MS = 300;

const ArchDoorwayWrapper = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (isFinished || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0.6 && !isAnimating && !isFinished) {
          setIsAnimating(true);

          const finishTimer = setTimeout(() => {
            setIsAnimating(false);
            setIsFinished(true);
            observer.disconnect();
          }, INITIAL_DELAY_MS + ANIMATION_DURATION_MS);

          return () => clearTimeout(finishTimer);
        }
      },
      {
        threshold: [0, 0.6, 1],
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isAnimating, isFinished]);

  if (isFinished) return <>{children}</>;

  return (
    <div ref={sectionRef} className="relative w-full h-screen overflow-hidden">
      {/* --- Black overlay for everything --- */}
      <div
        className="absolute inset-0 bg-black z-50"
        style={{
          animation: isAnimating
            ? `fadeOut ${ANIMATION_DURATION_MS}ms ease-in-out forwards`
            : "none",
        }}
      />

      {/* --- Expanding door container --- */}
      <div
        className="absolute inset-0 flex items-center justify-center z-50 overflow-hidden"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="bg-black relative"
          style={{
            width: "10vw",
            height: "25vh",
            borderRadius: "10vw 10vw 0 0",
            overflow: "hidden",
            transformOrigin: "center top",
            animation: isAnimating
              ? `archExpand ${ANIMATION_DURATION_MS}ms ease-in-out forwards`
              : "none",
          }}
        >
          {/* Slide content inside the door */}
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>

      {/* --- Animation keyframes --- */}
      <style jsx>{`
        @keyframes archExpand {
          0% {
            width: 10vw;
            height: 25vh;
          }
          100% {
            width: 100vw;
            height: 100vh;
          }
        }

        @keyframes fadeOut {
          0% {
            background-color: black;
          }
          100% {
            background-color: transparent;
          }
        }
      `}</style>
    </div>
  );
};

export default ArchDoorwayWrapper;
