import React, { useRef, useState } from 'react';

const Characters = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const characters = [
    {
      id: 1,
      name: 'William Shakespeare',
      image: '/characters/shakespeare.jpg',
      description: 'The William Shakespeare chatbot captures the wit and poetic brilliance of the legendary playwright.',
      chats: '1168 . 2K CHATS',
      available: false,
    },
    {
      id: 2,
      name: 'Shakuni',
      image: '/characters/shakuni.jpg',
      description: 'The Shakuni chatbot embodies the cunning and manipulative character from the Indian epic Mahabharata.',
      chats: '2030 . 1K CHATS',
      available: true,
    },
    {
      id: 3,
      name: 'Satyajit Ray',
      image: '/characters/satyajit.jpg',
      description: 'This chatbot introduces users to films by Satyajit Ray, the legendary Indian filmmaker.',
      chats: '875 . 3K CHATS',
      available: false,
    },
    {
      id: 4,
      name: 'Byomkesh Bakshi',
      image: '/characters/byomkesh.jpg',
      description: 'Byomkesh Bakshi enters the world of mystical Indian detective and analyzer clues.',
      chats: '508 . 7K CHATS',
      available: false,
    },
    {
      id: 5,
      name: 'Albert Einstein',
      image: '/characters/einstein.jpg',
      description: 'The Albert Einstein chatbot brings the genius physicist to life with scientific wisdom.',
      chats: '2456 . 5K CHATS',
      available: false,
    },
    {
      id: 6,
      name: 'Sherlock Holmes',
      image: '/characters/sherlock.jpg',
      description: 'The legendary detective from Victorian London solves mysteries with deductive reasoning.',
      chats: '3021 . 8K CHATS',
      available: true,
    },
  ];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = 
        direction === 'left' 
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  return (
    <div className="characters-section">
      <div className="characters-container">
        {/* Header Section */}
        <div className="characters-header">
          <div className="header-left">
            <span className="next-label">NEXT</span>
          </div>
          <div className="header-center">
            <h2 className="characters-title">
              Over 3000 people have brought their<br />
              vision to life using Mugafi Ved and built<br />
              100+ characters.
            </h2>
          </div>
          <div className="header-right">
            <button 
              className={`scroll-btn ${!canScrollLeft ? 'disabled' : ''}`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button 
              className={`scroll-btn ${!canScrollRight ? 'disabled' : ''}`}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cards Container */}
        <div 
          className="characters-scroll-container" 
          ref={scrollContainerRef}
        >
          <div className="characters-grid">
            {characters.map((character) => (
              <div key={character.id} className="character-card">
                <div className="card-image-wrapper">
                  <img 
                    src={character.image} 
                    alt={character.name}
                    className="card-image"
                  />
                </div>
                
                <div className="card-content">
                  <h3 className="card-title">{character.name}</h3>
                  <p className="card-description">{character.description}</p>
                  <p className="card-chats">{character.chats}</p>
                </div>

                <div className="card-footer">
                  <button 
                    className={`card-button ${character.available ? 'available' : ''}`}
                  >
                    {character.available ? 'CHAT NOW' : 'CHAT NOW'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .characters-section {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%);
          padding: 80px 0;
          position: relative;
          overflow: hidden;
        }

        .characters-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .characters-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 60px;
          gap: 40px;
        }

        .header-left {
          flex-shrink: 0;
        }

        .next-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          letter-spacing: 3px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .header-center {
          flex: 1;
        }

        .characters-title {
          font-size: 42px;
          font-weight: 300;
          line-height: 1.4;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .header-right {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .scroll-btn {
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .scroll-btn:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .scroll-btn.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .characters-scroll-container {
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 20px;
        }

        .characters-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .characters-grid {
          display: flex;
          gap: 24px;
          padding: 4px;
        }

        .character-card {
          flex-shrink: 0;
          width: 320px;
          background: rgba(10, 10, 20, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .character-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 75, 145, 0) 0%, rgba(255, 75, 145, 0.15) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .character-card:hover {
          border-color: rgba(255, 75, 145, 0.6);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(255, 75, 145, 0.2);
        }

        .character-card:hover::before {
          opacity: 1;
        }

        .card-image-wrapper {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .character-card:hover .card-image {
          transform: scale(1.1);
        }

        .card-content {
          padding: 24px;
        }

        .card-title {
          font-size: 22px;
          font-weight: 500;
          color: #ffffff;
          margin: 0 0 12px 0;
          letter-spacing: -0.3px;
        }

        .card-description {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 16px 0;
          min-height: 60px;
        }

        .card-chats {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .card-footer {
          padding: 0 24px 24px 24px;
        }

        .card-button {
          width: 100%;
          padding: 14px 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: white;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1.5px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .card-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .card-button.available {
          background: linear-gradient(135deg, #ff4b91 0%, #ff6b9d 100%);
          border: none;
          color: white;
        }

        .card-button.available:hover {
          background: linear-gradient(135deg, #ff3380 0%, #ff5a8c 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 75, 145, 0.4);
        }

        .character-card:hover .card-button:not(.available) {
          border-color: rgba(255, 75, 145, 0.6);
          color: #ff4b91;
        }

        @media (max-width: 768px) {
          .characters-container {
            padding: 0 20px;
          }

          .characters-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 40px;
          }

          .characters-title {
            font-size: 28px;
          }

          .header-right {
            width: 100%;
            justify-content: flex-end;
          }

          .character-card {
            width: 280px;
          }
        }
      `}</style>
    </div>
  );
};

export default Characters;