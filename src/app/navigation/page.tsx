'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GlitchText from '@/components/GlitchText/GlitchText';
import TerminalInterface from '@/components/Terminal/TerminalInterface';
import { useAudio } from '@/hooks/useAudio';

const basePath = process.env.NODE_ENV === 'production' ? '/nextjs-mothership-terminal' : '';

type StarMapRange = '12' | '20' | '50';

interface StarMapData {
  range: StarMapRange;
  title: string;
  description: string;
}

interface ShipPosition {
  x: number;
  y: number;
  isOutsideMap: boolean;
}

interface ShipPositions {
  [key: string]: ShipPosition;
}

const starMaps: StarMapData[] = [
  {
    range: '12',
    title: 'LOCAL STAR MAP (12 LY RADIUS)',
    description: 'DISPLAYING NEAREST STELLAR NEIGHBORS\nRANGE: 12 LIGHT YEARS FROM SOL\nSTATUS: REAL-TIME TRACKING ACTIVE'
  },
  {
    range: '20',
    title: 'LOCAL STAR MAP (20 LY RADIUS)',
    description: 'DISPLAYING STELLAR CARTOGRAPHY DATA\nRANGE: 20 LIGHT YEARS FROM SOL\nSTATUS: REAL-TIME TRACKING ACTIVE'
  },
  {
    range: '50',
    title: 'LOCAL STAR MAP (50 LY RADIUS)',
    description: 'DISPLAYING EXTENDED STELLAR REGION\nRANGE: 50 LIGHT YEARS FROM SOL\nSTATUS: REAL-TIME TRACKING ACTIVE'
  }
];

export default function NavigationPage() {
  const [activeMap, setActiveMap] = useState<StarMapRange>('20');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [shipPositions, setShipPositions] = useState<ShipPositions>({
    '12': { x: 50, y: 50, isOutsideMap: false },
    '20': { x: 50, y: 50, isOutsideMap: false },
    '50': { x: 50, y: 50, isOutsideMap: false }
  });
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useAudio();

  // Initialize loading state - Firebase subscription removed
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left click
    setIsDragging(true);
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setStartPosition({
        x: e.clientX - rect.left - position.x,
        y: e.clientY - rect.top - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left - startPosition.x,
        y: e.clientY - rect.top - startPosition.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * 0.1;
    const newZoom = Math.max(0.5, Math.min(3, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  const currentMap = starMaps.find(map => map.range === activeMap) || starMaps[1];
  const currentShipPosition = shipPositions[activeMap];

  if (isLoading) {
    return (
      <main>
        <div className="main-menu">
          <h1 className="menu-title"><GlitchText>Navigation</GlitchText></h1>
          <div className="loading-message">
            <GlitchText>INITIALIZING NAVIGATION SYSTEMS...</GlitchText>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="main-menu">
        <h1 className="menu-title"><GlitchText>Navigation</GlitchText></h1>
        <div className="separator">========</div>
        
        <div className="navigation-container">
          <div className="map-tabs">
            {starMaps.map((map) => (
              <button
                key={map.range}
                className={`map-tab ${activeMap === map.range ? 'active' : ''}`}
                onClick={() => {
                  setActiveMap(map.range);
                  playSound('click');
                }}
              >
                <GlitchText>{`${map.range}LY`}</GlitchText>
              </button>
            ))}
          </div>

          <h2 className="section-title">
            <GlitchText>{currentMap.title}</GlitchText>
          </h2>

          <div 
            ref={containerRef}
            className="star-map-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div 
              className="star-map-wrapper"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
              }}
            >
              <Image
                src={`${basePath}/${activeMap}lys.svg`}
                alt={`Star map ${activeMap} light years`}
                width={1000}
                height={1000}
                className="star-map"
                draggable={false}
                priority={true}
              />
              <div 
                className="ship-position"
                style={{
                  left: `${currentShipPosition.x}%`,
                  top: `${currentShipPosition.y}%`,
                }}
              >
                <div className="ship-dot" />
                <div className="ship-pulse" />
              </div>

              {currentShipPosition.isOutsideMap && (
                <div className="warning-message">
                  <GlitchText>WARNING: SHIP POSITION OUTSIDE MAP</GlitchText>
                </div>
              )}
            </div>

            <div className="map-description">
              <GlitchText>{currentMap.description}</GlitchText>
            </div>
          </div>
          
          <Link href="/main" className="menu-item back-button" onClick={() => playSound('click')}>
            <GlitchText>BACK TO MAIN MENU</GlitchText>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .navigation-container {
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
          max-width: 800px;
          margin: 1rem auto;
          aspect-ratio: 1;
          border: 1px solid var(--menu-text);
          background: rgba(0, 0, 0, 0.3);
          overflow: hidden;
          cursor: grab;
        }

        .star-map-container:active {
          cursor: grabbing;
        }

        .star-map-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-origin: center;
          transition: transform 0.1s ease;
        }

        .star-map {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: brightness(0.8) sepia(0.2) hue-rotate(160deg);
        }

        .ship-position {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }

        .ship-dot {
          width: 12px;
          height: 12px;
          background-color: #fff;
          border: 2px solid #00ff66;
          border-radius: 50%;
          box-shadow: 
            0 0 10px 2px #00ff66,
            0 0 20px 4px rgba(0, 255, 102, 0.5),
            inset 0 0 8px #00ff66;
        }

        .ship-pulse {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 2px solid rgba(0, 255, 102, 0.5);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
            border-color: rgba(0, 255, 102, 0.8);
          }
          50% {
            transform: scale(2);
            opacity: 0.5;
            border-color: rgba(0, 255, 102, 0.4);
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
            border-color: rgba(0, 255, 102, 0);
          }
        }

        .warning-message {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: #ff3300;
          font-size: 1.2rem;
          text-shadow: 0 0 10px #ff3300;
          white-space: nowrap;
          animation: blink 2s infinite;
          pointer-events: none;
        }

        .position-info {
          text-align: center;
          margin: 1rem 0;
          font-size: 1.2rem;
        }

        .map-description {
          text-align: center;
          margin-top: 1rem;
          white-space: pre-line;
        }

        .loading-message {
          text-align: center;
          font-size: 1.5rem;
          margin: 2rem 0;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .menu-item {
          background: transparent;
          border: none;
          color: var(--menu-text);
          padding: 0;
          cursor: pointer;
          font-family: "Glass TTY VT220", "VT323", monospace;
          transition: all 0.3s ease;
        }

        .menu-item:hover {
          color: #44ff44;
        }

        .back-button {
          display: block;
          margin-top: 2rem;
          text-align: center;
          color: #ff4444;
        }

        .back-button:hover {
          color: #ff4444;
        }
      `}</style>
    </main>
  );
} 