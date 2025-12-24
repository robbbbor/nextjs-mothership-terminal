'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlitchText from '@/components/GlitchText/GlitchText';
import { useAudio } from '@/hooks/useAudio';

const menuItems = [
  { id: 'lets', text: "let's" },
  { id: 'play', text: 'play' },
  { id: 'a', text: 'a' },
  { id: 'game', text: 'game' }
];

export default function AshliPage() {
  const router = useRouter();
  const { playSound } = useAudio();
  const [visibleItems, setVisibleItems] = useState(menuItems);
  const [isAllGone, setIsAllGone] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Shift+Enter if we're not already in a terminal input
      if (e.key === 'Enter' && e.shiftKey && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault(); // Prevent default to avoid any other handlers
        setShowTerminal(prev => !prev);
        playSound('click');
      }
    };

    // Use capture phase to ensure our handler runs first
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [playSound]);

  // Handle terminal commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.toLowerCase() === 'run hack.exe') {
      playSound('click');
      router.push('/hacking-game');
    }
    setTerminalInput('');
  };

  // Terminal overlay component
  const Terminal = () => (
    <>
      <div className="terminal-backdrop" onClick={() => setShowTerminal(false)} />
      <div className="terminal-overlay">
        <div className="terminal-header">
          <GlitchText>SECRET TERMINAL</GlitchText>
          <button className="terminal-close" onClick={() => setShowTerminal(false)}>×</button>
        </div>
        <form onSubmit={handleTerminalSubmit}>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            autoFocus
            placeholder="Enter command..."
          />
        </form>
        <style jsx>{`
          .terminal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
          }

          .terminal-overlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            padding: 20px;
            border: 1px solid #ff4444;
            box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
            z-index: 10000;
            width: 80%;
            max-width: 600px;
            border-radius: 4px;
          }

          .terminal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(255, 68, 68, 0.3);
          }

          .terminal-close {
            background: none;
            border: none;
            color: #ff4444;
            font-size: 2rem;
            cursor: pointer;
            padding: 0 0.5rem;
            font-family: inherit;
            text-shadow: 0 0 10px #ff4444;
          }

          .terminal-close:hover {
            color: #ff6666;
          }

          input {
            width: 100%;
            background: transparent;
            border: none;
            color: #ff4444;
            font-family: "Glass TTY VT220", "VT323", monospace;
            font-size: 1.2rem;
            outline: none;
            padding: 0.5rem;
          }

          input::placeholder {
            color: rgba(255, 68, 68, 0.5);
          }
        `}</style>
      </div>
    </>
  );

  const handleItemClick = (item: { id: string, text: string }) => {
    playSound('click');
    
    if (item.id === 'game') {
      setIsAllGone(true);
    } else {
      setVisibleItems(prev => prev.slice(prev.findIndex(i => i.id === item.id) + 1));
    }
  };

  if (isAllGone) {
    return (
      <>
        <div className="main-menu infected">
          <div className="glitch-text-container">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="glitch-text" style={{ 
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}>
                <GlitchText>GAME</GlitchText>
              </div>
            ))}
          </div>
          <div className="over-text">
            <GlitchText>OVER</GlitchText>
          </div>

          <style jsx>{`
            .main-menu.infected {
              background: #000;
              overflow: hidden;
            }

            .glitch-text-container {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
            }

            .glitch-text {
              position: absolute;
              color: #ff4444;
              font-size: 2rem;
              text-shadow: 0 0 10px #ff4444;
              animation: glitch 0.3s infinite;
              opacity: 0.7;
            }

            .over-text {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: none;
              border: none;
              color: #ff4444;
              font-size: 4rem;
              cursor: default;
              font-family: "Glass TTY VT220", "VT323", monospace;
              text-transform: uppercase;
              text-shadow: 0 0 20px #ff4444;
              animation: glitch 0.3s infinite;
              z-index: 1;
              padding: 1rem 2rem;
            }

            @keyframes glitch {
              0% {
                text-shadow: 0.05em 0 0 #ff4444, -0.05em -0.025em 0 #00ff00;
              }
              14% {
                text-shadow: 0.05em 0 0 #ff4444, -0.05em -0.025em 0 #00ff00;
              }
              15% {
                text-shadow: -0.05em -0.025em 0 #ff4444, 0.025em 0.025em 0 #00ff00;
              }
              49% {
                text-shadow: -0.05em -0.025em 0 #ff4444, 0.025em 0.025em 0 #00ff00;
              }
              50% {
                text-shadow: 0.025em 0.05em 0 #ff4444, 0.05em 0 0 #00ff00;
              }
              99% {
                text-shadow: 0.025em 0.05em 0 #ff4444, 0.05em 0 0 #00ff00;
              }
              100% {
                text-shadow: -0.025em 0 0 #ff4444, -0.025em -0.025em 0 #00ff00;
              }
            }
          `}</style>
        </div>
        {showTerminal && <Terminal />}
      </>
    );
  }

  return (
    <>
      <div className="main-menu">
        <h1 className="menu-title">
          <GlitchText>Ashli's Terminal</GlitchText>
        </h1>
        <div className="separator">========</div>
        <nav>
          {visibleItems.map((item) => (
            <button
              key={item.id}
              className="menu-item"
              onMouseEnter={() => playSound('click')}
              onClick={() => handleItemClick(item)}
            >
              <GlitchText>{item.text}</GlitchText>
            </button>
          ))}
        </nav>
      </div>
      {showTerminal && <Terminal />}
    </>
  );
} 