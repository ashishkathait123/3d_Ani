import React, { useEffect, useRef, useState } from 'react';

const MugafiLoading = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading, opening, welcome
  const containerRef = useRef(null);
  const arcRef = useRef(null);
  const logoRef = useRef(null);
  const loadingTextRef = useRef(null);
  const progressBarRef = useRef(null);
  const welcomeRef = useRef(null);
  const subtitleRef = useRef(null);
  const portalRef = useRef(null);

  useEffect(() => {
    // Animate progress from 0 to 100%
    const duration = 3000; // 3 seconds
    const startTime = Date.now();

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const prog = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(Math.round(prog));

      if (prog < 100) {
        requestAnimationFrame(animateProgress);
      } else {
        // Start opening animation after loading completes
        setTimeout(() => {
          setPhase('opening');
          
          // Move to welcome screen
          setTimeout(() => {
            setPhase('welcome');
            
            // Call onComplete after showing welcome screen
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 2500); // Show welcome for 2.5 seconds
          }, 1200);
        }, 500);
      }
    };

    requestAnimationFrame(animateProgress);
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Portal Background Effect */}
      <div
        ref={portalRef}
        className={`absolute inset-0 transition-all duration-1000 ${
          phase === 'opening' || phase === 'welcome' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(139, 0, 0, 0.6) 0%, rgba(0, 0, 0, 1) 70%)',
        }}
      />

      {/* Semi-circular Arc that transforms into window */}
      <div 
        ref={arcRef}
        className="absolute flex items-center justify-center"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <svg 
          width="340" 
          height={phase === 'loading' ? '200' : '520'} 
          viewBox={phase === 'loading' ? '0 0 340 200' : '0 0 340 520'}
          className="block transition-all duration-1000"
        >
          {/* Semi-circular Arc that stretches into rounded rectangle window */}
          <path
            d={phase === 'loading' 
              ? "M 40 180 L 40 100 Q 40 20, 170 20 Q 300 20, 300 100 L 300 180"
              : "M 40 500 L 40 100 Q 40 20, 170 20 Q 300 20, 300 100 L 300 500 Q 300 500, 170 500 Q 40 500, 40 500 Z"
            }
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            className="transition-all duration-1000"
            style={{
              fill: phase === 'opening' || phase === 'welcome' ? 'rgba(0, 0, 0, 0.3)' : 'none'
            }}
          />
          
          {/* Progress Bar Container - positioned at bottom of semi-circle */}
          {phase === 'loading' && (
            <g>
              <rect
                x="50"
                y="170"
                width="240"
                height="2"
                fill="rgba(255, 255, 255, 0.2)"
              />
              <rect
                x="50"
                y="170"
                width={240 * (progress / 100)}
                height="2"
                fill="white"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Logo - styled like the Mugafi logo, positioned at top of arc when opened */}
      <div
        ref={logoRef}
        className="absolute flex items-center justify-center transition-all duration-1000 ease-in-out"
        style={{ 
          top: phase === 'welcome' ? 'calc(50% - 240px)' : phase === 'opening' ? 'calc(50% - 80px)' : '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <svg width="80" height="60" viewBox="0 0 80 60" className="block">
          {/* Stylized Mugafi M Logo */}
          <g>
            {/* Left decorative line */}
            <line x1="8" y1="30" x2="22" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" />
            
            {/* Main M letter with stylized design */}
            <path
              d="M 28 45 L 28 20 L 35 30 L 40 20 L 45 30 L 52 20 L 52 45"
              fill="none"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Right decorative line */}
            <line x1="58" y1="30" x2="72" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Loading Text */}
      <div
        ref={loadingTextRef}
        className={`absolute text-white text-sm tracking-wider transition-opacity duration-500 ${
          phase === 'loading' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          top: '50%',
          marginTop: '120px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        LOADING MULTIVERSE... <span className="ml-4">{progress}%</span>
      </div>

      {/* Welcome Screen Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Welcome Text */}
        <h1
          ref={welcomeRef}
          className={`text-white text-5xl font-light mb-8 transition-all duration-1000 ${
            phase === 'welcome' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ 
            transitionDelay: phase === 'welcome' ? '400ms' : '0ms',
            marginTop: '60px'
          }}
        >
          Welcome to Mugafi
        </h1>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className={`text-white text-xl font-light text-center transition-all duration-1000 ${
            phase === 'welcome' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ 
            transitionDelay: phase === 'welcome' ? '800ms' : '0ms',
            marginTop: '0px'
          }}
        >
          <p>Where Ideas Grow Into Characters,</p>
          <p>Worlds, and Timeless Tales</p>
        </div>

        {/* Floating particles in the window */}
        <div
          className={`absolute w-64 h-96 transition-all duration-1000 ${
            phase === 'welcome' ? 'opacity-30' : 'opacity-0'
          }`}
          style={{
            top: '58%',
          }}
        >
          {/* Particle effect */}
          {phase === 'welcome' && (
            <div className="relative w-full h-full">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                    opacity: Math.random() * 0.6 + 0.2,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MugafiLoading;