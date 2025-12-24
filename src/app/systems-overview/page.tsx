'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlitchText from '@/components/GlitchText/GlitchText';
import { useAudio } from '@/hooks/useAudio';
import PowerRoutingPuzzle from '@/components/PowerRoutingPuzzle/PowerRoutingPuzzle';
import { useGlitch } from '@/contexts/GlitchContext';
import { useInfection } from '@/contexts/InfectionContext';

export default function SystemsOverview() {
  const router = useRouter();
  const { playSound } = useAudio();
  const { stopGlitch } = useGlitch();
  const { stopInfection } = useInfection();
  const [showWarning, setShowWarning] = useState(true);
  const [understood, setUnderstood] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');

  // Add keyboard event listener for shift+enter
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

  const handleAgree = () => {
    if (understood) {
      playSound('click');
      setShowWarning(false);
    }
  };

  // Handle terminal commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.toLowerCase() === 'kill ashli.exe') {
      playSound('click');
      stopGlitch();
      stopInfection();
      router.push('/terminal');
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

  return (
    <>
      <div className="systems-overview">
        {showWarning && (
          <div className="warning-dialog">
            <div className="warning-content">
              <GlitchText>WARNING</GlitchText>
              <p>Do not attempt to adjust system settings without proper certifications.</p>
            
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="understood"
                  checked={understood}
                  onChange={(e) => {
                    playSound('click');
                    setUnderstood(e.target.checked);
                  }}
                />
                <label htmlFor="understood">I have read and understood the warning</label>
              </div>
              <button
                className="agree-button"
                onClick={handleAgree}
                disabled={!understood}
              >
                <GlitchText>I Agree</GlitchText>
              </button>
            </div>
          </div>
        )}

        <div className="systems-content">
          <div className="power-routing-container">
            <PowerRoutingPuzzle />
          </div>
        </div>

      <style jsx>{`
        .systems-overview {
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

        .warning-dialog {
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

        .warning-content {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #ff4444;
          padding: 2rem;
          max-width: 600px;
          text-align: center;
          box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
        }

        .warning-content p {
          margin: 1rem 0;
          font-size: 1.2rem;
          line-height: 1.5;
        }

        .checkbox-container {
          margin: 2rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #ff4444;
        }

        .agree-button {
          background: none;
          border: 2px solid #ff4444;
          color: #ff4444;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .agree-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .agree-button:not(:disabled):hover {
          background: rgba(255, 68, 68, 0.1);
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
        }

        .systems-content {
          width: 100%;
          max-width: 1400px;
          margin-top: 1rem;
        }

        .power-routing-container {
          width: 100%;
          margin: 0.5rem 0;
          height: calc(100vh - 200px);
          min-height: 500px;
        }

        @media (max-width: 768px) {
          .systems-content {
            margin-top: 0.5rem;
          }
          
          .power-routing-container {
            height: calc(100vh - 180px);
          }
        }
      `}</style>
      </div>
      {showTerminal && <Terminal />}
    </>
  );
} 