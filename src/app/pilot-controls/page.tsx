'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import GlitchText from '@/components/GlitchText/GlitchText';
import { useAudio } from '@/hooks/useAudio';
import { useRouter } from 'next/navigation';
import { markPuzzleComplete, areBothPuzzlesComplete } from '@/utils/puzzleCompletion';

interface Waypoint {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

interface Asteroid {
  id: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  direction: 'left' | 'right';
}

interface Ship {
  x: number;
  y: number;
  size: number;
}

const GRID_COLS = 12;
const GRID_ROWS = 8;
const CELL_WIDTH = 80;
const CELL_HEIGHT = 80;

export default function PilotControls() {
  const { playSound } = useAudio();
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [showWarning, setShowWarning] = useState(true);
  const [understood, setUnderstood] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [level, setLevel] = useState(1);
  const levelRef = useRef(1);
  
  // Sync level ref with state
  useEffect(() => {
    levelRef.current = level;
  }, [level]);
  
  // State for rendering only
  const [, setShip] = useState<Ship>({ x: CELL_WIDTH / 2, y: CELL_HEIGHT * (GRID_ROWS - 1) + CELL_HEIGHT / 2, size: 20 });
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  
  // Refs for game logic
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressedRef = useRef<Set<string>>(new Set());
  const shipRef = useRef<Ship>({ x: CELL_WIDTH / 2, y: CELL_HEIGHT * (GRID_ROWS - 1) + CELL_HEIGHT / 2, size: 20 });
  const waypointsRef = useRef<Waypoint[]>([]);
  const currentPathRef = useRef<string[]>([]);
  const asteroidsRef = useRef<Asteroid[]>([]);
  const gameStateRef = useRef({ gameStarted: false, gameWon: false, gameLost: false });
  const lastAsteroidSpawnRef = useRef(0);
  const lastTimeUpdateRef = useRef(Date.now());
  const keysProcessedRef = useRef<Set<string>>(new Set());

  // Generate waypoints in a path pattern
  const generateWaypoints = (levelNum: number): Waypoint[] => {
    let path: { x: number; y: number }[];
    
    if (levelNum === 1) {
      // Level 1: Easier path
      path = [
        { x: 2, y: GRID_ROWS - 1 },
        { x: 5, y: GRID_ROWS - 2 },
        { x: 9, y: GRID_ROWS - 3 },
        { x: 3, y: GRID_ROWS - 4 },
        { x: 8, y: GRID_ROWS - 5 },
        { x: 4, y: GRID_ROWS - 6 },
        { x: 10, y: GRID_ROWS - 7 },
        { x: 6, y: 0 },
      ];
    } else {
      // Level 2: Harder path with more waypoints and more complex route
      path = [
        { x: 1, y: GRID_ROWS - 1 },
        { x: 6, y: GRID_ROWS - 2 },
        { x: 11, y: GRID_ROWS - 3 },
        { x: 4, y: GRID_ROWS - 4 },
        { x: 9, y: GRID_ROWS - 5 },
        { x: 2, y: GRID_ROWS - 6 },
        { x: 7, y: GRID_ROWS - 7 },
        { x: 11, y: GRID_ROWS - 6 },
        { x: 3, y: GRID_ROWS - 5 },
        { x: 8, y: GRID_ROWS - 4 },
        { x: 1, y: GRID_ROWS - 3 },
        { x: 10, y: GRID_ROWS - 2 },
        { x: 5, y: GRID_ROWS - 1 },
        { x: 0, y: 0 },
      ];
    }

    return path.map((pos, idx) => {
      // Ensure waypoints snap to grid cell centers
      const col = Math.max(0, Math.min(GRID_COLS - 1, pos.x));
      const row = Math.max(0, Math.min(GRID_ROWS - 1, pos.y));
      return {
        id: `wp-${idx}`,
        x: col * CELL_WIDTH + CELL_WIDTH / 2,
        y: row * CELL_HEIGHT + CELL_HEIGHT / 2,
        collected: false,
      };
    });
  };

  // Generate asteroids
  const generateAsteroid = (levelNum: number): Asteroid => {
    const direction = Math.random() > 0.5 ? 'left' : 'right';
    const row = Math.floor(Math.random() * GRID_ROWS); // Can spawn in all rows now
    
    // Level 2 has faster and smaller asteroids
    const baseSpeed = levelNum === 1 ? 2 : 3;
    const speedRange = levelNum === 1 ? 3 : 4;
    const baseSize = levelNum === 1 ? 12 : 10;
    const sizeRange = levelNum === 1 ? 18 : 15;
    
    return {
      id: `ast-${Date.now()}-${Math.random()}`,
      x: direction === 'right' ? -30 : GRID_COLS * CELL_WIDTH + 30,
      y: row * CELL_HEIGHT + CELL_HEIGHT / 2,
      speed: baseSpeed + Math.random() * speedRange,
      size: baseSize + Math.random() * sizeRange,
      direction,
    };
  };

  // Initialize game
  const startGame = useCallback((levelToStart: number | null = null) => {
    playSound('click');
    setShowInstructions(false);
    
    // Use provided level or current level
    const currentLevel = levelToStart !== null ? levelToStart : levelRef.current;
    levelRef.current = currentLevel;
    setLevel(currentLevel);
    
    const timeLimit = currentLevel === 1 ? 45 : 35; // Level 2 has less time
    
    const wps = generateWaypoints(currentLevel);
    // Get first waypoint position
    const firstWpCol = Math.floor((wps[0].x - CELL_WIDTH / 2) / CELL_WIDTH);
    const firstWpRow = Math.floor((wps[0].y - CELL_HEIGHT / 2) / CELL_HEIGHT);
    
    // Start ship on a different square than the first waypoint
    // Try to place it one column to the left, or to the right if that's off screen
    let startCol = firstWpCol - 1;
    if (startCol < 0 || startCol === firstWpCol) {
      // Try right side
      startCol = firstWpCol + 1;
      if (startCol >= GRID_COLS || startCol === firstWpCol) {
        // If still same or off screen, use column 0 (but ensure it's different)
        startCol = firstWpCol === 0 ? 1 : 0;
      }
    }
    
    // Use the same row as first waypoint
    const startRow = firstWpRow;
    
    const snappedX = Math.max(0, Math.min(GRID_COLS - 1, startCol)) * CELL_WIDTH + CELL_WIDTH / 2;
    const snappedY = Math.max(0, Math.min(GRID_ROWS - 1, startRow)) * CELL_HEIGHT + CELL_HEIGHT / 2;
    
    const initialShip = { x: snappedX, y: snappedY, size: 20 };
    
    // Update refs
    waypointsRef.current = wps;
    currentPathRef.current = [];
    shipRef.current = initialShip;
    asteroidsRef.current = [];
    gameStateRef.current = { gameStarted: true, gameWon: false, gameLost: false };
    lastAsteroidSpawnRef.current = Date.now();
    lastTimeUpdateRef.current = Date.now();
    
    // Update state
    setWaypoints(wps);
    setCurrentPath([]);
    setShip(initialShip);
    setAsteroids([]);
    setGameStarted(true);
    setGameWon(false);
    setGameLost(false);
    setTimeLeft(timeLimit);
  }, [playSound]);

  // Handle keyboard - process moves immediately on keypress
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current.gameWon || gameStateRef.current.gameLost) return;
      
      const key = e.key;
      const isGameKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(key);
      
      if (isGameKey) {
        e.preventDefault();
        
        // Process move immediately (once per keypress)
        if (!keysProcessedRef.current.has(key)) {
          keysProcessedRef.current.add(key);
          
          const currentShip = shipRef.current;
          let newX = currentShip.x;
          let newY = currentShip.y;
          
          // Calculate current grid position
          const currentCol = Math.floor((currentShip.x - CELL_WIDTH / 2) / CELL_WIDTH);
          const currentRow = Math.floor((currentShip.y - CELL_HEIGHT / 2) / CELL_HEIGHT);
          
          if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            const targetRow = Math.max(0, currentRow - 1);
            newY = targetRow * CELL_HEIGHT + CELL_HEIGHT / 2;
          }
          if (key === 'ArrowDown' || key === 's' || key === 'S') {
            const targetRow = Math.min(GRID_ROWS - 1, currentRow + 1);
            newY = targetRow * CELL_HEIGHT + CELL_HEIGHT / 2;
          }
          if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
            const targetCol = Math.max(0, currentCol - 1);
            newX = targetCol * CELL_WIDTH + CELL_WIDTH / 2;
          }
          if (key === 'ArrowRight' || key === 'd' || key === 'D') {
            const targetCol = Math.min(GRID_COLS - 1, currentCol + 1);
            newX = targetCol * CELL_WIDTH + CELL_WIDTH / 2;
          }
          
          // Update ship position
          if (newX !== currentShip.x || newY !== currentShip.y) {
            shipRef.current = { ...currentShip, x: newX, y: newY };
            setShip(shipRef.current);
            
            // Check waypoint collection
            const currentPath = currentPathRef.current;
            const waypoints = waypointsRef.current;
            const nextWaypointIndex = currentPath.length;
            
            if (nextWaypointIndex < waypoints.length) {
              const nextWp = waypoints[nextWaypointIndex];
              const dx = newX - nextWp.x;
              const dy = newY - nextWp.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 25 && !currentPath.includes(nextWp.id)) {
                playSound('click');
                const newPath = [...currentPath, nextWp.id];
                currentPathRef.current = newPath;
                setCurrentPath(newPath);
                
                // Check win condition
                if (newPath.length === waypoints.length) {
                  gameStateRef.current.gameWon = true;
                  setGameWon(true);
                  playSound('grant');
                  
                  // Advance to next level if not already on final level
                  if (levelRef.current < 2) {
                    // Small delay before showing level complete message
                    setTimeout(() => {
                      levelRef.current = 2;
                      startGame(2);
                    }, 1500);
                  } else {
                    // Level 2 completed - mark pilot controls puzzle as complete
                    markPuzzleComplete('pilotControls');
                  }
                }
              }
            }
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysProcessedRef.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      keysProcessedRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, playSound]);

  // Main game loop
  useEffect(() => {
    if (!gameStarted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = () => {
      const now = Date.now();

      // Update game state ref
      gameStateRef.current.gameStarted = gameStarted;
      gameStateRef.current.gameWon = gameWon;
      gameStateRef.current.gameLost = gameLost;

      // Update countdown timer
      if (now - lastTimeUpdateRef.current >= 1000) {
        lastTimeUpdateRef.current = now;
        setTimeLeft(prev => {
          if (prev <= 1) {
            gameStateRef.current.gameLost = true;
            setGameLost(true);
            playSound('deny');
            return 0;
          }
          return prev - 1;
        });
      }

      // Only update if game is active
      if (!gameWon && !gameLost) {
        // Ship movement is now handled in the keyboard event handler above

        // Spawn asteroids - frequency and max count based on level
        const currentLevel = levelRef.current;
        const spawnInterval = currentLevel === 1 ? 1000 : 800; // Level 2 spawns more frequently
        const maxAsteroids = currentLevel === 1 ? 25 : 35; // Level 2 has more asteroids
        
        if (now - lastAsteroidSpawnRef.current >= spawnInterval) {
          lastAsteroidSpawnRef.current = now;
          const currentAsteroids = asteroidsRef.current;
          if (currentAsteroids.length < maxAsteroids) {
            const newAsteroid = generateAsteroid(currentLevel);
            asteroidsRef.current = [...currentAsteroids, newAsteroid];
            setAsteroids(asteroidsRef.current);
          }
        }

        // Update asteroids
        const shipRadius = shipRef.current.size / 2;
        asteroidsRef.current = asteroidsRef.current
          .map(ast => ({
            ...ast,
            x: ast.direction === 'right' ? ast.x + ast.speed : ast.x - ast.speed,
          }))
          .filter(ast => {
            // Check collision
            const astRadius = ast.size / 2;
            const dx = shipRef.current.x - ast.x;
            const dy = shipRef.current.y - ast.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Collision detection
            if (distance < shipRadius + astRadius) {
              gameStateRef.current.gameLost = true;
              setGameLost(true);
              playSound('deny');
              return false;
            }
            
            // Remove off-screen
            return (ast.direction === 'right' && ast.x < GRID_COLS * CELL_WIDTH + 50) ||
                   (ast.direction === 'left' && ast.x > -50);
          });
        
        // Update asteroids state if changed
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (asteroidsRef.current.length !== asteroids.length) {
          setAsteroids(asteroidsRef.current);
        }
      }

      // Draw
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#333344';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_WIDTH, 0);
        ctx.lineTo(i * CELL_WIDTH, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i <= GRID_ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_HEIGHT);
        ctx.lineTo(canvas.width, i * CELL_HEIGHT);
        ctx.stroke();
      }

      // Draw path
      const currentPath = currentPathRef.current;
      const currentWaypoints = waypointsRef.current;
      if (currentPath.length > 0) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const sortedWaypoints = currentWaypoints
          .filter(wp => currentPath.includes(wp.id))
          .sort((a, b) => currentPath.indexOf(a.id) - currentPath.indexOf(b.id));

        if (sortedWaypoints.length > 0) {
          ctx.moveTo(sortedWaypoints[0].x, sortedWaypoints[0].y);
          for (let i = 1; i < sortedWaypoints.length; i++) {
            ctx.lineTo(sortedWaypoints[i].x, sortedWaypoints[i].y);
          }
          ctx.lineTo(shipRef.current.x, shipRef.current.y);
        }
        ctx.stroke();
      }

      // Draw waypoints
      currentWaypoints.forEach((wp, idx) => {
        const isCollected = currentPath.includes(wp.id);
        const isNext = !isCollected && (idx === 0 || currentPath.includes(currentWaypoints[idx - 1].id));
        
        ctx.fillStyle = isCollected ? '#00ff00' : isNext ? '#ffff00' : '#4444ff';
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, isCollected ? 12 : 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isCollected ? '#000000' : '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((idx + 1).toString(), wp.x, wp.y);
      });

      // Draw asteroids
      asteroidsRef.current.forEach(ast => {
        ctx.fillStyle = '#666666';
        ctx.beginPath();
        ctx.arc(ast.x, ast.y, ast.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#444444';
        ctx.beginPath();
        ctx.arc(ast.x - ast.size / 4, ast.y - ast.size / 4, ast.size / 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw ship
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.arc(shipRef.current.x, shipRef.current.y, shipRef.current.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(shipRef.current.x, shipRef.current.y - shipRef.current.size / 2);
      ctx.lineTo(shipRef.current.x - shipRef.current.size / 4, shipRef.current.y + shipRef.current.size / 4);
      ctx.lineTo(shipRef.current.x + shipRef.current.size / 4, shipRef.current.y + shipRef.current.size / 4);
      ctx.closePath();
      ctx.fill();

      if (gameStarted && !gameWon && !gameLost) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, gameWon, gameLost, playSound, startGame]);

  const resetGame = () => {
    playSound('click');
    setGameStarted(false);
    setGameWon(false);
    setGameLost(false);
    setAsteroids([]);
    // Don't show instructions on restart
    setShowInstructions(false);
    keysPressedRef.current.clear();
    // Restart immediately without instructions
    setTimeout(() => {
      startGame();
    }, 100);
  };

  const handleBack = () => {
    playSound('click');
    router.push('/systems-overview');
  };

  const handleCertificationAgree = () => {
    if (understood) {
      playSound('click');
      setShowWarning(false);
      setShowInstructions(true);
    }
  };

  return (
    <div className="pilot-controls">
      {showWarning && (
        <div className="certification-dialog">
          <div className="certification-content">
            <GlitchText>WARNING</GlitchText>
            <p>Do not attempt to access pilot controls without proper certifications.</p>
              <div className="checkbox-container">
              <input
                type="checkbox"
                id="cert-understood"
                checked={understood}
                onChange={(e) => {
                  playSound('click');
                  setUnderstood(e.target.checked);
                }}
              />
              <label htmlFor="cert-understood">I have read and understood the warning</label>
            </div>
            <button
              className="agree-button"
              onClick={handleCertificationAgree}
              disabled={!understood}
            >
              <GlitchText>I Agree</GlitchText>
            </button>
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-content">
            <GlitchText>FLIGHT PATH OVERRIDE</GlitchText>
            <div className="instructions-text">
              <p>The AI has locked the navigation system.</p>
              <p>You must trace the correct route through all waypoints to override the autopilot.</p>
              <p>Use arrow keys or WASD to navigate your ship.</p>
              <p>Collect all waypoints in order before time runs out.</p>
              <p className="warning">Avoid the asteroids! Collision will result in failure.</p>
              <p>Time limit: 45 seconds</p>
            </div>
            <button className="start-button" onClick={() => startGame()}>
              <GlitchText>BEGIN OVERRIDE</GlitchText>
            </button>
          </div>
        </div>
      )}

      {gameStarted && (
        <div className="game-container">
          <div className="game-header">
            <GlitchText>FLIGHT PATH OVERRIDE</GlitchText>
            <div className="game-stats">
              <div className="stat">Level: {level}</div>
              <div className="stat">Time: {timeLeft}s</div>
              <div className="stat">
                Waypoints: {currentPath.length}/{waypoints.length}
              </div>
            </div>
          </div>

          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              width={GRID_COLS * CELL_WIDTH}
              height={GRID_ROWS * CELL_HEIGHT}
              className="game-canvas"
            />
          </div>

          <div className="controls-hint">
            <p>Use Arrow Keys or WASD to navigate</p>
          </div>
        </div>
      )}

      {gameWon && level === 2 && (
        <div className="result-overlay">
          <div className="result-content">
            <GlitchText>OVERRIDE SUCCESSFUL</GlitchText>
            <p>Navigation system has been fully unlocked!</p>
            <p>All levels completed!</p>
            <p>Time remaining: {timeLeft} seconds</p>
            <div className="result-buttons">
              <button className="result-button" onClick={() => {
                // Check if both puzzles are complete
                if (areBothPuzzlesComplete()) {
                  router.push('/final-terminal');
                } else {
                  handleBack();
                }
              }}>
                <GlitchText>RETURN</GlitchText>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {gameWon && level === 1 && (
        <div className="result-overlay">
          <div className="result-content">
            <GlitchText>LEVEL 1 COMPLETE</GlitchText>
            <p>Proceeding to Level 2...</p>
          </div>
        </div>
      )}

      {gameLost && (
        <div className="result-overlay">
          <div className="result-content">
            <GlitchText>OVERRIDE FAILED</GlitchText>
            <p>
              {timeLeft === 0 
                ? 'Time has expired. The autopilot remains locked.' 
                : 'Collision detected. Navigation override aborted.'}
            </p>
            <div className="result-buttons">
              <button className="result-button" onClick={resetGame}>
                <GlitchText>TRY AGAIN</GlitchText>
              </button>
              <button className="result-button" onClick={handleBack}>
                <GlitchText>RETURN</GlitchText>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .pilot-controls {
          min-height: 100vh;
          background: #000;
          color: #ff4444;
          font-family: "Glass TTY VT220", "VT323", monospace;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .certification-dialog {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
        }

        .certification-content {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #ff4444;
          padding: 2rem;
          max-width: 600px;
          text-align: center;
          box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
        }

        .certification-content p {
          margin: 1rem 0;
          font-size: 1.2rem;
          line-height: 1.5;
        }

        .certification-content .checkbox-container {
          margin: 2rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .certification-content input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #ff4444;
        }

        .certification-content .agree-button {
          background: none;
          border: 2px solid #ff4444;
          color: #ff4444;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .certification-content .agree-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .certification-content .agree-button:not(:disabled):hover {
          background: rgba(255, 68, 68, 0.1);
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
        }

        .instructions-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .instructions-content {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #ff4444;
          padding: 2rem;
          max-width: 600px;
          text-align: center;
          box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
        }

        .instructions-text {
          margin: 1.5rem 0;
          line-height: 1.8;
        }

        .instructions-text p {
          margin: 0.8rem 0;
          font-size: 1.1rem;
        }

        .instructions-text .warning {
          color: #ff4444;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .start-button {
          background: none;
          border: 2px solid #ff4444;
          color: #ff4444;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          margin-top: 1rem;
        }

        .start-button:hover {
          background: rgba(255, 68, 68, 0.1);
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
        }

        .game-container {
          width: 100%;
          max-width: ${GRID_COLS * CELL_WIDTH}px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .game-header {
          text-align: center;
          margin-bottom: 1rem;
          width: 100%;
        }

        .game-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 0.5rem;
        }

        .stat {
          font-size: 1.5rem;
          color: #00ff00;
          text-shadow: 0 0 8px rgba(0, 255, 0, 0.8);
        }

        .canvas-container {
          border: 2px solid #ff4444;
          box-shadow: 0 0 15px rgba(255, 68, 68, 0.3);
          background: #000011;
        }

        .game-canvas {
          display: block;
        }

        .controls-hint {
          margin-top: 1rem;
          text-align: center;
          color: #888;
          font-size: 0.9rem;
        }

        .result-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .result-content {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid ${gameWon ? '#00ff00' : '#ff4444'};
          padding: 2rem;
          max-width: 600px;
          text-align: center;
          box-shadow: 0 0 20px ${gameWon ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 68, 68, 0.3)'};
        }

        .result-content p {
          margin: 1rem 0;
          font-size: 1.2rem;
          line-height: 1.6;
        }

        .result-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .result-button {
          background: none;
          border: 2px solid ${gameWon ? '#00ff00' : '#ff4444'};
          color: ${gameWon ? '#00ff00' : '#ff4444'};
          padding: 0.75rem 1.5rem;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .result-button:hover {
          background: ${gameWon ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 68, 68, 0.1)'};
          box-shadow: 0 0 10px ${gameWon ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 68, 68, 0.5)'};
        }
      `}</style>
    </div>
  );
}
