'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TerminalInterface from '@/components/Terminal/TerminalInterface';
import GlitchText from '@/components/GlitchText/GlitchText';

type StarMapRange = '12' | '20' | '50';

interface StarMapData {
  range: StarMapRange;
  title: string;
  description: string;
}

const starMaps: StarMapData[] = [
  {
    range: '12',
    title: 'LOCAL STAR MAP (12 LY RADIUS)',
    description: 'DISPLAYING NEAREST STELLAR NEIGHBORS\nRANGE: 12 LIGHT YEARS FROM SOL\nSTATUS: REAL-TIME TRACKING ACTIVE\nWARNING: SHIP POSITION OUTSIDE MAP RANGE'
  },
  {
    range: '20',
    title: 'LOCAL STAR MAP (20 LY RADIUS)',
    description: 'DISPLAYING STELLAR CARTOGRAPHY DATA\nRANGE: 20 LIGHT YEARS FROM SOL\nSTATUS: REAL-TIME TRACKING ACTIVE\nCURRENT POSITION: 70 OPHIUCHI'
  },
  {
    range: '50',
    title: 'LOCAL STAR MAP (50 LY RADIUS)',
    description: 'DISPLAYING EXTENDED STELLAR REGION\nRANGE: 50 LIGHT YEARS FROM SOL\nSTATUS: REAL-TIME TRACKING ACTIVE\nCURRENT POSITION: 70 OPHIUCHI'
  }
];

export default function NavigationPage() {
  const [activeMap, setActiveMap] = useState<StarMapRange>('20');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  const handleTabClick = (range: StarMapRange) => {
    playSound();
    setActiveMap(range);
    // Reset zoom and position when changing maps
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => {
      const newZoom = prev + delta * 0.1;
      return Math.min(Math.max(newZoom, 0.5), 3); // Limit zoom between 0.5x and 3x
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const currentMap = starMaps.find(map => map.range === activeMap)!;

  return (
    <main>
      <div className="main-menu">
        <h1 className="menu-title"><GlitchText>Navigation</GlitchText></h1>
        <div className="separator">========</div>
        
        <div className="navigation-container">
          <div className="star-map-section">
            <div className="map-tabs">
              {starMaps.map((map) => (
                <button
                  key={map.range}
                  className={`map-tab ${activeMap === map.range ? 'active' : ''}`}
                  onClick={() => handleTabClick(map.range)}
                  onMouseEnter={playSound}
                >
                  <GlitchText>{`${map.range}LY`}</GlitchText>
                </button>
              ))}
            </div>
            <div className="zoom-controls">
              <button className="zoom-button" onClick={() => handleZoom(1)} onMouseEnter={playSound}>
                <GlitchText>ZOOM +</GlitchText>
              </button>
              <button className="zoom-button" onClick={() => handleZoom(-1)} onMouseEnter={playSound}>
                <GlitchText>ZOOM -</GlitchText>
              </button>
              <button 
                className="zoom-button" 
                onClick={() => {
                  setZoomLevel(1);
                  setPosition({ x: 0, y: 0 });
                }}
                onMouseEnter={playSound}
              >
                <GlitchText>RESET</GlitchText>
              </button>
            </div>
            <h2 className="section-title">
              <GlitchText>{currentMap.title}</GlitchText>
            </h2>
            <div 
              className="star-map-container"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                className="star-map-wrapper"
                style={{
                  transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
              >
                <Image
                  src={`/images/${activeMap}lys.svg`}
                  alt={`Star map showing all stars within ${activeMap} light years of Earth`}
                  width={800}
                  height={600}
                  className="star-map"
                  priority
                />
                {(activeMap === '20' || activeMap === '50') && (
                  <div className={`ship-position ${activeMap === '50' ? 'position-50ly' : ''}`}>
                    <div className="ship-dot"></div>
                    <div className="ship-pulse"></div>
                  </div>
                )}
                {activeMap === '12' && (
                  <div className="error-message">
                    <GlitchText>ERROR: SHIP OUTSIDE MAP RANGE</GlitchText>
                  </div>
                )}
              </div>
            </div>
            <div className="map-description">
              <GlitchText>
                {currentMap.description}
              </GlitchText>
            </div>
          </div>
        </div>
        
        <Link
          href="/main"
          className="menu-item back-button"
          onMouseEnter={playSound}
          onClick={playSound}
        >
          <GlitchText>BACK TO MAIN MENU</GlitchText>
        </Link>

        <TerminalInterface />
      </div>

      <style jsx>{`
        .star-map-section {
          margin: 2rem 0;
          padding: 1rem;
          border: 1px solid var(--menu-text);
          background: rgba(0, 0, 0, 0.3);
        }

        .map-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .zoom-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .zoom-button {
          background: transparent;
          border: 1px solid var(--menu-text);
          color: var(--menu-text);
          padding: 0.3rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          font-size: 1rem;
        }

        .zoom-button:hover {
          background: rgba(var(--menu-text-rgb), 0.1);
        }

        .map-tab {
          background: transparent;
          border: 1px solid var(--menu-text);
          color: var(--menu-text);
          padding: 0.5rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          font-size: 1.2rem;
        }

        .map-tab:hover {
          background: rgba(var(--menu-text-rgb), 0.1);
        }

        .map-tab.active {
          background: var(--menu-text);
          color: var(--background);
        }

        .section-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .star-map-container {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 1rem 0;
          overflow: hidden;
          height: 600px;
        }

        .star-map-wrapper {
          position: relative;
          transition: transform 0.1s ease;
          transform-origin: center;
        }

        .star-map {
          max-width: 100%;
          height: auto;
          filter: brightness(0.8) sepia(0.2) hue-rotate(160deg);
          transition: filter 0.3s ease;
        }

        .star-map:hover {
          filter: brightness(1) sepia(0) hue-rotate(0deg);
        }

        .error-message {
          position: absolute;
          top: 2%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ff3300;
          font-size: 1.5rem;
          text-shadow: 0 0 10px #ff3300;
          white-space: nowrap;
          animation: errorBlink 2s infinite;
        }

        @keyframes errorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .map-description {
          text-align: center;
          font-size: 1.2rem;
          margin-top: 1rem;
          white-space: pre-line;
        }

        .ship-position {
          position: absolute;
          left: 89%;
          top: 46%;
          z-index: 2;
        }

        .position-50ly {
          left: 65.3%;
          top: 48.5%;
        }

        .ship-dot {
          width: 12px;
          height: 12px;
          background-color: #fff;
          border: 2px solid #00ff66;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 
            0 0 10px 2px #00ff66,
            0 0 20px 4px rgba(0, 255, 102, 0.5),
            inset 0 0 8px #00ff66;
          z-index: 3;
        }

        .ship-pulse {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(0, 255, 102, 0.5);
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
            border-color: rgba(0, 255, 102, 0.8);
          }
          50% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.5;
            border-color: rgba(0, 255, 102, 0.4);
          }
          100% {
            transform: translate(-50%, -50%) scale(3.5);
            opacity: 0;
            border-color: rgba(0, 255, 102, 0);
          }
        }
      `}</style>
    </main>
  );
} 